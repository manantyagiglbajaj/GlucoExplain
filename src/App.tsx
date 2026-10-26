/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { AssessmentForm } from './components/AssessmentForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { PrintReport } from './components/PrintReport';
import { Footer } from './components/Footer';
import {
  AssessmentData,
  RiskPredictionResult,
  GeminiExplanationResponse,
} from './types/assessment';
import { predictRisk } from './utils/predictRisk';
import { generateLocalFallbackExplanation } from './utils/fallbackExplanation';

const INITIAL_FORM_DATA: AssessmentData = {
  // Section 1: Personal Details
  fullName: '',
  dateOfBirth: '',
  sex: '',

  // Section 2: Health Background
  familyHistory: '',
  previousHighBloodSugar: '',
  highBloodPressure: '',

  // Section 3: Lifestyle
  weightKg: '',
  heightCm: '',
  dailyActivityMinutes: '',
  averageSleepHours: '',
  smokingHistory: '',
  sugaryDrinks: '',
  possibleSymptoms: '',

  // Section 4: Optional Measurements
  latestHbA1c: '',
  latestFastingGlucose: '',

  // Privacy & AI Explanation Consent
  aiConsent: true,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'assessment'>('home');
  const [formData, setFormData] = useState<AssessmentData>(INITIAL_FORM_DATA);
  const [result, setResult] = useState<RiskPredictionResult | null>(null);
  const [explanation, setExplanation] = useState<GeminiExplanationResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [isReviewingForm, setIsReviewingForm] = useState(false);

  const handleStartAssessment = () => {
    setActiveTab('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewAnswers = () => {
    setIsReviewingForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNewAssessment = () => {
    setFormData(INITIAL_FORM_DATA);
    setResult(null);
    setExplanation(null);
    setIsReviewingForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (submittedData: AssessmentData) => {
    setIsSubmitting(true);

    // 1. Calculate deterministic risk prediction
    const computedResult = predictRisk(submittedData);
    setResult(computedResult);
    setIsReviewingForm(false);

    // 2. Prepare explanation
    if (!submittedData.aiConsent) {
      // User opted for offline / local-only calculation
      const localExplanation = generateLocalFallbackExplanation(computedResult);
      setExplanation(localExplanation);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Call server-side /api/explain-risk
    setIsLoadingExplanation(true);
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // Privacy-first payload: Send only clinical metrics, NEVER full name or DOB
      const sanitizedPayload = {
        age: computedResult.age,
        bmi: computedResult.bmi,
        bmiCategory: computedResult.bmiCategory,
        score: computedResult.score,
        maxScore: computedResult.maxScore,
        category: computedResult.category,
        factors: computedResult.factors.map((f) => ({
          name: f.name,
          userResponse: f.userResponse,
          impact: f.impact,
          points: f.points,
          rationale: f.rationale,
        })),
        hasSymptoms: computedResult.hasSymptoms,
        labEvaluation: computedResult.labEvaluation
          ? {
              hasHbA1c: computedResult.labEvaluation.hasHbA1c,
              hba1cValue: computedResult.labEvaluation.hba1cValue,
              hba1cInterpretation: computedResult.labEvaluation.hba1cInterpretation,
              hasFastingGlucose: computedResult.labEvaluation.hasFastingGlucose,
              glucoseValue: computedResult.labEvaluation.glucoseValue,
              glucoseInterpretation: computedResult.labEvaluation.glucoseInterpretation,
            }
          : null,
      };

      const res = await fetch('/api/explain-risk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedPayload),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const aiResponse = (await res.json()) as GeminiExplanationResponse;
      setExplanation(aiResponse);
    } catch (err) {
      console.warn('Could not retrieve Gemini explanation, using local fallback:', err);
      const fallback = generateLocalFallbackExplanation(computedResult);
      setExplanation(fallback);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasAssessmentResult={Boolean(result)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-6 sm:pt-8">
        {activeTab === 'home' ? (
          <HomePage onStartAssessment={handleStartAssessment} />
        ) : (
          <div>
            {result && !isReviewingForm ? (
              <ResultsDashboard
                formData={formData}
                result={result}
                explanation={explanation}
                isLoadingExplanation={isLoadingExplanation}
                onReviewAnswers={handleReviewAnswers}
                onStartNewAssessment={handleStartNewAssessment}
              />
            ) : (
              <div className="space-y-6">
                <div className="text-center max-w-xl mx-auto px-4 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Diabetes Risk Assessment
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Answer the questions below to receive your explainable risk indicator. All data is kept private and never stored.
                  </p>
                </div>

                <AssessmentForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
          </div>
        )}

        {/* Dedicated Print Report View (Visible only during print) */}
        {result && (
          <PrintReport
            formData={formData}
            result={result}
            explanation={explanation}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
