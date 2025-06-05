export default function TenantNotFound({ tenant }: { tenant: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800 text-center p-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">⚠️ Tenant no encontrado</h1>
                <p className="text-lg">
                    El subdominio <strong>{tenant}</strong> no está configurado o no tiene interfaz definida.
                </p>
            </div>
        </div>
    )
}
