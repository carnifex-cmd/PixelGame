import React, { useState, useEffect } from 'react';
import { ChallengeResult, LeaderboardEntry } from '../types/game';
import { submitScore, fetchLeaderboard } from '../utils/scoring';
import { audio } from '../utils/audio';

interface ResultScreenProps {
  totalScore: number;
  results: ChallengeResult[];
  totalDurationMs: number;
  onPlayAgain: () => void;
  onReturnHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  totalScore,
  results,
  totalDurationMs,
  onPlayAgain,
  onReturnHome,
}) => {
  const [nickname, setNickname] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Play fanfare on load
  useEffect(() => {
    audio.playFanfare();
    fetchLeaderboard().then((res) => setLeaderboard(res.leaderboard));
  }, []);

  const totalSolved = results.filter((r) => r.correct).length;
  const totalTiles = results.reduce((acc, r) => acc + r.totalTiles, 0);
  const totalRevealed = results.reduce((acc, r) => acc + r.revealedCount, 0);
  const revealPct = totalTiles > 0 ? Math.round((totalRevealed / totalTiles) * 100) : 0;
  const durationSec = (totalDurationMs / 1000).toFixed(1);

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasSubmitted || isSubmitting) return;

    const cleanName = nickname.trim().toUpperCase() || 'AGENT';
    setIsSubmitting(true);
    audio.playSuccess();

    try {
      const response = await submitScore({
        playerId: `player-${Date.now()}`,
        displayName: cleanName,
        gameId: 'pixel_hunter',
        score: totalScore,
        durationMs: totalDurationMs,
        difficulty: 'standard',
        challengesSolved: totalSolved,
      });

      setPlayerRank(response.rank);
      setLeaderboard(response.leaderboard);
      setHasSubmitted(true);
    } catch {
      setHasSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="result-screen">
      <div className="result-card">
        <div className="result-score-title">MISSION EVALUATION COMPLETE</div>
        <div className="final-score-number">{totalScore.toLocaleString()} <span style={{ fontSize: '1.5rem' }}>PTS</span></div>

        {/* 4 Performance Metrics */}
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-title">Accuracy</span>
            <span className="stat-val" style={{ color: totalSolved === results.length ? 'var(--emerald-neon)' : 'var(--text-primary)' }}>
              {totalSolved} / {results.length}
            </span>
          </div>

          <div className="stat-item">
            <span className="stat-title">Mission Time</span>
            <span className="stat-val">{durationSec}s</span>
          </div>

          <div className="stat-item">
            <span className="stat-title">Tiles Uncovered</span>
            <span className="stat-val">{revealPct}%</span>
          </div>

          <div className="stat-item">
            <span className="stat-title">Analyst Rank</span>
            <span className="stat-val" style={{ color: 'var(--cyan-neon)' }}>
              {totalScore >= 3200 ? 'SENIOR' : totalScore >= 2000 ? 'SPECIALIST' : 'CADET'}
            </span>
          </div>
        </div>

        {/* Educational Takeaway without lecturing */}
        <div className="educational-callout">
          <div className="callout-header">CORE GRSS INSIGHT</div>
          <p className="callout-text">
            "Remote sensing lets us interpret large areas of Earth from data collected without direct physical contact."
          </p>
        </div>

        {/* Short Nickname Submission Form */}
        {!hasSubmitted ? (
          <form onSubmit={handleSubmitScore} className="name-submit-row">
            <input
              type="text"
              maxLength={10}
              placeholder="YOUR ALIAS"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="name-input"
              autoFocus
            />
            <button
              type="submit"
              className="submit-name-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SAVING...' : 'SAVE SCORE'}
            </button>
          </form>
        ) : (
          <div style={{ margin: '0.75rem 0', color: 'var(--emerald-neon)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            SCORE RECORDED! {playerRank ? `YOU ARE CURRENTLY RANK #${playerRank}` : ''}
          </div>
        )}

        {/* Mini Booth Top 3 Preview */}
        {leaderboard.length > 0 && (
          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              CURRENT BOOTH LEADERS
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              {leaderboard.slice(0, 3).map((lead, idx) => (
                <div key={lead.id || idx} style={{ display: 'flex', gap: '0.35rem' }}>
                  <span>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                  <span style={{ fontWeight: 700 }}>{lead.displayName}:</span>
                  <span style={{ color: 'var(--cyan-neon)' }}>{lead.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="result-actions">
        <button
          type="button"
          className="start-btn"
          onClick={() => {
            audio.playSuccess();
            onPlayAgain();
          }}
          title="Play Another Attempt Immediately [ENTER]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          PLAY AGAIN
        </button>

        <button
          type="button"
          className="action-btn"
          style={{ height: '48px', padding: '0 1.25rem' }}
          onClick={onReturnHome}
        >
          BOOTH HOME
        </button>
      </div>
    </div>
  );
};
