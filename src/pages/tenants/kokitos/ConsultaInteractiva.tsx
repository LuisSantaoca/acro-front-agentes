import { useState } from 'react'

export default function ConsultaInteractiva() {
    const [mensaje, setMensaje] = useState('')
    const [respuesta, setRespuesta] = useState<string | null>(null)
    const [cargando, setCargando] = useState(false)

    const enviarConsulta = async () => {
        setCargando(true)
        try {
            const res = await fetch('https://n8n.acro.com.mx/webhook/consultas_agente_01'
                , {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mensaje }),
                })

            const data = await res.json()
            setRespuesta(data.respuesta || 'Sin respuesta')
        } catch (err) {
            console.error(err)
            setRespuesta('Error al procesar la consulta')
        }
        setCargando(false)
    }

    return (
        <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow text-black">
            <h2 className="text-xl font-semibold mb-4">Consulta inteligente</h2>
            <textarea
                className="w-full border rounded p-2 mb-2 text-black"
                rows={3}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe tu pregunta aquí..."
            />
            <button
                onClick={enviarConsulta}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={cargando || !mensaje.trim()}
            >
                {cargando ? 'Consultando...' : 'Enviar'}
            </button>

            {respuesta && (
                <div className="mt-4 p-4 bg-gray-100 rounded text-black">
                    <strong>Respuesta:</strong>
                    <p>{respuesta}</p>
                </div>
            )}
        </div>
    )
}

