export interface TenantConfig {
    tenantName: string             // Nombre visible del tenant (e.g., "Kokitos 🍓")
    logo: string                   // Ruta al logo principal
    agentName: string              // Nombre del agente conversacional
    webhook: string                // URL del webhook a usar en el flujo
    fallback?: string              // Fallback para avatar en caso de error

    // 🎨 Personalización visual (branding)
    themeColor?: string            // Clase de Tailwind para color principal (e.g., 'bg-pink-600')
    backgroundColor?: string       // Clase de fondo del componente (e.g., 'bg-white', 'bg-neutral-100')
}
