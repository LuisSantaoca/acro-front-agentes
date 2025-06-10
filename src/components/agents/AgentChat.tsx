'use client'

import { useEffect, useRef, useState } from 'react'
import {
    Card, CardHeader, CardTitle, CardDescription,
    CardContent, CardFooter
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Message } from '@/types/messages'
import { Bot } from 'lucide-react'

type AgentChatProps = {
    agentName: string
}

export default function AgentChat({
    agentName,
}: AgentChatProps) {

    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState('')
    const chatContainerRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // INICIO BLOQUE: EFECTO DE SIMULACIÓN CON LA NUEVA CONVERSACIÓN
    useEffect(() => {
        let isMounted = true;
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        const runSimulation = async () => {
            while (isMounted) {
                // --- INICIO DE LA NUEVA SECUENCIA DE CONVERSACIÓN ---

                // 1. Limpiar e iniciar ciclo
                if (!isMounted) break;
                setMessages([]);
                await delay(1500);

                // 2. Chat: Saludo inicial
                if (!isMounted) break;
                setMessages([{ role: 'agent', content: 'Buenos dias Jorge, que información de tus ranchos necesitas conocer hoy:' }]);
                await delay(3000);

                // 3. Jorge: Pide reporte
                if (!isMounted) break;
                setMessages(prev => [...prev, { role: 'user', content: 'Enviame el reporte de trips del Rancho La Rosita.' }]);
                await delay(2500);

                // 4. Chat: Pregunta por el sector
                if (!isMounted) break;
                setMessages(prev => [...prev, { role: 'agent', content: 'De que sector.' }]);
                await delay(2000);

                // 5. Jorge: Especifica el sector
                if (!isMounted) break;
                setMessages(prev => [...prev, { role: 'user', content: 'Del sector 4' }]);
                setLoading(true); // El asistente empieza a trabajar
                await delay(2500);

                // 6. Chat: Confirma y prepara
                if (!isMounted) break;
                setMessages(prev => [...prev, { role: 'agent', content: 'Preparo el reporte del sector 4.' }]);
                await delay(3000);

                // 7. Chat: Entrega el resumen de riesgo
                if (!isMounted) break;
                setLoading(false); // El asistente termina de pensar
                setMessages(prev => [...prev, { role: 'agent', content: 'Basado en los datos, el nivel de riesgo actual es alto debido a los altos porcentajes de condiciones óptimas y la alta cantidad de grados-día acumulados. Las condiciones son suficientes para mantener poblaciones activas, y el crecimiento podría ser más rápido dada la superposición generacional.' }]);
                await delay(7000); // Pausa larga para leer el resumen

                // 8. Jorge: Pide datos específicos
                if (!isMounted) break;
                setMessages(prev => [...prev, { role: 'user', content: 'Dame los datos especificos.' }]);
                setLoading(true); // El asistente busca los datos
                await delay(2500);

                // 9. Chat: Entrega los datos punto por punto
                if (!isMounted) break;
                setLoading(false);
                setMessages(prev => [...prev, { role: 'agent', content: '- Grados-día acumulados (últimos 45 días): 679.413 GD. Esto indica que se han completado aproximadamente 3.2 generaciones del trips, lo que sugiere una presión poblacional significativa debido a la superposición de generaciones.' }]);
                await delay(5000);

                if (!isMounted) break;
                setMessages(prev => [...prev, { role: 'agent', content: '- Porcentaje del tiempo con temperatura óptima (últimos 14 días): 23.95%.' }]);
                await delay(4000);
                
                if (!isMounted) break;
                setMessages(prev => [...prev, { role: 'agent', content: '- Porcentaje del tiempo con humedad relativa óptima (últimos 14 días): 25.93%' }]);
                await delay(4000);

                if (!isMounted) break;
                setMessages(prev => [...prev, { role: 'agent', content: '- Temperatura y Humedad Relativa: Los porcentajes de 23.95% para temperatura y 25.93% para humedad relativa son altamente favorables, permitiendo un crecimiento rápido de las poblaciones del trips.' }]);
                
                // Pausa final antes de reiniciar la simulación
                await delay(10000);
            }
        };

        runSimulation();

        return () => {
            isMounted = false;
        };
    }, []);
    // FIN BLOQUE

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <Card className="chat-width shadow bg-background text-text">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback className="bg-gray-100">
                            <Bot className="w-6 h-6 text-indigo-500" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{agentName}</CardTitle>
                        <CardDescription>Asistente para el Rancho La Rosita</CardDescription>
                    </div>
                </div>
            </CardHeader>

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
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="text-sm text-gray-400 italic">El asistente está pensando…</div>
                )}
            </CardContent>

            <CardFooter>
                <form onSubmit={handleSend} className="w-full flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Interacción deshabilitada para la simulación"
                        className="flex-1 input-style"
                        disabled={true}
                    />
                    <Button
                        type="submit"
                        disabled={true}
                        className="button-style"
                    >
                        Enviar
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}