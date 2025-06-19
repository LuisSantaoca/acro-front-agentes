import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: '/var/www/agentes/config/backend.env' });

const PORT = Number(process.env.PORT || 3001);
const { OPENAI_API_KEY, OPENAI_ASSISTANT_ID, OPENAI_THREAD_ID } = process.env;

if (!OPENAI_API_KEY || !OPENAI_ASSISTANT_ID || !OPENAI_THREAD_ID) {
  console.error('❌ Error crítico: variables faltantes en backend.env.');
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["https://elathia.ai", "https://www.elathia.ai"],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (_req, res) => {
  res.send('🚀 Backend OpenAI activo.');
});

app.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt requerido.' });

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'OpenAI-Beta': 'assistants=v2',
    };

    await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ role: 'user', content: prompt }),
    });

    const runData: { id: string } = await (await fetch(
      `https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/runs`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ assistant_id: OPENAI_ASSISTANT_ID }),
      }
    )).json();

    res.status(202).json({ runId: runData.id });
  } catch (error) {
    console.error('❌ Error en /chat:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.get('/chat/status/:runId', async (req, res) => {
  try {
    const { runId } = req.params;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'OpenAI-Beta': 'assistants=v2',
    };

    let runStatus: { status: string };
    let attempts = 0;

    do {
      await new Promise(r => setTimeout(r, 1500));
      runStatus = await (await fetch(
        `https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/runs/${runId}`,
        { headers }
      )).json() as { status: string };
      attempts++;
    } while (['queued', 'in_progress'].includes(runStatus.status) && attempts < 10);

    if (runStatus.status !== 'completed') {
      res.status(202).json({ message: null });
      return;
    }

    const messagesData: {
      data: Array<{
        run_id: string;
        role: string;
        content: Array<{ text: { value: string } }>;
      }>;
    } = await (await fetch(
      `https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/messages`,
      { headers }
    )).json();

    const assistantMessage = messagesData.data.find((m: any) => m.run_id === runId && m.role === 'assistant');

    if (!assistantMessage) {
      res.status(202).json({ message: null });
      return;
    }

    res.json({ message: assistantMessage.content[0].text.value });
  } catch (error) {
    console.error('❌ Error en /chat/status:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.get('/diagnostico/run/:runId', async (req, res) => {
  try {
    const { runId } = req.params;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'OpenAI-Beta': 'assistants=v2',
    };

    const runData: {
      id: string;
      status: string;
      created_at: number;
      completed_at: number;
      thread_id: string;
      assistant_id: string;
    } = await (await fetch(
      `https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/runs/${runId}`,
      { method: 'GET', headers }
    )).json();

    res.json(runData);
  } catch (error) {
    console.error('❌ Error diagnóstico:', error);
    res.status(500).json({ error: 'Error al verificar el runId.' });
  }
});

app.listen(PORT, () => console.log(`✅ Servidor en puerto ${PORT}`));
