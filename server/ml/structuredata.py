from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
CSV_PATH = BASE_DIR / "financial_data.csv"

df = pd.read_csv(CSV_PATH)


positive_weights = {
    "valid housing contract": 10,
    "on-campus job": 8,
}

negative_weights = {
    "missing payment plan": -6,
    "reduced aid": -6,
    "SAP warning": -10,
    "work restriction": -6,
    "late fees": -6,
    "meal plan cancellation": -6,
    "course withdrawal after deadline": -6,
    "missed financial advising appointments": -6,
    "dropped gpa": -10,
    "first-gen student": -4,
    "transfer student": -3,
    "prior emergency aid usage": -6,
    "student returning from break": -6,
}

def compute_score(row):
    score = 50

    for col, w in positive_weights.items():
        if row[col] == "Yes":
            score += w

    for col, w in negative_weights.items():
        if row[col] == "Yes":
            score += w

    return max(0, min(100, score))

df["risk score"] = df.apply(compute_score, axis=1)

df.to_csv("financial_data_fixed.csv", index=False)