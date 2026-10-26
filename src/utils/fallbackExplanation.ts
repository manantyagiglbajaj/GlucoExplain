/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RiskPredictionResult, GeminiExplanationResponse } from '../types/assessment';

/**
 * Generates an explainable structured narrative locally when Gemini AI is not enabled,
 * if the user opts out of cloud processing, or if the server is unreachable.
 */
export function generateLocalFallbackExplanation(
  result: RiskPredictionResult
): GeminiExplanationResponse {
  const { score, maxScore, category, age, bmi, factors, hasSymptoms, labEvaluation } = result;

  const topFactors = factors
    .filter((f) => f.points > 0)
    .sort((a, b) => b.points - a.points);

  const protectiveFactors = factors.filter((f) => f.impact === 'protective');

  let summary = '';
  if (category === 'Higher') {
    summary = `Your assessment yields an illustrative risk score of ${score} out of ${maxScore}, placing you in the Higher Risk indicator category. This indicator is influenced primarily by clinical factors such as ${
      topFactors.slice(0, 2).map((f) => f.name.toLowerCase()).join(' and ') || 'reported health indicators'
    }. This is an educational screening benchmark, not a medical diagnosis.`;
  } else if (category === 'Moderate') {
    summary = `Your assessment yields an illustrative score of ${score} out of ${maxScore}, placing you in the Moderate Risk category. Some modifiable lifestyle habits and individual background factors contributed to this score, while other areas remain in a lower risk zone.`;
  } else {
    summary = `Your assessment yields an illustrative score of ${score} out of ${maxScore}, placing you in the Low Risk category. Your reported lifestyle habits, age group, and metabolic background align with lower baseline statistical indicators. Remember that a low score does not rule out future changes.`;
  }

  const factorExplanations = topFactors.slice(0, 4).map((f) => ({
    factor: f.name,
    explanation: `${f.rationale} (Reported: ${f.userResponse}, +${f.points} pts)`,
  }));

  if (protectiveFactors.length > 0) {
    protectiveFactors.forEach((pf) => {
      factorExplanations.push({
        factor: `${pf.name} (Protective)`,
        explanation: `${pf.rationale} (Reported: ${pf.userResponse})`,
      });
    });
  }

  const missingInfoList = [
    'Recent fasting plasma glucose or oral glucose tolerance lab tests conducted in a clinical lab',
    'Lipid profile (HDL cholesterol and triglycerides)',
    'Waist circumference measurement (a specific indicator of visceral fat)',
    'Dietary quality assessment beyond sugar-sweetened drinks',
  ];

  const practicalSuggestions = [
    'Aim for at least 150 minutes of moderate-intensity physical activity (such as brisk walking) per week.',
    'Focus on balanced nutrition rich in leafy vegetables, whole grains, and lean proteins while minimizing refined carbohydrates and sweetened beverages.',
    'Maintain a consistent sleep schedule aiming for 7–8 hours of restful sleep nightly.',
    'Schedule a routine check-up with a primary care physician to measure blood pressure and discuss routine preventive screening.',
  ];

  let medicalFollowUp =
    'Share this educational report with your general practitioner or primary care doctor at your next wellness visit. They can order standardized venous laboratory tests if appropriate.';

  let urgentWarning: string | null = null;
  if (hasSymptoms) {
    medicalFollowUp =
      'Because you noted frequent urination or unusual thirst, we advise scheduling an in-person medical evaluation. A doctor can check for both glycemic shifts and other common causes (such as urinary infections or electrolyte changes).';
  }

  if (labEvaluation?.hasHbA1c && (labEvaluation.hba1cValue ?? 0) >= 6.5) {
    urgentWarning =
      'Important: Your reported HbA1c value is at or above the clinical threshold typically associated with diabetes. Please arrange prompt follow-up with a medical doctor for definitive testing and clinical care.';
  } else if (labEvaluation?.hasFastingGlucose && (labEvaluation.glucoseValue ?? 0) >= 126) {
    urgentWarning =
      'Important: Your reported fasting blood glucose level exceeds standard fasting limits. Please contact a healthcare provider for professional evaluation.';
  }

  return {
    summary,
    contributingFactors: factorExplanations,
    missingInformation: `To gain a complete clinical picture, healthcare providers also consider: ${missingInfoList.join(', ')}.`,
    practicalSuggestions,
    medicalFollowUp,
    urgentWarning,
    source: 'local_fallback',
  };
}
