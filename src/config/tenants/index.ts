import kokitos from './kokitos'
import motas from './motas'
import { TenantConfig } from '@/types/tenants'

const tenantMap: Record<string, TenantConfig> = {
    kokitos,
    motas,
}

export function getTenantFromHostname(): TenantConfig | null {
    const host = window.location.hostname
    const subdomain = host.split('.')[0] // asume subdominio.kokitos.acro.com.mx o kokitos.localhost
    return tenantMap[subdomain] || null
}
