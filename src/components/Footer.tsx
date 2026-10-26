/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-500 text-xs py-10 mt-16 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-base">GlucoExplain</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs max-w-sm">
              An explainable machine learning approach for early diabetes risk education. Built to provide transparent, interpretable health factor scoring without black-box opacity.
            </p>
            <div className="flex items-center gap-1.5 text-slate-600 pt-1">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Zero-storage architecture: assessments remain local to your current session.</span>
            </div>
          </div>

          {/* Educational Resources */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Educational References
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://diabetes.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-700 transition-colors flex items-center gap-1"
                >
                  <span>American Diabetes Association</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.who.int/news-room/fact-sheets/detail/diabetes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-700 transition-colors flex items-center gap-1"
                >
                  <span>WHO Diabetes Guidelines</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.cdc.gov/diabetes/risk-test/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-700 transition-colors flex items-center gap-1"
                >
                  <span>CDC Pre-Diabetes Screener</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Technology & Transparency */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              System Transparency
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>&bull; Model: Gemini 3.8 Flash</li>
              <li>&bull; Deterministic Factor Scoring</li>
              <li>&bull; Ephemeral Client-Side State</li>
              <li>&bull; Vercel & Node Full-Stack Ready</li>
            </ul>
          </div>
        </div>

        {/* Mandatory Medical Disclaimer Notice */}
        <div className="pt-6 border-t border-slate-200/70 text-center space-y-2">
          <p className="text-[11px] text-slate-500 max-w-3xl mx-auto leading-relaxed">
            <strong>Medical Disclaimer:</strong> GlucoExplain is an educational research and demonstration software application. It does not provide medical diagnosis, clinical advice, treatment, or patient triage. The calculated score is an illustrative benchmark based on population health questionnaires and cannot replace clinical venous blood tests (such as lab-certified HbA1c or oral glucose tolerance tests) or the personalized advice of a healthcare provider.
          </p>
          <p className="text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} GlucoExplain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
