import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { sendChatPrompt } from '@/lib/openaiChatService';
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
  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [loading, setLoading] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const mutation = useMutation({
    mutationFn: sendChatPrompt,
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'user', content: prev[prev.length - 1].content, status: 'sent', timestamp: new Date().toLocaleTimeString() },
        { role: 'agent', content: data.content, timestamp: new Date().toLocaleTimeString() },
      ]);
      setLoading(false);
    },
    onError: () => {
      toast.error('Error de red: No se pudo conectar con el asistente.', {
        style: { border: '1px solid red' },
      });
      setMessages((prev) => prev.slice(0, -1));
      setLoading(false);
    },
  });

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    const parsed = messageSchema.safeParse({ message });

    if (!parsed.success) {
      setMessages((prev) => [...prev, { role: 'agent', content: parsed.error.errors[0].message, timestamp: new Date().toLocaleTimeString() }]);
      return;
    }

    setMessages((prev) => [...prev, { role: 'user', content: parsed.data.message, status: 'sending', timestamp: new Date().toLocaleTimeString() }]);
    setLoading(true);
    mutation.mutate(parsed.data.message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const typingAnimation = {
    animate: {
      scale: [0.8, 1, 0.8],
      transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  const copiarTexto = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      toast.success('Mensaje copiado al portapapeles');
    } catch (error) {
      toast.error('Error al copiar mensaje');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-4xl px-6 py-8 font-sans text-gray-700 bg-[#FAFAFA]"
    >
      <Card className="shadow-2xl rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-[#4F46E5] to-[#6366F1] rounded-t-2xl shadow-inner">
          <CardTitle className="text-3xl font-semibold text-center text-white py-2">
            Chat Interactivo ACRO
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div ref={chatContainerRef} className="max-h-72 overflow-y-auto space-y-3 pr-4">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: msg.status === 'sending' ? 0.6 : 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-xl shadow-md relative group ${msg.role === 'agent' ? 'bg-white' : 'bg-[#E0E7FF] self-end'}`}
                >
                  <p className="text-[#374151] font-medium">{msg.content}</p>
                  <div className="absolute -top-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button onClick={() => copiarTexto(msg.content)} className="bg-gray-200 p-1 rounded">📋</button>
                    <span className="ml-2 text-xs text-gray-500">{msg.timestamp}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-gray-200 rounded-xl shadow-md animate-pulse" />}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Textarea
              placeholder="Escribe aquí tu consulta institucional..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="resize-none text-lg p-4 rounded-xl shadow-inner border-[#4F46E5] focus:border-[#6366F1] focus:ring-2 focus:ring-[#E0E7FF]"
              rows={3}
            />

            <Button type="submit" className="self-end bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:from-[#6366F1] hover:to-[#4F46E5] transition-transform duration-200 hover:scale-110 text-white font-medium shadow-xl px-8 py-3 rounded-full">
              Enviar consulta
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LandingChatInteractivo;