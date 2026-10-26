/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AssessmentData,
  ContributingFactor,
  LabEvaluation,
  RiskPredictionResult,
  RiskCategory,
} from '../types/assessment';
import { calculateAge, calculateBMI } from './calculations';

/**
 * Illustrative Rule-Based Prototype Scoring Rules:
 *
 * This function calculates an educational risk indicator based on established
 * population-level epidemiological risk factors (e.g., ADA Diabetes Risk Test
 * and Finnish Diabetes Risk Score - FINDRISC concepts).
 *
 * Scoring breakdown (Max points = 26):
 * 1. Age:
 *    - < 45 years: 0 points (Lower baseline age risk)
 *    - 45–54 years: 2 points (Increased physiological risk threshold)
 *    - 55–64 years: 3 points (Significant risk increase)
 *    - ≥ 65 years: 4 points (Highest age category weight)
 * 2. BMI:
 *    - < 25.0: 0 points (Normal or underweight range)
 *    - 25.0–29.9: 2 points (Overweight: elevated visceral adipose tissue)
 *    - ≥ 30.0: 4 points (Obesity: strong clinical association with insulin resistance)
 * 3. Physical Activity:
 *    - ≥ 30 mins/day: 0 points (Protective habit aiding muscle glucose uptake)
 *    - < 30 mins/day: 2 points (Insufficient physical activity)
 * 4. Family History (Parent/Sibling):
 *    - Yes: 3 points (First-degree relative strongly correlates with genetic susceptibility)
 *    - Not Sure: 1 point (Unconfirmed family history)
 *    - No: 0 points (No reported first-degree family history)
 * 5. Previous High Blood Sugar / Prediabetes:
 *    - Yes: 5 points (Strongest clinical precursor: documented impaired fasting glucose or glucose tolerance)
 *    - Not Sure: 1 point (Unknown testing status)
 *    - No: 0 points (Never identified with elevated glucose)
 * 6. High Blood Pressure:
 *    - Yes: 2 points (Hypertension is a core component of metabolic syndrome)
 *    - Not Sure: 1 point
 *    - No: 0 points
 * 7. Sugary Drinks:
 *    - Daily: 2 points (Frequent liquid sugar intake induces rapid glycemic spikes)
 *    - Sometimes: 1 point (Moderate consumption)
 *    - Rarely: 0 points (Minimal consumption)
 * 8. Smoking History:
 *    - Current: 2 points (Active nicotine exposure elevates cortisol and systemic inflammation)
 *    - Former: 1 point (Previous exposure)
 *    - Never / Prefer not to say: 0 points
 * 9. Sleep Duration:
 *    - < 6 hours or > 9 hours: 1 point (Irregular/deprived sleep disrupts metabolic hormones like leptin/ghrelin)
 *    - 6–9 hours: 0 points (Optimal restorative range)
 * 10. Possible Symptoms (frequent urination / excessive thirst):
 *    - Yes: 3 points (Osmotic symptoms warranting clinical attention, though non-specific)
 *    - No: 0 points
 *
 * Category Thresholds:
 * - Low Risk: 0–6 points
 * - Moderate Risk: 7–12 points
 * - Higher Risk: 13+ points
 *
 * Note: Personal name and sex are NOT used to calculate score.
 * Laboratory measurements (HbA1c & Fasting Blood Glucose) are handled separately
 * in an explicit clinical evaluation module so as not to conflate educational scores
 * with diagnostic laboratory thresholds.
 */

