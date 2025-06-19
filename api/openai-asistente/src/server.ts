import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch, { HeadersInit } from 'node-fetch';

// --- Configuración Inicial ---
// Asegúrate de que la ruta a tu archivo .env sea correcta para tu entorno.
// Para desarrollo local, usualmente es suficiente con: dotenv.config();
dotenv.config({ path: '/var/www/agentes/config/backend.env' });

const PORT = process.env.PORT || 3001;
const { OPENAI_API_KEY, OPENAI_ASSISTANT_ID, OPENAI_THREAD_ID } = process.env;

// Verificación crítica de variables de entorno al iniciar
if (!OPENAI_API_KEY || !OPENAI_ASSISTANT_ID || !OPENAI_THREAD_ID) {
  console.error('❌ Error crítico: Faltan una o más variables (OPENAI_API_KEY, OPENAI_ASSISTANT_ID, OPENAI_THREAD_ID) en el archivo .env.');
  process.exit(1); // Detiene la aplicación si la configuración es incorrecta
}

// Headers reutilizables para las llamadas a la API de OpenAI
const openaiHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${OPENAI_API_KEY}`,
  'OpenAI-Beta': 'assistants=v2',
};

// --- Creación de la Aplicación Express ---
const app = express();

// --- Middlewares ---
app.use(express.json()); // Para parsear el cuerpo de las peticiones JSON
app.use(cors({
  // Ajusta los orígenes según tus necesidades de producción y desarrollo
  origin: ["https://elathia.ai", "https://www.elathia.ai", "http://localhost:3000"], // Añadido localhost para desarrollo
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Rutas de la API ---

/**
 * Ruta de salud para verificar que el servidor está activo.
 */
app.get('/', (_req, res) => res.send('🚀 Backend de Asistente OpenAI activo.'));

/**
 * @route   POST /chat
 * @desc    Recibe un prompt del usuario, lo añade al hilo de OpenAI y crea un "run".
 * @access  Public
 */
app.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'El campo "prompt" es requerido.' });
    }

    // 1. Añadir el mensaje del usuario al hilo existente.
    await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/messages`, {
      method: 'POST',
      headers: openaiHeaders,
      body: JSON.stringify({ role: 'user', content: prompt }),
    });

    // 2. Crear un "run" para que el asistente procese los mensajes del hilo.
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/runs`, {
      method: 'POST',
      headers: openaiHeaders,
      body: JSON.stringify({ assistant_id: OPENAI_ASSISTANT_ID }),
    });

    if (!runResponse.ok) {
        const errorData = await runResponse.json();
        console.error('❌ Error al crear el run:', errorData);
        return res.status(runResponse.status).json({ error: 'Error al comunicarse con la API de OpenAI para crear el run.' });
    }

    const runData = await runResponse.json();

    // 3. Responder inmediatamente con el runId para que el cliente pueda empezar a sondear.
    // Usamos 202 "Accepted" para indicar que la petición fue aceptada pero el procesamiento no ha terminado.
    res.status(202).json({ runId: runData.id });

  } catch (error) {
    console.error('❌ Error en la ruta /chat:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/**
 * @route   GET /chat/status/:runId
 * @desc    Verifica el estado de un "run" de forma NO BLOQUEANTE.
 * @access  Public
 */
app.get('/chat/status/:runId', async (req, res) => {
  try {
    const { runId } = req.params;

    // 1. Consultar el estado del "run" una sola vez.
    const statusResponse = await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/runs/${runId}`, { headers: openaiHeaders });
    
    // Si el runId es inválido o no se encuentra, OpenAI devuelve un 404.
    if (!statusResponse.ok) {
      const errorData = await statusResponse.json();
      return res.status(statusResponse.status).json({ error: errorData.error?.message || 'No se pudo obtener el estado del run.' });
    }

    const runStatus = await statusResponse.json();

    // 2. Si el "run" NO está completado, devolvemos el estado actual para que el cliente decida si sigue sondeando.
    if (['queued', 'in_progress', 'requires_action'].includes(runStatus.status)) {
      return res.json({ status: runStatus.status, message: null });
    }

    // 3. Si el "run" SÍ está completado, buscamos el mensaje de respuesta.
    if (runStatus.status === 'completed') {
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${OPENAI_THREAD_ID}/messages`, { headers: openaiHeaders });
      const messagesData = await messagesResponse.json();
      
      // Buscamos el último mensaje añadido por el asistente en este "run" específico.
      const assistantMessage = messagesData.data.find((m: any) => m.run_id === runId && m.role === 'assistant');

      if (assistantMessage && assistantMessage.content[0].type === 'text') {
        return res.json({ status: 'completed', message: assistantMessage.content[0].text.value });
      }
    }

    // 4. Si el "run" terminó en un estado diferente (failed, cancelled, etc.) o no hubo mensaje, lo informamos.
    res.json({ status: runStatus.status, message: 'El run finalizó sin una respuesta de texto visible.' });

  } catch (error) {
    console.error(`❌ Error en /chat/status/:runId :`, error);
    res.status(500).json({ error: 'Error interno del servidor al verificar el estado.' });
  }
});

// --- Iniciar el Servidor ---
app.listen(PORT, () => console.log(`✅ Servidor Express escuchando en el puerto ${PORT}`));