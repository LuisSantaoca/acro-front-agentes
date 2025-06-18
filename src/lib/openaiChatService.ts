import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '/var/www/agentes/config/backend.env' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantId = process.env.OPENAI_ASSISTANT_ID!;
const threadId = process.env.OPENAI_THREAD_ID!;

export async function sendChatPrompt(prompt: string) {
  await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: prompt,
  });

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });

  return {
    threadId,
    runId: run.id,
  };
}

export async function getChatStatus(runId: string) {
  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

  if (runStatus.status === 'completed') {
    const messages = await openai.beta.threads.messages.list(threadId);
    const latestMessage = messages.data.find(msg => msg.role === 'assistant');

    return { message: latestMessage?.content[0].text.value || 'Sin respuesta clara' };
  }

  throw new Error('El run aún no ha finalizado');
}

