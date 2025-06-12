
import TenantLayout from '@/pages/shared/TenantLayout'

import config from '@/config/tenants/kokitos'

import OpenAIChat from '@/components/agents/OpenAIChat'



export default function OpenAIChatPage() {

  return (

    <TenantLayout tenantName={config.tenantName} logo={config.logo}>

      <div className="max-w-3xl mx-auto p-4">

        <h1 className="text-xl font-bold mb-4">Chat directo con OpenAI</h1>

        <OpenAIChat />

      </div>

    </TenantLayout>

  )

}

