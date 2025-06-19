const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

// Import dinámico para node-fetch
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const config = {
    apiKey: process.env.OPENAI_API_KEY,
    threadId: process.env.OPENAI_THREAD_ID,
    assistantId: process.env.OPENAI_ASSISTANT_ID,
    baseUrl: 'https://api.openai.com/v1',
};

const apiClient = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'OpenAI-Beta': 'assistants=v2',
    },
    async request(endpoint, options = {}) {
        const url = `${config.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            headers: this.headers,
            ...options,
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: 'No se pudo leer el cuerpo del error' }));
            throw new Error(`Error de API: ${response.status} ${response.statusText} - ${errorBody.error?.message || 'Error desconocido'}`);
        }
        if (response.status === 204) return null;
        return response.json();
    },
    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },
    get(endpoint) {
        return this.request(endpoint);
    }
};

const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Prompt requerido.' });

        await apiClient.post(`/threads/${config.threadId}/messages`, {
            role: 'user',
            content: prompt,
        });

        const run = await apiClient.post(`/threads/${config.threadId}/runs`, {
            assistant_id: config.assistantId,
        });

        res.status(202).json({ runId: run.id, status: 'processing' });
    } catch (error) {
        console.error('❌ Error en /chat:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/chat/status/:runId', async (req, res) => {
    try {
        const { runId } = req.params;
        const run = await apiClient.get(`/threads/${config.threadId}/runs/${runId}`);

        if (run.status !== 'completed') {
            return res.json({ status: run.status, message: null });
        }

        const messages = await apiClient.get(`/threads/${config.threadId}/messages`);
        const assistantMessage = messages.data.find(
            m => m.run_id === runId && m.role === 'assistant'
        );

        let text = null;
        if (assistantMessage && Array.isArray(assistantMessage.content)) {
            const textBlock = assistantMessage.content.find(c => c.type === 'text');
            if (textBlock && textBlock.type === 'text') {
                text = textBlock.text.value;
            }
        }

        res.json({
            status: 'completed',
            message: text,
        });
    } catch (error) {
        console.error('❌ Error en /chat/status:', error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Backend OpenAI escuchando en puerto ${PORT}`);
});
