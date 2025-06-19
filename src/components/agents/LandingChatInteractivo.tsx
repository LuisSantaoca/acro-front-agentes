import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { sendChatPrompt, getChatStatus, type StatusChatResponse } from '@/lib/openaiChatService';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Nota: Si aún no tienes un QueryClientProvider en tu app, necesitarás uno.
// Por lo general, se coloca en el archivo raíz de tu aplicación (App.tsx o main.tsx).
// const queryClient = new QueryClient();
// <QueryClientProvider client={queryClient}> <TuApp /> </QueryClientProvider>

const OpenAIChatSimple = () => {
  // Estado para el input del usuario
  const [prompt, setPrompt] = useState('');
  // Estado para la respuesta final del asistente
  const [response, setResponse] = useState('');
  // Estado para almacenar el ID del "run" mientras está en progreso
  const [runId, setRunId] = useState<string | null>(null);

  // --- HOOKS DE REACT QUERY ---

  // 1. MUTACIÓN: Se usa solo para INICIAR la tarea en el backend.
  // Su única responsabilidad es llamar a sendChatPrompt y obtener el runId.
  const mutation = useMutation({
    mutationFn: sendChatPrompt, // Llama a la función que hace POST /chat
    onSuccess: (data) => {
      // Cuando la mutación tiene éxito, limpiamos la respuesta anterior
      // y guardamos el runId para que el hook useQuery pueda empezar a sondear.
      setResponse('');
      setRunId(data.runId);
    },
    onError: (error) => {
      toast.error(`Error al iniciar el chat: ${error.message}`);
    },
  });

  // 2. QUERY: Se usa para SONDEAR el estado del "run" de forma eficiente.
  const { data: statusData, isLoading: isPolling } = useQuery({
    // La clave de la query incluye el runId, por lo que cada "run" tiene su propio caché.
    queryKey: ['chatStatus', runId],
    // La función que se ejecutará para obtener los datos.
    queryFn: () => getChatStatus(runId!),
    // Opciones clave para controlar el sondeo:
    enabled: !!runId, // El query solo se ejecutará si `runId` no es nulo.
    refetchInterval: (query) => {
      const data = query.state.data as StatusChatResponse | undefined;
      // Detiene el sondeo si el "run" ha terminado (completado o fallido).
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false;
      }
      // De lo contrario, vuelve a preguntar en 2 segundos.
      return 2000;
    },
    refetchOnWindowFocus: false, // Opcional: previene sondeos al cambiar de pestaña.
    retry: 2, // Opcional: reintenta 2 veces si el sondeo falla.
  });

  // 3. EFFECT: Reacciona a los cambios en los datos del sondeo (statusData).
  useEffect(() => {
    // Cuando el estado del "run" es "completed"...
    if (statusData?.status === 'completed') {
      // ...actualizamos el estado de la respuesta con el mensaje recibido.
      setResponse(statusData.message || 'El asistente no proporcionó una respuesta de texto.');
      // ...y reseteamos el runId a nulo, lo que detiene automáticamente el hook `useQuery`.
      setRunId(null);
    } else if (statusData?.status === 'failed') {
      toast.error('La solicitud al asistente ha fallado.');
      setRunId(null);
    }
  }, [statusData]);

  // --- MANEJADORES Y ESTADO DERIVADO ---

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || mutation.isPending) {
      return;
    }
    mutation.mutate(prompt); // Inicia la mutación con el prompt del usuario
  };

  // El estado de carga general es verdadero si la mutación inicial está en curso
  // O si el sondeo de `useQuery` está activo.
  const isLoading = mutation.isPending || isPolling;

  return (
    <Card className="mx-auto max-w-xl mt-10 shadow-lg">
      <CardHeader className="bg-blue-500 text-white">
        <CardTitle>Chat Simple con OpenAI</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Escribe tu mensaje..."
            // Deshabilitar el área de texto mientras se espera una respuesta
            disabled={isLoading}
            className="mb-4"
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {/* Cambiar el texto del botón según el estado de carga */}
            {isLoading ? 'Pensando...' : 'Enviar'}
          </Button>
        </form>

        {/* Mostrar un indicador de carga mientras el sondeo está activo */}
        {isLoading && (
          <div className="mt-4 p-4 text-center text-gray-500">
            <p>El asistente está procesando tu solicitud...</p>
          </div>
        )}

        {/* Mostrar la respuesta final solo cuando esté disponible */}
        {response && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <strong>Respuesta:</strong>
            <p className="whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OpenAIChatSimple;