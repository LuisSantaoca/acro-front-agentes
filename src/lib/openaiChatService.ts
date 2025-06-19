import { z } from 'zod';

const API_BASE = "https://api.elathia.ai";

const initialResponseSchema = z.object({
  runId: z.string(),
});

const finalResponseSchema = z.object({
  message: z.string(),
});

type InitialChatResponse = z.infer<typeof initialResponseSchema>;
type FinalChatResponse = z.infer<typeof finalResponseSchema>;

export async function sendChatPrompt(prompt: string): Promise<InitialChatResponse> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error('Error al enviar el mensaje al servidor.');
  }

  const data = await response.json();
  return initialResponseSchema.parse(data);
}

export async function getChatStatus(runId: string): Promise<FinalChatResponse> {
  const response = await fetch(`${API_BASE}/chat/status/${runId}`);

  if (!response.ok) {
    throw new Error('Error al obtener la respuesta del servidor.');
  }

  const data = await response.json();
  return finalResponseSchema.parse(data);
}


