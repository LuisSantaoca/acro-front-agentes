import { z } from 'zod';

// La URL base de tu API de backend.
// Asegúrate de que apunte a donde tu servidor está desplegado.
const API_BASE = "https://api.elathia.ai"; 
// Para desarrollo local, podrías usar: const API_BASE = "http://localhost:3001";

// --- Definición de Schemas con Zod para validación y tipado ---

// Schema para la respuesta inicial del POST /chat.
// Esta parte no cambia.
const initialResponseSchema = z.object({
  runId: z.string({ required_error: 'El campo runId es esperado en la respuesta.' }),
});

// Schema para la respuesta del GET /chat/status/:runId.
// ESTA ES LA PARTE CORREGIDA:
// Ahora esperamos un objeto que siempre contiene un 'status' y un 'message' que puede ser nulo.
const statusResponseSchema = z.object({
  status: z.enum([
    'queued', 
    'in_progress', 
    'completed', 
    'failed', 
    'requires_action', 
    'cancelling', 
    'cancelled', 
    'expired'
  ]),
  message: z.string().nullable(), // El mensaje es un string o nulo
});


// --- Inferencia de Tipos desde los Schemas ---

// Tipo para la respuesta al iniciar el chat.
type InitialChatResponse = z.infer<typeof initialResponseSchema>;

// Exportamos el nuevo tipo para usarlo en el componente React.
// Esto proporciona autocompletado y seguridad de tipos.
export type StatusChatResponse = z.infer<typeof statusResponseSchema>;


// --- Funciones de Servicio para interactuar con el Backend ---

/**
 * Envía un nuevo prompt al backend para iniciar un "run" del asistente.
 * @param prompt El mensaje del usuario.
 * @returns Una promesa que resuelve a un objeto con el `runId`.
 */
export async function sendChatPrompt(prompt: string): Promise<InitialChatResponse> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    // Intenta parsear el error del backend para dar un mensaje más específico.
    const errorBody = await response.json().catch(() => ({ error: 'Error desconocido al enviar el mensaje.' }));
    throw new Error(errorBody.error || `Error ${response.status} al enviar el mensaje.`);
  }

  const data = await response.json();
  return initialResponseSchema.parse(data);
}

/**
 * Consulta el estado actual de un "run" específico.
 * @param runId El ID del "run" que se está sondeando.
 * @returns Una promesa que resuelve al estado actual del run y el mensaje si está disponible.
 */
export async function getChatStatus(runId: string): Promise<StatusChatResponse> {
  const response = await fetch(`${API_BASE}/chat/status/${runId}`);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Error desconocido al obtener el estado.' }));
    // El error 404 es común si el runId es inválido.
    throw new Error(errorBody.error || `Error ${response.status} al obtener el estado del chat.`);
  }

  const data = await response.json();
  // Valida que la respuesta del backend coincida con el schema esperado.
  return statusResponseSchema.parse(data);
}

