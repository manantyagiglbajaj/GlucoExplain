# GlucoExplain — An Explainable Machine Learning Approach for Early Diabetes Risk Prediction

GlucoExplain is a modern, privacy-focused educational health technology web application that evaluates lifestyle, demographic, and self-reported metabolic factors to generate an interpretable diabetes risk indicator and explains the underlying drivers using Google Gemini AI.

## Key Features

- **Exactly Two Clean Navigation Tabs:**
  - **Home:** Plain-English introduction, 3 feature cards, 3-step "How It Works" guide, transparent methodology overview, and prominent medical disclaimers.
  - **Risk Assessment:** 15-question interactive multi-step questionnaire with real-time age and BMI calculation, live validation, optional lab measurements, and privacy consent.
- **Explainable Deterministic Scoring:**
  - Prototype scoring module (`predictRisk`) separating established clinical drivers (age, BMI, family history, previous prediabetes, blood pressure) from lifestyle factors.
  - Transparent point weights and factor-by-factor medical rationales.
  - Separate clinical evaluation for self-reported laboratory measurements (HbA1c and fasting blood glucose).
- **Server-Side Gemini Integration:**
  - Calls Gemini 3.8 Flash (`@google/genai`) strictly from the server (`/api/explain-risk`).
  - Privacy-preserving: the user's name and date of birth are never transmitted to Gemini or persisted anywhere.
  - Automatic fallback to transparent local explanations if the API is offline or the user opts out.
- **Results Dashboard & PDF Printing:**
  - Interactive risk scale (Low, Moderate, Higher) without claiming medical certainty.
  - Factor filtering (All, Higher Risk, Protective / Neutral).
  - General lifestyle suggestions and clinical follow-up guidance.
  - Formatted printable report view (`window.print()`) with calculation methodology, limitations, and physician signature block.
- **Privacy & Safety First:**
  - Ephemeral client-side session state; zero database persistence.
  - Prominent educational notices and urgent care alerts for reported symptoms.

---

## Tech Stack & Dependencies

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React icons, Motion
- **Backend:** Express, Node.js, tsx
- **AI Engine:** Google Gemini (`@google/genai` TypeScript SDK, `gemini-3.8-flash`)
- **Build Tool:** Vite 8

---

## Getting Started

### 1. Prerequisites

- Node.js (version 20.19+ or 22.12+, Node.js 22.x recommended for Vercel)
- npm (v10+) or pnpm

### 2. Environment Configuration

Copy the example environment configuration:

```bash
cp .env.example .env
```

Ensure `GEMINI_API_KEY` is set:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=3000
```

> **Note:** In Google AI Studio Build, the `GEMINI_API_KEY` is automatically injected from the Secrets panel at runtime.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## Deploying to Vercel

GlucoExplain includes both an Express server for standalone Node environments and a native Vercel Serverless Function in `api/explain-risk.ts`:

1. Push your repository to GitHub or GitLab.
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. Set the Framework Preset to **Vite**.
4. In the **Environment Variables** settings in Vercel:
   - Add `GEMINI_API_KEY` with your Google Gemini API key.
5. Click **Deploy**. Vercel will build the frontend into static assets and deploy `/api/explain-risk` as a serverless endpoint.

---

## Educational Disclaimer

GlucoExplain is an educational demonstration application, not a certified medical device, and cannot diagnose, prevent, treat, or rule out type 2 diabetes or any other medical condition. A low risk score does not guarantee the absence of diabetes, and a higher score is not a clinical diagnosis. Always consult a licensed healthcare professional for health advice, routine screening, and diagnostic lab tests.
