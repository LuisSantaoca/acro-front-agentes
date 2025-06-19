import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendChatPrompt, getChatStatus } from '@/lib/openaiChatService';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const LandingChatInteractivo = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      const { runId } = await sendChatPrompt(prompt);

      let finalResponse;
      do {
        await new Promise(r => setTimeout(r, 2000));
        finalResponse = await getChatStatus(runId);
      } while (finalResponse.message === null); // ✅ espera hasta que haya respuesta real

      return finalResponse.message!;
    },
    onSuccess: (message) => setResponse(message),
    onError: () => toast.error('Error al procesar el mensaje del asistente.'),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Por favor escribe un mensaje antes de enviar.');
      return;
    }
    mutation.mutate(prompt);
  };

  return (
    <Card className="mx-auto max-w-xl mt-10 shadow-lg">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle>Chat interactivo con OpenAI</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="mb-4"
          />
          <Button type="submit" className="w-full" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Enviando...' : 'Enviar'}
          </Button>
        </form>
        {response && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <strong>Respuesta del agente:</strong>
            <p>{response}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LandingChatInteractivo;
