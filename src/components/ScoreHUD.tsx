import React from 'react';

interface ScoreHUDProps {
  currentIndex: number;
  totalChallenges: number;
  totalScore: number;
  currentPotentialScore: number;
  revealedCount: number;
  totalTiles: number;
  timeRemainingSeconds: number;
  timeLimitSeconds: number;
}

export const ScoreHUD: React.FC<ScoreHUDProps> = ({
  currentIndex,
  totalChallenges,
  totalScore,
  currentPotentialScore,
  revealedCount,
  totalTiles,
  timeRemainingSeconds,
  timeLimitSeconds,
}) => {
  const isUrgent = timeRemainingSeconds <= 4;
  const timePercent = Math.max(0, Math.min(100, (timeRemainingSeconds / timeLimitSeconds) * 100));

  return (
    <div className="hud-top">
      {/* Challenge Index */}
      <div className="hud-stat-box">
        <span className="hud-label">SCENARIO</span>
        <span className="hud-value">
          {currentIndex + 1}
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {totalChallenges}</span>
        </span>
      </div>

      {/* Potential Score on this challenge */}
      <div className="hud-stat-box">
        <span className="hud-label">POTENTIAL VALUE</span>
        <span className="hud-value highlight-cyan">
          +{currentPotentialScore}
          <span style={{ fontSize: '0.75rem', color: 'var(--cyan-neon)' }}>PTS</span>
        </span>
      </div>

      {/* Tile Reveal Stats */}
      <div className="hud-stat-box">
        <span className="hud-label">TILES REVEALED</span>
        <span className="hud-value">
          {revealedCount}
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {totalTiles}</span>
        </span>
      </div>

      {/* Timer with Progress Bar */}
      <div className="hud-stat-box">
        <span className="hud-label">SCAN WINDOW</span>
        <div className="timer-container">
          <div className="timer-bar-track">
            <div
              className={`timer-bar-fill ${isUrgent ? 'urgent' : ''}`}
              style={{ width: `${timePercent}%` }}
            />
          </div>
          <span className={`hud-value ${isUrgent ? 'highlight-danger' : ''}`} style={{ fontSize: '1.2rem' }}>
            {timeRemainingSeconds.toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Overall Session Score */}
      <div className="hud-stat-box" style={{ textAlign: 'right' }}>
        <span className="hud-label">SESSION SCORE</span>
        <span className="hud-value highlight-emerald">
          {totalScore.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
