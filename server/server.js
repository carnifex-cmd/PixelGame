import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'leaderboard.json');
const DIST_DIR = path.join(__dirname, '..', 'dist');

// ─── Core middleware ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Persistence helpers ───────────────────────────────────────────────────

function loadLeaderboard() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8').trim();
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading leaderboard file:', err);
  }
  return []; // Start empty — only real players make the board
}

function saveLeaderboard(scores) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(scores, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving leaderboard file:', err);
  }
}

// ─── API Routes (MUST be registered before static serving) ────────────────

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    game: 'Pixel Hunter',
    service: 'IEEE GRSS Open Day Leaderboard API',
    timestamp: Date.now(),
  });
});

// GET top 10 scores — only real submissions, never hardcoded
app.get('/api/leaderboard', (_req, res) => {
  try {
    const scores = loadLeaderboard();
    const sorted = [...scores]
      .sort((a, b) => b.score - a.score || a.durationMs - b.durationMs)
      .slice(0, 10);
    res.json({
      success: true,
      leaderboard: sorted,
      count: sorted.length,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error('GET /api/leaderboard error:', err);
    res.status(500).json({ success: false, error: 'Failed to load leaderboard' });
  }
});

// POST a new real player score
app.post('/api/score', (req, res) => {
  try {
    const {
      playerId,
      displayName,
      gameId = 'pixel_hunter',
      score,
      durationMs,
      difficulty = 'standard',
      challengesSolved = 0,
      sessionId,
    } = req.body;

    // Validation
    if (typeof score !== 'number' || score < 0 || score > 15000) {
      return res.status(400).json({ success: false, error: 'Invalid score value' });
    }
    if (!displayName || typeof displayName !== 'string') {
      return res.status(400).json({ success: false, error: 'displayName required' });
    }

    const cleanName = displayName
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9_\- ]/g, '')
      .slice(0, 12) || 'ANON';

    const entry = {
      id: `rec-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
      playerId: playerId || `usr-${Date.now()}`,
      displayName: cleanName,
      gameId,
      score: Math.round(score),
      durationMs: Number(durationMs) || 0,
      difficulty,
      challengesSolved: Number(challengesSolved) || 0,
      timestamp: Date.now(),
      sessionId: sessionId || null,
    };

    const scores = loadLeaderboard();
    scores.push(entry);

    // Persist top 200 — display is always top 10
    scores.sort((a, b) => b.score - a.score || a.durationMs - b.durationMs);
    const trimmed = scores.slice(0, 200);
    saveLeaderboard(trimmed);

    const rank = trimmed.findIndex((item) => item.id === entry.id) + 1;
    console.log(`📊 Score saved: ${cleanName} — ${entry.score} pts (rank #${rank})`);

    res.json({
      success: true,
      entry,
      rank,
      isTopTen: rank <= 10,
      leaderboard: trimmed.slice(0, 10),
    });
  } catch (err) {
    console.error('POST /api/score error:', err);
    res.status(500).json({ success: false, error: 'Failed to save score' });
  }
});

// POST reset — wipes ALL scores to empty (volunteer use only)
app.post('/api/reset-leaderboard', (req, res) => {
  const { passcode } = req.body;
  if (passcode === 'grss2026') {
    saveLeaderboard([]);
    console.log('⚠️  Leaderboard reset to empty by volunteer.');
    return res.json({ success: true, message: 'Leaderboard cleared. Ready for new session.' });
  }
  res.status(403).json({ success: false, error: 'Unauthorized' });
});

// ─── Serve built frontend AFTER all API routes ────────────────────────────
// express.static only matches exact files — it won't catch /api/* since
// those don't exist as files in dist/. The SPA fallback below handles routing.

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  // SPA fallback: for any non-API path not matched by static files
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
  console.log(`🌐 Serving frontend from ${DIST_DIR}`);
} else {
  console.log('⚡ No dist/ found — run "npm run build" for production serving.');
  console.log('   In dev mode, Vite serves the frontend on port 3000.');
}

// ─── Global error handler ─────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n📡 IEEE GRSS Pixel Hunter API → http://localhost:${PORT}`);
  console.log(`📋 Leaderboard data: ${DATA_FILE}`);
  console.log(`   GET  /api/leaderboard`);
  console.log(`   POST /api/score`);
  console.log(`   POST /api/reset-leaderboard { passcode:"grss2026" }\n`);
});
