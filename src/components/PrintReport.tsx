/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  AssessmentData,
  RiskPredictionResult,
  GeminiExplanationResponse,
} from '../types/assessment';

interface PrintReportProps {
  formData: AssessmentData;
  result: RiskPredictionResult;
  explanation: GeminiExplanationResponse | null;
}

export const PrintReport: React.FC<PrintReportProps> = ({
  formData,
  result,
  explanation,
}) => {
  return (
    <div className="print-only hidden p-8 max-w-4xl mx-auto text-black font-sans leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            GlucoExplain — Diabetes Risk Assessment Summary
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            An Explainable Machine Learning Approach for Educational Risk Screening
          </p>
        </div>
        <div className="text-right text-xs text-slate-600">
          <p><strong>Date:</strong> {result.assessmentDate}</p>
          <p><strong>Report ID:</strong> GE-{Math.abs(result.score * 31 + result.age * 7).toString(16).toUpperCase()}</p>
        </div>
      </div>

      {/* Prominent Educational Notice */}
      <div className="p-3 bg-slate-100 border border-slate-300 rounded mb-6 text-xs text-slate-800">
        <strong>EDUCATIONAL PROTOTYPE NOTICE:</strong> This document is generated for educational and informational purposes only. It is not a clinical diagnostic test and cannot diagnose or rule out type 2 diabetes. Please review this report with a licensed physician for clinical interpretation and venous lab testing.
      </div>

      {/* Individual Information */}
      <div className="grid grid-cols-4 gap-4 mb-6 border border-slate-200 p-4 rounded text-xs">
        <div>
          <span className="text-slate-500 block">Assessed Name:</span>
          <span className="font-bold text-slate-900">{formData.fullName.trim() || 'Anonymous Participant'}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Calculated Age:</span>
          <span className="font-bold text-slate-900">{result.age} years</span>
        </div>
        <div>
          <span className="text-slate-500 block">Calculated BMI:</span>
          <span className="font-bold text-slate-900">{result.bmi} kg/m² ({result.bmiCategory})</span>
        </div>
        <div>
          <span className="text-slate-500 block">Reported Symptoms:</span>
          <span className="font-bold text-slate-900">{result.hasSymptoms ? 'Present' : 'None Reported'}</span>
        </div>
      </div>

      {/* Primary Result */}
      <div className="border-2 border-slate-800 p-4 rounded mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Screening Risk Indicator
          </span>
          <span className="text-xs font-mono">
            Score: {result.score} of {result.maxScore} points
          </span>
        </div>
        <div className="text-xl font-extrabold text-slate-900 mb-2">
          {result.category} Risk Category
        </div>
        <p className="text-xs text-slate-700">
          {explanation?.summary ||
            `The assessment calculated an illustrative score of ${result.score} points, placing the profile into the ${result.category} Risk category based on established population risk factors.`}
        </p>
      </div>

      {/* Laboratory Measurements (if reported) */}
      {result.labEvaluation && (
        <div className="mb-6 border border-slate-200 p-4 rounded text-xs print-break-inside-avoid">
          <h2 className="font-bold text-slate-900 mb-2">Self-Reported Laboratory Testing</h2>
          <div className="grid grid-cols-2 gap-4">
            {result.labEvaluation.hasHbA1c && (
              <div>
                <span className="font-semibold">Reported HbA1c: </span>
                <span>{result.labEvaluation.hba1cValue}% ({result.labEvaluation.hba1cInterpretation})</span>
              </div>
            )}
            {result.labEvaluation.hasFastingGlucose && (
              <div>
                <span className="font-semibold">Reported Fasting Glucose: </span>
                <span>{result.labEvaluation.glucoseValue} mg/dL ({result.labEvaluation.glucoseInterpretation})</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Factors Table */}
      <div className="mb-6 print-break-inside-avoid">
        <h2 className="text-sm font-bold text-slate-900 mb-2">
          Assessment Factors & Deterministic Score Impact
        </h2>
        <table className="w-full text-xs text-left border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th className="border border-slate-300 p-2 font-bold">Factor</th>
              <th className="border border-slate-300 p-2 font-bold">Reported Response</th>
              <th className="border border-slate-300 p-2 font-bold">Points Impact</th>
              <th className="border border-slate-300 p-2 font-bold">Rationale / Note</th>
            </tr>
          </thead>
          <tbody>
            {result.factors.map((f) => (
              <tr key={f.id} className="border-b border-slate-200">
                <td className="border border-slate-300 p-2 font-medium">{f.name}</td>
                <td className="border border-slate-300 p-2">{f.userResponse}</td>
                <td className="border border-slate-300 p-2 font-mono">
                  {f.points > 0 ? `+${f.points}` : f.impact === 'protective' ? 'Protective' : '0'}
                </td>
                <td className="border border-slate-300 p-2 text-slate-600">{f.rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calculation Method and Limitations */}
      <div className="border-t border-slate-300 pt-4 text-xs text-slate-600 space-y-2 print-break-inside-avoid">
        <h3 className="font-bold text-slate-900 text-xs">Calculation Method & Technical Limitations</h3>
        <p>
          <strong>Method:</strong> Deterministic rule-based scoring module calibrated against population health screening parameters (ADA Risk Test and FINDRISC guidelines). Natural language contextual explanation generated via GlucoExplain AI without overriding calculated point values.
        </p>
        <p>
          <strong>Limitations:</strong> This prototype evaluates self-reported questionnaire inputs and does not account for comprehensive medical history, clinical lipid panels, kidney function, or ongoing prescription therapies.
        </p>
      </div>

      {/* Signature / Doctor notes section */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
        <div>
          <p>Generated by GlucoExplain Educational Web Platform</p>
          <p>https://glucoexplain.internal</p>
        </div>
        <div className="text-right">
          <div className="w-48 border-b border-slate-400 mb-1" />
          <p>Reviewing Physician Signature / Date</p>
        </div>
      </div>
    </div>
  );
};
