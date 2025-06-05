import { useEffect, useState, Suspense } from 'react'
import { getTenantConfig } from '@/config/tenants'
import TenantNotFound from './shared/TenantNotFound'

const tenantModules = import.meta.glob('./tenants/*/index.tsx')

export default function TenantIndex() {
    const subdomain = window.location.hostname.split('.')[0]
    const [TenantApp, setTenantApp] = useState<React.ComponentType<any> | null>(null)
    const [config, setConfig] = useState<any>(null)

    useEffect(() => {
        const path = `./tenants/${subdomain}/index.tsx`
        const loadTenant = tenantModules[path]
        const configData = getTenantConfig(subdomain)

        if (loadTenant && configData) {
            setConfig(configData)
            loadTenant().then((mod) => setTenantApp(() => mod.default))
        } else {
            // fallback a componente de error visual reutilizable
            setTenantApp(() => () => <TenantNotFound tenant={subdomain} />)
        }
    }, [subdomain])

    if (!TenantApp) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Cargando interfaz...
            </div>
        )
    }

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Cargando módulo...</div>}>
            <TenantApp config={config} />
        </Suspense>
    )
}

