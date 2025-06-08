import kokitos from './kokitos'
import motas from './motas'
import { landingConfig } from './landing' // 👈 corregido claramente aquí
import { TenantConfig } from '@/types/tenants'

const tenantMap: Record<string, TenantConfig> = {
    kokitos,
    motas,
    landing: landingConfig, // 👈 corregido uso exacto
}

export function getTenantFromHostname(): TenantConfig | null {
    const host = window.location.hostname
    const subdomain = host.split('.')[0]
    return tenantMap[subdomain] || landingConfig; // fallback claramente corregido
}
