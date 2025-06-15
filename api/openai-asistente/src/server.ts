import express, { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

// --- CONFIGURACIÓN Y VALIDACIÓN (Sin cambios, ya es robusto) ---
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const { PORT = 3001, OPENAI_API_KEY, OPENAI_ASSISTANT_ID } = process.env;
if (!OPENAI_API_KEY || !OPENAI_ASSISTANT_ID) {
    console.error('❌ Error: Faltan OPENAI_API_KEY o OPENAI_ASSISTANT_ID. Verifica tu archivo .env');
    process.exit(1);
}

// --- CAPA DE SERVICIO (Lógica de Negocio de OpenAI) ---
// En un proyecto real, esto iría en `src/services/openai.service.ts`

// Interfaces para tipado fuerte
interface IRun extends Record<string, any> { id: string; status: string; }
interface IMessage extends Record<string, any> { id: string; role: string; content: { type: string; text: { value: string } }[]; }

const apiClient = { /* ... tu apiClient sin cambios ... */ }; // Tu apiClient es excelente, lo omito por brevedad

const openAIService = {
    // Ahora el threadId se pasa como argumento, no se usa uno global
    async createMessage(threadId: string, content: string): Promise<void> {
        await apiClient.post(`/threads/${threadId}/messages`, { role: 'user', content });
    },

    async createRun(threadId: string): Promise<IRun> {
        return await apiClient.post(`/threads/${threadId}/runs`, { assistant_id: OPENAI_ASSISTANT_ID });
    },

    // Esta función maneja el polling y devuelve la respuesta final
    async getFinalResponse(threadId: string, runId: string): Promise<string> {
        let runStatus: IRun;
        do {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            runStatus = await apiClient.get(`/threads/${threadId}/runs/${runId}`);
            console.log(`⏳ Estado del run (${runId}): ${runStatus.status}`);
        } while (['queued', 'in_progress'].includes(runStatus.status));

        if (runStatus.status !== 'completed') {
            throw new Error(`El asistente no finalizó correctamente (estado: ${runStatus.status}).`);
        }

        const messages = await apiClient.get(`/threads/${threadId}/messages`);
        const assistantMessage = (messages.data as IMessage[]).find(
            (m) => m.run_id === runId && m.role === 'assistant'
        );

        return assistantMessage?.content[0]?.text?.value ?? 'No se obtuvo respuesta textual del asistente.';
    },

    async createNewThread(): Promise<{ id: string }> {
        // 'body' es opcional, podemos pasar un objeto vacío.
        return await apiClient.post('/threads', {});
    }
};

// --- CAPA DE CONTROLADOR Y RUTAS (Lógica de Express) ---
// En un proyecto real, esto iría en `src/controllers/chat.controller.ts` y `src/routes/chat.route.ts`

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (_req: Request, res: Response) => {
    res.send('🚀 Servidor backend OpenAI funcionando correctamente.');
});

// El controlador ahora es mucho más limpio
app.post('/chat', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { prompt, threadId } = req.body;

        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ error: 'El campo "prompt" es obligatorio.' });
        }

        // Si no se proporciona un threadId, se crea uno nuevo para la conversación.
        if (!threadId) {
            console.log("No se proporcionó threadId, creando uno nuevo...");
            const newThread = await openAIService.createNewThread();
            threadId = newThread.id;
        }

        await openAIService.createMessage(threadId, prompt);
        const run = await openAIService.createRun(threadId);

        // Estrategia Asíncrona: Devolver el control al cliente inmediatamente.
        // El cliente usará estos IDs para preguntar por el estado después.
        res.status(202).json({ 
            message: "La solicitud ha sido aceptada y está siendo procesada.",
            threadId: threadId,
            runId: run.id 
        });

    } catch (error) {
        next(error); // Pasa el error al middleware de manejo de errores
    }
});

// Nuevo endpoint para que el cliente pregunte por el estado y resultado
app.get('/chat/status/:threadId/:runId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { threadId, runId } = req.params;
        const responseText = await openAIService.getFinalResponse(threadId, runId);
        res.json({ message: responseText });
    } catch (error) {
        next(error);
    }
});


// --- Middleware de Manejo de Errores ---
// Este middleware atrapa todos los errores pasados por `next(error)`
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('❌ Error manejado por el middleware:', error.message);
    res.status(500).json({ error: error.message || 'Ocurrió un error interno en el servidor.' });
});


app.listen(PORT, () => {
    console.log(`✅ Servidor activo en el puerto ${PORT}`);
});