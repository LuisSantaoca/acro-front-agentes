
import { z } from 'zod'



const chatResponseSchema = z.object({

  role: z.string(),

  content: z.string(),

})



type ChatResponse = z.infer<typeof chatResponseSchema>



export async function sendChatPrompt(prompt: string): Promise<ChatResponse> {

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

  return chatResponseSchema.parse(data)

}

