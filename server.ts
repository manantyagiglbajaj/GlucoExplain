/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { explainRiskWithGemini } from './src/server/geminiService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Strict body parser with size limit to prevent abuse
app.use(express.json({ limit: '100kb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'GlucoExplain',
    geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
  });
});

// Explain Risk endpoint
app.post('/api/explain-risk', async (req: Request, res: Response): Promise<void> => {
  try {
    const { age, bmi, bmiCategory, score, maxScore, category, factors, hasSymptoms, labEvaluation } = req.body;

    // Validation: Ensure required numerical and category fields are provided
    if (typeof age !== 'number' || typeof bmi !== 'number' || typeof score !== 'number' || !category) {
      res.status(400).json({
        error: 'Invalid request: age, bmi, score, and category are required.',
      });
      return;
    }

    // Safety & Privacy: Reject any inadvertent personal identifier payloads
    // (Explicitly strip name or DOB if sent)
    const sanitizedFactors = Array.isArray(factors)
      ? factors.map((f: any) => ({
          name: String(f.name || ''),
          userResponse: String(f.userResponse || ''),
          impact: String(f.impact || 'neutral'),
          points: Number(f.points || 0),
          rationale: String(f.rationale || ''),
        }))
      : [];

    const explanation = await explainRiskWithGemini({
      age,
      bmi,
      bmiCategory: String(bmiCategory || ''),
      score,
      maxScore: Number(maxScore || 26),
      category,
      factors: sanitizedFactors,
      hasSymptoms: Boolean(hasSymptoms),
      labEvaluation: labEvaluation || null,
    });

    res.json(explanation);
  } catch (error: any) {
    console.error('Server error handling /api/explain-risk:', error?.message || error);
    res.status(500).json({
      error: 'Failed to generate explanation. Please try again or use the offline summary.',
    });
  }
});

async function startServer() {
  if (!isProd) {
    // Development mode: attach Vite dev server middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[GlucoExplain] Server running at http://0.0.0.0:${port} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[GlucoExplain] Failed to start server:', err);
  process.exit(1);
});
