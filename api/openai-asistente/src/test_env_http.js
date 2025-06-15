const path = require('path');
const dotenv = require('dotenv');

// Usar `path.resolve` para una ruta de configuración robusta y portable
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import dinámico (se mantiene por compatibilidad con tu setup actual)
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// 1. CONFIGURACIÓN CENTRALIZADA
const config = {
    apiKey: process.env.OPENAI_API_KEY,
    threadId: process.env.OPENAI_THREAD_ID,
    assistantId: process.env.OPENAI_ASSISTANT_ID,
    baseUrl: 'https://api.openai.com/v1',
};

// 2. CLIENTE DE API ROBUSTO Y CENTRALIZADO
// Encapsula la lógica de fetch, URLs, cabeceras y manejo de errores.
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

        // Verificación de errores HTTP (¡la mejora más importante!)
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: 'No se pudo leer el cuerpo del error' }));
            throw new Error(`Error de API: ${response.status} ${response.statusText} - ${errorBody.error?.message || 'Error desconocido'}`);
        }

        // Si la respuesta no tiene cuerpo (ej. 204 No Content), no intentes parsear JSON
        if (response.status === 204) {
            return null;
        }
        
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

// 3. FUNCIONES CON RESPONSABILIDAD ÚNICA
async function createMessage(threadId, content) {
    console.log("Enviando mensaje...");
    await apiClient.post(`/threads/${threadId}/messages`, {
        role: 'user',
        content,
    });
    console.log("✅ Mensaje enviado.");
}

async function createRun(threadId, assistantId) {
    console.log("Creando run...");
    const run = await apiClient.post(`/threads/${threadId}/runs`, {
        assistant_id: assistantId,
    });
    console.log(`✅ Run creado. ID: ${run.id}`);
    return run;
}

async function pollRunStatus(threadId, runId) {
    console.log("Sondeando estado del run...");
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const runStatus = await apiClient.get(`/threads/${threadId}/runs/${runId}`);
        console.log(`⏳ Estado actual: ${runStatus.status}`);
        
        if (['completed', 'failed', 'cancelled'].includes(runStatus.status)) {
            console.log(`✅ Run finalizado con estado: ${runStatus.status}`);
            return runStatus;
        }
    }
}

async function getAssistantResponse(threadId, runId) {
    const messages = await apiClient.get(`/threads/${threadId}/messages`);
    const assistantMessage = messages.data.find(m => m.run_id === runId && m.role === 'assistant');
    
    if (assistantMessage && assistantMessage.content[0].type === 'text') {
        return assistantMessage.content[0].text.value;
    }
    return "No se encontró una respuesta del asistente.";
}

// 4. FUNCIÓN PRINCIPAL ORQUESTADORA
async function main() {
    try {
        const prompt = "Explícame la computación cuántica de forma muy simple.";
        
        await createMessage(config.threadId, prompt);
        const run = await createRun(config.threadId, config.assistantId);
        const finalRunStatus = await pollRunStatus(config.threadId, run.id);
        
        if (finalRunStatus.status === 'completed') {
            const response = await getAssistantResponse(config.threadId, run.id);
            console.log("\n💬 Respuesta del Asistente:\n----------------------------\n", response);
        }

    } catch (error) {
        console.error("\n❌ Ha ocurrido un error en el flujo principal:", error.message);
    }
}

main();