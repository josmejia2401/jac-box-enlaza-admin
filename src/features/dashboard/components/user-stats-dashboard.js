import React, { useEffect, useState, useCallback } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import { AuthStore } from '../../../store';
import { findStatsUser } from "./api";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function UserStatsDashboard() {
    const [id] = useState(AuthStore.getState().tokenInfo.keyid);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchForm = useCallback(async () => {
        setLoading(true);
        setError("");
        findStatsUser(id)
            .then(json => {
                setStats(json.data);
                setLoading(false);
            })
            .catch(err => {
                setError("No se pudieron cargar las estadísticas.");
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        fetchForm();
    }, [fetchForm]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <svg
                    className="animate-spin h-10 w-10 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ArrowPathIcon
                        className="w-6 h-6 text-red-400 animate-spin"
                        aria-hidden="true"
                    />
                    <p className="text-sm text-red-700 font-medium">
                        Error al cargar el formulario: <span className="font-normal">{error}</span>
                    </p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                        onClick={fetchForm}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        <ArrowPathIcon className="w-5 h-5 mr-1" />
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (!stats)
        return null;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Resumen de Usuario</h1>
                <button
                    onClick={fetchForm}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    title="Refrescar estadísticas"
                >
                    <ArrowPathIcon className="w-5 h-5 mr-1" />
                    Refrescar
                </button>
            </div>

            {/* Cards de resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SummaryCard label="Formularios creados" value={stats.totalForms} />
                <SummaryCard label="Respuestas totales" value={stats.totalResponses} />
                <SummaryCard
                    label="Promedio por formulario"
                    value={Number(stats.avgResponsesPerForm).toFixed(1)}
                />
            </div>

            {/* Gráfico de barras: Respuestas por día */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Respuestas recibidas por día
                    </h2>
                    <button
                        onClick={fetchForm}
                        className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors shadow focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        title="Refrescar gráfico"
                    >
                        <ArrowPathIcon className="w-4 h-4 mr-1" />
                        Refrescar
                    </button>
                </div>
                <div className="w-full h-72">
                    <ResponsiveContainer>
                        <BarChart
                            data={stats.responsesPerDay.map(d => ({
                                ...d,
                                count: Number(d.count)
                            }))}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Card: Formulario con más respuestas */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        Formulario con más respuestas
                    </h2>
                    {stats.topForm ? (
                        <>
                            <div className="font-medium text-gray-800">
                                {stats.topForm.title}
                            </div>
                            <div className="text-gray-500 text-sm">
                                Respuestas: <span className="font-bold">{stats.topForm.responseCount}</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-400">Sin datos</div>
                    )}
                </div>
                {stats.lastResponseDate && (
                    <div className="mt-4 sm:mt-0 sm:ml-8 text-sm text-gray-500">
                        Última respuesta:{" "}
                        <span className="font-semibold">
                            {new Date(stats.lastResponseDate).toLocaleString("es-ES")}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

function SummaryCard({ label, value }) {
    return (
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">{value}</div>
            <div className="text-gray-600 text-sm text-center">{label}</div>
        </div>
    );
}