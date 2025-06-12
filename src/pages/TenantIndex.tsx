import { useEffect, useState, Suspense } from 'react'
import { getTenantFromHostname } from '@/config/tenants'
import { TenantConfig } from '@/types/tenants'
import TenantNotFound from './shared/TenantNotFound'

const tenantModules = import.meta.glob('./tenants/*/index.tsx')

export default function TenantIndex() {
    const [TenantApp, setTenantApp] = useState<React.ComponentType<any> | null>(null)
    const [config, setConfig] = useState<TenantConfig | null>(null)

    useEffect(() => {
        const tenant = getTenantFromHostname()
        if (!tenant) {
            setTenantApp(() => () => <TenantNotFound tenant="desconocido" />)
            return
        }

        const subdomain = tenant?.tenantName?.toLowerCase().split(' ')[0] || 'desconocido';

        const path = `./tenants/${subdomain}/index.tsx`
        const loadTenant = tenantModules[path]

        if (loadTenant) {
            setConfig(tenant)
            loadTenant().then((mod) => setTenantApp(() => mod.default))
        } else {
            setTenantApp(() => () => <TenantNotFound tenant={subdomain} />)
        }
    }, [])

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

