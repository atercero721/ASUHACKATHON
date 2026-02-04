// server/chatgpt.ts
import OpenAI from "openai";
import express from "express";

const router = express.Router();

let client: OpenAI | null = null;

function getClient() {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return client;
}

router.post("/chat", async (req, res) => {
  try {
    const { input } = req.body;

    const response = await getClient().responses.create({
      model: "gpt-5",
      input,
    });

    res.json({ text: response.output_text });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
