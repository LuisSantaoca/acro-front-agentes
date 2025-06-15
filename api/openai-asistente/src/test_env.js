const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config({ path: '/home/santaoca/projects/acro/frontend/agentes/api/openai-asistente/.env' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function interactWithAssistant(prompt) {

  console.log("\n--- Interacción Literal (sin variables intermedias) ---");
  console.log("Assistant ID:", process.env.OPENAI_ASSISTANT_ID);
  console.log("Thread ID:", process.env.OPENAI_THREAD_ID);

  try {
    await openai.beta.threads.messages.create(process.env.OPENAI_THREAD_ID, {
      role: 'user',
      content: prompt
    });
    console.log("✅ Mensaje enviado correctamente.");

    const run = await openai.beta.threads.runs.create(process.env.OPENAI_THREAD_ID, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID
    });
    console.log("✅ Run creado correctamente:", run.id);

    let status;
    do {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Directamente usa literales sin variables
      status = await openai.beta.threads.runs.retrieve(
        process.env.OPENAI_THREAD_ID,
        run.id
      );
      
      console.log("Estado actual del run:", status.status);
    } while (status.status === 'queued' || status.status === 'in_progress');

    console.log("✅ Run finalizado:", status.status);

    const messages = await openai.beta.threads.messages.list(process.env.OPENAI_THREAD_ID);
    const responseMessage = messages.data.find(m => m.role === 'assistant');
    const responseText = responseMessage?.content[0]?.text?.value;

    console.log("\n💬 Respuesta del asistente:", responseText);

  } catch (error) {
    console.error("Error al interactuar con OpenAI:", error);
  }
}

interactWithAssistant("Prueba con literales directos");