export function predictRisk(data: AssessmentData): RiskPredictionResult {
  const factors: ContributingFactor[] = [];
  let score = 0;
  const maxScore = 26;

  // 1. Calculate Age
  const { age } = calculateAge(data.dateOfBirth);
  const validatedAge = age ?? 30; // fallback safe value if unparsed

  let agePoints = 0;
  let ageRationale = '';
  if (validatedAge < 45) {
    agePoints = 0;
    ageRationale = 'Individuals under 45 generally have a lower baseline statistical risk of type 2 diabetes.';
  } else if (validatedAge <= 54) {
    agePoints = 2;
    ageRationale = 'Risk progressively increases between ages 45 and 54 due to gradual metabolic changes.';
  } else if (validatedAge <= 64) {
    agePoints = 3;
    ageRationale = 'Ages 55 to 64 have higher statistical prevalence of impaired glucose tolerance.';
  } else {
    agePoints = 4;
    ageRationale = 'Individuals aged 65 and older have the highest age-associated risk for metabolic shifts.';
  }
  score += agePoints;
  factors.push({
    id: 'age',
    name: 'Age',
    category: 'Demographic',
    userResponse: `${validatedAge} years old`,
    impact: agePoints > 0 ? 'increased' : 'neutral',
    points: agePoints,
    rationale: ageRationale,
  });

  // 2. Calculate BMI
  const { bmi, category: bmiCategory } = calculateBMI(data.weightKg, data.heightCm);
  const validatedBmi = bmi ?? 22.0;

  let bmiPoints = 0;
  let bmiRationale = '';
  if (validatedBmi < 25.0) {
    bmiPoints = 0;
    bmiRationale =
      validatedBmi < 18.5
        ? 'Underweight range: while not directly tied to diabetes risk, balanced nutrition remains important.'
        : 'Healthy weight range (BMI 18.5–24.9): associated with healthy insulin sensitivity.';
  } else if (validatedBmi < 30.0) {
    bmiPoints = 2;
    bmiRationale =
      'Overweight range (BMI 25.0–29.9): excess body weight, especially visceral fat, can promote cellular insulin resistance.';
  } else {
    bmiPoints = 4;
    bmiRationale =
      'Obesity range (BMI ≥ 30.0): strong clinical link with metabolic strain and reduced insulin sensitivity.';
  }
  score += bmiPoints;
  factors.push({
    id: 'bmi',
    name: 'Body Mass Index (BMI)',
    category: 'Demographic',
    userResponse: `${validatedBmi} kg/m² (${bmiCategory})`,
    impact: bmiPoints > 0 ? 'increased' : 'neutral',
    points: bmiPoints,
    rationale: bmiRationale,
  });

  // 3. Family History
  let familyPoints = 0;
  let familyRationale = '';
  if (data.familyHistory === 'yes') {
    familyPoints = 3;
    familyRationale =
      'Having a parent or sibling with diabetes confers a notable genetic predisposition and shared environmental habits.';
  } else if (data.familyHistory === 'not_sure') {
    familyPoints = 1;
    familyRationale =
      'Family history is unknown or unconfirmed, so slight statistical uncertainty is recorded.';
  } else {
    familyPoints = 0;
    familyRationale = 'No first-degree family history of diabetes reported.';
  }
  score += familyPoints;
  factors.push({
    id: 'family_history',
    name: 'Family History',
    category: 'Metabolic',
    userResponse:
      data.familyHistory === 'yes'
        ? 'Yes (Parent or sibling has diabetes)'
        : data.familyHistory === 'not_sure'
        ? 'Not sure'
        : 'No family history',
    impact: familyPoints > 0 ? 'increased' : 'neutral',
    points: familyPoints,
    rationale: familyRationale,
  });

  // 4. Previous High Blood Sugar / Prediabetes
  let sugarHistoryPoints = 0;
  let sugarHistoryRationale = '';
  if (data.previousHighBloodSugar === 'yes') {
    sugarHistoryPoints = 5;
    sugarHistoryRationale =
      'Prior medical findings of elevated glucose or prediabetes represent the single highest clinical risk factor for progression to type 2 diabetes.';
  } else if (data.previousHighBloodSugar === 'not_sure') {
    sugarHistoryPoints = 1;
    sugarHistoryRationale = 'Blood sugar testing status has not been recently confirmed.';
  } else {
    sugarHistoryPoints = 0;
    sugarHistoryRationale = 'No prior diagnosis of prediabetes or elevated blood sugar.';
  }
  score += sugarHistoryPoints;
  factors.push({
    id: 'previous_sugar',
    name: 'Previous High Blood Sugar',
    category: 'Metabolic',
    userResponse:
      data.previousHighBloodSugar === 'yes'
        ? 'Yes, previously told by healthcare provider'
        : data.previousHighBloodSugar === 'not_sure'
        ? 'Never tested / Not sure'
        : 'No history of high blood sugar',
    impact: sugarHistoryPoints > 0 ? 'increased' : 'neutral',
    points: sugarHistoryPoints,
    rationale: sugarHistoryRationale,
  });

  // 5. High Blood Pressure
  let bpPoints = 0;
  let bpRationale = '';
  if (data.highBloodPressure === 'yes') {
    bpPoints = 2;
    bpRationale =
      'High blood pressure frequently coexists with insulin resistance and vascular strain as part of metabolic syndrome.';
  } else if (data.highBloodPressure === 'not_sure') {
    bpPoints = 1;
    bpRationale = 'Blood pressure status is unconfirmed.';
  } else {
    bpPoints = 0;
    bpRationale = 'No diagnosis of high blood pressure.';
  }
  score += bpPoints;
  factors.push({
    id: 'blood_pressure',
    name: 'High Blood Pressure',
    category: 'Metabolic',
    userResponse:
      data.highBloodPressure === 'yes'
        ? 'Yes, diagnosed'
        : data.highBloodPressure === 'not_sure'
        ? 'Not sure'
        : 'No',
    impact: bpPoints > 0 ? 'increased' : 'neutral',
    points: bpPoints,
    rationale: bpRationale,
  });

  // 6. Daily Physical Activity
  const activityMins = typeof data.dailyActivityMinutes === 'number' ? data.dailyActivityMinutes : 0;
  let activityPoints = 0;
  let activityRationale = '';
  if (activityMins >= 30) {
    activityPoints = 0;
    activityRationale =
      'Meeting or exceeding 30 minutes of daily moderate activity significantly enhances muscle glucose uptake and insulin action.';
  } else {
    activityPoints = 2;
    activityRationale =
      'Under 30 minutes of daily activity indicates a sedentary pattern, reducing cellular glucose clearance.';
  }
  score += activityPoints;
  factors.push({
    id: 'activity',
    name: 'Daily Physical Activity',
    category: 'Lifestyle',
    userResponse: `${activityMins} minutes/day`,
    impact: activityMins >= 30 ? 'protective' : 'increased',
    points: activityPoints,
    rationale: activityRationale,
  });

  // 7. Average Sleep
  const sleepHrs = typeof data.averageSleepHours === 'number' ? data.averageSleepHours : 7;
  let sleepPoints = 0;
  let sleepRationale = '';
  if (sleepHrs >= 6 && sleepHrs <= 9) {
    sleepPoints = 0;
    sleepRationale =
      '6 to 9 hours of nightly sleep supports healthy cortisol rhythm and normal glucose metabolism.';
  } else {
    sleepPoints = 1;
    sleepRationale =
      sleepHrs < 6
        ? 'Short sleep duration (<6 hours) elevates sympathetic nervous activity and nighttime cortisol levels.'
        : 'Prolonged sleep (>9 hours) is frequently associated with disrupted metabolic homeostasis.';
  }
  score += sleepPoints;
  factors.push({
    id: 'sleep',
    name: 'Sleep Duration',
    category: 'Lifestyle',
    userResponse: `${sleepHrs} hours/night`,
    impact: sleepPoints > 0 ? 'increased' : 'protective',
    points: sleepPoints,
    rationale: sleepRationale,
  });

  // 8. Sugary Drinks
  let drinkPoints = 0;
  let drinkRationale = '';
  if (data.sugaryDrinks === 'daily') {
    drinkPoints = 2;
    drinkRationale =
      'Daily consumption of sugar-sweetened beverages causes rapid spikes in blood glucose and promotes hepatic fat buildup.';
  } else if (data.sugaryDrinks === 'sometimes') {
    drinkPoints = 1;
    drinkRationale = 'Occasional intake contributes modest refined sugar load.';
  } else {
    drinkPoints = 0;
    drinkRationale = 'Rare or no sugary beverage consumption supports stable glycemic regulation.';
  }
  score += drinkPoints;
  factors.push({
    id: 'sugary_drinks',
    name: 'Sugary Beverages',
    category: 'Lifestyle',
    userResponse:
      data.sugaryDrinks === 'daily'
        ? 'Daily or almost daily'
        : data.sugaryDrinks === 'sometimes'
        ? 'Sometimes'
        : 'Never or rarely',
    impact: drinkPoints > 0 ? 'increased' : 'protective',
    points: drinkPoints,
    rationale: drinkRationale,
  });

  // 9. Smoking History
  let smokingPoints = 0;
  let smokingRationale = '';
  if (data.smokingHistory === 'current') {
    smokingPoints = 2;
    smokingRationale =
      'Current smoking significantly increases systemic inflammation, oxidative stress, and impairs insulin sensitivity.';
  } else if (data.smokingHistory === 'former') {
    smokingPoints = 1;
    smokingRationale =
      'Past smoking exposure confers residual cardiovascular risk, though stopping greatly benefits overall health.';
  } else {
    smokingPoints = 0;
    smokingRationale = 'Non-smoking status protects vascular endothelial function.';
  }
  score += smokingPoints;
  factors.push({
    id: 'smoking',
    name: 'Smoking History',
    category: 'Lifestyle',
    userResponse:
      data.smokingHistory === 'current'
        ? 'Current smoker'
        : data.smokingHistory === 'former'
        ? 'Former smoker'
        : data.smokingHistory === 'never'
        ? 'Never smoked'
        : 'Prefer not to say',
    impact: smokingPoints > 0 ? 'increased' : 'neutral',
    points: smokingPoints,
    rationale: smokingRationale,
  });

  // 10. Possible Symptoms (frequent urination / excessive thirst)
  let symptomPoints = 0;
  let symptomRationale = '';
  const hasSymptoms = data.possibleSymptoms === 'yes';
  if (hasSymptoms) {
    symptomPoints = 3;
    symptomRationale =
      'Frequent urination and excessive thirst are classic physiological symptoms of osmotic diuresis from elevated glucose. While other causes exist, they merit timely clinical review.';
  } else {
    symptomPoints = 0;
    symptomRationale = 'No classic symptoms of frequent urination or unquenchable thirst reported.';
  }
  score += symptomPoints;
  factors.push({
    id: 'symptoms',
    name: 'Possible Symptoms',
    category: 'Symptoms',
    userResponse: hasSymptoms ? 'Yes (Frequent urination or thirst)' : 'No symptoms reported',
    impact: symptomPoints > 0 ? 'increased' : 'neutral',
    points: symptomPoints,
    rationale: symptomRationale,
  });

  // Calculate Risk Category from Total Score (0 - 26 scale)
  let category: RiskCategory = 'Low';
  if (score >= 13) {
    category = 'Higher';
  } else if (score >= 7) {
    category = 'Moderate';
  } else {
    category = 'Low';
  }

  // Handle Optional Laboratory Measurements
  const labEvaluation = evaluateLabMeasurements(data.latestHbA1c, data.latestFastingGlucose);

  return {
    score,
    maxScore,
    category,
    age: validatedAge,
    bmi: validatedBmi,
    bmiCategory,
    factors,
    labEvaluation,
    assessmentDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    hasSymptoms,
  };
}

