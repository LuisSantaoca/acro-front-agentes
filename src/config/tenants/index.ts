import kokitos from './kokitos'
import motas from './motas'
import landing from './landing' // 👈 nuevo agregado claramente aquí
import { TenantConfig } from '@/types/tenants'

const tenantMap: Record<string, TenantConfig> = {
    kokitos,
    motas,
    landing, // 👈 claramente agregado para landing institucional
}

export function getTenantFromHostname(): TenantConfig | null {
    const host = window.location.hostname
    const subdomain = host.split('.')[0] // ej.: kokitos.acro.com.mx, landing.acro.com.mx
    return tenantMap[subdomain] || landing; // 👈 fallback claro y seguro a landing
}
