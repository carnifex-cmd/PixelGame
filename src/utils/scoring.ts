import { LeaderboardEntry } from '../types/game';

const LOCAL_STORAGE_KEY = 'pixel_hunter_leaderboard_v2';

/**
 * Calculates real-time or final challenge score conforming to GRSS spec:
 * score = 1000 * revealMultiplier * speedMultiplier
 * floor of 100 for correct answers before submitting.
 */
export function calculateChallengeScore(
  revealedCount: number,
  totalTiles: number,
  timeRemainingSeconds: number,
  timeLimitSeconds: number,
  isCorrect: boolean
): number {
  if (!isCorrect) {
    return 0;
  }

  const BASE = 1000;
  const revealRatio = Math.min(1, Math.max(0, revealedCount / totalTiles));
  // Reveal multiplier: from 1.0 (0 tiles revealed) down to 0.25 (100% tiles revealed)
  const revealMultiplier = 1.0 - 0.75 * revealRatio;

  // Speed multiplier: from 1.0 (instant) down to 0.5 (time expired)
  const timeRatio = Math.min(1, Math.max(0, timeRemainingSeconds / timeLimitSeconds));
  const speedMultiplier = 0.5 + 0.5 * timeRatio;

  const rawScore = BASE * revealMultiplier * speedMultiplier;
  return Math.max(100, Math.round(rawScore));
}

/**
 * Loads leaderboard — tries server first, falls back to localStorage.
 * Returns an empty array when no scores have been recorded yet.
 */
export async function fetchLeaderboard(): Promise<{ leaderboard: LeaderboardEntry[]; isOffline: boolean }> {
  try {
    const res = await fetch('/api/leaderboard', { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.leaderboard)) {
        // Update local cache
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.leaderboard));
        } catch {
          // ignore
        }
        return { leaderboard: data.leaderboard, isOffline: false };
      }
    }
  } catch {
    // API unavailable — use local storage
  }

  // Load from localStorage (may be empty — that's fine, no fake data)
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return { leaderboard: parsed, isOffline: true };
      }
    }
  } catch {
    // ignore
  }

  // Nothing saved yet — return genuinely empty leaderboard
  return { leaderboard: [], isOffline: true };
}

/**
 * Submits player score to server, caching locally in case of network interruption
 */
export async function submitScore(entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>): Promise<{
  success: boolean;
  rank: number;
  leaderboard: LeaderboardEntry[];
}> {
  const localEntry: LeaderboardEntry = {
    ...entry,
    id: `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: Date.now(),
  };

  // Attempt server post
  try {
    const res = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
      signal: AbortSignal.timeout(2500),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.leaderboard)) {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.leaderboard));
        } catch {
          // ignore
        }
        return {
          success: true,
          rank: data.rank || 1,
          leaderboard: data.leaderboard,
        };
      }
    }
  } catch {
    // Server unavailable: save to local cache
  }

  // Local offline saving — only real player data, never fake entries
  let list: LeaderboardEntry[] = [];
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    list = cached ? JSON.parse(cached) : [];
  } catch {
    list = [];
  }

  list.push(localEntry);
  list.sort((a, b) => b.score - a.score || a.durationMs - b.durationMs);
  const top10 = list.slice(0, 10);

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(top10));
  } catch {
    // ignore
  }

  const rank = list.findIndex((item) => item.id === localEntry.id) + 1;
  return {
    success: true,
    rank: rank > 0 ? rank : 1,
    leaderboard: top10,
  };
}
