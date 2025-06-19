const express = require('express');
const OpenAI = require('openai');
require('dotenv').config({ path: '/var/www/agentes/config/.env' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const assistantId = process.env.OPENAI_ASSISTANT_ID;
const threadId = process.env.OPENAI_THREAD_ID;

const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt requerido.' });

    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: prompt,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    res.status(202).json({ runId: run.id });
  } catch (error) {
    console.error("❌ Error al interactuar con OpenAI:", error);
    res.status(500).json({ error: "Error interno con OpenAI" });
  }
});

app.get('/chat/status/:runId', async (req, res) => {
  try {
    const { runId } = req.params;

    const run = await openai.beta.threads.runs.retrieve(threadId, runId);

    if (run.status !== 'completed') {
      return res.json({ status: run.status, message: null });
    }

    // Obtener mensajes del thread
    const messages = await openai.beta.threads.messages.list(threadId);

    const assistantMessage = messages.data.find(
      m => m.run_id === runId && m.role === 'assistant'
    );

    res.json({
      status: 'completed',
      message: assistantMessage ? assistantMessage.content[0].text.value : null,
    });
  } catch (error) {
    console.error("❌ Error consultando el run:", error);
    res.status(500).json({ error: "Error interno consultando el run" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend OpenAI escuchando en puerto ${PORT}`);
});
