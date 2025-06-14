// INICIO: Importación de Zod para validaciones
import { z } from 'zod'
// FIN: Importación de Zod para validaciones

// INICIO: Esquema adaptado al nuevo formato de respuesta del asistente
const chatResponseSchema = z.object({
  message: z.object({
    type: z.literal('text'),
    text: z.object({
      value: z.string(),
      annotations: z.array(z.any()).optional(),
    }),
  }),
})
// FIN: Esquema adaptado al nuevo formato de respuesta del asistente

// INICIO: Tipado derivado claramente del esquema
type ChatResponse = z.infer<typeof chatResponseSchema>
// FIN: Tipado derivado claramente del esquema

// INICIO: Función adaptada para enviar prompts al backend
export async function sendChatPrompt(prompt: string): Promise<string> {
  const response = await fetch('http://localhost:3001/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  })

  if (!response.ok) {
    throw new Error('Error al enviar el mensaje al servidor')
  }

  const data = await response.json()
  const parsedData = chatResponseSchema.parse(data)

  // Devuelve claramente el contenido textual del mensaje del asistente
  return parsedData.message.text.value
}
// FIN: Función adaptada para enviar prompts al backend
