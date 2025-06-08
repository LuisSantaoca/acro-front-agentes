import React, { useState } from 'react'
import LandingInstitucional from '../LandingInstitucional/ui/LandingInstitucional'

export default function ProtectedLanding() {
    const [token, setToken] = useState('')
    const [isValid, setIsValid] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (token === 'acro2025') setIsValid(true)
        else alert('Token incorrecto, inténtalo de nuevo.')
    }

    if (!isValid) {
        return (
            <div className="flex justify-center items-center h-screen">
                <form onSubmit={handleSubmit} className="text-center">
                    <h2 className="mb-4 text-xl font-semibold">Introduce el token:</h2>
                    <input
                        type="password"
                        className="border px-4 py-2 rounded mb-4"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                    <br />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Acceder
                    </button>
                </form>
            </div>
        )
    }

    return <LandingInstitucional />
}
