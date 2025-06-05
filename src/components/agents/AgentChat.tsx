'use client'

import { useState } from 'react'
import {
    Card, CardHeader, CardTitle, CardDescription,
    CardContent, CardFooter
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type AgentChatProps = {
    agentName: string
    webhook: string
    logo: string
    fallback?: string
}

type Message = {
    role: 'user' | 'agent'
    content: string
    isHtml?: boolean
}

export default function AgentChat({
    agentName,
    webhook,
    logo,
    fallback = 'IA',
}: AgentChatProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage: Message = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const res = await fetch(webhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mensaje: userMessage.content,
                    agente: agentName,
                }),
            })

            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status}`)
            }

            const data = await res.json()

            const content =
                data.formattedText?.toString().trim() ||
                data.respuesta?.toString().trim() ||
                null

            if (!content) {
                console.warn('Respuesta inesperada del servidor:', data)
                setMessages(prev => [
                    ...prev,
                    { role: 'agent', content: '⚠️ Sin respuesta del agente' }
                ])
            } else {
                const agentMessage: Message = {
                    role: 'agent',
                    content,
                    isHtml: !!data.formattedText,
                }
                setMessages(prev => [...prev, agentMessage])
            }

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

    return (
        <Card className="max-w-xl mx-auto shadow">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={logo} />
                        <AvatarFallback>{fallback}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{agentName}</CardTitle>
                        <CardDescription>Tu asistente está listo para ayudarte</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="h-80 overflow-y-auto space-y-2">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`inline-block px-4 py-2 rounded-lg max-w-xs ${msg.role === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                            {...(msg.isHtml
                                ? { dangerouslySetInnerHTML: { __html: msg.content } }
                                : { children: msg.content })}
                        />
                    </div>
                ))}
                {loading && (
                    <div className="text-sm text-gray-400 italic">
                        El asistente está pensando…
                    </div>
                )}
            </CardContent>

            <CardFooter>
                <form onSubmit={handleSend} className="w-full flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe tu mensaje…"
                        className="flex-1"
                    />
                    <Button type="submit" disabled={loading}>
                        Enviar
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}
