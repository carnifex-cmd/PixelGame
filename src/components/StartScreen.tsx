import React, { useState } from 'react';
import { audio } from '../utils/audio';

export type LadderMode = 'ladder' | 'easy' | 'medium' | 'hard' | 'expert';

interface StartScreenProps {
  onStartGame: (mode: LadderMode) => void;
  onOpenHelp: () => void;
  onOpenLeaderboard: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  onOpenHelp,
  onOpenLeaderboard,
}) => {
  const [selectedLadder, setSelectedLadder] = useState<LadderMode>('ladder');

  const handleStart = () => {
    audio.playSuccess();
    onStartGame(selectedLadder);
  };

  return (
    <div className="start-screen">

      {/* Live feed indicator */}
      <div className="booth-pill">
        <span className="live-dot" aria-hidden="true" />
        IEEE GRSS OPEN DAY 2026 · INTERACTIVE LAB
      </div>

      {/* Hero Title */}
      <h1 className="hero-title">
        PIXEL <span className="highlight">HUNTER</span>
      </h1>

      {/* Tagline */}
      <p className="hero-tagline">"How little can you see and still know?"</p>

      {/* Volunteer Script / Mission Directive */}
      <div className="volunteer-banner">
        <div className="lead">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" stroke="none"/>
          </svg>
          MISSION DIRECTIVE
        </div>
        <p>
          A satellite image is hidden behind tiles. Reveal only as much as necessary to identify the Earth feature or change.{' '}
          <strong>Fewer reveals + faster guesses = higher scores!</strong>
        </p>
      </div>

      {/* Core Loop: REVEAL → INFER → GUESS → SCORE */}
      <div className="loop-tracker" role="list" aria-label="Game loop steps">
        {[
          { num: '01', label: 'REVEAL' },
          { num: '02', label: 'INFER' },
          { num: '03', label: 'GUESS' },
          { num: '04', label: 'SCORE' },
        ].map((step, i, arr) => (
          <React.Fragment key={step.num}>
            <div className="loop-step" role="listitem">
              <span className="loop-step-num">{step.num}</span>
              {step.label}
            </div>
            {i < arr.length - 1 && <span className="loop-arrow" aria-hidden="true">›</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Difficulty Ladder — Page 6 Spec */}
      <div className="difficulty-label">DIFFICULTY LADDER</div>
      <div className="difficulty-ladder-selector" role="radiogroup" aria-label="Difficulty Ladder">
        <button
          type="button"
          className={`ladder-pill${selectedLadder === 'ladder' ? ' active' : ''}`}
          onClick={() => { audio.playTileClick(); setSelectedLadder('ladder'); }}
          title="Progressive 4-challenge attempt: Easy → Med → Hard → Time-Shift"
          aria-pressed={selectedLadder === 'ladder'}
        >
          <span>MISSION LADDER</span>
          <span className="grid-tag">4 SCENES</span>
        </button>

        <button
          type="button"
          className={`ladder-pill${selectedLadder === 'easy' ? ' active' : ''}`}
          onClick={() => { audio.playTileClick(); setSelectedLadder('easy'); }}
          title="Distinctive patterns, 4×4 grid"
          aria-pressed={selectedLadder === 'easy'}
        >
          <span>EASY</span>
          <span className="grid-tag">4×4</span>
        </button>

        <button
          type="button"
          className={`ladder-pill${selectedLadder === 'medium' ? ' active' : ''}`}
          onClick={() => { audio.playTileClick(); setSelectedLadder('medium'); }}
          title="Ambiguous natural patterns, 5×5 grid"
          aria-pressed={selectedLadder === 'medium'}
        >
          <span>MEDIUM</span>
          <span className="grid-tag">5×5</span>
        </button>

        <button
          type="button"
          className={`ladder-pill${selectedLadder === 'hard' ? ' active' : ''}`}
          onClick={() => { audio.playTileClick(); setSelectedLadder('hard'); }}
          title="False-color or time-shift image pairs, 5×5 grid"
          aria-pressed={selectedLadder === 'hard'}
        >
          <span>HARD</span>
          <span className="grid-tag">TIME-SHIFT</span>
        </button>

        <button
          type="button"
          className={`ladder-pill${selectedLadder === 'expert' ? ' active' : ''}`}
          onClick={() => { audio.playTileClick(); setSelectedLadder('expert'); }}
          title="Low reveal budget & closely related answer choices"
          aria-pressed={selectedLadder === 'expert'}
        >
          <span>EXPERT</span>
          <span className="grid-tag">BUDGETED</span>
        </button>
      </div>

      {/* Primary CTA */}
      <div className="start-action-row">
        <button
          type="button"
          id="launch-btn"
          className="start-btn"
          onClick={handleStart}
          title="Start Selected Mission [ENTER / SPACE]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          LAUNCH MISSION
          <span className="start-btn-timer">{selectedLadder === 'ladder' ? '45s' : '30s'}</span>
        </button>
      </div>

      {/* Utility row: session time + help + leaderboard */}
      <div className="quick-stats-row">
        <span className="stat-chip">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          30–60s session
        </span>

        <button
          type="button"
          id="help-btn"
          className="link-pill"
          onClick={onOpenHelp}
          title="Open Mission Briefing"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          Mission Briefing
        </button>

        <button
          type="button"
          id="leaderboard-btn"
          className="link-pill emerald"
          onClick={onOpenLeaderboard}
          title="View Booth Rankings"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
          Booth Rankings
        </button>
      </div>
    </div>
  );
};
