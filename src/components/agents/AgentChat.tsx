'use client'

import { useEffect, useRef, useState } from 'react'
import {
    Card, CardHeader, CardTitle, CardDescription,
    CardContent, CardFooter
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { sendMessageToAgent } from '@/lib/chatService'
import { Message } from '@/types/messages'
import { Bot } from 'lucide-react'

type AgentChatProps = {
    agentName: string
    webhook: string
    fallback?: string
}

// INICIO COMPONENTE AgentChat: Componente principal para interacción del chat
export default function AgentChat({
    agentName,
    webhook,
    fallback = 'IA',
}: AgentChatProps) {

    // INICIO BLOQUE: Define clave para almacenamiento local específico del agente
    const storageKey = `agent_chat_history_${agentName}`
    // FIN BLOQUE

    // INICIO BLOQUE: Estado para mensajes del chat
    const [messages, setMessages] = useState<Message[]>([])
    // FIN BLOQUE

    // INICIO BLOQUE: Estados para manejo del input y estado de carga
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    // FIN BLOQUE

    // INICIO BLOQUE: Referencia para controlar desplazamiento automático al último mensaje
    const chatContainerRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }
    // FIN BLOQUE

    // INICIO BLOQUE: Carga inicial de mensajes desde localStorage y mensajes automáticos iniciales
    useEffect(() => {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
            setMessages(JSON.parse(saved))
            setMessages(prev => [
                ...prev,
                { role: 'agent', content: '👋 ¡Qué bueno que estás de nuevo! ¿Quieres información del sector 5?' }
            ])
        } else {
            setMessages([{ role: 'agent', content: '👋 Bienvenido, ¿en qué te puedo ayudar?' }])
        }
    }, [])
    // FIN BLOQUE

    // INICIO BLOQUE: Efecto para guardar mensajes en localStorage y desplazamiento automático al cambiar mensajes
    useEffect(() => {
        scrollToBottom()
        localStorage.setItem(storageKey, JSON.stringify(messages))
    }, [messages])
    // FIN BLOQUE

    // INICIO BLOQUE: Función para manejo del envío de mensajes del usuario
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage: Message = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const agentMessage = await sendMessageToAgent(webhook, userMessage, agentName)
            setMessages(prev => [...prev, agentMessage])
        } catch (err) {
            console.error('Error al contactar con el agente:', err)
            setMessages(prev => [
                ...prev,
                { role: 'agent', content: '⚠️ Error al conectar con el asistente' },
            ])
        } finally {
            setLoading(false)
        }
    }
    // FIN BLOQUE

    // INICIO BLOQUE: Renderización visual del chat (UI)
    return (
        <Card className="chat-width shadow bg-background text-text">
            {/* INICIO CABECERA DEL CHAT: Avatar y título */}
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback className="bg-gray-100">
                            <Bot className="w-6 h-6 text-indigo-500" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{agentName}</CardTitle>
                        <CardDescription>Tu asistente está listo para ayudarte</CardDescription>
                    </div>
                </div>
            </CardHeader>
            {/* FIN CABECERA DEL CHAT */}

            {/* INICIO ÁREA DE MENSAJES: Mensajes intercambiados entre usuario y agente */}
            <CardContent
                ref={chatContainerRef}
                className="h-80 overflow-y-auto space-y-2"
            >
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`inline-block px-4 py-2 rounded-lg max-w-xs ${msg.role === 'user'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-900'
                                }`}
                            {...(msg.isHtml
                                ? { dangerouslySetInnerHTML: { __html: msg.content } }
                                : { children: msg.content })}
                        />
                    </div>
                ))}

                {loading && (
                    <div className="text-sm text-gray-400 italic">El asistente está pensando…</div>
                )}
            </CardContent>
            {/* FIN ÁREA DE MENSAJES */}

            {/* INICIO FORMULARIO DE ENTRADA: Para enviar mensajes */}
            <CardFooter>
                <form onSubmit={handleSend} className="w-full flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe tu mensaje…"
                        className="flex-1 input-style"
                    />
                    <Button
                        type="submit"
                        disabled={loading}
                        className="button-style"
                    >
                        Enviar
                    </Button>
                </form>
            </CardFooter>
            {/* FIN FORMULARIO DE ENTRADA */}
        </Card>
    )
    // FIN BLOQUE: Renderización visual
}
// FIN COMPONENTE AgentChat