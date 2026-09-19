// Cloudflare Pages Function — Analytics metrics endpoint (optimized, no list())
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

    // Total visitors today (counter, no list())
    const totalVisits = parseInt(await env.ANALYTICS_KV.get(`counter:${todayKey}`) || "0");

    // Unique visitors (array, no list())
    const uniqueList = JSON.parse(await env.ANALYTICS_KV.get(`unique:${todayKey}`) || "[]");

    // Active visitors — use a single key with a list (no list() call)
    const activeData = JSON.parse(await env.ANALYTICS_KV.get(`activeList:${todayKey}`) || "[]");

    // Recent visitors — use a rolling log (no list())
    const recentVisitors = JSON.parse(await env.ANALYTICS_KV.get(`recentLog:${todayKey}`) || "[]");

    // Events today — use a rolling log (no list())
    const events = JSON.parse(await env.ANALYTICS_KV.get(`eventLog:${todayKey}`) || "[]");

    // Event counters (known keys, no list())
    const eventNames = ["Get Directions", "Call Us", "VisitIntent", "Apparel WhatsApp", "Sticky WhatsApp", "Floating WhatsApp", "Hero Mini Form", "Free Quote Form"];
    const eventCounters = {};
    for (const name of eventNames) {
      const count = parseInt(await env.ANALYTICS_KV.get(`eventcounter:${todayKey}:${name}`) || "0");
      if (count > 0) eventCounters[name] = count;
    }

    // Hourly visits (24 known keys, no list())
    const hourly = [];
    for (let h = 0; h < 24; h++) {
      const count = parseInt(await env.ANALYTICS_KV.get(`hourly:${todayKey}:${h}`) || "0");
      hourly.push(count);
    }

    // Last 7 days (7 known keys, no list())
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
        activeVisitors: activeData.length,
        events: eventCounters,
        hourly,
      },
      last7days: daily,
      recentVisitors,
      activeVisitors: activeData,
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
