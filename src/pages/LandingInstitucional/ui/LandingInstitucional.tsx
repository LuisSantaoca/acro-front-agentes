import AgentChat from '@/components/agents/AgentChat';
import { getTenantFromHostname } from '@/config/tenants';

const LandingInstitucional = () => {
    const tenantConfig = getTenantFromHostname();

    return (
        <div className="landing-container">
            <h1 className="text-3xl font-bold text-center">Bienvenido a Acro 🚀</h1>
            {tenantConfig && (
                <AgentChat
                    agentName={tenantConfig.agentName}
                    webhook={tenantConfig.agentWebhook}
                    logo="/ruta/logo-institucional.png"
                    fallback="IA"
                />
            )}
        </div>
    );
};

export default LandingInstitucional;
