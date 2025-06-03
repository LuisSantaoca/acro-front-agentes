import kokitosConfig from './kokitos' // ✅ importación por default

const tenantConfigs: Record<string, any> = {
    kokitos: kokitosConfig,
}

export const getTenantConfig = (subdominio: string) => {
    return tenantConfigs[subdominio] || null
}

