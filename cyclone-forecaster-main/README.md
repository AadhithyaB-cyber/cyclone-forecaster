# Cyclone Impact & Infrastructure Vulnerability Forecaster

> "Cyclone forecasts tell you where the storm goes. This tells you where the
> damage will actually happen — and why."

AI-augmented risk ranking for disaster response officers. Built for **Mini
Inter-College Hackathon: Red, Recode, Rebuild 2026** — Domain: **AI × Human
Augmentation**.

---

## Problem Statement

Cyclone forecasting predicts a storm's path, wind speed, and landfall timing
— but this rarely translates into actionable, ground-level impact
predictions. Disaster response officials manually cross-reference storm
tracks against infrastructure maps and historical damage patterns, under
severe time pressure, often missing vulnerabilities outside the storm's
direct path. Resource allocation ends up **reactive** instead of
**proactive**.

## Our Solution

Given a cyclone's predicted track and current data, the system cross-
references it against each zone's infrastructure vulnerability profile
(drainage capacity, elevation, building density, power grid exposure,
distance from landfall, past damage history) to produce:

- A **ranked list of at-risk zones**, not just the landfall point
- A **plain-English explanation** of why each zone is vulnerable
- A **recommended resource-allocation priority** for response teams

The risk-scoring engine surfaces patterns a human team can't compute
manually in real time — but the **final deployment decision stays with the
human officer**. The system augments judgment with speed and structured
analysis; it doesn't replace it.

**No external AI API required** — the risk engine is a fully self-contained,
weighted Python algorithm. This keeps the demo 100% reliable (no internet
dependency, no API key, no rate limits) and easy to explain and defend to
judges: every score is traceable to a specific, explainable rule.

---

## Project structure

```
cyclone-forecaster/
├── backend/          FastAPI (Python)
│   ├── main.py         App entry point
│   ├── models.py        Pydantic schemas
│   ├── database.py       In-memory store, seeded from seed_data.json
│   ├── seed_data.json      Cyclone track + 6 Chennai-area zones (demo data)
│   ├── ai_engine.py        Pure-Python weighted risk-scoring engine
│   └── routes/
│       ├── cyclone.py        GET current cyclone data
│       ├── zones.py           GET zones, zone detail, risk assessment
│       └── dashboard.py        GET risk-ranked zone list
└── frontend/         React + TypeScript + Vite + Tailwind
    └── src/
        ├── App.tsx
        ├── api.ts              Backend API client
        ├── types.ts             Shared TS types
        └── components/
            ├── CycloneOverview.tsx  Storm summary + predicted track
            ├── Dashboard.tsx          Risk-ranked zone list
            ├── ZoneDetailView.tsx      Risk assessment + vulnerability profile
            └── RiskBadge.tsx            Risk level/score pill
```

---

## How the risk score works

Six weighted factors are combined into a 0–100 score:

| Factor | Logic |
|---|---|
| Distance from landfall | Closer = higher risk, decays with distance |
| Elevation | Lower elevation = higher storm-surge/flood risk |
| Drainage capacity | Poor drainage adds the most weight |
| Building density | Higher density = more population exposure |
| Power grid exposure | Exposed overhead lines score highest |
| Past damage history | Any recorded history adds a risk bump |
| Wind speed | Current cyclone intensity adds a modest multiplier |

Score bands: **0–34 low · 35–54 moderate · 55–74 high · 75–100 severe**

See `backend/ai_engine.py` for the full logic — every number is explainable,
which is a strength when judges ask "how does the AI decide this?"

---

## Running locally (in Cursor)

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Visit `http://localhost:8000/docs` for interactive Swagger API docs.

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env          # Mac/Linux: cp .env.example .env
npm run dev
```

Visit `http://localhost:5173`.

**Keep both terminals running at the same time** — the frontend needs the
backend live to load any data.

---

## Deploying

- **Backend:** Push `backend/` to GitHub, deploy on **Render** or
  **Railway** (free tier). Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Frontend:** Push `frontend/` to GitHub, deploy on **Vercel**. Set env
  variable `VITE_API_URL` to your deployed backend URL.

---

## Demo script (for judges)

1. Open the **dashboard** — zones are already ranked by risk score, with the
   coastal zone nearest landfall at the top marked "severe."
2. Click into a **high-risk zone** (e.g. Mahabalipuram Coastal Belt) — show
   the risk assessment: key factors, plain-English reasoning, and the
   recommended action for the officer.
3. Click into a **lower-risk zone** (e.g. West Tambaram) to show the score
   correctly drops — proving the engine actually differentiates, not just
   defaults everything to "high."
4. Emphasize: *the system never deploys resources itself — it ranks and
   explains risk so a human officer can act faster and with more complete
   information than manual cross-referencing would allow.*

---

## Notes on scope (be upfront with judges if asked)

- Cyclone track and zone vulnerability data are **seeded demo data**, not
  live weather API feeds — this is an MVP built for a hackathon, not
  production infrastructure.
- The risk-scoring logic is a transparent weighted rule system rather than a
  trained ML model — this was a deliberate choice for reliability and
  explainability in a live demo setting. The architecture (seeded data →
  scoring engine → ranked dashboard) is designed to plug in a trained model
  or live data feeds later without changing the frontend.
