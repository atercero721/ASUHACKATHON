// server/chatgpt.ts
import OpenAI from "openai";
import express from "express";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

router.post("/chat", async (req, res) => {
  const { input } = req.body;

  const response = await client.responses.create({
    model: "gpt-5",
    input,
  });

  res.json({
    text: response.output_text,
  });
});

export default router;