/**
 * Separate laboratory measurement interpretation with medical caveats.
 */
function evaluateLabMeasurements(
  hba1c: number | '',
  glucose: number | ''
): LabEvaluation | null {
  const hasHbA1c = typeof hba1c === 'number' && hba1c > 0;
  const hasFastingGlucose = typeof glucose === 'number' && glucose > 0;

  if (!hasHbA1c && !hasFastingGlucose) {
    return null;
  }

  let hba1cInterpretation = '';
  if (hasHbA1c) {
    if (hba1c < 5.7) {
      hba1cInterpretation = `Reported ${hba1c}% is within the standard normal reference range (<5.7%).`;
    } else if (hba1c <= 6.4) {
      hba1cInterpretation = `Reported ${hba1c}% falls in the prediabetes reference range (5.7%–6.4%). Recommend discussing repeat testing with your doctor.`;
    } else {
      hba1cInterpretation = `Reported ${hba1c}% meets the laboratory threshold associated with diabetes (≥6.5%). Requires clinical evaluation by a medical provider.`;
    }
  }

  let glucoseInterpretation = '';
  if (hasFastingGlucose) {
    if (glucose < 100) {
      glucoseInterpretation = `Reported ${glucose} mg/dL is within the standard normal fasting glucose range (<100 mg/dL).`;
    } else if (glucose <= 125) {
      glucoseInterpretation = `Reported ${glucose} mg/dL falls in the impaired fasting glucose / prediabetes range (100–125 mg/dL).`;
    } else {
      glucoseInterpretation = `Reported ${glucose} mg/dL is elevated above normal fasting limits (≥126 mg/dL). Requires clinical confirmation.`;
    }
  }

  return {
    hasHbA1c,
    hba1cValue: hasHbA1c ? (hba1c as number) : undefined,
    hba1cInterpretation,
    hasFastingGlucose,
    glucoseValue: hasFastingGlucose ? (glucose as number) : undefined,
    glucoseInterpretation,
    cautionNotice:
      'Laboratory values are self-reported and provided for educational tracking only. They do not replace venous blood tests ordered by a licensed physician.',
  };
}
