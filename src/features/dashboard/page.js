import React, { useEffect, useState } from 'react';
import { getStats, listEvents } from './api';
import { AuthStore } from '../../store';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#06b6d4", "#9333ea"];

const normalizeData = (arr, key) => {
    return (arr || []).map(item => ({
        ...item,
        [key]: item[key] && item[key].trim() !== "" ? item[key] : "Desconocido",
        count: Number(item.count) || 0,
    }));
};

const Dashboard = () => {
    const userId = AuthStore.getState().tokenInfo.keyid;
    const [stats, setStats] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [eventsError, setEventsError] = useState(null);
    const [showError, setShowError] = useState(true);

    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    const [from, setFrom] = useState(weekAgo.toISOString().split('T')[0]);
    const [to, setTo] = useState(today.toISOString().split('T')[0]);
    const [searchParams, setSearchParams] = useState({ from, to });

    const [searchLoading, setSearchLoading] = useState(false);
    const [reloadLoading, setReloadLoading] = useState(false);

    const fetchStats = async (f = searchParams.from, t = searchParams.to) => {
        setLoading(true);
        try {
            const resp = await getStats('user', userId, { from: f, to: t });
            setStats(resp.data);
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar las estadísticas.');
        }
        setLoading(false);
    };

    const fetchEvents = async (f = searchParams.from, t = searchParams.to) => {
        setEventsLoading(true);
        try {
            const data = await listEvents('user', userId, { from: f, to: t, limit: 10 });
            setEvents(data?.data || []);
            setEventsError(null);
        } catch (err) {
            setEventsError('No se pudieron cargar los eventos.');
        }
        setEventsLoading(false);
    };

    useEffect(() => {
        if (userId) {
            fetchStats();
            fetchEvents();
        }
    }, [userId, searchParams]);

    const handleSearch = async () => {
        setSearchLoading(true);
        setSearchParams({ from, to });
        setTimeout(() => setSearchLoading(false), 700);
    };

    const handleReload = async () => {
        setReloadLoading(true);
        await fetchStats();
        await fetchEvents();
        setTimeout(() => setReloadLoading(false), 700);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-300 py-10">
            <div className="max-w-5xl mx-auto px-4">
                {error && showError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex justify-between items-center">
                        <span>Error al cargar la información: {error}</span>
                        <button className="ml-4 text-sm text-red-600 hover:underline" onClick={() => setShowError(false)}>Cerrar</button>
                    </div>
                )}

                <h1 className="text-3xl font-bold mb-6 text-neutral-800">
                    Bienvenido 👋
                </h1>

                <div className="flex flex-wrap gap-4 mb-6 items-center">
                    <label className="text-neutral-700">
                        Desde:{" "}
                        <input
                            type="date"
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                            className="rounded px-2 py-1 border border-neutral-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                        />
                    </label>
                    <label className="text-neutral-700">
                        Hasta:{" "}
                        <input
                            type="date"
                            value={to}
                            onChange={e => setTo(e.target.value)}
                            className="rounded px-2 py-1 border border-neutral-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                        />
                    </label>
                    <button
                        onClick={handleSearch}
                        disabled={searchLoading || loading}
                        className="px-4 py-2 rounded-lg font-bold shadow-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {searchLoading ? 'Buscando...' : 'Buscar'}
                    </button>
                    <button
                        onClick={handleReload}
                        disabled={reloadLoading || loading}
                        className="px-4 py-2 rounded-lg font-bold shadow-sm bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                    >
                        {reloadLoading ? 'Recargando...' : 'Recargar'}
                    </button>
                </div>

                <section className="bg-white/90 backdrop-blur rounded-xl shadow p-6 mb-8 flex flex-wrap gap-6">
                    {error ? (
                        <div className="w-full text-center text-red-500">
                            {error}
                        </div>
                    ) : stats ? (
                        <>
                            <StatBox label="Total de clics" value={stats.totalClicks || 0} icon="👁️" />
                            <StatBox label="Clics únicos" value={stats.uniqueClicks || 0} icon="🧑‍💻" />
                            <StatBox label="Primer clic" value={stats.firstClick ? new Date(stats.firstClick).toLocaleString() : 'N/A'} icon="⏱️" />
                            <StatBox label="Último clic" value={stats.lastClick ? new Date(stats.lastClick).toLocaleString() : 'N/A'} icon="⏱️" />
                        </>
                    ) : null}
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold mb-3 text-neutral-800">
                        Evolución de clics por fecha
                    </h2>
                    <div className="w-full h-60 bg-white rounded-xl shadow p-4">
                        {(stats && stats.clicksByDate && stats.clicksByDate.length > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={stats.clicksByDate.map(item => ({
                                        ...item,
                                        // Convertimos la fecha string en objeto Date
                                        dateObj: new Date(item.date + "T00:00:00")
                                    }))}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="dateObj"
                                        tickFormatter={(d) =>
                                            d.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
                                        }
                                    />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip
                                        labelFormatter={(d) =>
                                            d.toLocaleDateString("es-ES", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            })
                                        }
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="count" stroke="#3b82f6" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-neutral-400 h-full">
                                <span className="text-4xl mb-2">📉</span>
                                <p>No hay datos para mostrar</p>
                            </div>
                        )}
                    </div>
                </section>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatChartBar
                        title="Clicks por referrer"
                        data={normalizeData(stats?.clicksByReferrer, "referrer")}
                        dataKey="referrer"
                    />
                    <StatPieChart
                        title="Clicks por dispositivo"
                        data={normalizeData(stats?.clicksByDevice, "device")}
                        dataKey="device"
                    />
                    <StatPieChart
                        title="Clicks por navegador"
                        data={normalizeData(stats?.clicksByBrowser, "browser")}
                        dataKey="browser"
                    />
                    <StatPieChart
                        title="Clicks por OS"
                        data={normalizeData(stats?.clicksByOS, "os")}
                        dataKey="os"
                    />
                    <StatChartBar
                        title="Clicks por país"
                        data={normalizeData(stats?.clicksByCountry, "country")}
                        dataKey="country"
                    />
                    <StatChartBar
                        title="Clicks por ciudad"
                        data={normalizeData(stats?.clicksByCity, "city")}
                        dataKey="city"
                    />
                </div>


                <section className="bg-white/95 backdrop-blur rounded-xl shadow p-6 mt-8">
                    <h2 className="text-xl font-bold mb-4 text-neutral-800">Actividad reciente</h2>

                    {eventsLoading ? (
                        <div className="flex justify-center items-center min-h-[80px]">
                            <svg
                                className="animate-spin h-8 w-8 text-blue-500"
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
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                        </div>
                    ) : eventsError ? (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex justify-between items-center">
                            <span>{eventsError}</span>
                            <button
                                className="ml-4 text-sm text-red-600 hover:underline"
                                onClick={() => setEventsError(null)}
                            >
                                Cerrar
                            </button>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-neutral-500">
                            No hay eventos recientes en este rango de fechas.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-neutral-600 border-b">
                                        <th className="p-2">Fecha</th>
                                        <th className="p-2">Dispositivo</th>
                                        <th className="p-2">Navegador</th>
                                        <th className="p-2">OS</th>
                                        <th className="p-2">Ubicación</th>
                                        <th className="p-2">Referrer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((ev, idx) => (
                                        <tr
                                            key={ev.id || idx}
                                            className="border-b hover:bg-neutral-50 transition"
                                        >
                                            <td className="p-2 text-sm text-neutral-700">
                                                {new Date(ev.clickedAt).toLocaleString()}
                                            </td>
                                            <td className="p-2 capitalize">{ev.device || "—"}</td>
                                            <td className="p-2">{ev.browser || "—"}</td>
                                            <td className="p-2">{ev.os || "—"}</td>
                                            <td className="p-2">
                                                {ev.country || "—"}
                                                {ev.city ? `, ${ev.city}` : ""}
                                            </td>
                                            <td className="p-2 truncate max-w-[180px] text-neutral-500">
                                                {ev.referrer || "Directo"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
};

const StatBox = ({ label, value, icon }) => (
    <div className="flex-1 min-w-[160px] bg-white rounded-xl p-5 shadow-md border border-neutral-200">
        <div className="flex items-center gap-3">
            <span className="text-4xl text-blue-500">{icon}</span>
            <div>
                <p className="text-sm text-neutral-500">{label}</p>
                <p className="text-2xl font-bold text-neutral-800">{value}</p>
            </div>
        </div>
    </div>
);

const StatChartBar = ({ title, data, dataKey }) => (
    <section className="bg-white rounded-xl shadow p-4 mb-4">
        <h3 className="font-semibold text-neutral-700 mb-2">{title}</h3>
        {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={dataKey} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex flex-col items-center justify-center text-neutral-400 h-[180px]">
                <span className="text-3xl mb-2">📉</span>
                <p>No hay datos para mostrar</p>
            </div>
        )}
    </section>
);

const StatPieChart = ({ title, data, dataKey }) => (
    <section className="bg-white rounded-xl shadow p-4 mb-4">
        <h3 className="font-semibold text-neutral-700 mb-2">{title}</h3>
        {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="count"
                        nameKey={dataKey}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex flex-col items-center justify-center text-neutral-400 h-[180px]">
                <span className="text-3xl mb-2">📉</span>
                <p>No hay datos para mostrar</p>
            </div>
        )}
    </section>
);

export default Dashboard;
