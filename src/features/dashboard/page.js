import React, { useEffect, useState } from 'react';
import { getStats, listEvents } from './api';
import { AuthStore } from '../../store';
import Button from '../../components/button';
import Alert from '../../components/alert';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c', '#d0ed57', '#8dd1e1', '#83a6ed'];

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
            setStats(resp.data); // solo el objeto data
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
            setEvents(data?.events || []);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, searchParams]);

    const handleSearch = async () => {
        setSearchLoading(true);
        setSearchParams({ from, to });
        setTimeout(() => setSearchLoading(false), 700); // Simulación visual
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
                <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-300 py-10">
            <div className="max-w-4xl mx-auto px-4">
                {/* ALERTA de error global */}
                {error && showError && (
                    <Alert
                        type="error"
                        message={`Error al cargar la información: ${error}`}
                        onClose={() => setShowError(false)}
                    />
                )}

                <h1 className="text-3xl font-bold mb-6 text-neutral-800">
                    Bienvenido 👋
                </h1>

                {/* Filtros de fechas y botones */}
                <div className="flex flex-wrap gap-4 mb-6 items-center">
                    <label className="text-neutral-700">
                        Desde:{" "}
                        <input
                            type="date"
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                            className="rounded px-2 py-1 border border-neutral-300 bg-white focus:border-primary focus:ring-primary"
                        />
                    </label>
                    <label className="text-neutral-700">
                        Hasta:{" "}
                        <input
                            type="date"
                            value={to}
                            onChange={e => setTo(e.target.value)}
                            className="rounded px-2 py-1 border border-neutral-300 bg-white focus:border-primary focus:ring-primary"
                        />
                    </label>
                    <Button
                        variant="primary"
                        size="md"
                        loading={searchLoading}
                        disabled={searchLoading || loading}
                        className="rounded-lg font-bold shadow-sm"
                        onClick={handleSearch}
                    >
                        Buscar
                    </Button>
                    <Button
                        variant="secondary"
                        size="md"
                        loading={reloadLoading}
                        disabled={reloadLoading || loading}
                        className="rounded-lg font-bold shadow-sm"
                        onClick={handleReload}
                    >
                        Recargar
                    </Button>
                </div>

                {/* Estadísticas principales */}
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

                {/* Gráfica de evolución de clics por fecha */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold mb-3 text-neutral-800">Evolución de clics por fecha</h2>
                    <div className="w-full h-60 bg-white rounded-xl shadow p-4">
                        {(stats && stats.clicksByDate && stats.clicksByDate.length > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.clicksByDate}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-neutral-400 text-center pt-10">No hay datos para mostrar</div>
                        )}
                    </div>
                </section>

                {/* Gráficas de barras y pastel para referrer, device, browser, OS, country, city */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatChartBar title="Clicks por referrer" data={stats?.clicksByReferrer} dataKey="referrer" />
                    <StatPieChart title="Clicks por dispositivo" data={stats?.clicksByDevice} dataKey="device" />
                    <StatPieChart title="Clicks por navegador" data={stats?.clicksByBrowser} dataKey="browser" />
                    <StatPieChart title="Clicks por OS" data={stats?.clicksByOS} dataKey="os" />
                    <StatChartBar title="Clicks por país" data={stats?.clicksByCountry} dataKey="country" />
                    <StatChartBar title="Clicks por ciudad" data={stats?.clicksByCity} dataKey="city" />
                </div>

                {/* Eventos recientes */}
                <section className="bg-white/95 backdrop-blur rounded-xl shadow p-6 mt-8">
                    <h2 className="text-xl font-bold mb-4 text-neutral-800">
                        Actividad reciente
                    </h2>
                    {eventsLoading ? (
                        <div className="flex justify-center items-center min-h-[80px]">
                            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                        </div>
                    ) : eventsError ? (
                        <Alert
                            type="error"
                            message={eventsError}
                            onClose={() => setEventsError(null)}
                        />
                    ) : events.length === 0 ? (
                        <div className="text-neutral-500">
                            No hay eventos recientes en este rango de fechas.
                        </div>
                    ) : (
                        <ul className="divide-y divide-neutral-200">
                            {events.map((ev, idx) => (
                                <li
                                    key={ev.id || idx}
                                    className="py-2 flex items-center gap-2 text-neutral-800"
                                >
                                    <span className="text-lg">
                                        {ev.type === "click" && "🖱️"}
                                        {ev.type === "create" && "➕"}
                                        {ev.type === "edit" && "✏️"}
                                    </span>
                                    <span>
                                        <b>{ev.type.toUpperCase()}</b> — {ev.shortUrl || ev.target || "Enlace"} —{" "}
                                        <span className="text-xs text-neutral-500">
                                            {new Date(ev.timestamp).toLocaleString()}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
};

const StatBox = ({ label, value, icon }) => (
    <div className="flex-1 min-w-[150px] bg-neutral-50 rounded-lg p-4 flex flex-col items-center shadow border border-neutral-200">
        <span className="text-3xl mb-2">{icon}</span>
        <span className="text-2xl font-bold text-neutral-800">{value}</span>
        <span className="text-sm text-neutral-500">{label}</span>
    </div>
);

// Gráfico de barras reutilizable
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
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        ) : (
            <div className="text-neutral-400 text-center pt-10">No hay datos para mostrar</div>
        )}
    </section>
);

// Gráfico de pastel reutilizable
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
                        fill="#8884d8"
                        label
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
            <div className="text-neutral-400 text-center pt-10">No hay datos para mostrar</div>
        )}
    </section>
);

export default Dashboard;