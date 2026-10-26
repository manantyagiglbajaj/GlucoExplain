/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { explainRiskWithGemini } from '../src/server/geminiService';

/**
 * Vercel Serverless Function handler for /api/explain-risk
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { age, bmi, bmiCategory, score, maxScore, category, factors, hasSymptoms, labEvaluation } = req.body || {};

    if (typeof age !== 'number' || typeof bmi !== 'number' || typeof score !== 'number' || !category) {
      return res.status(400).json({
        error: 'Invalid request: age, bmi, score, and category are required.',
      });
    }

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

    return res.status(200).json(explanation);
  } catch (error: any) {
    console.error('Vercel API error:', error);
    return res.status(500).json({
      error: 'Failed to generate explanation. Please try again.',
    });
  }
}
