// --- INICIO DEL CÓDIGO FINAL Y RECOMENDADO ---
import express, { Request, Response, RequestHandler } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch, { HeadersInit } from 'node-fetch';
import { z } from 'zod'; // Importamos Zod

// --- Configuración y Middlewares (sin cambios) ---
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
  origin: ["https://elathia.ai", "https://www.elathia.ai", "http://localhost:3000"],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Schemas de Zod para Validación y Tipado ---
// Schema para la respuesta al crear un run (POST /chat)
const RunCreationSchema = z.object({
  id: z.string(),
});

// Schema para la respuesta al consultar el estado de un run
const RunStatusSchema = z.object({
  id: z.string(),
  status: z.string(),
  // y cualquier otro campo que quieras del run
});

// Schema para la lista de mensajes
const MessageSchema = z.object({
  run_id: z.string().nullable(),
  role: z.enum(['user', 'assistant']),
  content: z.array(
    z.object({
      type: z.literal('text'),
      text: z.object({
        value: z.string(),
      }),
    })
  ),
});

const MessagesListSchema = z.object({
  data: z.array(MessageSchema),
});


// --- Rutas de la API ---

app.get('/', ((_req, res) => {
  res.send('🚀 Backend OpenAI activo.');
}) as RequestHandler);


// --- RUTA POST /chat (CON TU SOLUCIÓN DE ZOD) ---
app.post('/chat', (async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt requerido.' });
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'OpenAI-Beta': 'assistants=v2',
    };

    // Añadir mensaje al hilo
    await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ role: 'user', content: prompt }),
    });

    // Crear el run
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/runs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ assistant_id: OPENAI_ASSISTANT_ID }),
    });
    
    if (!runResponse.ok) throw new Error(`OpenAI API error: ${runResponse.statusText}`);

    // Parseamos la respuesta con Zod para obtener el tipado y la validación
    const runData = RunCreationSchema.parse(await runResponse.json());
    res.status(202).json({ runId: runData.id });

  } catch (error) {
    console.error('❌ Error en /chat:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}) as RequestHandler);


// --- RUTA GET /chat/status/:runId (ARQUITECTURA NO BLOQUEANTE + ZOD) ---
app.get('/chat/status/:runId', (async (req: Request<{ runId: string }>, res: Response) => {
  try {
    const { runId } = req.params;
    const headers: HeadersInit = {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'OpenAI-Beta': 'assistants=v2',
    };

    // 1. Consultar el estado del run UNA SOLA VEZ
    const statusResponse = await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/runs/${runId}`, { headers });
    if (!statusResponse.ok) {
        const errorData = await statusResponse.json().catch(() => ({}));
        return res.status(statusResponse.status).json({ error: 'Error al obtener estado del run desde OpenAI.', details: errorData });
    }

    // 2. Parsear el estado del run con Zod
    const runStatus = RunStatusSchema.parse(await statusResponse.json());

    // 3. Si NO está completado, responder inmediatamente con el estado
    if (runStatus.status !== 'completed') {
      return res.json({ status: runStatus.status, message: null });
    }
    
    // 4. Si SÍ está completado, obtener y parsear los mensajes
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/messages`, { headers });
    if (!messagesResponse.ok) throw new Error('No se pudieron obtener los mensajes tras completar el run.');

    const messagesData = MessagesListSchema.parse(await messagesResponse.json());
    const assistantMessage = messagesData.data.find(m => m.run_id === runId && m.role === 'assistant');

    // 5. Responder con el mensaje final
    res.json({
      status: 'completed',
      message: assistantMessage ? assistantMessage.content[0].text.value : 'Run completado sin mensaje de respuesta.'
    });

  } catch (error) {
    console.error('❌ Error en /chat/status:', error);
    res.status(500).json({ error: 'Error interno del servidor al verificar estado.' });
  }
}) as RequestHandler);

// Mantengo tu útil ruta de diagnóstico, ¡es una buena idea!
app.get('/diagnostico/run/:runId', (async (req: Request<{ runId: string }>, res: Response) => {
    // ... tu código de diagnóstico aquí ...
}) as RequestHandler);

app.listen(PORT, () => console.log(`✅ Servidor en puerto ${PORT}`));

// --- FIN DEL CÓDIGO FINAL Y RECOMENDADO ---