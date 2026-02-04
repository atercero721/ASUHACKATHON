import express from "express";
import { spawn } from "child_process";

interface ScoreRequest {
  income: number;
  expenses: Record<string, number>; // keys are expense names, values are numbers
  debt: number;
  savings: number;
}

const router = express.Router();

router.post("/score", async (req, res) => {
  const { income, expenses, debt, savings } = req.body as ScoreRequest;

  // Simple feature calculation
  const totalExpenses = Object.values(expenses).reduce((a: number, b: number) => a + b, 0);
  const monthlyNet = income - totalExpenses;
  const debtSum = Object.values(debt).reduce((a: number, b: number) => a + b, 0);
  const debtRatio = income > 0 ? debtSum / income : 0;
  const savingsRatio = income > 0 ? savings / income : 0;

  const input = { monthlyNet, debtRatio, savingsRatio };

  // Call Python script
  const py = spawn("python3", ["./ml/model.py"]);

  let result = "";
  py.stdout.on("data", (data) => {
    result += data.toString();
  });

  py.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  py.on("close", () => {
    try {
      const score = JSON.parse(result).score;
      res.json({ score: Math.round(score) });
    } catch (err) {
      res.status(500).json({ error: "ML model error" });
    }
  });

  py.stdin.write(JSON.stringify(input));
  py.stdin.end();
});

export default router;
