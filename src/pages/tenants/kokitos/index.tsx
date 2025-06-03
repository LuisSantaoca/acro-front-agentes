import config from '@/config/tenants/kokitos'
import TenantLayout from '@/pages/shared/TenantLayout'
import AgentChat from '@/components/agents/AgentChat'

export default function KokitosIndex() {
  return (
    <TenantLayout tenantName={config.tenantName} logo={config.logo}>
      <AgentChat
        agentName={config.agentName}
        webhook={config.webhook}
        logo={config.logo}
        fallback={config.fallback}
      />
    </TenantLayout>
  )
}

