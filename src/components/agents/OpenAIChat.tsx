
import { useState } from 'react'

import { sendChatPrompt } from '@/lib/openaiChatService'



export default function OpenAIChat() {

  const [prompt, setPrompt] = useState('')

  const [response, setResponse] = useState('')



  const handleSend = async () => {

    try {

      const res = await sendChatPrompt(prompt)

      setResponse(res.content)

    } catch (error) {

      setResponse('Error al comunicarse con el servidor.')

    }

  }



  return (

    <div className="p-4 border rounded-lg shadow">

      <textarea

        value={prompt}

        onChange={(e) => setPrompt(e.target.value)}

        placeholder="Escribe tu mensaje..."

        className="w-full p-2 border rounded mb-2"

      />

      <button

        onClick={handleSend}

        className="px-4 py-2 bg-blue-500 text-white rounded"

      >

        Enviar

      </button>

      {response && (

        <div className="mt-4 p-2 bg-gray-100 rounded">

          Respuesta: {response}

        </div>

      )}

    </div>

  )

}

