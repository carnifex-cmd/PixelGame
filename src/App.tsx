import React, { useState, useEffect, useRef, useCallback } from 'react';
import scenariosData from './data/scenarios.json';
import { Scenario, ChallengeResult } from './types/game';
import { Header } from './components/Header';
import { StartScreen, LadderMode } from './components/StartScreen';
import { TileGridCanvas } from './components/TileGridCanvas';
import { ScoreHUD } from './components/ScoreHUD';
import { ConfidenceMeter } from './components/ConfidenceMeter';
import { AnswerPanel } from './components/AnswerPanel';
import { FeedbackBanner } from './components/FeedbackBanner';
import { ResultScreen } from './components/ResultScreen';
import { LeaderboardModal } from './components/LeaderboardModal';
import { HelpModal } from './components/HelpModal';
import { calculateChallengeScore } from './utils/scoring';
import { audio } from './utils/audio';

type GameState = 'IDLE' | 'PLAYING' | 'FEEDBACK' | 'RESULT';

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [challenges, setChallenges] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastMode, setLastMode] = useState<LadderMode>('ladder');

  const [revealedTiles, setRevealedTiles] = useState<Set<number>>(new Set());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [lastChallengeResult, setLastChallengeResult] = useState<{
    isCorrect: boolean;
    scoreDelta: number;
  } | null>(null);

  const [sessionResults, setSessionResults] = useState<ChallengeResult[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [currentPotentialScore, setCurrentPotentialScore] = useState(1000);

  const [timeRemaining, setTimeRemaining] = useState(15);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [totalSessionDuration, setTotalSessionDuration] = useState(0);

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const timerRef = useRef<number | null>(null);
  const challengeStartTimeRef = useRef<number>(0);

  const currentScenario: Scenario | undefined = challenges[currentIndex];
  const gridSize = currentScenario ? currentScenario.gridSize : 4;
  const totalTiles = gridSize * gridSize;

  // Build a randomized game run conforming to Page 5 & 6 difficulty ladder
  const setupGameSession = (mode: LadderMode) => {
    setLastMode(mode);
    const easyPool = scenariosData.filter((s) => s.difficulty === 'easy') as Scenario[];
    const medPool = scenariosData.filter((s) => s.difficulty === 'medium') as Scenario[];
    const hardPool = scenariosData.filter((s) => s.difficulty === 'hard' && s.theme !== 'time_shift') as Scenario[];
    const timeShiftPool = scenariosData.filter((s) => s.theme === 'time_shift') as Scenario[];
    const expertPool = scenariosData.filter((s) => s.difficulty === 'expert') as Scenario[];

    const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const pickUnique = <T,>(arr: T[], count: number): T[] => {
      const copy = [...arr].sort(() => Math.random() - 0.5);
      return copy.slice(0, Math.min(count, copy.length));
    };

    let selected: Scenario[] = [];
    if (mode === 'ladder') {
      // 4 challenges matching full ladder: Easy 4x4 -> Med 5x5 -> Hard 5x5 -> Time Shift 5x5
      selected = [
        pickRandom(easyPool),
        pickRandom(medPool),
        pickRandom(hardPool),
        pickRandom(timeShiftPool),
      ];
    } else if (mode === 'easy') {
      selected = pickUnique(easyPool, 3);
    } else if (mode === 'medium') {
      selected = pickUnique(medPool, 3);
    } else if (mode === 'hard') {
      selected = [pickRandom(hardPool), pickRandom(timeShiftPool), pickRandom(hardPool)];
    } else if (mode === 'expert') {
      selected = pickUnique(expertPool.length > 0 ? expertPool : hardPool, 3);
    }

    setChallenges(selected);
    setCurrentIndex(0);
    setSessionResults([]);
    setTotalScore(0);
    setSessionStartTime(Date.now());
    startChallenge(selected[0]);
  };

  const startChallenge = (scenario: Scenario) => {
    setRevealedTiles(new Set());
    setSelectedAnswer(null);
    setLastChallengeResult(null);
    setTimeRemaining(scenario.timeLimit || 15);
    challengeStartTimeRef.current = Date.now();
    setCurrentPotentialScore(1000);
    setGameState('PLAYING');
  };

  // Timer loop during PLAYING state
  useEffect(() => {
    if (gameState !== 'PLAYING' || !currentScenario) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = 100; // 100ms precision
    const timeLimit = currentScenario.timeLimit || 15;

    timerRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - challengeStartTimeRef.current) / 1000;
      const rem = Math.max(0, timeLimit - elapsed);
      setTimeRemaining(rem);

      // Real-time potential score update (Page 5 formula)
      const pot = calculateChallengeScore(
        revealedTiles.size,
        totalTiles,
        rem,
        timeLimit,
        true
      );
      setCurrentPotentialScore(pot);

      // Time expired
      if (rem <= 0) {
        handleTimeExpired();
      }
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentScenario, revealedTiles.size, totalTiles]);

  // Handle tile reveal click with budget check
  const handleRevealTile = (index: number) => {
    if (gameState !== 'PLAYING' || revealedTiles.has(index)) return;

    // Check expert reveal budget if specified
    if (currentScenario?.revealBudget && revealedTiles.size >= currentScenario.revealBudget) {
      audio.playMiss();
      return;
    }

    setRevealedTiles((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  // Answer selection
  const handleSelectAnswer = useCallback((answer: string) => {
    if (gameState !== 'PLAYING' || !currentScenario) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = answer === currentScenario.correctAnswer;
    const timeUsedMs = Date.now() - challengeStartTimeRef.current;
    const timeLimit = currentScenario.timeLimit || 15;

    const scoreDelta = calculateChallengeScore(
      revealedTiles.size,
      totalTiles,
      timeRemaining,
      timeLimit,
      isCorrect
    );

    if (isCorrect) {
      audio.playSuccess();
    } else {
      audio.playMiss();
    }

    setSelectedAnswer(answer);
    setLastChallengeResult({ isCorrect, scoreDelta });
    setTotalScore((prev) => prev + scoreDelta);

    const challengeRecord: ChallengeResult = {
      scenarioId: currentScenario.id,
      correct: isCorrect,
      score: scoreDelta,
      revealedCount: revealedTiles.size,
      totalTiles,
      timeUsedMs,
      chosenAnswer: answer,
      correctAnswer: currentScenario.correctAnswer,
    };

    setSessionResults((prev) => [...prev, challengeRecord]);
    setGameState('FEEDBACK');

    // Page 5 rule: "After the result, auto-advance to the next challenge after 1.5-2.0 seconds"
    window.setTimeout(() => {
      advanceRound();
    }, 1800);
  }, [gameState, currentScenario, revealedTiles.size, totalTiles, timeRemaining]);

  const handleTimeExpired = () => {
    if (gameState !== 'PLAYING' || !currentScenario) return;
    handleSelectAnswer('TIMEOUT_EXPIRED');
  };

  // Advance to next challenge or final result screen
  const advanceRound = () => {
    if (currentIndex + 1 < challenges.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      startChallenge(challenges[nextIdx]);
    } else {
      // Session finished
      setTotalSessionDuration(Date.now() - sessionStartTime);
      setGameState('RESULT');
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsHelpOpen(false);
        setIsLeaderboardOpen(false);
        return;
      }
      if (e.key.toLowerCase() === 'h' && gameState !== 'PLAYING') {
        setIsHelpOpen((prev) => !prev);
        return;
      }
      if (e.key.toLowerCase() === 'l' && gameState !== 'PLAYING') {
        setIsLeaderboardOpen((prev) => !prev);
        return;
      }
      if (e.key.toLowerCase() === 'm') {
        audio.toggleMute();
        return;
      }
      if (e.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
        return;
      }

      // Start on Enter in Idle
      if (gameState === 'IDLE' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        setupGameSession(lastMode);
        return;
      }

      // Play Again on Enter in Result
      if (gameState === 'RESULT' && e.key === 'Enter') {
        setupGameSession(lastMode);
        return;
      }

      // Answer selection: 1, 2, 3, 4
      if (gameState === 'PLAYING') {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 4) {
          const answerButtons = document.querySelectorAll('.answer-card');
          if (answerButtons[num - 1]) {
            (answerButtons[num - 1] as HTMLButtonElement).click();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, lastMode]);

  return (
    <div className="game-container">
      <Header
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onResetGame={() => setGameState('IDLE')}
      />

      <main className="main-viewport">
        {gameState === 'IDLE' && (
          <StartScreen
            onStartGame={(mode) => setupGameSession(mode)}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        )}

        {(gameState === 'PLAYING' || gameState === 'FEEDBACK') && currentScenario && (
          <div className="gameplay-layout">
            <ScoreHUD
              currentIndex={currentIndex}
              totalChallenges={challenges.length}
              totalScore={totalScore}
              currentPotentialScore={currentPotentialScore}
              revealedCount={revealedTiles.size}
              totalTiles={totalTiles}
              timeRemainingSeconds={timeRemaining}
              timeLimitSeconds={currentScenario.timeLimit || 15}
            />

            {/* Component 1 & 2: Hidden Satellite Image Grid + Reveal Tile */}
            <TileGridCanvas
              scenario={currentScenario}
              revealedTiles={revealedTiles}
              onRevealTile={handleRevealTile}
              disabled={gameState === 'FEEDBACK'}
            />

            {/* Component 3: Confidence / Score Meter (Page 5 wireframe) */}
            <ConfidenceMeter
              potentialScore={currentPotentialScore}
              maxScore={1000}
              revealedCount={revealedTiles.size}
              totalTiles={totalTiles}
              timeRemaining={timeRemaining}
              timeLimit={currentScenario.timeLimit || 15}
              revealBudget={currentScenario.revealBudget}
            />

            {/* Component 4: Four Answer Choices (Page 5 wireframe) */}
            <AnswerPanel
              scenario={currentScenario}
              selectedAnswer={selectedAnswer}
              isAnswerSubmitted={gameState === 'FEEDBACK'}
              onSelectAnswer={handleSelectAnswer}
              disabled={gameState === 'FEEDBACK'}
            />

            {gameState === 'FEEDBACK' && lastChallengeResult && (
              <FeedbackBanner
                scenario={currentScenario}
                isCorrect={lastChallengeResult.isCorrect}
                scoreDelta={lastChallengeResult.scoreDelta}
              />
            )}
          </div>
        )}

        {gameState === 'RESULT' && (
          <ResultScreen
            totalScore={totalScore}
            results={sessionResults}
            totalDurationMs={totalSessionDuration}
            onPlayAgain={() => setupGameSession(lastMode)}
            onReturnHome={() => setGameState('IDLE')}
          />
        )}
      </main>

      {/* Consistent IEEE GRSS badge / footer (Page 4) */}
      <footer className="footer-bar">
        <div className="status-indicator">
          <div className="status-dot" />
          <span>IEEE GRSS OPEN DAY BOOTH · STATION 01 (PIXEL HUNTER)</span>
        </div>
        <div>
          <span>AMPLIFY THE INSIGHT · ELEVATE THE IMPACT</span>
        </div>
      </footer>

      {/* Modals */}
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
      {isLeaderboardOpen && <LeaderboardModal onClose={() => setIsLeaderboardOpen(false)} />}
    </div>
  );
};
