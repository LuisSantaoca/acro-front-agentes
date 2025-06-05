import type { Config } from 'tailwindcss'
import { tenantsThemes } from './src/themes/tailwind/generateThemes'

// Determina el tema activo. Puedes usar una variable de entorno o dejar fijo por ahora.
const activeTenant = process.env.TENANT || 'kokitos'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: tenantsThemes[activeTenant],
  },
  plugins: [],
}

export default config
