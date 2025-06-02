import ConsultaInteractiva from './ConsultaInteractiva'

export default function KokitosIndex() {
  return (
    <div className="min-h-screen bg-orange-500 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a Kokitos 🍓</h1>
      <p className="text-lg mb-6">
        Este es el menú inicial personalizado para el subdominio <strong>kokitos</strong>.
      </p>

      <ConsultaInteractiva />
    </div>
  )
}
