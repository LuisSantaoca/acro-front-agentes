// INICIO: Importar dependencias
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';
// FIN: Importar dependencias

// INICIO: Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// FIN: Configuración inicial Express y OpenAI

// INICIO: Middlewares de Express
app.use(express.json());
app.use(cors());
// FIN: Middlewares de Express

// INICIO: Ruta raíz para comprobar servidor
app.get('/', (req, res) => {
  res.send('Servidor backend OpenAI funcionando correctamente.');
});
// FIN: Ruta raíz para comprobar servidor

// INICIO: Ruta POST para interactuar con OpenAI usando asistente e hilo persistentes
app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  // Variables claramente asignadas aquí mismo para evitar pérdida de contexto
  const threadId = process.env.OPENAI_THREAD_ID;
  const assistantId = process.env.OPENAI_ASSISTANT_ID;

  console.log("Variables justo antes de llamar a OpenAI:", { threadId, assistantId });

  if (!threadId || !assistantId) {
    console.error("Error crítico: Variables faltantes", { threadId, assistantId });
    return res.status(500).json({ error: 'Variables necesarias no cargadas correctamente.' });
  }

  try {
    // Añadir mensaje del usuario al hilo específico
    await openai.beta.threads.messages.create(
      threadId,
      { role: 'user', content: prompt }
    );

    // Crear ejecución (run) del asistente específico
    const run = await openai.beta.threads.runs.create(
      threadId,
      { assistant_id: assistantId }
    );

    // Esperar que el asistente complete la ejecución
    let runStatus;
    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(
        threadId,
        run.id
      );
    } while (runStatus.status === 'queued' || runStatus.status === 'in_progress');

    // Recuperar mensajes generados por el asistente
    const messages = await openai.beta.threads.messages.list(threadId);

    // Enviar respuesta más reciente generada por el asistente
    const responseMessage = messages.data.find(m => m.role === 'assistant');
    res.json({ message: responseMessage?.content[0] });

  } catch (error) {
    console.error("Error detallado:", error);
    res.status(500).json({ error: 'Error al conectar con OpenAI Assistants API' });
  }
});
// FIN: Ruta POST para interactuar con OpenAI usando asistente e hilo persistentes

// INICIO: Escuchar en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
// FIN: Escuchar en el puerto definido