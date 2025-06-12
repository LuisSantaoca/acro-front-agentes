import TenantLayout from '@/pages/shared/TenantLayout';
import LandingChatInteractivo from '@/components/agents/LandingChatInteractivo';

const LandingChatInteractivoPage = () => (
  <TenantLayout tenantName="ACRO">
    <LandingChatInteractivo />
  </TenantLayout>
);

export default LandingChatInteractivoPage;
