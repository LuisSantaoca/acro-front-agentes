import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
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

app.get('/', (_req, res) => res.send('🚀 Backend OpenAI activo.'));

app.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt requerido.' });

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'OpenAI-Beta': 'assistants=v2',
    };

    // Crear mensaje del usuario en el hilo
    await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ role: 'user', content: prompt }),
    });

    // Iniciar ejecución del assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/runs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ assistant_id: OPENAI_ASSISTANT_ID }),
    });

    const runData = await runResponse.json();
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

    let runStatus;
    let attempts = 0;

    do {
      await new Promise(r => setTimeout(r, 1500));
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/runs/${runId}`, { headers });
      runStatus = await statusResponse.json();
      attempts++;
    } while (['queued', 'in_progress'].includes(runStatus.status) && attempts < 10);

    if (runStatus.status !== 'completed') {
      return res.status(202).json({ message: null });
    }

    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/messages`, { headers });
    const messagesData = await messagesResponse.json();

    const assistantMessage = messagesData.data.find(m => m.run_id === runId && m.role === 'assistant');

    if (!assistantMessage) {
      return res.status(202).json({ message: null });
    }

    res.json({ message: assistantMessage.content[0].text.value });

  } catch (error) {
    console.error('❌ Error en /chat/status:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// ✅ Ruta de diagnóstico para verificar cualquier runId directamente
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
      return res.status(response.status).json({ error: 'No se encontró el runId o no es válido.' });
    }

    const runData = await response.json();
    return res.json({
      id: runData.id,
      status: runData.status,
      created_at: runData.created_at,
      completed_at: runData.completed_at,
      thread_id: runData.thread_id,
      assistant_id: runData.assistant_id,
    });
  } catch (error) {
    console.error('❌ Error diagnóstico:', error);
    return res.status(500).json({ error: 'Error al verificar el runId.' });
  }
});

app.listen(PORT, () => console.log(`✅ Servidor en puerto ${PORT}`));
