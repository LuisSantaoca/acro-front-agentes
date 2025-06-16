// Archivo: LandingChatInteractivo.tsx
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { sendChatPrompt, getChatStatus } from '@/lib/openaiChatService';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const messageSchema = z.object({
  message: z.string().min(1, 'Por favor escribe un mensaje antes de enviar.'),
});

interface Message {
  role: 'user' | 'agent';
  content: string;
  status?: 'sending' | 'sent';
  timestamp: string;
}

const LandingChatInteractivo = () => {
  // Inicio bloque estado inicial y localStorage
  const [message, setMessage] = useState('');
  const [threadId, setThreadId] = useState<string | null>(() => localStorage.getItem('threadId'));
  const [runId, setRunId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (threadId) localStorage.setItem('threadId', threadId);
  }, [threadId]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  // Fin bloque estado inicial y localStorage

  // Inicio bloque mutación envío mensaje
  const mutation = useMutation({
    mutationFn: ({ prompt, threadId }: { prompt: string; threadId?: string }) =>
      sendChatPrompt(prompt, threadId),
    onSuccess: ({ threadId, runId }) => {
      setThreadId(threadId);
      setRunId(runId);
      setLoading(true);
    },
    onError: () => {
      toast.error('No se pudo enviar el mensaje.');
      setMessages((prev) => prev.slice(0, -1));
      setLoading(false);
    },
  });
  // Fin bloque mutación envío mensaje

  // Inicio bloque polling respuesta
  useEffect(() => {
    if (!runId || !threadId) return;

    const intervalId = setInterval(async () => {
      try {
        const { message: content } = await getChatStatus(threadId, runId);

        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === 'agent' && lastMessage.content === content) {
            return prev;
          }
          return [...prev, { role: 'agent', content, timestamp: new Date().toLocaleTimeString() }];
        });

        setLoading(false);
        setRunId(null);
        clearInterval(intervalId);
      } catch (error) {
        console.log('Esperando respuesta del servidor...');
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [runId, threadId]);
  // Fin bloque polling respuesta

  // Inicio bloque manejar envío mensaje
  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    const parsed = messageSchema.safeParse({ message });

    if (!parsed.success) {
      setMessages((prev) => [
        ...prev,
        { role: 'agent', content: parsed.error.errors[0].message, timestamp: new Date().toLocaleTimeString() },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: parsed.data.message, status: 'sending', timestamp: new Date().toLocaleTimeString() },
    ]);

    mutation.mutate({ prompt: parsed.data.message, threadId: threadId || undefined });
    setMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  // Fin bloque manejar envío mensaje

  // Inicio bloque copiar mensaje
  const copiarTexto = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      toast.success('Mensaje copiado al portapapeles');
    } catch {
      toast.error('Error al copiar mensaje');
    }
  };
  // Fin bloque copiar mensaje

  // Inicio bloque UI componente
  return (
    <motion.div className="mx-auto max-w-4xl px-6 py-8 font-sans text-gray-700 bg-[#FAFAFA]">
      <Card className="shadow-2xl rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-[#4F46E5] to-[#6366F1] rounded-t-2xl">
          <CardTitle className="text-white">Chat Interactivo ACRO</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={chatContainerRef} className="max-h-72 overflow-y-auto">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`p-2 my-2 rounded-xl ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
                  <p>{msg.content}</p>
                  <button onClick={() => copiarTexto(msg.content)}>📋</button>
                </motion.div>
              ))}
              {loading && <div>Enviando...</div>}
            </AnimatePresence>
          </div>
          <form onSubmit={handleSubmit}>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} />
            <Button type="submit">Enviar</Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
  // Fin bloque UI componente
};

export default LandingChatInteractivo;

