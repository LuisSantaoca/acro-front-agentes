const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantId = process.env.OPENAI_ASSISTANT_ID;
const threadId = process.env.OPENAI_THREAD_ID;

async function enviarMensaje(prompt) {
  try {
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: prompt,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    console.log("✅ Mensaje enviado correctamente.");
    console.log("🔎 Usando threadId:", threadId);
    console.log("🟢 runId generado:", run.id);

  } catch (error) {
    console.error("❌ Error al interactuar con OpenAI:", error);
  }
}

enviarMensaje("Mensaje de prueba directo al thread");
