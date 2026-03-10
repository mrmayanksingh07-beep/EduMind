require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.get("/", (req, res) => {
  res.json({ status: "EduMind AI server is running 🚀" });
});

app.post("/api/chat", async (req, res) => {
  const { messages, systemPrompt } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt || "You are EduMind AI, a helpful study assistant.",
      messages: messages,
    });
    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error("Anthropic API error:", err.message);
    res.status(500).json({ error: "AI request failed: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ EduMind AI server running on http://localhost:${PORT}`);
});