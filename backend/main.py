from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np
from lightgbm import Booster

app = FastAPI(title="Smart Health Predictor API")

# Allow frontend
origins = ["https://healthpredictorfrontend.onrender.com"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model safely
model = joblib.load("model/lgbm_pipeline.pkl")

# Handle both sklearn wrapper and raw Booster
is_booster = isinstance(model, Booster)

ALL_FEATURES = [
    "age", "sex", "trestbps", "chol", "thalach", "oldpeak",
    "cp", "fbs", "restecg", "exang", "slope", "ca", "thal"
]

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
    try:
        # Convert input into dataframe
        input_dict = data.dict()
        df = pd.DataFrame([input_dict])[ALL_FEATURES]

        if is_booster:
            # Raw Booster requires numpy array
            dmatrix = df.values
            prob = model.predict(dmatrix)[0]
        else:
            # Sklearn wrapper
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
        return {"error": str(e)}
