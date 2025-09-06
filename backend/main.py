from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import logging
import sys

app = FastAPI(title="Smart Health Predictor API")

# Allow only your deployed frontend
origins = ["https://healthpredictorfrontend.onrender.com"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALL_FEATURES = [
    "age","sex","trestbps","chol","thalach","oldpeak",
    "cp","fbs","restecg","exang","slope","ca","thal"
]

# Logging setup
logging.basicConfig(level=logging.INFO, stream=sys.stdout)
logger = logging.getLogger("uvicorn.error")

# Safe model loading
try:
    model = joblib.load("model/lgbm_pipeline.pkl")
    logger.info("✅ Model loaded successfully.")
except Exception as e:
    logger.error(f"❌ Failed to load model: {e}")
    model = None  # Fallback to avoid crashing


class PatientData(BaseModel):
    age: float
    sex: int
    trestbps: float
    chol: float
    thalach: float
    oldpeak: float
    cp: int
    fbs: int
    restecg: int
    exang: int
    slope: int
    ca: int
    thal: int


@app.get("/")
def root():
    return {"message": "Smart Health Predictor API is running!"}


@app.post("/predict")
def predict(data: PatientData):
    if model is None:
        return {"error": "Model not loaded. Check server logs."}

    try:
        df = pd.DataFrame([data.dict()])[ALL_FEATURES]

        prob = model.predict_proba(df)[:, 1][0]
        health_score = round(prob * 100, 2)

        if prob < 0.2:
            risk_category = "Healthy"
        elif prob < 0.5:
            risk_category = "Mild Risk"
        else:
            risk_category = "At Risk"

        return {
            "Predicted Health Score": f"{health_score}%",
            "Risk Category": risk_category
        }

    except Exception as e:
        logger.error(f"❌ Prediction failed: {e}")
        return {"error": str(e)}
