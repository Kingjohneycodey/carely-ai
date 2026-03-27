import joblib
from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "weights" / "malaria_model_v2.pkl"

# Load the Scikit-learn pipeline
MALARIA_MODEL = joblib.load(str(MODEL_PATH))

def predict_malaria(symptom_data: dict):
    # Convert incoming dict to DataFrame for the pipeline
    df = pd.DataFrame([symptom_data])
    
    # Predict probability and class
    prediction = MALARIA_MODEL.predict(df)[0]
    probabilities = MALARIA_MODEL.predict_proba(df)[0]
    confidence = max(probabilities)
    
    result = "Positive" if prediction == 1 else "Negative"
    return result, confidence