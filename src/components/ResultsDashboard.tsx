/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AssessmentData,
  RiskPredictionResult,
  GeminiExplanationResponse,
} from '../types/assessment';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Printer,
  RotateCcw,
  Edit3,
  Sparkles,
  ShieldAlert,
  Activity,
  HeartPulse,
  TrendingUp,
  Scale,
  Calendar,
  Layers,
  ArrowRight,
  FileCheck,
} from 'lucide-react';

interface ResultsDashboardProps {
  formData: AssessmentData;
  result: RiskPredictionResult;
  explanation: GeminiExplanationResponse | null;
  isLoadingExplanation: boolean;
  onReviewAnswers: () => void;
  onStartNewAssessment: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  formData,
  result,
  explanation,
  isLoadingExplanation,
  onReviewAnswers,
  onStartNewAssessment,
}) => {
  const [factorFilter, setFactorFilter] = useState<'all' | 'increased' | 'protective'>('all');

  // Extract first name if provided
  const firstName = formData.fullName.trim()
    ? formData.fullName.trim().split(' ')[0]
    : null;

  const handlePrint = () => {
    window.print();
  };

  const filteredFactors = result.factors.filter((f) => {
    if (factorFilter === 'increased') return f.impact === 'increased';
    if (factorFilter === 'protective') return f.impact === 'protective' || f.impact === 'neutral';
    return true;
  });

  // Visual scale styling based on risk category
  const categoryConfig = {
    Low: {
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      barColor: 'bg-emerald-500',
      label: 'Low Risk Indicator',
      description: 'Your reported metrics fall into the lower baseline range for type 2 diabetes screening.',
      accentBorder: 'border-emerald-200',
    },
    Moderate: {
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
      barColor: 'bg-amber-500',
      label: 'Moderate Risk Indicator',
      description: 'Some reported clinical or lifestyle factors suggest an elevated risk profile compared to baseline.',
      accentBorder: 'border-amber-200',
    },
    Higher: {
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-300',
      barColor: 'bg-rose-500',
      label: 'Higher Risk Indicator',
      description: 'Several significant risk factors or reported symptoms were identified in this screening.',
      accentBorder: 'border-rose-200',
    },
  }[result.category];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 pb-16">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>Assessment Completed &bull; {result.assessmentDate}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {firstName ? `${firstName}'s Diabetes Risk Profile` : 'Diabetes Risk Assessment Profile'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Transparent, factor-based prototype analysis calculated on {result.assessmentDate}.
            </p>
          </div>

          {/* Action Buttons for Top Bar */}
          <div className="flex items-center gap-2 no-print self-start sm:self-center">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onReviewAnswers}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Review Answers</span>
            </button>
          </div>
        </div>

        {/* Mandatory Educational Prototype Banner */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
          <p className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
            Educational prototype result — not a diagnosis.
          </p>
        </div>

        {/* Core Score & Metric Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Main Risk Category Box */}
          <div className={`p-5 rounded-2xl border ${categoryConfig.accentBorder} bg-gradient-to-br from-white to-slate-50/60 shadow-xs md:col-span-2`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${categoryConfig.badgeClass}`}>
                {categoryConfig.label}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Points: <strong>{result.score}</strong> / {result.maxScore}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">
                {result.category} Risk Category
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {categoryConfig.description}
              </p>
            </div>

            {/* Visual Risk Indicator Scale */}
            <div className="mt-5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Low (0–6)</span>
                <span>Moderate (7–12)</span>
                <span>Higher (13–26)</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
                <div
                  className={`h-full ${
                    result.category === 'Low'
                      ? 'bg-emerald-500 w-1/3'
                      : result.category === 'Moderate'
                      ? 'bg-amber-500 w-2/3'
                      : 'bg-rose-500 w-full'
                  } transition-all duration-500`}
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics Summary */}
          <div className="space-y-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-600">Calculated Age</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{result.age} years</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-600">Calculated BMI</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-900 block">{result.bmi} kg/m²</span>
                <span className="text-[10px] text-slate-500 block">{result.bmiCategory}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-600">Reported Symptoms</span>
              </div>
              <span className={`text-xs font-bold ${result.hasSymptoms ? 'text-amber-700' : 'text-slate-700'}`}>
                {result.hasSymptoms ? 'Present' : 'None Reported'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Warning (if symptoms or high lab values reported) */}
      {(result.hasSymptoms || (explanation && explanation.urgentWarning)) && (
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-5 sm:p-6 text-amber-950 flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-tight text-amber-900">
              Clinical Precaution & Prompt Medical Evaluation
            </h3>
            <p className="text-xs sm:text-sm text-amber-800/95 mt-1 leading-relaxed">
              {explanation?.urgentWarning ||
                'You reported symptoms such as frequent urination or excessive thirst. While these symptoms can result from multiple factors, they warrant prompt evaluation by a qualified medical professional.'}
            </p>
            <p className="text-xs text-amber-700 mt-2 font-medium">
              If you experience severe symptoms like dizziness, confusion, nausea, or rapid breathing, seek immediate emergency medical care.
            </p>
          </div>
        </div>
      )}

      {/* "Understand Your Result" Plain English Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Understand Your Result
              </h2>
              <p className="text-xs text-slate-500">
                {explanation?.source === 'gemini'
                  ? 'AI-Powered Plain-Language Clinical Synthesis (Google Gemini)'
                  : 'Transparent Rule-Based Explanatory Narrative'}
              </p>
            </div>
          </div>

          {isLoadingExplanation && (
            <div className="flex items-center gap-2 text-xs text-teal-700 bg-teal-50 px-3 py-1 rounded-full font-medium animate-pulse">
              <div className="w-3 h-3 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
              <span>Generating AI insights...</span>
            </div>
          )}
        </div>

        {explanation ? (
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70">
              <p className="font-medium text-slate-800">{explanation.summary}</p>
            </div>

            {/* Missing Information Callout */}
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/70 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <span className="font-bold block mb-0.5">Clinical Information Not Covered in This Questionnaire:</span>
                {explanation.missingInformation}
              </div>
            </div>

            {/* Medical Follow-up recommendation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 flex items-start gap-3">
              <HeartPulse className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-0.5">Recommended Clinical Follow-Up:</span>
                {explanation.medicalFollowUp}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500">
            Calculating explanatory synthesis...
          </div>
        )}
      </div>

      {/* "Factors Affecting Your Result" Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Factors Affecting Your Result
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect each individual input and see how the prototype scored it.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-medium no-print">
            <button
              onClick={() => setFactorFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                factorFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({result.factors.length})
            </button>
            <button
              onClick={() => setFactorFilter('increased')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                factorFilter === 'increased'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Higher Risk ({result.factors.filter((f) => f.impact === 'increased').length})
            </button>
            <button
              onClick={() => setFactorFilter('protective')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                factorFilter === 'protective'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Protective / Neutral ({result.factors.filter((f) => f.impact !== 'increased').length})
            </button>
          </div>
        </div>

        {/* Factors Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFactors.map((factor) => {
            const isIncreased = factor.impact === 'increased';
            const isProtective = factor.impact === 'protective';

            return (
              <div
                key={factor.id}
                className={`p-4 rounded-xl border transition-all ${
                  isIncreased
                    ? 'bg-rose-50/30 border-rose-200/80 hover:border-rose-300'
                    : isProtective
                    ? 'bg-emerald-50/30 border-emerald-200/80 hover:border-emerald-300'
                    : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isIncreased
                          ? 'bg-rose-500'
                          : isProtective
                          ? 'bg-emerald-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    <h3 className="text-sm font-bold text-slate-900">{factor.name}</h3>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      isIncreased
                        ? 'bg-rose-100 text-rose-800'
                        : isProtective
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isIncreased ? `+${factor.points} pts` : isProtective ? 'Protective' : '0 pts'}
                  </span>
                </div>

                <div className="mb-2 text-xs">
                  <span className="text-slate-400">Your Answer: </span>
                  <span className="font-semibold text-slate-800">{factor.userResponse}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-white/80 p-2.5 rounded-lg border border-slate-100">
                  {factor.rationale}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Laboratory Measurements Card (if provided) */}
      {result.labEvaluation && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Self-Reported Laboratory Measurements
              </h2>
              <p className="text-xs text-slate-500">
                Clinical test benchmarks evaluated separately from lifestyle scores
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {result.labEvaluation.hasHbA1c && (
              <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-200/60 text-xs text-purple-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-sm block">HbA1c: {result.labEvaluation.hba1cValue}%</span>
                  <span className="text-purple-800">{result.labEvaluation.hba1cInterpretation}</span>
                </div>
                <span className="text-[11px] text-purple-700 bg-purple-100 px-2.5 py-1 rounded-md self-start sm:self-auto font-medium">
                  Reference: Normal &lt;5.7%
                </span>
              </div>
            )}

            {result.labEvaluation.hasFastingGlucose && (
              <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-200/60 text-xs text-purple-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-sm block">Fasting Blood Glucose: {result.labEvaluation.glucoseValue} mg/dL</span>
                  <span className="text-purple-800">{result.labEvaluation.glucoseInterpretation}</span>
                </div>
                <span className="text-[11px] text-purple-700 bg-purple-100 px-2.5 py-1 rounded-md self-start sm:self-auto font-medium">
                  Reference: Normal &lt;100 mg/dL
                </span>
              </div>
            )}

            <p className="text-xs text-slate-500 italic pt-1">
              {result.labEvaluation.cautionNotice}
            </p>
          </div>
        </div>
      )}

      {/* "General Next Steps" Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
          General Next Steps & Actionable Habits
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Evidence-based lifestyle practices for metabolic health. Always discuss major changes with your physician.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(explanation?.practicalSuggestions && explanation.practicalSuggestions.length > 0
            ? explanation.practicalSuggestions
            : [
                'Aim for at least 150 minutes of moderate-intensity aerobic physical activity (such as brisk walking) per week.',
                'Prioritize fiber-rich foods, leafy greens, and whole grains while moderating refined carbohydrates and sugary drinks.',
                'Establish a consistent nightly sleep schedule aiming for 7–8 hours of restful sleep.',
                'Consult your primary care physician for routine annual checkups and preventive laboratory blood testing.',
              ]
          ).map((suggestion, index) => (
            <div
              key={index}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {suggestion}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 no-print">
        <button
          onClick={onStartNewAssessment}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start New Assessment</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onReviewAnswers}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>Review Answers</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Save Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
