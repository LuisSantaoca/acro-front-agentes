import express, { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fetch from 'node-fetch';

// Inicio bloque: Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const PORT = Number(process.env.PORT || 3001);
const { OPENAI_API_KEY, OPENAI_ASSISTANT_ID, OPENAI_THREAD_ID } = process.env;

if (!OPENAI_API_KEY || !OPENAI_ASSISTANT_ID || !OPENAI_THREAD_ID) {
  console.error('❌ Error crítico: OPENAI_API_KEY, OPENAI_ASSISTANT_ID o OPENAI_THREAD_ID faltan en .env.');
  process.exit(1);
}
// Fin bloque: Cargar variables de entorno

// Inicio bloque: Interfaces
interface IRun { id: string; status: string; }
interface IMessage {
  id: string;
  run_id?: string;
  role: string;
  content: { type: string; text: { value: string } }[];
}
// Fin bloque: Interfaces

// Inicio bloque: Cliente API OpenAI
const apiClient = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'OpenAI-Beta': 'assistants=v2',
  },

  async request(endpoint: string, options: any = {}) {
    const url = `https://api.openai.com/v1${endpoint}`;
    const response = await fetch(url, { headers: this.headers, ...options });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Error desconocido al leer el cuerpo' }));
      throw new Error(`Error API OpenAI: ${response.status} ${response.statusText} - ${errorBody.error?.message || errorBody.message}`);
    }

    return response.json();
  },

  post(endpoint: string, body: any) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  },

  get(endpoint: string) {
    return this.request(endpoint);
  }
};
// Fin bloque: Cliente API OpenAI

// Inicio bloque: Servicio OpenAI
const openAIService = {
  async createMessage(threadId: string, content: string): Promise<void> {
    await apiClient.post(`/threads/${threadId}/messages`, { role: 'user', content });
  },

  async createRun(threadId: string): Promise<IRun> {
    return await apiClient.post(`/threads/${threadId}/runs`, { assistant_id: OPENAI_ASSISTANT_ID });
  },

  async getFinalResponse(threadId: string, runId: string): Promise<string> {
    let runStatus: IRun;
    do {
      await new Promise(r => setTimeout(r, 1500));
      runStatus = await apiClient.get(`/threads/${threadId}/runs/${runId}`);
    } while (['queued', 'in_progress'].includes(runStatus.status));

    if (runStatus.status !== 'completed') {
      throw new Error(`Run finalizó con estado inesperado: ${runStatus.status}`);
    }

    const messages = await apiClient.get(`/threads/${threadId}/messages`);
    const assistantMessage = (messages.data as IMessage[]).find(
      (m) => m.run_id === runId && m.role === 'assistant'
    );

    if (!assistantMessage || assistantMessage.content.length === 0) {
      throw new Error('No se obtuvo respuesta textual del asistente.');
    }

    return assistantMessage.content[0].text.value;
  },

  async createNewThread(): Promise<{ id: string }> {
    return await apiClient.post('/threads', {});
  }
};
// Fin bloque: Servicio OpenAI

const app = express();

// Inicio bloque: Configuración middleware
app.use(express.json());
app.use(cors({
  origin: ["https://elathia.ai", "https://www.elathia.ai"],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Fin bloque: Configuración middleware

// Inicio bloque: Rutas API
app.get('/', (_req: Request, res: Response) => {
  res.send('🚀 Backend OpenAI activo.');
});

app.post('/chat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { prompt, threadId } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'El campo \"prompt\" es obligatorio.' });
    }

    if (!threadId) {
      threadId = OPENAI_THREAD_ID; // Claramente definido desde .env
    }

    console.log("🚩 Usando ThreadId:", threadId); // Log claramente visible

    await openAIService.createMessage(threadId, prompt);
    const run = await openAIService.createRun(threadId);

    res.status(202).json({
      message: "Solicitud aceptada y en proceso.",
      threadId,
      runId: run.id
    });

  } catch (error) {
    next(error);
  }
});

app.get('/chat/status/:threadId/:runId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { threadId, runId } = req.params;
    const responseText = await openAIService.getFinalResponse(threadId, runId);
    res.json({ message: responseText });
  } catch (error) {
    next(error);
  }
});
// Fin bloque: Rutas API

// Inicio bloque: Manejo de errores
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Error:', error.message);
  res.status(500).json({ error: error.message });
});
// Fin bloque: Manejo de errores

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en puerto ${PORT}`);
});
