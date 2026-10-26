/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AssessmentData {
  // Section 1: Personal Details
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  sex: 'male' | 'female' | 'prefer_not_to_say' | '';

  // Section 2: Health Background
  familyHistory: 'yes' | 'no' | 'not_sure' | '';
  previousHighBloodSugar: 'yes' | 'no' | 'not_sure' | '';
  highBloodPressure: 'yes' | 'no' | 'not_sure' | '';

  // Section 3: Lifestyle
  weightKg: number | '';
  heightCm: number | '';
  dailyActivityMinutes: number | '';
  averageSleepHours: number | '';
  smokingHistory: 'never' | 'former' | 'current' | 'prefer_not_to_say' | '';
  sugaryDrinks: 'rarely' | 'sometimes' | 'daily' | '';
  possibleSymptoms: 'yes' | 'no' | '';

  // Section 4: Optional Health Measurements
  latestHbA1c: number | '';
  latestFastingGlucose: number | '';

  // Privacy & AI Explanation Consent
  aiConsent: boolean;
}

export type RiskCategory = 'Low' | 'Moderate' | 'Higher';

export interface ContributingFactor {
  id: string;
  name: string;
  category: 'Demographic' | 'Metabolic' | 'Lifestyle' | 'Symptoms';
  userResponse: string;
  impact: 'increased' | 'neutral' | 'protective';
  points: number;
  rationale: string;
}

export interface LabEvaluation {
  hasHbA1c: boolean;
  hba1cValue?: number;
  hba1cInterpretation?: string;
  hasFastingGlucose: boolean;
  glucoseValue?: number;
  glucoseInterpretation?: string;
  cautionNotice: string;
}

export interface RiskPredictionResult {
  score: number;
  maxScore: number;
  category: RiskCategory;
  age: number;
  bmi: number;
  bmiCategory: string;
  factors: ContributingFactor[];
  labEvaluation: LabEvaluation | null;
  assessmentDate: string;
  hasSymptoms: boolean;
}

export interface GeminiExplanationResponse {
  summary: string;
  contributingFactors: Array<{
    factor: string;
    explanation: string;
  }>;
  missingInformation: string;
  practicalSuggestions: string[];
  medicalFollowUp: string;
  urgentWarning?: string | null;
  source: 'gemini' | 'local_fallback';
}

export interface AssessmentFormErrors {
  fullName?: string;
  dateOfBirth?: string;
  sex?: string;
  weightKg?: string;
  heightCm?: string;
  dailyActivityMinutes?: string;
  averageSleepHours?: string;
  familyHistory?: string;
  previousHighBloodSugar?: string;
  highBloodPressure?: string;
  smokingHistory?: string;
  sugaryDrinks?: string;
  possibleSymptoms?: string;
  latestHbA1c?: string;
  latestFastingGlucose?: string;
}
