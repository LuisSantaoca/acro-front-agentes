// Archivo: src/lib/openaiChatService.ts

import { z } from 'zod';

const initialResponseSchema = z.object({
  message: z.string(),
  threadId: z.string(),
  runId: z.string(),
});

const finalResponseSchema = z.object({
  message: z.string(),
});

type InitialChatResponse = z.infer<typeof initialResponseSchema>;
type FinalChatResponse = z.infer<typeof finalResponseSchema>;

const API_BASE = "https://api.elathia.ai";

export async function sendChatPrompt(prompt: string, threadId?: string): Promise<InitialChatResponse> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, threadId }),
  });

  if (!response.ok) {
    throw new Error('Error al enviar el mensaje al servidor');
  }

  const data = await response.json();
  return initialResponseSchema.parse(data);
}

export async function getChatStatus(threadId: string, runId: string): Promise<FinalChatResponse> {
  const response = await fetch(`${API_BASE}/chat/status/${threadId}/${runId}`);

  if (!response.ok) {
    throw new Error('Error al obtener estado del chat');
  }

  const data = await response.json();
  return finalResponseSchema.parse(data);
}


