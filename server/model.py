import sys
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor

# Load CSV
from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR.parent / "ml" / "financial_data.csv"

df = pd.read_csv(DATA_PATH)


# Features and target
X = df[["monthlyNet", "debtRatio", "savingsRatio"]].values
y = df["riskScore"].values

# Train model
model = RandomForestRegressor()
model.fit(X, y)

# Read input from Node API
input_json = sys.stdin.read()
data = json.loads(input_json)

monthly_net = data.get("monthlyNet", 0)
debt_ratio = data.get("debtRatio", 0)
savings_ratio = data.get("savingsRatio", 0)

X_test = np.array([[monthly_net, debt_ratio, savings_ratio]])
score = model.predict(X_test)[0]

# Output JSON
print(json.dumps({"score": float(score)}))
