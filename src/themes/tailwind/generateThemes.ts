// src/themes/tailwind/generateThemes.ts

import { kokitosTheme } from '@/config/tenants/kokitosTheme'
// Aquí podrás importar otros temas como motasTheme

export const tenantsThemes = {
    kokitos: {
        colors: {
            primary: kokitosTheme.colors.primary,
            secondary: kokitosTheme.colors.secondary,
            background: kokitosTheme.colors.background,
            text: kokitosTheme.colors.text,
            textSecondary: kokitosTheme.colors.textSecondary,
        },
        fontSize: {
            base: kokitosTheme.fontSize.base,
            lg: kokitosTheme.fontSize.lg,
        },
    },

    // Ejemplo futuro:
    // motas: { ...motasTheme }
}
