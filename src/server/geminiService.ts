/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from '@google/genai';
import { GeminiExplanationResponse, RiskPredictionResult } from '../types/assessment';
import { generateLocalFallbackExplanation } from '../utils/fallbackExplanation';

/**
 * Server-side explanation generator using the modern @google/genai SDK.
 * Model: gemini-3.8-flash (official recommended model for text tasks).
 */
export async function explainRiskWithGemini(
  payload: {
    age: number;
    bmi: number;
    bmiCategory: string;
    score: number;
    maxScore: number;
    category: 'Low' | 'Moderate' | 'Higher';
    factors: Array<{
      name: string;
      userResponse: string;
      impact: string;
      points: number;
      rationale: string;
    }>;
    hasSymptoms: boolean;
    labEvaluation?: {
      hasHbA1c: boolean;
      hba1cValue?: number;
      hba1cInterpretation?: string;
      hasFastingGlucose: boolean;
      glucoseValue?: number;
      glucoseInterpretation?: string;
    } | null;
  }
): Promise<GeminiExplanationResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  // If API key is missing, return high-quality local fallback explanation
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.warn('GEMINI_API_KEY not configured. Using local rule-based explanation.');
    const mockResult: RiskPredictionResult = {
      score: payload.score,
      maxScore: payload.maxScore,
      category: payload.category,
      age: payload.age,
      bmi: payload.bmi,
      bmiCategory: payload.bmiCategory,
      factors: payload.factors.map((f, i) => ({
        id: `f_${i}`,
        category: 'Metabolic',
        ...f,
        impact: f.impact as 'increased' | 'neutral' | 'protective',
      })),
      labEvaluation: payload.labEvaluation
        ? {
            ...payload.labEvaluation,
            cautionNotice: 'Laboratory values are self-reported and provided for educational tracking only.',
          }
        : null,
      assessmentDate: new Date().toLocaleDateString('en-US'),
      hasSymptoms: payload.hasSymptoms,
    };
    return generateLocalFallbackExplanation(mockResult);
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const promptContent = `
You are an explainable health risk education specialist for GlucoExplain.
Your task is to explain the ALREADY-CALCULATED educational diabetes risk score to a user in clear, compassionate, accessible English.

CRITICAL INSTRUCTIONS:
1. DO NOT invent, recalculate, or override the score or risk category. The score (${payload.score} / ${payload.maxScore}) and category (${payload.category} Risk) are authoritative.
2. DO NOT diagnose or claim medical certainty. GlucoExplain is an educational screening prototype, not a medical diagnostic device.
3. Distinguish clearly between established factors (such as age, prior blood sugar history, BMI) and modifiable lifestyle factors (sleep, physical activity, sugar intake).
4. Explain WHY each factor influenced the calculation in plain English without medical jargon.
5. If the user reported symptoms (frequent urination or thirst) or elevated laboratory results, include a clear recommendation to seek professional clinical evaluation.
6. Return purely valid JSON following the schema.

Assessment Data:
- Age: ${payload.age} years
- Calculated BMI: ${payload.bmi} (${payload.bmiCategory})
- Category: ${payload.category} Risk (${payload.score} out of ${payload.maxScore} points)
- Reported Symptoms: ${payload.hasSymptoms ? 'Reported frequent urination or excessive thirst' : 'None reported'}
- Recorded Factor Impacts:
${payload.factors.map((f) => `  * ${f.name}: User reported "${f.userResponse}" (Impact: ${f.impact}, Points: ${f.points}) - Note: ${f.rationale}`).join('\n')}
${payload.labEvaluation?.hasHbA1c ? `- Reported HbA1c: ${payload.labEvaluation.hba1cValue}% (${payload.labEvaluation.hba1cInterpretation})` : ''}
${payload.labEvaluation?.hasFastingGlucose ? `- Reported Fasting Glucose: ${payload.labEvaluation.glucoseValue} mg/dL (${payload.labEvaluation.glucoseInterpretation})` : ''}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptContent,
      config: {
        systemInstruction:
          'You are a friendly, scientifically accurate health communications specialist. Provide plain-English, supportive, non-alarmist educational explanations of diabetes risk factors. Never provide a clinical diagnosis or prescribe treatments.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'A 2-3 sentence overview explaining what the score and risk category mean in plain English.',
            },
            contributingFactors: {
              type: Type.ARRAY,
              description: 'Explanations for key factors that influenced this score.',
              items: {
                type: Type.OBJECT,
                properties: {
                  factor: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['factor', 'explanation'],
              },
            },
            missingInformation: {
              type: Type.STRING,
              description: 'Explanation of what clinical information is missing from this questionnaire (e.g. lab blood tests, lipid panel).',
            },
            practicalSuggestions: {
              type: Type.ARRAY,
              description: '3-4 safe, evidence-based general lifestyle suggestions (exercise, nutrition, sleep).',
              items: { type: Type.STRING },
            },
            medicalFollowUp: {
              type: Type.STRING,
              description: 'Advice on when and how to discuss these results with a licensed doctor or healthcare professional.',
            },
            urgentWarning: {
              type: Type.STRING,
              description: 'If concerning symptoms or elevated labs are present, a gentle yet firm prompt to seek professional medical review. Null or empty if normal.',
            },
          },
          required: [
            'summary',
            'contributingFactors',
            'missingInformation',
            'practicalSuggestions',
            'medicalFollowUp',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from Gemini');
    }

    const parsed = JSON.parse(text) as GeminiExplanationResponse;
    return {
      ...parsed,
      urgentWarning: parsed.urgentWarning || null,
      source: 'gemini',
    };
  } catch (error) {
    console.error('Error in Gemini API call, using fallback:', error);
    const mockResult: RiskPredictionResult = {
      score: payload.score,
      maxScore: payload.maxScore,
      category: payload.category,
      age: payload.age,
      bmi: payload.bmi,
      bmiCategory: payload.bmiCategory,
      factors: payload.factors.map((f, i) => ({
        id: `f_${i}`,
        category: 'Metabolic',
        ...f,
        impact: f.impact as 'increased' | 'neutral' | 'protective',
      })),
      labEvaluation: payload.labEvaluation
        ? {
            ...payload.labEvaluation,
            cautionNotice: 'Laboratory values are self-reported and provided for educational tracking only.',
          }
        : null,
      assessmentDate: new Date().toLocaleDateString('en-US'),
      hasSymptoms: payload.hasSymptoms,
    };
    return generateLocalFallbackExplanation(mockResult);
  }
}
