// Cloudflare Pages Function — Analytics tracking endpoint
// POST /api/track — receives tracking events from frontend

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

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

      // Store visitor record
      await env.ANALYTICS_KV.put(
        `visitors:${todayKey}:${now}:${ip}`,
        JSON.stringify(visitor),
        { expirationTtl: 86400 * 7 }
      );

      // Update daily counter
      const counterKey = `counter:${todayKey}`;
      const current = parseInt(await env.ANALYTICS_KV.get(counterKey) || "0");
      await env.ANALYTICS_KV.put(counterKey, String(current + 1), { expirationTtl: 86400 * 7 });

      // Update unique visitors
      const uniqueKey = `unique:${todayKey}`;
      const uniqueList = JSON.parse(await env.ANALYTICS_KV.get(uniqueKey) || "[]");
      if (!uniqueList.includes(ip)) {
        uniqueList.push(ip);
        await env.ANALYTICS_KV.put(uniqueKey, JSON.stringify(uniqueList), { expirationTtl: 86400 * 7 });
      }

      // Update active visitors (5 min window)
      await env.ANALYTICS_KV.put(
        `active:${ip}`,
        JSON.stringify({ path: visitor.path, timestamp: now, city, country }),
        { expirationTtl: 300 }
      );

      // Track hourly visits
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

      const eventKey = `events:${todayKey}:${now}:${ip}:${body.eventName}`;
      await env.ANALYTICS_KV.put(eventKey, JSON.stringify(event), { expirationTtl: 86400 * 7 });

      // Update event counter
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
