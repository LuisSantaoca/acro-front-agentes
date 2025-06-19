// Archivo: src/pages/tenants/kokitos/KokitosCase.jsx

import React from 'react';
import { 
    Leaf, BarChart3, Thermometer, Droplet, CloudRainWind, Sun, CloudSun, AlertTriangle,
    Activity, Wind, CloudDrizzle, TrendingUp, TrendingDown, CalendarClock, ClipboardCheck,
    PieChart, ShieldCheck, Sprout, MapPinned, Target, Database, Calculator
} from 'lucide-react';

const KokitosCase = () => {
    return (
        <div className="max-w-5xl mx-auto py-12 px-8 space-y-16">

            {/* Título del Caso de Estudio */}
            <section className="text-center mb-8">
                <h1 className="text-3xl font-bold text-green-700">
                    Estudio de Caso Kokitos<br />
                    <span className="text-xl font-normal">Primer trimestre del 2025, Jocotepec, Jalisco. Productor de Driscoll's</span>
                </h1>
            </section>

            {/* Fundamentación del Índice de Riesgo de Cenicilla (IRC) */}
            <section>
                <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
                    <BarChart3 className="mr-2 text-green-600" /> Fundamentación del Índice de Riesgo de Cenicilla (IRC)
                </h2>
                <p className="text-gray-700">
                    El Índice de Riesgo de Cenicilla (IRC) es una herramienta desarrollada para predecir con precisión la aparición y propagación de la cenicilla polvorienta (<em>Podosphaera aphanis</em>) en cultivos de frambuesa.
                </p>
                <div className="mt-6 bg-green-50 rounded-lg shadow p-6 flex flex-col md:flex-row items-center">
                    <BarChart3 className="text-green-600 mr-6" size={80} />
                    <div>
                        <p className="font-medium text-gray-800 mb-2">Condiciones óptimas identificadas:</p>
                        <ul className="list-disc ml-6 text-gray-600">
                            <li><Thermometer className="inline-block mr-2 text-red-400" />Temperaturas cercanas a 13°C.</li>
                            <li><Droplet className="inline-block mr-2 text-blue-400" />Humedad relativa de aproximadamente 67%.</li>
                            <li><CloudRainWind className="inline-block mr-2 text-indigo-400" />Humedad superficial constante sobre hojas y frutos.</li>
                            <li><Sun className="inline-block mr-2 text-yellow-400" />Variaciones térmicas suaves día-noche.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Referencias Científicas y Valores de Referencia */}
            <section>
                <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
                    <Leaf className="mr-2 text-green-600" /> Referencias Científicas
                </h2>
                <p className="text-gray-700">
                    Temperatura ideal entre 18°C y 25°C, humedad relativa del 60%-85%, sin agua libre sobre hojas.
                    Temperaturas extremas (&gt;30°C o &lt;10°C) disminuyen actividad del hongo.
                </p>
                <div className="mt-6 bg-gray-50 rounded-lg shadow p-6 flex items-center">
                    <Thermometer className="text-red-500" size={60} />
                    <Droplet className="text-blue-500 ml-4" size={60} />
                    <p className="text-gray-600 italic ml-6">
                        Koppert (2024), IPM UCANR (2023), Editorial de Riego (2023).
                    </p>
                </div>
            </section>

            {/* Metodología del Índice */}
            <section>
                <h2 className="text-2xl font-semibold text-green-700 mb-4">
                    Metodología del Índice
                </h2>
                <div className="mt-4">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Riesgo por Temperatura</h3>
                    <table className="w-full shadow rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">Temperatura (°C)</th>
                                <th className="px-4 py-2">Nivel de Riesgo</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            <tr><td className="px-4 py-2">&lt;12°C o &gt;28°C</td><td>Bajo</td></tr>
                            <tr className="bg-gray-50"><td className="px-4 py-2">12°C-16°C o 24°C-28°C</td><td>Moderado</td></tr>
                            <tr><td className="px-4 py-2">16°C-24°C</td><td>Alto</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-6">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Riesgo por Humedad Relativa</h3>
                    <table className="w-full shadow rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">Humedad Relativa (%)</th>
                                <th className="px-4 py-2">Nivel de Riesgo</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            <tr><td className="px-4 py-2">&lt;55% o &gt;85%</td><td>Bajo</td></tr>
                            <tr className="bg-gray-50"><td className="px-4 py-2">55%-70%</td><td>Moderado</td></tr>
                            <tr><td className="px-4 py-2">70%-85%</td><td>Alto</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Cálculo del IRC */}
            <section>
                <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
                    <Calculator className="mr-2 text-green-600" />Cálculo IRC
                </h2>
                <div className="my-6 bg-gray-100 rounded-lg p-4 shadow text-center font-mono">
                    IRC = (Riesgo Temperatura + Riesgo Humedad) / 2
                </div>


{/* Bloque Escala de Clasificación del IRC */}
<section>
    <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
        <ClipboardCheck className="mr-2 text-green-600" /> Escala de Clasificación del IRC
    </h3>
    <table className="w-full table-auto border-collapse shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-2 text-left text-gray-700">Índice de Riesgo de Cenicilla (IRC)</th>
                <th className="px-4 py-2 text-left text-gray-700">Nivel de Riesgo</th>
                <th className="px-4 py-2 text-left text-gray-700">Acción Requerida</th>
            </tr>
        </thead>
        <tbody className="text-gray-600">
            <tr>
                <td className="px-4 py-2">0 - 0.5</td>
                <td className="px-4 py-2">Bajo</td>
                <td className="px-4 py-2">No hay condiciones favorables para la cenicilla.</td>
            </tr>
            <tr className="bg-gray-50">
                <td className="px-4 py-2">0.5 - 1.5</td>
                <td className="px-4 py-2">Moderado</td>
                <td className="px-4 py-2">Se recomienda monitoreo y prevención.</td>
            </tr>
            <tr>
                <td className="px-4 py-2">1.5 - 2.0</td>
                <td className="px-4 py-2">Alto</td>
                <td className="px-4 py-2">Se requieren medidas inmediatas de control.</td>
            </tr>
        </tbody>
    </table>
</section>

            </section>
{/* Bloque Resultados del Análisis del Mapa de Calor */}
<section>
    <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
        <MapPinned className="mr-2 text-green-600" /> Resultados del Análisis: Mapa de Calor Cenicilla
    </h2>
    <p className="text-gray-700 mb-4">
        Se presenta el análisis de la distribución espacial del riesgo de cenicilla polvorienta, basado en un mapa de calor generado con datos recopilados del 18 de enero al 5 de marzo del 2025.
    </p>
    <div className="mt-4 bg-gray-100 rounded-lg shadow p-4">
        <img
            src="/assets/kokitos/mapa_calor_cenicilla.png"
            alt="Mapa de Calor Cenicilla"
            className="w-full rounded-lg shadow-md"
        />
    </div>
</section>

        </div>
    );
};

export default KokitosCase;