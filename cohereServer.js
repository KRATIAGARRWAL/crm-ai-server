import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cohere from 'cohere-ai'; // default import, no destructuring

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: 'https://crm-frontend-liart.vercel.app',
}));
app.use(express.json());

// Initialize Cohere with API key
cohere.init(process.env.COHERE_API_KEY);

app.post('/api/generate-messages', async (req, res) => {
  const { objective } = req.body;

  if (!objective) {
    return res.status(400).json({ error: 'Objective is required' });
  }

  try {
    const response = await cohere.generate({
      model: 'command',
      prompt: `Generate 3 short marketing message variants for this objective, one in one line, no numbering. Objective: "${objective}"`,
      max_tokens: 100,
      temperature: 0.9,
      num_generations: 1,
    });

    const messages = response.body.generations[0].text
      .split('\n')
      .map(m => m.trim())
      .filter(Boolean);

    res.json({ messages });
  } catch (err) {
    console.error('Cohere error:', err.message);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`AI server running on port ${PORT}`);
});
