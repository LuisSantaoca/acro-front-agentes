import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { sendChatPrompt } from '@/lib/openaiChatService';

const messageSchema = z.object({
  message: z.string().min(1, 'Por favor escribe un mensaje antes de enviar.'),
});

const LandingChatInteractivo = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const mutation = useMutation({
    mutationFn: sendChatPrompt,
    onSuccess: (data) => {
      setResponse(data.content);
    },
    onError: () => {
      setResponse('Hubo un problema al conectar con el asistente.');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = messageSchema.safeParse({ message });
    if (!parsed.success) {
      setResponse(parsed.error.errors[0].message);
      return;
    }
    mutation.mutate(parsed.data.message);
    setMessage('');
  };

  return (
    <div className="mx-auto max-w-3xl p-6 bg-white rounded-xl shadow-xl">
      <h2 className="mb-4 text-2xl font-bold text-indigo-800">Chat Interactivo ACRO</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="w-full border rounded-lg p-4 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
          placeholder="Escribe aquí tu consulta institucional..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
        <button
          type="submit"
          className="self-end bg-indigo-600 text-white font-semibold py-2 px-6 rounded-full transition-transform hover:scale-105 hover:bg-indigo-500 shadow-lg"
        >
          Enviar consulta
        </button>
      </form>
      {response && (
        <div className="mt-6 p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-lg shadow-sm">
          <p className="text-indigo-800">{response}</p>
        </div>
      )}
    </div>
  );
};

export default LandingChatInteractivo;
