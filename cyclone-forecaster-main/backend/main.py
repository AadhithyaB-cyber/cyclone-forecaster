from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import database
from routes import cyclone, zones, dashboard

app = FastAPI(
    title="Cyclone Impact & Infrastructure Vulnerability Forecaster API",
    description="AI-augmented cyclone risk ranking for disaster-response officers",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your deployed frontend URL before final submission
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    database.load_seed_data()


@app.get("/")
def root():
    return {"message": "Cyclone Forecaster API is running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(cyclone.router)
app.include_router(zones.router)
app.include_router(dashboard.router)