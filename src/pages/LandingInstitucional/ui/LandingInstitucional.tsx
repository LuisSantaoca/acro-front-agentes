import AgentChat from '@/components/agents/AgentChat';
import { getTenantFromHostname } from '@/config/tenants';

const LandingInstitucional = () => {
    const tenantConfig = getTenantFromHostname();

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
                    <source src="/assets/hero.mp4" type="video/mp4" />
                </video>
                <div className="relative z-10">

<img
  src="/assets/robot.png"
  alt="Robot ACRO"
  className="inline-block object-cover mb-6 border-4 rounded-full w-32 h-32 border-white/10 shadow-lg"
/>







                    <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--color-primary)' }}>
                        Anticípate a las plagas con información precisa en tiempo real
                    </h1>
                    <p className="text-lg mb-6" style={{ color: 'var(--color-secondary)' }}>
                        La inteligencia artificial de ACRO que predice riesgos agrícolas especialmente diseñada para productores de berries.
                    </p>
      {/* 
<button
    className="px-6 py-2 rounded-lg font-semibold"
    style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}
>
    Inicia tu Diagnóstico Gratuito
</button>
*/}

                </div>
            </header>

            {/* Sección Beneficios clave */}
            <section className="w-full max-w-4xl my-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
{[
  { title: 'Información precisa', desc: 'Más efectiva que consultores', img: '/assets/escudo01.png', bgColor: 'bg-blue-50' },
  { title: 'Prevención efectiva', desc: 'Predice condiciones para plagas', img: '/assets/escudo02.png', bgColor: 'bg-green-50' },
  { title: 'Rentabilidad optimizada', desc: 'Reduce costos, aumenta productividad', img: '/assets/escudo03.png', bgColor: 'bg-yellow-50' }
].map((benefit, index) => (
  <div key={index} className={`p-4 ${benefit.bgColor} rounded-lg shadow-sm`}>
    <img
      src={benefit.img}
      alt={benefit.title}
      className="inline-block object-cover mb-4 border-4 rounded-full w-24 h-24 border-white/10 shadow-lg mx-auto"
    />
    <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
    <p className="text-sm">{benefit.desc}</p>
  </div>
))}

                </div>
            </section>

            {/* Componente del chatbot interactivo */}
        <section className="w-full max-w-3xl my-10">
    {tenantConfig && (
        <div className="p-1 bg-indigo-200 rounded-xl shadow-lg"> {/* Color alrededor */}
            <AgentChat
                agentName={tenantConfig.agentName}
                webhook={tenantConfig.agentWebhook}
                logo="/ruta/logo-institucional.png"
                fallback="ACRO"
            />
        </div>
    )}
</section>


            {/* Footer simple */}
            <footer className="w-full text-center mt-10 py-6 border-t border-gray-200">
                <p className="text-sm">&copy; {new Date().getFullYear()} ACRO. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default LandingInstitucional;
