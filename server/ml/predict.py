import sys
import json
import numpy as np
import joblib
from pathlib import Path

try:
    # -----------------------------
    # Load model
    # -----------------------------
    BASE_DIR = Path(__file__).resolve().parent
    MODEL_PATH = BASE_DIR / "risk_model.joblib"

    bundle = joblib.load(MODEL_PATH)
    model = bundle["model"]
    feature_cols = bundle["feature_cols"]

    # -----------------------------
    # Read input
    # -----------------------------
    input_json = sys.stdin.read().strip()
    data = json.loads(input_json) if input_json else {}

    # -----------------------------
    # Build feature vector
    # -----------------------------
    X_test = np.array([[1 if str(data.get(col, 0)).lower() == "yes" else 0 for col in feature_cols]])
    score = float(model.predict(X_test)[0])

    # Clamp optional
    score = max(0, min(100, score))

    # -----------------------------
    # Output
    # -----------------------------
    print(json.dumps({"score": score}))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
