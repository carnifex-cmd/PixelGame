import React, { useMemo } from 'react';
import { Scenario } from '../types/game';

interface AnswerPanelProps {
  scenario: Scenario;
  selectedAnswer: string | null;
  isAnswerSubmitted: boolean;
  onSelectAnswer: (answer: string) => void;
  disabled?: boolean;
}

export const AnswerPanel: React.FC<AnswerPanelProps> = ({
  scenario,
  selectedAnswer,
  isAnswerSubmitted,
  onSelectAnswer,
  disabled = false,
}) => {
  // Deterministically shuffle answers once per scenario id
  const options = useMemo(() => {
    const list = [scenario.correctAnswer, ...scenario.distractors];
    // Seeded shuffle using scenario id
    let seed = 0;
    for (let i = 0; i < scenario.id.length; i++) {
      seed = (seed * 31 + scenario.id.charCodeAt(i)) % 1000000;
    }
    for (let i = list.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.floor((seed / 233280) * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [scenario.id, scenario.correctAnswer, scenario.distractors]);

  return (
    <div className="answer-grid" role="group" aria-label="Earth Observation Feature Choices">
      {options.map((option, idx) => {
        const keyNumber = idx + 1;
        const isSelected = selectedAnswer === option;
        const isCorrect = option === scenario.correctAnswer;

        let statusClass = '';
        if (isAnswerSubmitted) {
          if (isCorrect) {
            statusClass = 'correct';
          } else if (isSelected && !isCorrect) {
            statusClass = 'wrong';
          }
        }

        return (
          <button
            key={option}
            type="button"
            className={`answer-card ${statusClass}`}
            disabled={disabled || isAnswerSubmitted}
            onClick={() => onSelectAnswer(option)}
            aria-label={`Choice ${keyNumber}: ${option}`}
          >
            <span className="key-badge">{keyNumber}</span>
            <span style={{ flex: 1 }}>{option}</span>
          </button>
        );
      })}
    </div>
  );
};
