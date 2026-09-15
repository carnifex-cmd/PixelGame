export type Theme = 'land' | 'water' | 'cryosphere' | 'atmosphere' | 'disasters' | 'time_shift';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface Scenario {
  id: string;
  title: string;
  theme: Theme;
  difficulty: Difficulty;
  gridSize: 4 | 5;
  correctAnswer: string;
  distractors: [string, string, string];
  source: string;
  sensor: string;
  license: string;
  crop: string;
  intendedBands: string; // e.g. "True Color RGB", "SWIR / NIR / Red", "Thermal IR", "SAR C-Band"
  timeLimit: number; // in seconds (e.g. 15)
  revealBudget?: number;
  targetMask?: string;
  explanation: string;
  grssTakeaway: string;
  // Generator or image identifier
  imageKey: string;
  imageAfterKey?: string; // For Time Shift mode before/after
  changePrompt?: string; // e.g. "What primary change occurred between 1990 and 2024?"
}

export interface ChallengeResult {
  scenarioId: string;
  correct: boolean;
  score: number;
  revealedCount: number;
  totalTiles: number;
  timeUsedMs: number;
  chosenAnswer: string;
  correctAnswer: string;
}

export interface GameSession {
  sessionId: string;
  playerId: string;
  displayName: string;
  startTime: number;
  endTime?: number;
  challenges: Scenario[];
  currentIndex: number;
  totalScore: number;
  results: ChallengeResult[];
}

export interface LeaderboardEntry {
  id: string;
  playerId: string;
  displayName: string;
  gameId: string;
  score: number;
  durationMs: number;
  difficulty: string;
  challengesSolved: number;
  timestamp: number;
  sessionId?: string;
  signature?: string;
}
