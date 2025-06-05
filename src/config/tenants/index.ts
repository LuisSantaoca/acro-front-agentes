import kokitosConfig from './kokitos'
import motasConfig from './motas' // ✅ nuevo tenant

const tenantConfigs: Record<string, any> = {
    kokitos: kokitosConfig,
    motas: motasConfig,
}

export const getTenantConfig = (subdominio: string) => {
    return tenantConfigs[subdominio] || null
}
