import { ReactNode } from 'react'

type TenantLayoutProps = {
    tenantName: string
    logo?: string
    children: ReactNode
}

export default function TenantLayout({ tenantName, logo, children }: TenantLayoutProps) {
    return (
        <div className="min-h-screen bg-orange-500 text-white p-6">
            <header className="text-center mb-6">
                <h1 className="text-4xl font-bold flex justify-center items-center gap-2">
                    {tenantName}
                    {logo && <img src={logo} alt="logo" className="h-8 w-8 inline-block" />}
                </h1>
                <p className="text-lg mt-2">
                    Este es el menú inicial personalizado para el subdominio <strong>{tenantName.toLowerCase().split(' ')[0]}</strong>.
                </p>
            </header>

            <main>
                {children}
            </main>
        </div>
    )
}
