import { ReactNode } from 'react'

type TenantLayoutProps = {
    tenantName: string
    logo?: string
    children: ReactNode
}

export default function TenantLayout({ tenantName, logo, children }: TenantLayoutProps) {
    return (
        <div className="container-layout">
            <header className="text-center section-spacing header-divider w-1/2 mx-auto">
                <div className="flex justify-center items-center gap-3 mb-2">
                    <h1 className="header-title text-lg font-normal">
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
                <p className="header-subtitle text-sm">
                    Nombre del agente:{' '}
                    <span className="not-italic text-[var(--color-text)]">
                        {tenantName.toLowerCase().split(' ')[0]}
                    </span>
                </p>
            </header>

            <main className="flex flex-col gap-6">
                {children}
            </main>
        </div>
    )
}
