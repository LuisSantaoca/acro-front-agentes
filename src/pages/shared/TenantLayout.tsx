import { ReactNode } from 'react'

type TenantLayoutProps = {
    tenantName: string
    logo?: string
    children: ReactNode
}

export default function TenantLayout({ tenantName, logo, children }: TenantLayoutProps) {
    return (
        <div className="container-layout">
            <header className="text-center section-spacing header-divider">
                <div className="flex justify-center items-center gap-3 mb-2">
                    <h1 className="header-title">
                        {tenantName}
                    </h1>
                    {logo && (
                        <img
                            src={logo}
                            alt="logo"
                            className="h-10 w-10 rounded-full border border-[var(--color-border)] bg-white p-1 shadow-sm"
                            style={{ objectFit: 'contain' }}
                        />
                    )}
                </div>
                <p className="header-subtitle">
                    Este es el menú inicial personalizado para el subdominio{' '}
                    <strong className="not-italic text-[var(--color-text)]">
                        {tenantName.toLowerCase().split(' ')[0]}
                    </strong>.
                </p>
            </header>

            <main className="flex flex-col gap-6">
                {children}
            </main>
        </div>
    )
}
