import sys
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from pathlib import Path
import joblib

# -----------------------------
# Load CSV
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR.parent / "server" / "ml" / "financial_data.csv"

df = pd.read_csv(DATA_PATH)

# -----------------------------
# Feature columns (MODEL INPUTS)
# -----------------------------
feature_cols = [
    "valid housing contract",
    "missing payment plan",
    "reduced aid",
    "SAP warning",
    "on-campus job",
    "work restriction",
    "late fees",
    "meal plan cancellation",
    "course withdrawal after deadline",
    "missed financial advising appointments",
    "dropped gpa",
    "first-gen student",
    "transfer student",
    "prior emergency aid usage",
    "student returning from break"
]

target_col = "risk score"

# -----------------------------
# Convert Yes / No → 1 / 0
# -----------------------------
df[feature_cols] = df[feature_cols].replace({
    "Yes": 1,
    "No": 0
})

# Ensure numeric types
df[feature_cols] = df[feature_cols].apply(pd.to_numeric, errors="coerce").fillna(0)
df[target_col] = pd.to_numeric(df[target_col], errors="coerce")

# -----------------------------
# Train model
# -----------------------------
X = df[feature_cols].values
y = df[target_col].values

model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)
model.fit(X, y)

# -----------------------------
# Read input from Node API
# -----------------------------
if not sys.stdin.isatty():
    input_json = sys.stdin.read().strip()
    data = json.loads(input_json) if input_json else {}
else:
    data = {}


# Build prediction row in correct order
X_test = np.array([[
    int(data.get(col, 0)) for col in feature_cols
]])

score = model.predict(X_test)[0]

MODEL_PATH = BASE_DIR / "risk_model.joblib"
joblib.dump(
    {
        "model": model,
        "feature_cols": feature_cols
    },
    MODEL_PATH
)

# -----------------------------
# Output JSON
# -----------------------------
print(json.dumps({
    "score": float(score)
}))
