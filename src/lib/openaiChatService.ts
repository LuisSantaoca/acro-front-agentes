import React from 'react';
import config from '@/config/tenants/kokitos';

import { OpenAIChat } from '@/components/agents/OpenAIChat';

const OpenAIChatPage = () => (
  <div>
    <OpenAIChat config={config} />
  </div>
);

export default OpenAIChatPage;


