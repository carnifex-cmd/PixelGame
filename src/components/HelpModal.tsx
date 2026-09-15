import React from 'react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="leaderboard-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            HOW TO PLAY PIXEL HUNTER
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-primary)', fontSize: '0.92rem' }}>
          <div style={{ background: 'rgba(0, 229, 255, 0.08)', padding: '0.85rem', borderRadius: '6px', borderLeft: '3px solid var(--cyan-neon)' }}>
            <strong>The Core Mission:</strong> A satellite image is hidden behind a grid of tiles. Reveal only as much as necessary to identify the Earth feature or environmental change shown.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--cyan-neon)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>01</span>
              <div>
                <strong>REVEAL:</strong> Click any tile to expose the imagery underneath. Each reveal reduces your available score multiplier.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--cyan-neon)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>02</span>
              <div>
                <strong>INFER:</strong> Look for textural signatures—meanders, geometric crop circles, urban grids, sediment plumes, or glacial tongues.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--cyan-neon)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>03</span>
              <div>
                <strong>GUESS & SCORE:</strong> Click one of the 4 answer choices (or press keys 1–4). Guessing immediately locks your score. Fast guesses earn speed multipliers!
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--amber-alert)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>04</span>
              <div>
                <strong>TIME-SHIFT MODE:</strong> In paired challenges, use the <em>STATE A / STATE B</em> buttons to spot decadal environmental change!
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Hotkeys
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span><kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '3px' }}>1-4</kbd> Choose Answer</span>
              <span><kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '3px' }}>F</kbd> Fullscreen</span>
              <span><kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '3px' }}>M</kbd> Mute Audio</span>
              <span><kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '3px' }}>Esc</kbd> Close</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <button
            type="button"
            className="start-btn"
            style={{ width: '100%', height: '44px', fontSize: '1rem', justifyContent: 'center' }}
            onClick={onClose}
          >
            GOT IT — LET'S PLAY!
          </button>
        </div>
      </div>
    </div>
  );
};
