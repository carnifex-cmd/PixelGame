import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../types/game';
import { fetchLeaderboard } from '../utils/scoring';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard().then((res) => {
      setEntries(res.leaderboard);
      setIsOffline(res.isOffline);
      setLoading(false);
    });
  }, []);

  return (
    <div className="leaderboard-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            BOOTH TOP ANALYSTS
            {isOffline && (
              <span style={{ fontSize: '0.75rem', color: 'var(--amber-alert)', marginLeft: '0.5rem' }}>
                [LOCAL STORAGE]
              </span>
            )}
          </div>

          <button
            type="button"
            className="action-btn icon-only"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            LOADING TELEMETRY...
          </div>
        ) : entries.length === 0 ? (
          <div style={{
            padding: '3rem 1rem',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-display)',
            lineHeight: 1.8,
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏆</div>
            <div style={{ fontSize: '1rem', color: 'var(--cyan-neon)', letterSpacing: '0.1em' }}>
              NO SCORES YET
            </div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.6 }}>
              BE THE FIRST TO COMPLETE A MISSION AND CLAIM THE TOP SPOT!
            </div>
          </div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="rank-col">#</th>
                <th>CALLSIGN</th>
                <th>SOLVED</th>
                <th style={{ textAlign: 'right' }}>SCORE</th>
                <th style={{ textAlign: 'right' }}>DURATION</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => {
                const rank = index + 1;
                const dur = (entry.durationMs / 1000).toFixed(1);
                const totalChallenges = entry.challengesSolved != null
                  ? Math.max(entry.challengesSolved, 1)
                  : 4;
                return (
                  <tr key={entry.id || index}>
                    <td className="rank-col">
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}`}
                    </td>
                    <td className="name-col">{entry.displayName}</td>
                    <td>{entry.challengesSolved ?? '?'}/{totalChallenges <= 4 ? 4 : totalChallenges}</td>
                    <td className="score-col">{entry.score.toLocaleString()}</td>
                    <td className="time-col">{dur}s</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <button
            type="button"
            className="action-btn"
            style={{ width: '100%', height: '42px' }}
            onClick={onClose}
          >
            RETURN TO GAME
          </button>
        </div>
      </div>
    </div>
  );
};
