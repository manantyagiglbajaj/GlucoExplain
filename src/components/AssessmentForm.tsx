/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AssessmentData,
  AssessmentFormErrors,
} from '../types/assessment';
import { calculateAge, calculateBMI } from '../utils/calculations';
import {
  User,
  HeartPulse,
  Activity,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Scale,
  Calendar,
} from 'lucide-react';

interface AssessmentFormProps {
  formData: AssessmentData;
  setFormData: React.Dispatch<React.SetStateAction<AssessmentData>>;
  onSubmit: (data: AssessmentData) => void;
  isSubmitting: boolean;
}

const SECTIONS = [
  { id: 1, title: 'Personal Details', icon: User },
  { id: 2, title: 'Health Background', icon: HeartPulse },
  { id: 3, title: 'Lifestyle & Habits', icon: Activity },
  { id: 4, title: 'Lab Measurements & Review', icon: FileText },
];

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
}) => {
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [errors, setErrors] = useState<AssessmentFormErrors>({});

  // Computed live metrics
  const { age, error: ageError } = calculateAge(formData.dateOfBirth);
  const { bmi, category: bmiCategory } = calculateBMI(formData.weightKg, formData.heightCm);

  const updateField = <K extends keyof AssessmentData>(
    field: K,
    value: AssessmentData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for that field if present
    if (errors[field as keyof AssessmentFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateSection = (sectionId: number): boolean => {
    const newErrors: AssessmentFormErrors = {};

    if (sectionId === 1) {
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required.';
      } else if (ageError) {
        newErrors.dateOfBirth = ageError;
      }
    } else if (sectionId === 2) {
      if (!formData.familyHistory) {
        newErrors.familyHistory = 'Please indicate family history of diabetes.';
      }
      if (!formData.previousHighBloodSugar) {
        newErrors.previousHighBloodSugar = 'Please indicate if a doctor has noted high blood sugar.';
      }
      if (!formData.highBloodPressure) {
        newErrors.highBloodPressure = 'Please indicate blood pressure diagnosis status.';
      }
    } else if (sectionId === 3) {
      if (typeof formData.weightKg !== 'number' || formData.weightKg <= 20 || formData.weightKg > 350) {
        newErrors.weightKg = 'Please enter a valid weight in kg (20–350 kg).';
      }
      if (typeof formData.heightCm !== 'number' || formData.heightCm <= 60 || formData.heightCm > 250) {
        newErrors.heightCm = 'Please enter a valid height in cm (60–250 cm).';
      }
      if (typeof formData.dailyActivityMinutes !== 'number' || formData.dailyActivityMinutes < 0 || formData.dailyActivityMinutes > 720) {
        newErrors.dailyActivityMinutes = 'Please enter approximate minutes of daily physical activity (0–720).';
      }
      if (typeof formData.averageSleepHours !== 'number' || formData.averageSleepHours < 2 || formData.averageSleepHours > 20) {
        newErrors.averageSleepHours = 'Please enter your typical nightly sleep in hours (2–20).';
      }
      if (!formData.smokingHistory) {
        newErrors.smokingHistory = 'Please select your smoking history.';
      }
      if (!formData.sugaryDrinks) {
        newErrors.sugaryDrinks = 'Please select how often you drink sugary beverages.';
      }
      if (!formData.possibleSymptoms) {
        newErrors.possibleSymptoms = 'Please select whether you experience frequent urination or excessive thirst.';
      }
    } else if (sectionId === 4) {
      // Optional lab validation if filled
      if (typeof formData.latestHbA1c === 'number' && (formData.latestHbA1c < 3.0 || formData.latestHbA1c > 20.0)) {
        newErrors.latestHbA1c = 'HbA1c is typically between 3.0% and 20.0%. Leave blank if unsure.';
      }
      if (typeof formData.latestFastingGlucose === 'number' && (formData.latestFastingGlucose < 40 || formData.latestFastingGlucose > 600)) {
        newErrors.latestFastingGlucose = 'Fasting glucose is typically between 40 and 600 mg/dL. Leave blank if unsure.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all sections
    let isValid = true;
    for (let i = 1; i <= 4; i++) {
      if (!validateSection(i)) {
        isValid = false;
        setCurrentSection(i);
        break;
      }
    }

    if (isValid) {
      onSubmit(formData);
    }
  };

  const progressPercentage = Math.round((currentSection / 4) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      {/* Header and Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          <span>Section {currentSection} of 4: {SECTIONS[currentSection - 1].title}</span>
          <span className="text-teal-700">{progressPercentage}% Completed</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-teal-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isDone = currentSection > section.id;
            const isCurrent = currentSection === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => {
                  // Only allow jumping back, or jumping forward if validated
                  if (section.id < currentSection || validateSection(currentSection)) {
                    setCurrentSection(section.id);
                  }
                }}
                className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-teal-50/80 border-teal-300 text-teal-900 shadow-xs'
                    : isDone
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'bg-white/50 border-slate-100 text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : section.id}
                </div>
                <span className="text-xs font-medium truncate hidden sm:inline">
                  {section.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        {/* SECTION 1: Personal Details */}
        {currentSection === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Personal Details</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                This information helps calibrate age and provides personalization for your final summary report.
              </p>
            </div>

            {/* 1. Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-800 mb-1">
                1. Full Name <span className="text-xs font-normal text-slate-400">(Optional — used only for report header)</span>
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="e.g. Alex Morgan"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                maxLength={60}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-sm placeholder:text-slate-400 transition-colors"
              />
              <p className="text-xs text-slate-500 mt-1">
                Your name is never sent to Gemini or stored in any database; it only appears on your printable summary.
              </p>
            </div>

            {/* 2. Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-slate-800 mb-1">
                2. Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="dateOfBirth"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  min="1900-01-01"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.dateOfBirth
                      ? 'border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50/20'
                      : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-600'
                  }`}
                />
              </div>

              {errors.dateOfBirth && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.dateOfBirth}</span>
                </p>
              )}

              {age !== null && !errors.dateOfBirth && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200/80 rounded-lg text-xs font-medium text-teal-800">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>Calculated Current Age: <strong>{age} years old</strong></span>
                </div>
              )}
            </div>

            {/* 3. Sex */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                3. Sex <span className="text-xs font-normal text-slate-400">(Optional)</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { value: 'female', label: 'Female' },
                  { value: 'male', label: 'Male' },
                  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField('sex', option.value as any)}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-center cursor-pointer ${
                      formData.sex === option.value
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Health Background */}
        {currentSection === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Health Background</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Family history and prior medical observations are among the most significant indicators for metabolic risk.
              </p>
            </div>

            {/* 4. Family History */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                4. Family History of Diabetes <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Has a parent, brother, or sister been diagnosed with type 1 or type 2 diabetes?
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'not_sure', label: 'Not Sure' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('familyHistory', opt.value as any)}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-center cursor-pointer ${
                      formData.familyHistory === opt.value
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.familyHistory && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.familyHistory}</span>
                </p>
              )}
            </div>

            {/* 5. Previous High Blood Sugar */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                5. Previous High Blood Sugar / Prediabetes <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Has a doctor, nurse, or healthcare provider ever told you that you have prediabetes, impaired fasting glucose, or high blood sugar?
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'not_sure', label: 'Never Tested / Not Sure' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('previousHighBloodSugar', opt.value as any)}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-center cursor-pointer ${
                      formData.previousHighBloodSugar === opt.value
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.previousHighBloodSugar && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.previousHighBloodSugar}</span>
                </p>
              )}
            </div>

            {/* 6. High Blood Pressure */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                6. High Blood Pressure (Hypertension) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Have you been diagnosed with high blood pressure, or are you taking medicine for hypertension?
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'not_sure', label: 'Not Sure' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('highBloodPressure', opt.value as any)}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-center cursor-pointer ${
                      formData.highBloodPressure === opt.value
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.highBloodPressure && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.highBloodPressure}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* SECTION 3: Lifestyle & Habits */}
        {currentSection === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Lifestyle & Health Habits</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Body measurements and routine daily activities influence metabolic demand and cellular insulin sensitivity.
              </p>
            </div>

            {/* 7 & 8. Weight & Height Grid (Auto BMI) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 7. Weight */}
              <div>
                <label htmlFor="weightKg" className="block text-sm font-semibold text-slate-800 mb-1">
                  7. Weight (kg) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="weightKg"
                    type="number"
                    step="0.5"
                    min="20"
                    max="350"
                    placeholder="e.g. 74"
                    value={formData.weightKg}
                    onChange={(e) => updateField('weightKg', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
                      errors.weightKg
                        ? 'border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50/20'
                        : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-600'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">kg</span>
                </div>
                {errors.weightKg && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.weightKg}</span>
                  </p>
                )}
              </div>

              {/* 8. Height */}
              <div>
                <label htmlFor="heightCm" className="block text-sm font-semibold text-slate-800 mb-1">
                  8. Height (cm) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="heightCm"
                    type="number"
                    step="1"
                    min="60"
                    max="250"
                    placeholder="e.g. 172"
                    value={formData.heightCm}
                    onChange={(e) => updateField('heightCm', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
                      errors.heightCm
                        ? 'border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50/20'
                        : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-600'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">cm</span>
                </div>
                {errors.heightCm && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.heightCm}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Live BMI Card */}
            {bmi !== null && !errors.weightKg && !errors.heightCm && (
              <div className="p-3.5 bg-teal-50/80 border border-teal-200/80 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-teal-700" />
                  <span className="text-xs sm:text-sm font-medium text-teal-900">
                    Calculated BMI: <strong>{bmi} kg/m²</strong> ({bmiCategory})
                  </span>
                </div>
                <span className="text-[11px] text-teal-700 font-mono hidden sm:inline">BMI = kg/m²</span>
              </div>
            )}

            {/* 9. Daily Physical Activity */}
            <div>
              <label htmlFor="dailyActivityMinutes" className="block text-sm font-semibold text-slate-800 mb-1">
                9. Daily Physical Activity (minutes per day) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Approximately how many minutes do you walk, exercise, or perform moderate physical activity each day?
              </p>
              <div className="relative">
                <input
                  id="dailyActivityMinutes"
                  type="number"
                  min="0"
                  max="720"
                  placeholder="e.g. 35"
                  value={formData.dailyActivityMinutes}
                  onChange={(e) => updateField('dailyActivityMinutes', e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.dailyActivityMinutes
                      ? 'border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50/20'
                      : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-600'
                  }`}
                />
                <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">mins/day</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                <span>Recommended: at least 30 minutes daily</span>
                <span className="text-teal-700 font-medium">Brisk walking counts!</span>
              </div>
              {errors.dailyActivityMinutes && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.dailyActivityMinutes}</span>
                </p>
              )}
            </div>

            {/* 10. Average Sleep */}
            <div>
              <label htmlFor="averageSleepHours" className="block text-sm font-semibold text-slate-800 mb-1">
                10. Average Nightly Sleep (hours) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="averageSleepHours"
                  type="number"
                  step="0.5"
                  min="2"
                  max="20"
                  placeholder="e.g. 7.5"
                  value={formData.averageSleepHours}
                  onChange={(e) => updateField('averageSleepHours', e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.averageSleepHours
                      ? 'border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50/20'
                      : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-600'
                  }`}
                />
                <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">hours/night</span>
              </div>
              {errors.averageSleepHours && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.averageSleepHours}</span>
                </p>
              )}
            </div>

            {/* 11. Smoking History */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                11. Smoking History <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'never', label: 'Never' },
                  { value: 'former', label: 'Former' },
                  { value: 'current', label: 'Current' },
                  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('smokingHistory', opt.value as any)}
                    className={`py-2 px-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all text-center cursor-pointer ${
                      formData.smokingHistory === opt.value
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.smokingHistory && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.smokingHistory}</span>
                </p>
              )}
            </div>

            {/* 12. Sugary Drinks */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                12. Sugary Beverages Intake <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">
                How often do you consume soda, sweetened teas, sweetened coffees, energy drinks, or fruit juices with added sugar?
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { value: 'rarely', label: 'Never or Rarely' },
                  { value: 'sometimes', label: 'Sometimes' },
                  { value: 'daily', label: 'Daily / Almost Daily' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('sugaryDrinks', opt.value as any)}
                    className={`py-2.5 px-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all text-center cursor-pointer ${
                      formData.sugaryDrinks === opt.value
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.sugaryDrinks && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.sugaryDrinks}</span>
                </p>
              )}
            </div>

            {/* 13. Possible Symptoms */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                13. Possible Symptoms (Frequent Urination or Excessive Thirst) <span className="text-red-500">*</span>
              </label>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 mb-2.5">
                <span className="font-semibold text-slate-800">Contextual Note:</span> Frequent urination (polyuria) and unusual persistent thirst (polydipsia) can stem from elevated blood sugar, but also from weather, medication, caffeine, or urinary issues.
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { value: 'no', label: 'No, not experiencing these' },
                  { value: 'yes', label: 'Yes, experiencing these' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('possibleSymptoms', opt.value as any)}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-center cursor-pointer ${
                      formData.possibleSymptoms === opt.value
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.possibleSymptoms && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.possibleSymptoms}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* SECTION 4: Optional Health Measurements & Final Review */}
        {currentSection === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Optional Health Measurements & Review</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                If you have had recent laboratory tests, you may enter them below. <strong>Leave these blank if you have not been tested</strong>; do not guess.
              </p>
            </div>

            {/* 14. Latest HbA1c */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="latestHbA1c" className="block text-sm font-semibold text-slate-800">
                  14. Latest HbA1c (Hemoglobin A1c)
                </label>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Optional</span>
              </div>
              <p className="text-xs text-slate-500 mb-1.5">
                Reflects average blood sugar over the past 2–3 months in percent units (e.g., 5.4%).
              </p>
              <div className="relative">
                <input
                  id="latestHbA1c"
                  type="number"
                  step="0.1"
                  min="3.0"
                  max="20.0"
                  placeholder="e.g. 5.6 (leave blank if untested)"
                  value={formData.latestHbA1c}
                  onChange={(e) => updateField('latestHbA1c', e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.latestHbA1c
                      ? 'border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50/20'
                      : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-600'
                  }`}
                />
                <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">%</span>
              </div>
              {errors.latestHbA1c && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.latestHbA1c}</span>
                </p>
              )}
            </div>

            {/* 15. Latest Fasting Blood Glucose */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="latestFastingGlucose" className="block text-sm font-semibold text-slate-800">
                  15. Latest Fasting Blood Glucose
                </label>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Optional</span>
              </div>
              <p className="text-xs text-slate-500 mb-1.5">
                Blood glucose measured after an overnight fast in mg/dL (e.g., 95 mg/dL).
              </p>
              <div className="relative">
                <input
                  id="latestFastingGlucose"
                  type="number"
                  step="1"
                  min="40"
                  max="600"
                  placeholder="e.g. 98 (leave blank if untested)"
                  value={formData.latestFastingGlucose}
                  onChange={(e) => updateField('latestFastingGlucose', e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.latestFastingGlucose
                      ? 'border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50/20'
                      : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-600'
                  }`}
                />
                <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">mg/dL</span>
              </div>
              {errors.latestFastingGlucose && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.latestFastingGlucose}</span>
                </p>
              )}
            </div>

            {/* Assessment Pre-Submission Summary Card */}
            <div className="mt-6 bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Pre-Submission Assessment Summary</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-slate-400 block mb-0.5">Calculated Age</span>
                  <span className="font-bold text-slate-800 text-sm">{age !== null ? `${age} yrs` : '—'}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-slate-400 block mb-0.5">Calculated BMI</span>
                  <span className="font-bold text-slate-800 text-sm">{bmi !== null ? `${bmi}` : '—'}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-slate-400 block mb-0.5">Weight Category</span>
                  <span className="font-semibold text-slate-700">{bmiCategory || '—'}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-slate-400 block mb-0.5">Symptoms</span>
                  <span className="font-semibold text-slate-700">
                    {formData.possibleSymptoms === 'yes' ? 'Reported' : 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy & AI Consent Section */}
            <div className="bg-teal-50/60 border border-teal-200/80 rounded-xl p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-teal-950">
                    Privacy Protection & AI Explanation Consent
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    GlucoExplain processes your calculation locally using deterministic rules. If consented, an anonymous summary (calculated age, BMI, and factor answers) is sent to Google Gemini via our secure server to generate plain-language explanations and practical suggestions.
                  </p>
                  <p className="text-xs font-semibold text-teal-900">
                    Your name and date of birth are NEVER sent to the AI model or saved in any database.
                  </p>

                  <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.aiConsent}
                      onChange={(e) => updateField('aiConsent', e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <span className="text-xs font-medium text-slate-800">
                      Enable Gemini AI-powered plain English explanation (uncheck for local offline explanation only)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Action Buttons (Previous, Next, Submit) */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          {currentSection > 1 ? (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {currentSection < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next Section</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Assessment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Assessment</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
