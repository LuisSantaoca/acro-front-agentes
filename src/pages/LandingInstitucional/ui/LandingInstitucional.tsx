// File: src/pages/LandingInstitutional.jsx
import LandingAgentChat from '@/components/agents/LandingAgentChat';
import { getTenantFromHostname } from '@/config/tenants';
import { useNavigate } from 'react-router-dom';
import { Droplet, Leaf, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react';

const LandingInstitutional = () => {
    const tenantConfig = getTenantFromHostname();
    const navigate = useNavigate();

    return (
        <div
            className="landing-container flex flex-col items-center justify-center w-full py-10 px-6"
            style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
        >

            {/* HERO BLOCK OPTIMIZED FOR BERRY PRODUCERS */}
            <header className="relative w-full overflow-hidden rounded-2xl bg-indigo-950 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-900 to-black opacity-90"></div>

                <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-8 py-16 text-center">
                    <h1 className="text-5xl font-bold text-white drop-shadow-lg">
                       Elathia, AI Specialized in <span className="text-green-300">Sustainable Agriculture for Berry Growers</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-green-100">
                        Our intelligent agents integrate specific data and environmental priorities to sustainably and accurately optimize your berry production.
                    </p>
<button
    onClick={() => navigate('/kokitos')}
    className="mt-8 rounded-full bg-green-400 px-8 py-4 font-bold text-green-900 hover:bg-green-300"
>
    Learn More
</button>
                </div>
            </header>

            {/* KEY BENEFITS BLOCK WITH VECTOR ICONS AND ENHANCED COLORS */}
            <section className="w-full max-w-4xl my-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[ 
                    { 
                        title: 'Smart Water Management', 
                        desc: 'Plan your irrigation schedules using precise, predictive data to optimize water use, improve efficiency, and maximize nutrient and fertilizer uptake.',
                        icon: Droplet,
                        color: 'text-blue-500'
                    },
                    { 
                        title: 'Responsible Fertilizer Use', 
                        desc: 'Precisely monitor soil nutrients to create sustainable nutritional plans that maximize agricultural productivity, minimize environmental impact, and strictly comply with environmental regulations.',
                        icon: Leaf,
                        color: 'text-green-600'
                    },
                    { 
                        title: 'Maximum Agricultural Productivity', 
                        desc: 'Optimize your production curves with precise predictions, reducing waste and unnecessary agrochemical applications, achieving complete and sustainable harvests with minimal environmental impact.',
                        icon: TrendingUp,
                        color: 'text-yellow-500'
                    },
                ].map((benefit, idx) => {
                    const IconComponent = benefit.icon;
                    return (
                        <div key={idx} className="p-6 rounded-lg shadow-xl bg-gray-50 hover:bg-gray-100 transition duration-300 ease-in-out flex flex-col items-center text-center">
                            <IconComponent className={`mb-4 h-12 w-12 ${benefit.color}`} />
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">{benefit.title}</h3>
                            <p className="text-base text-gray-600">{benefit.desc}</p>
                        </div>
                    );
                })}
            </section>

            {/* SPECIFIC SOLUTIONS FOR BERRY GROWERS BLOCK */}
            <section className="w-full max-w-3xl my-10 px-8 py-6 bg-green-50 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-center">Specific Solutions for Berry Growers</h2>
                <ul className="list-inside space-y-2 text-base text-gray-700">
                    {[
                        'Direct integration of internal data and best practices.',
                        'Proactive monitoring to prevent chemical contamination risks.',
                        'Optimized water management and precise fertilization.',
                        'Implementation of circular economy practices for agricultural plastics.',
                        'Strict compliance and monitoring of environmental regulations.',
                        'Real-time capture of irrigation and environmental data.',
                    ].map((solution, idx) => (
                        <li key={idx} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-1" />
                            {solution}
                        </li>
                    ))}
                </ul>
            </section>

            {/* PERSONALIZED INTERACTIVE CHAT BLOCK */}
            <section className="w-full max-w-3xl my-10">
                {tenantConfig && (
                    <div className="bg-green-100 p-4 rounded-xl shadow-lg">
                        <LandingAgentChat
                            agentName={tenantConfig.agentName}
                            webhook={tenantConfig.agentWebhook}
                            logo="/ruta/logo-elathia.png"
                            fallback="Talk with our specialized agent in agricultural sustainability"
                        />
                    </div>
                )}
            </section>

            {/* PROVEN RESULTS IN POWDERY MILDEW PREDICTION BLOCK */}
            <section className="w-full max-w-4xl my-10 px-8 py-6 bg-gray-50 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-2 text-center">Proven Results in Powdery Mildew Prediction</h2>
                <p className="text-center text-base flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-purple-500 mr-2" />
                    We have supported Driscoll’s producers in Jocotepec, Jalisco, with advanced predictive models that forecast powdery mildew outbreaks, significantly increasing agricultural production and optimizing water consumption in irrigation systems.
                </p>
            </section>

            {/* FOOTER BLOCK */}
            <footer className="w-full text-center mt-10 py-6 border-t border-gray-200">
                <p className="text-sm">
                    © {new Date().getFullYear()} Elathia. Strategic Partners in Agricultural Sustainability.
                </p>
            </footer>
        </div>
    );
};

export default LandingInstitutional;