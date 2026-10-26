/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ClipboardCheck,
  Cpu,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  Activity,
  Scale,
  Stethoscope,
} from 'lucide-react';

interface HomePageProps {
  onStartAssessment: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartAssessment }) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto px-4">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold mb-6 shadow-xs">
          <Activity className="w-3.5 h-3.5 text-teal-600" />
          <span>Educational Health Technology Prototype</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
          Understand Your Diabetes Risk. <br className="hidden sm:inline" />
          <span className="text-teal-700">Know What to Do Next.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          GlucoExplain is an educational risk-assessment application that uses personal health and lifestyle information to generate an easy-to-understand diabetes risk indicator and explain the factors behind it.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onStartAssessment}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Start Risk Assessment</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={scrollToHowItWorks}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-base border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>Learn How It Works</span>
          </button>
        </div>

        {/* Quick Highlights Row */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-xs">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Time</span>
            <span className="text-sm font-semibold text-slate-800">Under 3 minutes</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-xs">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Questions</span>
            <span className="text-sm font-semibold text-slate-800">15 targeted fields</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-xs">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Privacy</span>
            <span className="text-sm font-semibold text-slate-800">No account required</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-xs">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Explainability</span>
            <span className="text-sm font-semibold text-slate-800">Transparent factor scores</span>
          </div>
        </div>
      </section>

      {/* 3 Core Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Key Capabilities</h2>
          <p className="text-sm text-slate-600 mt-1">Built to provide clear insight, not black-box predictions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5 border border-teal-100">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Simple Assessment</h3>
            <p className="text-sm text-slate-600 leading-relaxed grow">
              Answer a short set of questions about your health and lifestyle. Fields are clearly labeled, with automatic age and BMI calculation and optional lab entries.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-teal-700">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Structured into 4 digestible sections</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5 border border-blue-100">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. Explainable Results</h3>
            <p className="text-sm text-slate-600 leading-relaxed grow">
              Understand which reported factors influenced the result. View transparent point weights, clinical rationale, and how lifestyle factors contrast with non-modifiable demographics.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-blue-700">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Full factor-by-factor breakdown</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 border border-emerald-100">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. AI-Powered Explanation</h3>
            <p className="text-sm text-slate-600 leading-relaxed grow">
              Receive a simple explanation and general health information using GlucoExplain AI. The system clarifies results in plain language, highlights missing clinical data, and guides next steps.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Private, server-side processing</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Step-by-Step Flow</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-white">
                How GlucoExplain Works
              </h2>
              <p className="text-sm text-slate-300 mt-2">
                A three-step approach combining deterministic scoring rules with natural language explanations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative">
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                  1
                </div>
                <h3 className="text-base font-bold text-white mb-2">Enter Your Details</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Provide demographic, family history, and everyday lifestyle habits (sleep, exercise, sugary drinks). Optionally include recent lab measurements if available.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative">
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                  2
                </div>
                <h3 className="text-base font-bold text-white mb-2">Calculate the Risk Indicator</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our transparent rule-based module computes an illustrative benchmark score based on established epidemiological risk models, categorizing risk as Low, Moderate, or Higher.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative">
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                  3
                </div>
                <h3 className="text-base font-bold text-white mb-2">Understand Your Results</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Review which factors drove the score, read the GlucoExplain AI plain English summary, review personalized lifestyle suggestions, and print a report for your doctor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Assessment Methodology</h2>
              <p className="text-xs text-slate-500">Transparent, deterministic scoring logic</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              GlucoExplain calculates an <strong>illustrative risk score</strong> based on documented clinical risk factors adapted from recognized guidelines such as the American Diabetes Association (ADA) Risk Tool and the Finnish Diabetes Risk Score (FINDRISC).
            </p>
            <p>
              Established risk drivers—such as age, Body Mass Index (BMI), first-degree family history, prior prediabetes findings, and hypertension—carry greater mathematical weight than lifestyle items. GlucoExplain AI does <em>not</em> calculate or invent numbers; instead, it provides natural language context, explains uncertainty, and highlights what clinical details are missing.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-start gap-2">
              <Scale className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>Deterministic weights:</strong> Calculated openly without hidden model drift.</span>
            </div>
            <div className="flex items-start gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span><strong>Separated clinical labs:</strong> HbA1c and glucose are evaluated distinctly.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
