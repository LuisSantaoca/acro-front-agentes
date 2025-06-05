import { getTenantFromHostname } from '@/config/tenants'
import AgentChat from '@/components/agents/AgentChat'

export default function ConsultaInteractiva() {
    const tenant = getTenantFromHostname()

    if (!tenant) {
        return (
            <div className="text-center mt-10 text-red-600">
                ⚠️ No se pudo identificar el tenant desde el subdominio.
            </div>
        )
    }

    return (
        <AgentChat
            agentName={tenant.agentName}
            webhook={tenant.webhook}
            logo={tenant.logo}
            fallback={tenant.fallback}
        />
    )
}

