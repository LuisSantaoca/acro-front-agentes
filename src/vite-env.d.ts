/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_OPENAI_ASSISTANT_ID: string
  readonly VITE_PROJECT_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
