"use client";

import { useState, useEffect } from "react";

const API_KEY = "isd-admin-2024";

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const loadData = async () => {
    try {
      const dateParam = selectedDate ? `&date=${selectedDate}` : "";
      const res = await fetch(`/api/metrics?key=${API_KEY}${dateParam}`);
      const json = await res.json();
      if (json.error) setError(json.error);
      else { setData(json); setError(""); }
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // 15s auto-refresh
    return () => clearInterval(interval);
  }, [selectedDate]);

  if (loading) return <div className="min-h-screen bg-[#050510] flex items-center justify-center text-gray-400 text-lg">Cargando...</div>;
  if (error) return <div className="min-h-screen bg-[#050510] flex items-center justify-center"><div className="text-red-400">Error: {error}<button onClick={loadData} className="block mt-4 cta-primary text-white px-6 py-3 rounded-xl">Reintentar</button></div></div>;
  if (!data) return null;

  const d = data.today;
  const hourly = d.hourly || [];
  const maxHourly = Math.max(...hourly, 1);
  const totalEvents = Object.values(d.events || {}).reduce((a: any, b: any) => a + b, 0) as number;
  const conversionRate = d.totalVisits > 0 ? ((totalEvents / d.totalVisits) * 100).toFixed(1) : "0";
  const bounceRate = d.totalVisits > 0 ? (((d.totalVisits - totalEvents) / d.totalVisits) * 100).toFixed(0) : "0";

  return (
    <main className="min-h-screen bg-[#050510] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">📊 Analytics</h1>
            <p className="text-gray-500 text-sm mt-1">
              {data.date} · <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> <span className="text-emerald-400">Live · 15s refresh</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date filter */}
            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none">
              <option value="">Hoy</option>
              {data.availableDates?.map((ad: any) => (
                <option key={ad.date} value={ad.date}>{ad.date} ({ad.visits} visits)</option>
              ))}
            </select>
            <button onClick={loadData} className="cta-primary text-white font-bold px-5 py-2.5 rounded-lg text-sm">↻ Refresh</button>
          </div>
        </div>

        {/* LIVE banner */}
        {d.activeVisitors > 0 && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold text-lg">{d.activeVisitors} {d.activeVisitors === 1 ? "persona viendo AHORA" : "personas viendo AHORA"}</span>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          <Card label="Total Visits" value={d.totalVisits} color="white" />
          <Card label="Unique" value={d.uniqueVisitors} color="pink" />
          <Card label="🔴 EN VIVO" value={d.activeVisitors} color="green" pulse />
          <Card label="Avg Time" value={`${d.avgTimeOnPage || 0}s`} color="blue" />
          <Card label="Conv. Rate" value={`${conversionRate}%`} color="green" />
          <Card label="Bounce Rate" value={`${bounceRate}%`} color="pink" />
        </div>

        {/* Events + Device split */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Click Actions</h3>
            <div className="space-y-3">
              {Object.entries(d.events || {}).map(([name, count]: any) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-white/5 rounded-full h-2 overflow-hidden"><div className="h-full bg-gradient-to-r from-brand-purple to-brand-hot-pink rounded-full" style={{ width: `${d.totalVisits > 0 ? (count / d.totalVisits * 100) : 0}%` }} /></div>
                    <span className="text-lg font-black text-white w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
              {totalEvents === 0 && <p className="text-gray-500 text-sm">No button clicks yet today.</p>}
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Device Split</h3>
            <div className="flex items-center gap-6">
              <div className="text-center"><div className="text-3xl font-black text-white">{d.mobile || 0}</div><div className="text-xs text-gray-500 mt-1">📱 Mobile</div></div>
              <div className="text-center"><div className="text-3xl font-black text-white">{d.desktop || 0}</div><div className="text-xs text-gray-500 mt-1">💻 Desktop</div></div>
              <div className="text-center"><div className="text-3xl font-black text-purple-400">{d.metaBrowser || 0}</div><div className="text-xs text-gray-500 mt-1">📱 IG/FB Browser</div></div>
            </div>
          </div>
        </div>

        {/* Hourly Chart */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Visits by Hour</h3>
          <div className="flex items-end gap-1 h-32">
            {hourly.map((v: number, i: number) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-brand-purple to-brand-hot-pink rounded-t opacity-80 hover:opacity-100" style={{ height: `${(v / maxHourly) * 100}%`, minHeight: v > 0 ? "4px" : "0" }} title={`${i}:00 — ${v}`} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span></div>
        </div>

        {/* Active Visitors */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Active Visitors (Live)</h3>
          <div className="overflow-x-auto">
            <table className="w-full"><thead><tr className="border-b border-white/5">{["IP", "City", "Country", "Device", "Page", "Status"].map(h => <th key={h} className="text-left text-xs text-gray-500 uppercase px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>{data.activeVisitors?.map((v: any, i: number) => (
              <tr key={i} className="border-b border-white/[0.02]">
                <td className="px-4 py-3 text-sm text-gray-300">{v.ip}</td><td className="px-4 py-3 text-sm text-gray-300">{v.city}</td><td className="px-4 py-3 text-sm text-gray-300">{v.country}</td>
                <td className="px-4 py-3 text-sm">{v.isMetaBrowser ? <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400">IG/FB</span> : <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400">Direct</span>}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{v.path}</td><td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">ACTIVE</span></td>
              </tr>
            )) || <tr><td colSpan={6} className="text-center py-8 text-gray-500">No active visitors</td></tr>}</tbody>
          </table>
        </div></div>

        {/* Recent Visitors with time on page */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Recent Visitors</h3>
          <div className="overflow-x-auto">
            <table className="w-full"><thead><tr className="border-b border-white/5">{["IP", "City", "Country", "Device", "Time", "Scroll", "Exit"].map(h => <th key={h} className="text-left text-xs text-gray-500 uppercase px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>{data.recentVisitors?.slice(0, 20).map((v: any, i: number) => (
              <tr key={i} className="border-b border-white/[0.02]">
                <td className="px-4 py-3 text-sm text-gray-300">{v.ip}</td><td className="px-4 py-3 text-sm text-gray-300">{v.city}</td><td className="px-4 py-3 text-sm text-gray-300">{v.country}</td>
                <td className="px-4 py-3 text-sm">{v.isMetaBrowser ? <span className="text-xs text-purple-400">IG/FB</span> : <span className="text-xs text-blue-400">Direct</span>}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{v.timeOnPage ? `${v.timeOnPage}s` : "—"}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{v.scrollDepth ? `${v.scrollDepth}%` : "—"}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{v.endReason || "—"}</td>
              </tr>
            )) || <tr><td colSpan={7} className="text-center py-8 text-gray-500">No visitors yet</td></tr>}</tbody>
          </table>
        </div></div>

        {/* Top Cities */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Top Cities</h3>
          <div className="space-y-2">
            {data.topCities?.map(([city, count]: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.02]">
                <span className="text-sm text-gray-300">{city}</span>
                <div className="flex items-center gap-3"><div className="w-32 bg-white/5 rounded-full h-2"><div className="h-full bg-gradient-to-r from-brand-bright-blue to-brand-hot-pink rounded-full" style={{ width: `${(count / d.totalVisits * 100)}%` }} /></div><span className="text-sm font-bold text-white w-6">{count}</span></div>
              </div>
            )) || <p className="text-gray-500 text-sm">No data</p>}
          </div>
        </div>

        {/* Last 7 Days */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Last 7 Days</h3>
          <div className="overflow-x-auto">
            <table className="w-full"><thead><tr className="border-b border-white/5">{["Date", "Visits", "Unique", "Avg Time", "Mobile", "Desktop", "IG/FB"].map(h => <th key={h} className="text-left text-xs text-gray-500 uppercase px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>{data.last7days?.map((day: any, i: number) => (
              <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelectedDate(day.date)}>
                <td className="px-4 py-3 text-sm text-gray-300">{day.date}</td><td className="px-4 py-3 text-sm font-bold text-white">{day.visits}</td><td className="px-4 py-3 text-sm gradient-brand-text font-bold">{day.uniques}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{day.avgTime ? `${day.avgTime}s` : "—"}</td><td className="px-4 py-3 text-sm text-gray-300">{day.mobile || 0}</td><td className="px-4 py-3 text-sm text-gray-300">{day.desktop || 0}</td><td className="px-4 py-3 text-sm text-purple-400">{day.metaBrowser || 0}</td>
              </tr>
            ))}</tbody>
          </table>
        </div></div>

        <div className="text-center text-gray-600 text-xs mb-4">Last updated: {new Date(data.timestamp).toLocaleTimeString()}</div>
      </div>
    </main>
  );
}

function Card({ label, value, color, pulse }: { label: string; value: any; color: string; pulse?: boolean }) {
  const c = { white: "text-white", green: "text-[#25D366]", pink: "gradient-brand-text", blue: "text-[#2D7FE0]" }[color] || "text-white";
  return (
    <div className={`bg-white/[0.03] border rounded-2xl p-4 lg:p-6 ${pulse ? "border-emerald-500/40 animate-pulse" : "border-white/5"}`}>
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{label}</div>
      <div className={`text-2xl lg:text-4xl font-black ${c} ${pulse ? "animate-pulse" : ""}`}>{value}</div>
    </div>
  );
}
