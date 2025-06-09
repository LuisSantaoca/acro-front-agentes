import AgentChat from '@/components/agents/AgentChat';
import { getTenantFromHostname } from '@/config/tenants';

const LandingInstitucional = () => {
    const tenantConfig = getTenantFromHostname();

    ```
return (
    <div
        className="landing-container flex flex-col items-center justify-center w-full py-10 px-6"
        style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
    >
        {/* Sección Hero con video de fondo */}
        <header className="relative w-full max-w-4xl text-center py-8 overflow-hidden">
            <video
                className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
                autoPlay
                loop
                muted
            >
                <source src="../assets/berries.mp4" type="video/mp4" />
            </video>
            <div className="relative z-10">
                <div className="inline-block w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--color-primary)' }}>
                    Anticípate a las Plagas con Información Precisa en Tiempo Real
                </h1>
                <p className="text-lg mb-6" style={{ color: 'var(--color-secondary)' }}>
                    La inteligencia artificial de ACRO que predice riesgos agrícolas especialmente diseñada para productores de berries.
                </p>
                <button
                    className="px-6 py-2 rounded-lg font-semibold"
                    style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}
                >
                    Inicia tu Diagnóstico Gratuito
                </button>
            </div>
        </header>

        {/* Sección Beneficios clave */}
        <section className="w-full max-w-4xl my-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {[
                    { title: 'Información precisa', desc: 'Más efectiva que consultores' },
                    { title: 'Prevención efectiva', desc: 'Predice condiciones para plagas' },
                    { title: 'Rentabilidad optimizada', desc: 'Reduce costos, aumenta productividad' }
                ].map((benefit, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                        <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                        <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                        <p className="text-sm">{benefit.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Componente del chatbot interactivo */}
        <section className="w-full max-w-3xl my-10">
            {tenantConfig && (
                <AgentChat
                    agentName={tenantConfig.agentName}
                    webhook={tenantConfig.agentWebhook}
                    logo="/ruta/logo-institucional.png"
                    fallback="ACRO"
                />
            )}
        </section>

        {/* Sección testimonios breves */}
        <section className="w-full max-w-4xl my-10">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <p className="italic">
                            \"Gracias a ACRO anticipamos correctamente una amenaza de Botrytis, salvando gran parte de nuestra cosecha de fresas en Oxnard.\"
                        </p>
                        <p className="mt-2 font-bold">— Ricardo Pérez, Productor de Berries</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Formulario simple para leads */}
        <section className="w-full max-w-3xl my-10 text-center">
            <h2 className="text-2xl font-bold mb-4">Solicita un análisis personalizado sin costo</h2>
            <form className="flex flex-col gap-4 items-center">
                <input className="border border-gray-300 p-2 rounded-md w-full" placeholder="Nombre" />
                <input className="border border-gray-300 p-2 rounded-md w-full" placeholder="Correo electrónico" />
                <input className="border border-gray-300 p-2 rounded-md w-full" placeholder="Ubicación del cultivo" />
                <input className="border border-gray-300 p-2 rounded-md w-full" placeholder="Tipo de berry cultivado" />
                <button type="submit" className="px-6 py-2 rounded-lg font-semibold" style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>
                    Enviar
                </button>
            </form>
        </section>

        {/* Footer simple */}
        <footer className="w-full text-center mt-10 py-6 border-t border-gray-200">
            <p className="text-sm">&copy; {new Date().getFullYear()} ACRO. Todos los derechos reservados.</p>
        </footer>
    </div>
);
```

};

export default LandingInstitucional;

