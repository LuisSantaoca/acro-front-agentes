import LandingAgentChat from '@/components/agents/LandingAgentChat';
import { getTenantFromHostname } from '@/config/tenants';
import { useNavigate } from 'react-router-dom';

const LandingInstitucional = () => {
    const tenantConfig = getTenantFromHostname();
    const navigate = useNavigate();

    return (
        <div
            className="landing-container flex flex-col items-center justify-center w-full py-10 px-6"
            style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
        >
            {/* BLOQUE HERO */}
            <header className="relative w-full overflow-hidden rounded-2xl bg-indigo-950 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-900 to-black opacity-90"></div>

                <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-8 py-16 text-center">
                    <h1 className="text-5xl font-bold text-white drop-shadow-lg">
                        Elathia: <span className="text-green-300">IA para Agricultura Sustentable</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-green-100">
                        Agentes inteligentes que optimizan la gestión agrícola para enfrentar desafíos ambientales con precisión.
                    </p>
                    <button
                        onClick={() => navigate('/landing/chat-interactivo')}
                        className="mt-8 rounded-full bg-green-400 px-8 py-4 font-bold text-green-900 hover:bg-green-300"
                    >
                        Solicita una demo personalizada
                    </button>
                </div>
            </header>

            {/* BLOQUE BENEFICIOS CLAVE */}
            <section className="w-full max-w-4xl my-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { title: 'Optimización hídrica', desc: 'Reduce significativamente el uso del agua mediante IA.', img: '/assets/escudo01.png', bgColor: 'bg-blue-50' },
                    { title: 'Fertilización precisa', desc: 'Cumple normativas ambientales con precisión en aplicación.', img: '/assets/escudo02.png', bgColor: 'bg-green-50' },
                    { title: 'Alta productividad', desc: 'Alcanza máximos rendimientos incluso en condiciones adversas.', img: '/assets/escudo03.png', bgColor: 'bg-yellow-50' }
                ].map((benefit, idx) => (
                    <div key={idx} className={`p-4 rounded-lg shadow ${benefit.bgColor}`}>
                        <img src={benefit.img} className="mx-auto mb-4 h-24 w-24" />
                        <h3 className="text-lg font-semibold">{benefit.title}</h3>
                        <p className="text-sm">{benefit.desc}</p>
                    </div>
                ))}
            </section>

            {/* BLOQUE CHAT INTERACTIVO */}
            <section className="w-full max-w-3xl my-10">
                {tenantConfig && (
                    <div className="bg-green-200 p-4 rounded-xl shadow-lg">
                        <LandingAgentChat
                            agentName={tenantConfig.agentName}
                            webhook={tenantConfig.agentWebhook}
                            logo="/ruta/logo-elathia.png"
                            fallback="Consulta con Elathia"
                        />
                    </div>
                )}
            </section>

            {/* PIE DE PÁGINA */}
            <footer className="w-full text-center mt-10 py-6 border-t border-gray-200">
                <p className="text-sm">
                    © {new Date().getFullYear()} Elathia.. Líderes en IA para agricultura sustentable.
                </p>
            </footer>
        </div>
    );
};

export default LandingInstitucional;
