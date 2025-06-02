import { useEffect, useState } from 'react'
import { getTenantConfig } from '@/config/tenants'

const tenants: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
    kokitos: () => import('./tenants/kokitos'),
    // Agrega más tenants aquí si los tienes
}

export default function TenantIndex() {
    const subdomain = window.location.hostname.split('.')[0]
    const [Component, setComponent] = useState<React.ComponentType<any> | null>(null)
    const [config, setConfig] = useState<any>(null)

    useEffect(() => {
        const loadComponent = tenants[subdomain]
        const configData = getTenantConfig(subdomain)

        if (loadComponent && configData) {
            setConfig(configData)
            loadComponent().then(mod => setComponent(() => mod.default))
        } else {
            setComponent(() => () => (
                <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800 text-xl font-bold">
                    Tenant "{subdomain}" no encontrado o sin configuración
                </div>
            ))
        }
    }, [subdomain])

    if (!Component) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Cargando interfaz...</div>
    }

    return <Component config={config} />
}
