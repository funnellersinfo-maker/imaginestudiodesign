// Cloudflare Pages Function — Analytics tracking endpoint (optimized, no list())
// POST /api/track — receives tracking events from frontend

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const MAX_RECENT = 50; // Keep last 50 visitors
const MAX_EVENTS = 30;  // Keep last 30 events

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const cf = request.cf || {};
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const country = cf.country || "unknown";
    const city = cf.city || "unknown";
    const region = cf.region || "unknown";
    const now = Date.now();
    const todayKey = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

    if (body.type === "pageview") {
      const visitor = {
        ip, country, city, region,
        path: body.path || "/",
        referrer: body.referrer || "",
        timestamp: now,
        userAgent: request.headers.get("User-Agent") || "unknown",
      };

      // 1. Update daily counter (single key)
      const counterKey = `counter:${todayKey}`;
      const current = parseInt(await env.ANALYTICS_KV.get(counterKey) || "0");
      await env.ANALYTICS_KV.put(counterKey, String(current + 1), { expirationTtl: 86400 * 7 });

      // 2. Update unique visitors (single key with array)
      const uniqueKey = `unique:${todayKey}`;
      const uniqueList = JSON.parse(await env.ANALYTICS_KV.get(uniqueKey) || "[]");
      if (!uniqueList.includes(ip)) {
        uniqueList.push(ip);
        await env.ANALYTICS_KV.put(uniqueKey, JSON.stringify(uniqueList), { expirationTtl: 86400 * 7 });
      }

      // 3. Update rolling recent visitors log (single key, no list())
      const recentKey = `recentLog:${todayKey}`;
      const recentList = JSON.parse(await env.ANALYTICS_KV.get(recentKey) || "[]");
      recentList.push(visitor);
      if (recentList.length > MAX_RECENT) recentList.shift();
      await env.ANALYTICS_KV.put(recentKey, JSON.stringify(recentList), { expirationTtl: 86400 * 7 });

      // 4. Update active visitors (single key with array, 5 min window)
      const activeKey = `activeList:${todayKey}`;
      const activeList = JSON.parse(await env.ANALYTICS_KV.get(activeKey) || "[]");
      // Remove expired entries (older than 5 min)
      const fiveMinAgo = now - 300000;
      const filtered = activeList.filter(v => v.timestamp > fiveMinAgo);
      // Update or add this visitor
      const existingIdx = filtered.findIndex(v => v.ip === ip);
      const activeEntry = { ip, path: visitor.path, timestamp: now, city, country };
      if (existingIdx >= 0) {
        filtered[existingIdx] = activeEntry;
      } else {
        filtered.push(activeEntry);
      }
      await env.ANALYTICS_KV.put(activeKey, JSON.stringify(filtered), { expirationTtl: 86400 * 7 });

      // 5. Track hourly visits (single key per hour)
      const hour = new Date().getHours();
      const hourlyKey = `hourly:${todayKey}:${hour}`;
      const hourCount = parseInt(await env.ANALYTICS_KV.get(hourlyKey) || "0");
      await env.ANALYTICS_KV.put(hourlyKey, String(hourCount + 1), { expirationTtl: 86400 * 7 });

    } else if (body.type === "event") {
      const event = {
        type: body.eventType || "click",
        name: body.eventName || "unknown",
        ip, country, city,
        path: body.path || "/",
        timestamp: now,
      };

      // 1. Update rolling event log (single key, no list())
      const eventLogKey = `eventLog:${todayKey}`;
      const eventList = JSON.parse(await env.ANALYTICS_KV.get(eventLogKey) || "[]");
      eventList.push(event);
      if (eventList.length > MAX_EVENTS) eventList.shift();
      await env.ANALYTICS_KV.put(eventLogKey, JSON.stringify(eventList), { expirationTtl: 86400 * 7 });

      // 2. Update event counter (single key per event name)
      const eventCounterKey = `eventcounter:${todayKey}:${body.eventName}`;
      const eventCount = parseInt(await env.ANALYTICS_KV.get(eventCounterKey) || "0");
      await env.ANALYTICS_KV.put(eventCounterKey, String(eventCount + 1), { expirationTtl: 86400 * 7 });
    }

    return new Response(JSON.stringify({ success: true }), { headers: CORS_HEADERS });
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
