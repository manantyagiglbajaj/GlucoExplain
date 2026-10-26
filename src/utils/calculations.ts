/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates current age in years given an ISO date string (YYYY-MM-DD).
 * Validates against future dates and implausible dates.
 */
export function calculateAge(dobString: string): {
  age: number | null;
  error?: string;
} {
  if (!dobString) {
    return { age: null };
  }

  const parts = dobString.split('-');
  if (parts.length !== 3) {
    return { age: null, error: 'Please enter a valid date in YYYY-MM-DD format.' };
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);

  const birthDate = new Date(year, month, day);
  const today = new Date();

  // Check valid date instance
  if (isNaN(birthDate.getTime())) {
    return { age: null, error: 'Invalid calendar date.' };
  }

  // Reject future dates
  if (birthDate > today) {
    return { age: null, error: 'Date of birth cannot be in the future.' };
  }

  // Reject implausible past dates (e.g., year before 1900)
  if (year < 1900) {
    return { age: null, error: 'Please enter a plausible year of birth (after 1900).' };
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 1) {
    return { age: 0, error: 'Age must be at least 1 year for this assessment.' };
  }

  if (age > 120) {
    return { age: null, error: 'Please check your date of birth.' };
  }

  return { age };
}

/**
 * Calculates Body Mass Index (BMI = kg / m^2).
 */
export function calculateBMI(
  weightKg: number | '',
  heightCm: number | ''
): {
  bmi: number | null;
  category: string;
} {
  if (
    typeof weightKg !== 'number' ||
    typeof heightCm !== 'number' ||
    weightKg <= 0 ||
    heightCm <= 0
  ) {
    return { bmi: null, category: '' };
  }

  const heightMeters = heightCm / 100;
  const rawBmi = weightKg / (heightMeters * heightMeters);
  const bmi = Math.round(rawBmi * 10) / 10;

  let category = '';
  if (bmi < 18.5) {
    category = 'Underweight (<18.5)';
  } else if (bmi < 25.0) {
    category = 'Normal weight (18.5–24.9)';
  } else if (bmi < 30.0) {
    category = 'Overweight (25.0–29.9)';
  } else {
    category = 'Obesity (≥30.0)';
  }

  return { bmi, category };
}
