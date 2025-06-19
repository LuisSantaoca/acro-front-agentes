import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { z } from 'zod';

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

const runDataSchema = z.object({ id: z.string() });
const runStatusSchema = z.object({ status: z.string() });
const messagesDataSchema = z.object({
  data: z.array(z.object({
    run_id: z.string(),
    role: z.string(),
    content: z.array(z.object({
      text: z.object({ value: z.string() })
    }))
  }))
});

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

    const runResponse = await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/runs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ assistant_id: OPENAI_ASSISTANT_ID }),
    });

    const runData = await runResponse.json() as { id: string };
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
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/runs/${runId}`, { headers });
      runStatus = await statusResponse.json() as { status: string };
      attempts++;
    } while (['queued', 'in_progress'].includes(runStatus.status) && attempts < 10);

    if (runStatus.status !== 'completed') {
      res.status(202).json({ message: null });
      return;
    }

    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/messages`, { headers });
    const messagesData = await messagesResponse.json() as {
      data: Array<{
        run_id: string;
        role: string;
        content: Array<{ text: { value: string } }>;
      }>;
    };

    const assistantMessage = messagesData.data.find(
      m => m.run_id === runId && m.role === 'assistant'
    );

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

    const response = await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/runs/${runId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      res.status(response.status).json({ error: 'No se encontró el runId o no es válido.' });
      return;
    }

    const runData = await response.json();
    res.json(runData);
  } catch (error) {
    console.error('❌ Error diagnóstico:', error);
    res.status(500).json({ error: 'Error al verificar el runId.' });
  }
});

app.listen(PORT, () => console.log(`✅ Servidor en puerto ${PORT}`));
