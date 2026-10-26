/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'assessment';
  setActiveTab: (tab: 'home' | 'assessment') => void;
  hasAssessmentResult?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasAssessmentResult = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left focus:outline-none group transition-opacity"
            aria-label="GlucoExplain Home"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-700/20 group-hover:bg-teal-700 transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  GlucoExplain
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200/60">
                  Prototype
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Explainable Diabetes Risk Assessment
              </p>
            </div>
          </button>

          {/* Navigation Tabs (Exactly Home and Risk Assessment) */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('assessment')}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'assessment'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>Risk Assessment</span>
              {hasAssessmentResult && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
              )}
            </button>
          </nav>

          {/* Privacy badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Private & Ephemeral</span>
          </div>
        </div>
      </div>
    </header>
  );
};
