import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Servidor backend para OpenAI funcionando correctamente.');
});

app.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json(completion.choices[0].message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al conectar con OpenAI' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
