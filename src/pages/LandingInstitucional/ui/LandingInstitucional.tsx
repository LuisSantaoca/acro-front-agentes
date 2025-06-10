import AgentChat from '@/components/agents/AgentChat';
import { getTenantFromHostname } from '@/config/tenants';

const LandingInstitucional = () => {
    const tenantConfig = getTenantFromHostname();

    return (
        <div
            className="landing-container flex flex-col items-center justify-center w-full py-10 px-6"
            style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
        >
{/*=============== INICIA SECCIÓN HERO MEJORADA ===============*/}
{/*
  Mejoras clave:
  1.  **Composición Asimétrica:** En pantallas medianas y grandes (md:), separamos el texto a la izquierda y la imagen a la derecha. Esto crea un flujo visual más dinámico y profesional que guía la vista del usuario desde el titular hacia el CTA.
  2.  **Profundidad Mejorada:** Se cambia el gradiente lineal por uno radial. Esto crea un efecto de "viñeta" sutil que oscurece los bordes y enfoca la luz (y la atención) en el centro del contenido, mejorando enormemente la legibilidad del texto sobre el video.
  3.  **Imagen Integrada:** Eliminamos el círculo con fondo glassmorphism que contenía al robot. En su lugar, hacemos que el robot "flote" en el espacio y le añadimos un resplandor propio con `filter drop-shadow`. Esto lo hace sentir más tecnológico y parte de la escena, no un elemento pegado encima.
  4.  **CTA Activo y Visible:** Reincorporamos el botón de llamado a la acción, que es crucial en una landing page. Le añadimos un ícono y micro-interacciones al pasar el cursor para incentivar el clic.
  5.  **Tipografía Responsiva:** Los títulos ahora son más grandes en pantallas mayores (md:text-5xl, lg:text-6xl) para un mayor impacto visual.
*/}
<header className="relative w-full overflow-hidden rounded-2xl bg-indigo-950 shadow-2xl">
  {/* Video de fondo y capa de gradiente */}
  <video
    className="absolute inset-0 z-0 h-full w-full object-cover opacity-90"
    autoPlay
    loop
    muted
    playsInline // Atributo importante para autoplay en móviles
  >
    <source src="/assets/hero.mp4" type="video/mp4" />
  </video>
  {/* Gradiente radial para enfocar la atención y mejorar legibilidad */}
  <div className="absolute inset-0 z-10 bg-gradient-to-br from-indigo-900/40 via-indigo-950/80 to-black/90"></div>

  {/* Contenedor del contenido principal */}
  <div className="relative z-20 mx-auto flex max-w-6xl flex-col items-center justify-between px-8 py-16 md:flex-row md:py-24 lg:py-28">
    
    {/* Columna de Texto y CTA (izquierda) */}
    <div className="mb-10 w-full text-center md:mb-0 md:w-3/5 md:text-left">
      <h1 className="text-4xl font-bold leading-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
        Anticípate a las plagas con <span className="text-cyan-300">precisión en tiempo real</span>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-indigo-200 drop-shadow-md md:text-xl">
        Inteligencia artificial de ACRO que predice riesgos agrícolas, especialmente diseñada para productores de berries.
      </p>
      
      {/* Botón de Llamado a la Acción (CTA) */}
      <div className="mt-8">
        <button
          className="group inline-flex items-center gap-x-3 rounded-full bg-cyan-400 px-8 py-4 text-lg font-bold text-indigo-900 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-cyan-300 hover:shadow-cyan-400/40"
        >
          <span>Conoce más del proyecto</span>
          {/* Ícono de flecha que reacciona al hover del grupo */}
          <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    {/* Columna de Imagen (derecha) */}
    <div className="flex w-2/5 justify-center md:justify-end">
        <img
          src="/assets/robot.png"
          alt="Robot ACRO"
          className="w-48 transition-all duration-500 ease-in-out md:w-64 lg:w-72"
          // Este filtro crea un resplandor de color cian que integra mejor al robot
          style={{ filter: 'drop-shadow(0px 0px 25px rgba(56, 189, 248, 0.4))' }} 
        />
    </div>

  </div>
</header>
{/*=============== TERMINA SECCIÓN HERO MEJORADA ===============*/}

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
