"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════
   ADMIN DASHBOARD — Real-time analytics
   ═══════════════════════════════════════════════════ */

const API_KEY = "isd-admin-2024";
const API_URL = `/api/metrics?key=${API_KEY}`;

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setData(json);
        setError("");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-gray-400 text-lg">Cargando métricas...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">Error: {error}</div>
          <button onClick={loadData} className="cta-primary text-white px-6 py-3 rounded-xl">Reintentar</button>
        </div>
      </main>
    );
  }

  if (!data) return null;

  const hourly = data.today.hourly || [];
  const maxHourly = Math.max(...hourly, 1);

  return (
    <main className="min-h-screen bg-[#050510] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">📊 Analytics Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Imagine Studio Design · Wilmington, NC
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-2" />
              <span className="text-emerald-400 ml-1">Live</span>
            </p>
          </div>
          <button
            onClick={loadData}
            className="cta-primary text-white font-bold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <MetricCard label="Total Visits Today" value={data.today.totalVisits} color="white" />
          <MetricCard label="Unique Visitors" value={data.today.uniqueVisitors} color="pink" />
          <MetricCard label="Active Now" value={data.today.activeVisitors} color="green" />
          <MetricCard label="Get Directions" value={data.today.events["Get Directions"] || 0} color="blue" />
          <MetricCard label="Calls" value={data.today.events["Call Us"] || 0} color="green" />
          <MetricCard label="Visit Intent" value={data.today.events["VisitIntent"] || 0} color="pink" />
        </div>

        {/* Hourly Chart */}
        <Section title="Visits by Hour (Today)">
          <div className="flex items-end gap-1 h-32">
            {hourly.map((v: number, i: number) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-brand-purple to-brand-hot-pink rounded-t opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${(v / maxHourly) * 100}%`, minHeight: v > 0 ? "4px" : "0" }}
                title={`${i}:00 — ${v} visits`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span>
          </div>
        </Section>

        {/* Active Visitors */}
        <Section title="Active Visitors (Last 5 min)">
          <Table
            headers={["IP", "City", "Country", "Page", "Status"]}
            rows={data.activeVisitors.map((v: any) => [
              v.ip,
              v.city,
              v.country,
              v.path,
              <span className="inline-block px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold">ACTIVE</span>
            ])}
            emptyText="No active visitors right now"
          />
        </Section>

        {/* Recent Visitors */}
        <Section title="Recent Visitors (Last 50)">
          <Table
            headers={["IP", "City", "Country", "Page", "Time"]}
            rows={data.recentVisitors.map((v: any) => [
              v.ip,
              v.city,
              v.country,
              v.path,
              new Date(v.timestamp).toLocaleTimeString()
            ])}
            emptyText="No visitors yet today"
          />
        </Section>

        {/* Events */}
        <Section title="Recent Events (Last 30)">
          <Table
            headers={["Event", "IP", "City", "Country", "Page", "Time"]}
            rows={data.events.map((e: any) => [
              <span className="font-bold text-brand-hot-pink">{e.name}</span>,
              e.ip,
              e.city,
              e.country,
              e.path,
              new Date(e.timestamp).toLocaleTimeString()
            ])}
            emptyText="No events tracked yet"
          />
        </Section>

        {/* Last 7 Days */}
        <Section title="Last 7 Days">
          <Table
            headers={["Date", "Total Visits", "Unique Visitors"]}
            rows={data.last7days.map((d: any) => [
              d.date,
              <span className="font-bold">{d.visits}</span>,
              <span className="font-bold gradient-brand-text">{d.uniques}</span>
            ])}
            emptyText="No data yet"
          />
        </Section>

        <div className="text-center text-gray-600 text-xs mt-8 mb-4">
          Auto-refresh every 30s · Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </main>
  );
}

function MetricCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorClass = {
    white: "text-white",
    green: "text-[#25D366]",
    pink: "gradient-brand-text",
    blue: "text-[#2D7FE0]",
  }[color] || "text-white";

  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 lg:p-6">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{label}</div>
      <div className={`text-2xl lg:text-4xl font-black ${colorClass}`}>{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Table({ headers, rows, emptyText }: { headers: string[]; rows: any[][]; emptyText: string }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-8 text-center text-gray-500">
        {emptyText}
      </div>
    );
  }
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            {headers.map((h, i) => (
              <th key={i} className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.02]">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-sm text-gray-300">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
