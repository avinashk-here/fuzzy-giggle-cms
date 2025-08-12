// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Single endpoint
app.post('/api/generate', async (req, res) => {
  const { model, prompt, context } = req.body;

  // 1) Decide which provider to call
  let url, headers, payload;

  if (model.startsWith('gpt')) {
    url = 'https://api.openai.com/v1/chat/completions';
    headers = {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    };
    payload = {
      model: model.replace('gpt-', 'gpt-'),   // sanitize if needed
      messages: [{ role: 'user', content: `${prompt}\n\n${context}` }],
      max_tokens: 2000,
      temperature: 0.3,
    };
  } else if (model.startsWith('sonar')) {
    // Perplexity example
    url = 'https://api.perplexity.ai/chat/completions';
    headers = {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    };
    payload = {
      model: model, // sonar, sonar-pro, etc.
      messages: [{ role: 'user', content: `${prompt}\n\n${context}` }],
      max_tokens: 2000,
      temperature: 0.3,
    };
  } else {
    return res.status(400).json({ error: 'Unknown model' });
  }

  try {
    const { data } = await axios.post(url, payload, { headers });
    const reply = data.choices?.[0]?.message?.content || '';
    res.json({ output: reply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Generation failed' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));