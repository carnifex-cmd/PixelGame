import React from 'react';

interface ConfidenceMeterProps {
  potentialScore: number;
  maxScore?: number;
  revealedCount: number;
  totalTiles: number;
  timeRemaining: number;
  timeLimit: number;
  revealBudget?: number;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  potentialScore,
  maxScore = 1000,
  revealedCount,
  totalTiles,
  timeRemaining,
  timeLimit,
  revealBudget,
}) => {
  const scorePct = Math.max(10, Math.min(100, (potentialScore / maxScore) * 100));

  // Determine meter color stage
  let colorClass = 'high'; // > 700 pts: emerald/cyan
  if (potentialScore < 400) {
    colorClass = 'low'; // < 400 pts: alert orange/ruby
  } else if (potentialScore < 700) {
    colorClass = 'mid'; // 400-700 pts: amber
  }

  const revealRatio = totalTiles > 0 ? Math.round((revealedCount / totalTiles) * 100) : 0;

  return (
    <div className="confidence-meter-container" role="meter" aria-valuenow={potentialScore} aria-valuemin={100} aria-valuemax={1000}>
      <div className="confidence-meta-row">
        <div className="confidence-title">
          <span className="meter-pulse-dot" />
          CONFIDENCE / SCORE METER
        </div>
        <div className="confidence-value-tag">
          CURRENT YIELD: <span className={`points-val ${colorClass}`}>{potentialScore}</span> / {maxScore} PTS
        </div>
      </div>

      <div className="confidence-bar-track">
        <div
          className={`confidence-bar-fill ${colorClass}`}
          style={{ width: `${scorePct}%` }}
        />
        {/* Threshold ticks */}
        <div className="meter-tick" style={{ left: '25%' }} title="250 pts" />
        <div className="meter-tick" style={{ left: '50%' }} title="500 pts" />
        <div className="meter-tick" style={{ left: '75%' }} title="750 pts" />
      </div>

      <div className="confidence-subtext-row">
        <span>
          Reveal Penalty: -{revealRatio}% ({revealedCount}/{totalTiles} tiles open)
        </span>
        {revealBudget !== undefined && (
          <span style={{ color: revealedCount >= revealBudget ? 'var(--ruby-danger)' : 'var(--amber-alert)' }}>
            Reveal Budget: {Math.max(0, revealBudget - revealedCount)} remaining
          </span>
        )}
        <span>
          Speed Multiplier: {(0.5 + 0.5 * (timeRemaining / timeLimit)).toFixed(2)}x
        </span>
      </div>
    </div>
  );
};
