import React from 'react';
import { Scenario } from '../types/game';

interface FeedbackBannerProps {
  scenario: Scenario;
  isCorrect: boolean;
  scoreDelta: number;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  scenario,
  isCorrect,
  scoreDelta,
}) => {
  return (
    <div className="feedback-overlay">
      <div className={`feedback-badge ${isCorrect ? 'correct' : 'wrong'}`}>
        {isCorrect ? (
          <>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            TARGET VERIFIED
          </>
        ) : (
          <>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            MISINTERPRETATION
          </>
        )}
      </div>

      <div
        className="feedback-score-delta"
        style={{ color: isCorrect ? 'var(--emerald-neon)' : 'var(--ruby-danger)' }}
      >
        {isCorrect ? `+${scoreDelta} POINTS` : '+0 POINTS'}
      </div>

      <div className="feedback-explanation">
        <strong>{scenario.correctAnswer}</strong> — {scenario.explanation}
      </div>

      <div className="feedback-takeaway">
        📡 {scenario.grssTakeaway}
      </div>

      <div className="auto-advance-bar">
        <div className="auto-advance-fill" />
      </div>
    </div>
  );
};
