// src/components/LandingChatInteractivo.tsx

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { sendChatPrompt, getChatStatus } from '@/lib/openaiChatService';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { RotateCw, AlertTriangle } from 'lucide-react';

// --- Constantes y Tipos ---

const MAX_POLL_RETRIES = 5;

const messageInputSchema = z.object({
  prompt: z.string().min(1, 'Por favor, escribe un mensaje antes de enviar.'),
});

type Message = {
  id: string;
  role: 'user' | 'agent' | 'status';
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'failed';
};

// --- Componente ---

export const LandingChatInteractivo = () => {
  // --- Estado del Componente ---

  const [prompt, setPrompt] = useState('');
  const [runId, setRunId] = useState<string | null>(null);
  
  const [threadId, setThreadId] = useState<string | null>(() => {
    return localStorage.getItem('chatThreadId');
  });
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [pollRetries, setPollRetries] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // --- Efectos Laterales (Side Effects) ---

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (threadId) {
      localStorage.setItem('chatThreadId', threadId);
    } else {
      localStorage.removeItem('chatThreadId');
    }
  }, [threadId]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // --- Lógica de Mutación y Sondeo (Polling) ---

  const mutation = useMutation({
    mutationFn: (variables: { prompt: string; threadId: string | null }) => 
      sendChatPrompt(variables.prompt, variables.threadId),
    
    onMutate: async (variables) => {
      const tempId = `temp_${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: tempId,
          role: 'user',
          content: variables.prompt,
          timestamp: new Date().toLocaleTimeString(),
          status: 'sending',
        },
        {
          id: `status_${tempId}`,
          role: 'status',
          content: 'El agente está escribiendo...',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setPrompt('');
      return { tempId };
    },

    onSuccess: (data, _variables, context) => {
      setRunId(data.runId);
      setThreadId(data.threadId);
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === context?.tempId ? { ...msg, status: 'sent' } : msg
        )
      );
    },

    onError: (_error, _variables, context) => {
      toast.error('No se pudo enviar el mensaje.');
      setMessages((prev) =>
        prev
          .filter(msg => msg.id !== `status_${context?.tempId}`)
          .map(msg =>
            msg.id === context?.tempId ? { ...msg, status: 'failed' } : msg
          )
      );
    },
  });

  useEffect(() => {
    if (!runId || !threadId) return;

    const intervalId = setInterval(async () => {
      try {
        // <<< LA CORRECCIÓN CLAVE ESTÁ AQUÍ >>>
        // Se asegura que los parámetros se pasen en el orden correcto: (threadId, runId)
        const response = await getChatStatus(threadId, runId);
        
        if (response && response.message) {
          clearInterval(intervalId);
          setRunId(null);
          setPollRetries(0);
          setMessages((prev) => [
            ...prev.filter((msg) => msg.role !== 'status'),
            {
              id: `agent_${Date.now()}`,
              role: 'agent',
              content: response.message,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      } catch (error) {
        const newRetryCount = pollRetries + 1;
        setPollRetries(newRetryCount);
        console.error(`Intento de sondeo ${newRetryCount} fallido.`);

        if (newRetryCount >= MAX_POLL_RETRIES) {
          clearInterval(intervalId);
          setRunId(null);
          setPollRetries(0);
          toast.error('No se pudo obtener una respuesta del servidor.');
          setMessages((prev) => [
            ...prev.filter((msg) => msg.role !== 'status'),
            {
              id: `status_error_${Date.now()}`,
              role: 'status',
              content: 'Error al conectar con el servidor. Por favor, inténtalo más tarde.',
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [runId, threadId, pollRetries]);

  // --- Manejadores de Eventos ---
  
  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (mutation.isPending) return;

    const parsed = messageInputSchema.safeParse({ prompt });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    mutation.mutate({ prompt: parsed.data.prompt, threadId });
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleRetry = (failedMessage: Message) => {
    setMessages(prev => prev.filter(msg => msg.id !== failedMessage.id));
    mutation.mutate({ prompt: failedMessage.content, threadId });
  };

  // --- Renderizado del Componente ---

  return (
    <motion.div className="mx-auto max-w-2xl px-4 py-8 font-sans">
      <Card className="shadow-lg rounded-xl w-full">
        <CardHeader className="bg-gray-800 rounded-t-xl">
          <CardTitle className="text-white text-center">Asistente Interactivo ACRO</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div ref={chatContainerRef} className="h-96 overflow-y-auto space-y-4 p-4 border rounded-lg bg-gray-50">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'user' && msg.status === 'failed' && (
                    <div className="text-red-500 flex items-center gap-1">
                      <AlertTriangle size={16} />
                      <button onClick={() => handleRetry(msg)} className="underline text-xs">Reintentar</button>
                    </div>
                  )}

                  <div
                    className={`max-w-md p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : msg.role === 'agent'
                        ? 'bg-gray-200 text-gray-800 rounded-bl-none'
                        : 'w-full text-center text-sm text-gray-500 bg-transparent'
                    } ${msg.status === 'sending' ? 'opacity-60' : ''}`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje aquí..."
              rows={1}
              disabled={mutation.isPending}
              className="flex-1 resize-none p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" disabled={mutation.isPending} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
              {mutation.isPending ? <RotateCw className="animate-spin" /> : 'Enviar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LandingChatInteractivo;
