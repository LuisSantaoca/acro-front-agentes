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

interface IRun { id: string; status: string; }
interface IMessage {
  id: string;
  run_id?: string;
  role: string;
  content: { type: string; text: { value: string } }[];
}

const apiClient = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'OpenAI-Beta': 'assistants=v2',
  },

  async request<T>(endpoint: string, options: any = {}): Promise<T> {
    const response = await fetch(`https://api.openai.com/v1${endpoint}`, {
      headers: this.headers, ...options
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(`Error OpenAI: ${errorBody.error?.message || errorBody.message}`);
    }

    return response.json();
  },

  post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
  },

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }
};

const openAIService = {
  async createMessage(content: string) {
    await apiClient.post(`/threads/${OPENAI_THREAD_ID}/messages`, { role: 'user', content });
  },

  async createRun() {
    return apiClient.post<IRun>(`/threads/${OPENAI_THREAD_ID}/runs`, { assistant_id: OPENAI_ASSISTANT_ID });
  },

  async getFinalResponse(runId: string): Promise<string> {
    let runStatus: IRun;
    do {
      await new Promise(r => setTimeout(r, 1500));
      runStatus = await apiClient.get<IRun>(`/threads/${OPENAI_THREAD_ID}/runs/${runId}`);
    } while (['queued', 'in_progress'].includes(runStatus.status));

    if (runStatus.status !== 'completed') {
      throw new Error(`Run finalizó en estado inesperado: ${runStatus.status}`);
    }

    const messages = await apiClient.get<{ data: IMessage[] }>(`/threads/${OPENAI_THREAD_ID}/messages`);
    const assistantMessage = messages.data.find(m => m.run_id === runId && m.role === 'assistant');
    if (!assistantMessage) throw new Error('Sin respuesta del asistente.');

    return assistantMessage.content[0].text.value;
  },
};

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["https://elathia.ai", "https://www.elathia.ai"],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (_req, res) => res.send('🚀 Backend OpenAI activo.'));

app.post('/chat', async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt requerido.' });

    await openAIService.createMessage(prompt);
    const run = await openAIService.createRun();

    res.status(202).json({ message: "Solicitud aceptada", threadId: OPENAI_THREAD_ID, runId: run.id });
  } catch (error) {
    next(error);
  }
});

app.get('/chat/status/:runId', async (req, res, next) => {
  try {
    const { runId } = req.params;
    const responseText = await openAIService.getFinalResponse(runId);
    res.json({ message: responseText });
  } catch (error) {
    next(error);
  }
});

app.use((error: Error, _req, res, _next) => {
  console.error('❌ Error:', error.message);
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => console.log(`✅ Servidor en puerto ${PORT}`));
