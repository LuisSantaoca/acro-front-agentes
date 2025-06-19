import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendChatPrompt, getChatStatus } from '@/lib/openaiChatService';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'agent' | 'status';
  content: string;
}

const OpenAIChat = () => {
  const [message, setMessage] = useState('');
  const [runId, setRunId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const mutation = useMutation({
    mutationFn: (prompt: string) => sendChatPrompt(prompt),
    onSuccess: (data) => {
      setRunId(data.runId);
    },
    onError: () => {
      toast.error('No se pudo enviar el mensaje.');
      setMessages(prev => prev.slice(0, -2));
    },
  });

  useEffect(() => {
    if (!runId) return;

    const intervalId = setInterval(async () => {
      try {
        const response = await getChatStatus(runId);
        if (response.message) {
          setMessages(prev => [
            ...prev.filter(msg => msg.role !== 'status'),
            { role: 'agent', content: response.message },
          ]);
          clearInterval(intervalId);
          setRunId(null);
        }
      } catch (error) {
        toast.error('Error al obtener respuesta.');
        clearInterval(intervalId);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [runId]);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (!message.trim()) {
      toast.error('El mensaje no puede estar vacío.');
      return;
    }

    setMessages(prev => [
      ...prev,
      { role: 'user', content: message },
      { role: 'status', content: 'Enviando...' },
    ]);

    mutation.mutate(message);
    setMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div ref={chatContainerRef} className="h-72 overflow-auto rounded-lg border p-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`my-2 p-2 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-100 text-right' :
              msg.role === 'agent' ? 'bg-gray-100 text-left' :
              'text-center text-sm text-gray-500'
            }`}>
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje aquí..."
        />
        <Button type="submit" className="bg-blue-500">Enviar</Button>
      </form>
    </div>
  );
};

export default OpenAIChat;


