// Cloudflare Pages Function — Analytics metrics endpoint
// GET /api/metrics?key=isd-admin-2024 — returns dashboard data

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Simple auth
  const key = url.searchParams.get("key");
  if (key !== "isd-admin-2024") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: CORS_HEADERS,
    });
  }

  try {
    const todayKey = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

    // Total visitors today
    const totalVisits = parseInt(await env.ANALYTICS_KV.get(`counter:${todayKey}`) || "0");

    // Unique visitors
    const uniqueList = JSON.parse(await env.ANALYTICS_KV.get(`unique:${todayKey}`) || "[]");

    // Recent visitors (last 50)
    const visitorList = await env.ANALYTICS_KV.list({ prefix: `visitors:${todayKey}:` });
    const recentVisitors = [];
    for (const entry of visitorList.keys.slice(-50).reverse()) {
      const data = JSON.parse(await env.ANALYTICS_KV.get(entry.name) || "{}");
      recentVisitors.push(data);
    }

    // Active visitors
    const activeList = await env.ANALYTICS_KV.list({ prefix: "active:" });
    const activeVisitors = [];
    for (const entry of activeList.keys) {
      const data = JSON.parse(await env.ANALYTICS_KV.get(entry.name) || "{}");
      activeVisitors.push({ ip: entry.name.replace("active:", ""), ...data });
    }

    // Events today
    const eventList = await env.ANALYTICS_KV.list({ prefix: `events:${todayKey}:` });
    const events = [];
    for (const entry of eventList.keys.slice(-30).reverse()) {
      const data = JSON.parse(await env.ANALYTICS_KV.get(entry.name) || "{}");
      events.push(data);
    }

    // Event counters
    const eventCounters = {};
    const eventCounterList = await env.ANALYTICS_KV.list({ prefix: `eventcounter:${todayKey}:` });
    for (const entry of eventCounterList.keys) {
      const name = entry.name.split(":").pop();
      const count = await env.ANALYTICS_KV.get(entry.name);
      eventCounters[name] = parseInt(count || "0");
    }

    // Hourly visits
    const hourly = [];
    for (let h = 0; h < 24; h++) {
      const count = parseInt(await env.ANALYTICS_KV.get(`hourly:${todayKey}:${h}`) || "0");
      hourly.push(count);
    }

    // Last 7 days
    const daily = [];
    for (let d = 6; d >= 0; d--) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      const dateKey = date.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
      const count = parseInt(await env.ANALYTICS_KV.get(`counter:${dateKey}`) || "0");
      const uniques = JSON.parse(await env.ANALYTICS_KV.get(`unique:${dateKey}`) || "[]");
      daily.push({ date: dateKey, visits: count, uniques: uniques.length });
    }

    const metrics = {
      today: {
        totalVisits,
        uniqueVisitors: uniqueList.length,
        activeVisitors: activeVisitors.length,
        events: eventCounters,
        hourly,
      },
      last7days: daily,
      recentVisitors,
      activeVisitors,
      events,
      timestamp: Date.now(),
    };

    return new Response(JSON.stringify(metrics), { headers: CORS_HEADERS });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
