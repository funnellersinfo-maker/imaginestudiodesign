// Cloudflare Pages Function — Analytics metrics endpoint v2 (enhanced)
// GET /api/metrics?key=isd-admin-2024&date=YYYY-MM-DD

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const key = url.searchParams.get("key");
  if (key !== "isd-admin-2024") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: CORS_HEADERS,
    });
  }

  try {
    const selectedDate = url.searchParams.get("date");
    const todayKey = selectedDate || new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

    // Total visitors
    const totalVisits = parseInt(await env.ANALYTICS_KV.get(`counter:${todayKey}`) || "0");

    // Unique visitors
    const uniqueList = JSON.parse(await env.ANALYTICS_KV.get(`unique:${todayKey}`) || "[]");

    // Active visitors
    const activeData = JSON.parse(await env.ANALYTICS_KV.get(`activeList:${todayKey}`) || "[]");

    // Recent visitors
    const recentVisitors = JSON.parse(await env.ANALYTICS_KV.get(`recentLog:${todayKey}`) || "[]");

    // Events
    const events = JSON.parse(await env.ANALYTICS_KV.get(`eventLog:${todayKey}`) || "[]");

    // Event counters
    const eventNames = ["Get Directions", "Call Us", "VisitIntent", "WhatsApp"];
    const eventCounters = {};
    for (const name of eventNames) {
      const count = parseInt(await env.ANALYTICS_KV.get(`eventcounter:${todayKey}:${name}`) || "0");
      if (count > 0) eventCounters[name] = count;
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
      const avgData = JSON.parse(await env.ANALYTICS_KV.get(`avgTime:${dateKey}`) || '{"total":0,"count":0}');
      const mobileCount = parseInt(await env.ANALYTICS_KV.get(`device:${dateKey}:mobile`) || "0");
      const desktopCount = parseInt(await env.ANALYTICS_KV.get(`device:${dateKey}:desktop`) || "0");
      const metaCount = parseInt(await env.ANALYTICS_KV.get(`metaBrowser:${dateKey}`) || "0");
      daily.push({
        date: dateKey, visits: count, uniques: uniques.length,
        avgTime: avgData.count > 0 ? Math.round(avgData.total / avgData.count) : 0,
        mobile: mobileCount, desktop: desktopCount, metaBrowser: metaCount,
      });
    }

    // Available dates (for history selector)
    const availableDates = [];
    for (let d = 0; d < 30; d++) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      const dateKey = date.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
      const count = parseInt(await env.ANALYTICS_KV.get(`counter:${dateKey}`) || "0");
      if (count > 0) availableDates.push({ date: dateKey, visits: count });
    }

    // Avg time on page today
    const avgData = JSON.parse(await env.ANALYTICS_KV.get(`avgTime:${todayKey}`) || '{"total":0,"count":0}');
    const avgTime = avgData.count > 0 ? Math.round(avgData.total / avgData.count) : 0;

    // Device split
    const mobileCount = parseInt(await env.ANALYTICS_KV.get(`device:${todayKey}:mobile`) || "0");
    const desktopCount = parseInt(await env.ANALYTICS_KV.get(`device:${todayKey}:desktop`) || "0");

    // Meta browser count
    const metaCount = parseInt(await env.ANALYTICS_KV.get(`metaBrowser:${todayKey}`) || "0");

    // Top cities
    const cityMap = {};
    for (const v of recentVisitors) {
      const c = v.city || "unknown";
      cityMap[c] = (cityMap[c] || 0) + 1;
    }
    const topCities = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 10);

    const metrics = {
      date: todayKey,
      today: {
        totalVisits,
        uniqueVisitors: uniqueList.length,
        activeVisitors: activeData.length,
        events: eventCounters,
        hourly,
        avgTimeOnPage: avgTime,
        mobile: mobileCount,
        desktop: desktopCount,
        metaBrowser: metaCount,
      },
      last7days: daily,
      recentVisitors,
      activeVisitors: activeData,
      events,
      topCities,
      availableDates,
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
