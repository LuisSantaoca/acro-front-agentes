import { useState } from 'react'
import { sendMessageToAgent } from '@/lib/chatService'

interface ChatbotProps {
    agentName: string
    webhook: string
}

const Chatbot = ({ agentName, webhook }: ChatbotProps) => {
    const [input, setInput] = useState('')
    const [respuesta, setRespuesta] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const message = { role: 'user', content: input }
        const result = await sendMessageToAgent(webhook, message, agentName)
        setRespuesta(result.content)
    }

    return (
        <div className="chatbot-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu mensaje"
                    className="border border-gray-300 rounded p-2 w-full"
                />
                <button type="submit" className="mt-2 bg-blue-500 text-white rounded p-2">
                    Enviar
                </button>
            </form>
            {respuesta && (
                <div className="mt-4 p-4 bg-white rounded shadow">
                    <strong>Respuesta:</strong> {respuesta}
                </div>
            )}
        </div>
    )
}

export default Chatbot
