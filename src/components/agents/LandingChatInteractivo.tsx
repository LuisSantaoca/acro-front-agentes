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
  role: 'user' | 'agent' | 'status';
  content: string;
  timestamp: string;
}

const LandingChatInteractivo = () => {
  const [message, setMessage] = useState('');
  const [runId, setRunId] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const mutation = useMutation({
    mutationFn: ({ prompt, threadId }: { prompt: string; threadId: string | null }) => sendChatPrompt(prompt, threadId),
    onSuccess: ({ runId, threadId }) => {
      setRunId(runId);
      setThreadId(threadId);
    },
    onError: () => {
      toast.error('No se pudo enviar el mensaje.');
      setMessages(prev => prev.slice(0, -2));
    },
  });

  useEffect(() => {
    if (!runId || !threadId) return;

    const intervalId = setInterval(async () => {
      try {
        const response = await getChatStatus(threadId, runId);
        if (response && response.message) {
          setMessages(prev => [
            ...prev.filter(msg => msg.role !== 'status'),
            { role: 'agent', content: response.message, timestamp: new Date().toLocaleTimeString() },
          ]);
          clearInterval(intervalId);
          setRunId(null);
          setThreadId(null);
        }
      } catch (error) {
        toast.error('Error al obtener respuesta del servidor.');
        clearInterval(intervalId);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [runId, threadId]);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    const parsed = messageSchema.safeParse({ message });

    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setMessages(prev => [
      ...prev,
      { role: 'user', content: parsed.data.message, timestamp: new Date().toLocaleTimeString() },
      { role: 'status', content: 'Enviando...', timestamp: new Date().toLocaleTimeString() },
    ]);

    mutation.mutate({ prompt: parsed.data.message, threadId });
    setMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-2 my-2 rounded-xl ${
                    msg.role === 'user'
                      ? 'bg-blue-100 text-right'
                      : msg.role === 'agent'
                      ? 'bg-gray-100 text-left'
                      : 'text-center text-sm text-gray-500'
                  }`}
                >
                  {msg.content}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <form onSubmit={handleSubmit}>
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button type="submit">Enviar</Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LandingChatInteractivo;
