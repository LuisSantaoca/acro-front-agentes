import { Message } from '@/types/messages'
import { z } from 'zod'

// Validación segura del objeto de respuesta
const agentResponseSchema = z.object({
    respuesta: z.string().optional(),
    formattedText: z.string().optional(),
})

export async function sendMessageToAgent(
    webhook: string,
    message: Message,
    agentName: string
): Promise<Message> {
    const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mensaje: message.content,
            agente: agentName,
        }),
    })

    if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`)
    }

    const raw = await res.json()
    const result = agentResponseSchema.safeParse(raw)

    if (!result.success) {
        console.warn('Respuesta inválida del agente:', raw)
        throw new Error('Respuesta inválida del agente')
    }

    const data = result.data
    const content =
        data.formattedText?.trim() ||
        data.respuesta?.trim() ||
        '⚠️ Sin respuesta del agente'

    return {
        role: 'agent',
        content,
        isHtml: !!data.formattedText,
    }
}
