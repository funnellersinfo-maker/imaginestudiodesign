// Cloudflare Pages Function — Analytics tracking endpoint (optimized v2)
// POST /api/track — receives tracking events from frontend

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const MAX_RECENT = 100;
const MAX_EVENTS = 50;

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const cf = request.cf || {};
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const userAgent = request.headers.get("User-Agent") || "";
    const isMetaBrowser = userAgent.includes("Instagram") || userAgent.includes("FBAN") || userAgent.includes("FBAV");
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
    const country = cf.country || "unknown";
    const city = cf.city || "unknown";
    const region = cf.region || "unknown";
    const postalCode = cf.postalCode || "unknown";
    const timezone = cf.timezone || "unknown";
    const now = Date.now();
    const todayKey = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });

    if (body.type === "pageview") {
      const visitor = {
        ip, country, city, region, postalCode, timezone,
        isMetaBrowser, isMobile,
        path: body.path || "/",
        referrer: body.referrer || "",
        timestamp: now,
        userAgent: userAgent.substring(0, 200),
        sessionId: body.sessionId || ip,
      };

      // 1. Daily counter
      const counterKey = `counter:${todayKey}`;
      const current = parseInt(await env.ANALYTICS_KV.get(counterKey) || "0");
      await env.ANALYTICS_KV.put(counterKey, String(current + 1), { expirationTtl: 86400 * 7 });

      // 2. Unique visitors
      const uniqueKey = `unique:${todayKey}`;
      const uniqueList = JSON.parse(await env.ANALYTICS_KV.get(uniqueKey) || "[]");
      if (!uniqueList.includes(ip)) {
        uniqueList.push(ip);
        await env.ANALYTICS_KV.put(uniqueKey, JSON.stringify(uniqueList), { expirationTtl: 86400 * 7 });
      }

      // 3. Recent visitors log
      const recentKey = `recentLog:${todayKey}`;
      const recentList = JSON.parse(await env.ANALYTICS_KV.get(recentKey) || "[]");
      recentList.push(visitor);
      if (recentList.length > MAX_RECENT) recentList.shift();
      await env.ANALYTICS_KV.put(recentKey, JSON.stringify(recentList), { expirationTtl: 86400 * 7 });

      // 4. Active visitors (5 min window)
      const activeKey = `activeList:${todayKey}`;
      const activeList = JSON.parse(await env.ANALYTICS_KV.get(activeKey) || "[]");
      const fiveMinAgo = now - 300000;
      const filtered = activeList.filter(v => v.timestamp > fiveMinAgo);
      const existingIdx = filtered.findIndex(v => v.ip === ip);
      const activeEntry = { ip, path: visitor.path, timestamp: now, city, country, isMetaBrowser, isMobile, sessionId: visitor.sessionId };
      if (existingIdx >= 0) filtered[existingIdx] = activeEntry;
      else filtered.push(activeEntry);
      await env.ANALYTICS_KV.put(activeKey, JSON.stringify(filtered), { expirationTtl: 86400 * 7 });

      // 5. Hourly visits
      const hour = new Date().getHours();
      const hourlyKey = `hourly:${todayKey}:${hour}`;
      const hourCount = parseInt(await env.ANALYTICS_KV.get(hourlyKey) || "0");
      await env.ANALYTICS_KV.put(hourlyKey, String(hourCount + 1), { expirationTtl: 86400 * 7 });

      // 6. Sessions tracking (time on page)
      const sessionKey = `session:${todayKey}:${body.sessionId || ip}`;
      await env.ANALYTICS_KV.put(sessionKey, JSON.stringify({
        startTime: now,
        lastSeen: now,
        ip, city, country, isMetaBrowser, isMobile,
        path: visitor.path,
        scrollDepth: 0,
        events: [],
      }), { expirationTtl: 86400 * 7 });

      // 7. Mobile vs Desktop counter
      const deviceKey = `device:${todayKey}:${isMobile ? "mobile" : "desktop"}`;
      const deviceCount = parseInt(await env.ANALYTICS_KV.get(deviceKey) || "0");
      await env.ANALYTICS_KV.put(deviceKey, String(deviceCount + 1), { expirationTtl: 86400 * 7 });

      // 8. Meta browser counter
      if (isMetaBrowser) {
        const metaKey = `metaBrowser:${todayKey}`;
        const metaCount = parseInt(await env.ANALYTICS_KV.get(metaKey) || "0");
        await env.ANALYTICS_KV.put(metaKey, String(metaCount + 1), { expirationTtl: 86400 * 7 });
      }

    } else if (body.type === "heartbeat") {
      // Update session time + active visitors
      const sessionKey = `session:${todayKey}:${body.sessionId || ip}`;
      const session = JSON.parse(await env.ANALYTICS_KV.get(sessionKey) || "{}");
      if (session.startTime) {
        session.lastSeen = now;
        session.scrollDepth = Math.max(session.scrollDepth || 0, body.scrollDepth || 0);
        await env.ANALYTICS_KV.put(sessionKey, JSON.stringify(session), { expirationTtl: 86400 * 7 });
      }

      // Update active visitors
      const activeKey = `activeList:${todayKey}`;
      const activeList = JSON.parse(await env.ANALYTICS_KV.get(activeKey) || "[]");
      const fiveMinAgo = now - 300000;
      const filtered = activeList.filter(v => v.timestamp > fiveMinAgo);
      const idx = filtered.findIndex(v => v.ip === ip);
      if (idx >= 0) {
        filtered[idx].timestamp = now;
        filtered[idx].scrollDepth = body.scrollDepth || filtered[idx].scrollDepth || 0;
      }
      await env.ANALYTICS_KV.put(activeKey, JSON.stringify(filtered), { expirationTtl: 86400 * 7 });

    } else if (body.type === "session_end") {
      // Calculate total time on page
      const sessionKey = `session:${todayKey}:${body.sessionId || ip}`;
      const session = JSON.parse(await env.ANALYTICS_KV.get(sessionKey) || "{}");
      if (session.startTime) {
        const totalTime = Math.round((now - session.startTime) / 1000); // seconds
        session.totalTime = totalTime;
        session.scrollDepth = body.scrollDepth || session.scrollDepth || 0;
        session.endReason = body.reason || "unknown";
        await env.ANALYTICS_KV.put(sessionKey, JSON.stringify(session), { expirationTtl: 86400 * 7 });

        // Update recent log with time
        const recentKey = `recentLog:${todayKey}`;
        const recentList = JSON.parse(await env.ANALYTICS_KV.get(recentKey) || "[]");
        const visitorIdx = recentList.findIndex(v => (v.sessionId || v.ip) === (body.sessionId || ip));
        if (visitorIdx >= 0) {
          recentList[visitorIdx].timeOnPage = totalTime;
          recentList[visitorIdx].scrollDepth = session.scrollDepth;
          recentList[visitorIdx].endReason = session.endReason;
          await env.ANALYTICS_KV.put(recentKey, JSON.stringify(recentList), { expirationTtl: 86400 * 7 });
        }

        // Update avg time
        const avgKey = `avgTime:${todayKey}`;
        const avgData = JSON.parse(await env.ANALYTICS_KV.get(avgKey) || '{"total":0,"count":0}');
        avgData.total += totalTime;
        avgData.count += 1;
        await env.ANALYTICS_KV.put(avgKey, JSON.stringify(avgData), { expirationTtl: 86400 * 7 });
      }

    } else if (body.type === "event") {
      const event = {
        type: body.eventType || "click",
        name: body.eventName || "unknown",
        ip, country, city, isMetaBrowser, isMobile,
        path: body.path || "/",
        timestamp: now,
      };

      // Event log
      const eventLogKey = `eventLog:${todayKey}`;
      const eventList = JSON.parse(await env.ANALYTICS_KV.get(eventLogKey) || "[]");
      eventList.push(event);
      if (eventList.length > MAX_EVENTS) eventList.shift();
      await env.ANALYTICS_KV.put(eventLogKey, JSON.stringify(eventList), { expirationTtl: 86400 * 7 });

      // Event counter
      const eventCounterKey = `eventcounter:${todayKey}:${body.eventName}`;
      const eventCount = parseInt(await env.ANALYTICS_KV.get(eventCounterKey) || "0");
      await env.ANALYTICS_KV.put(eventCounterKey, String(eventCount + 1), { expirationTtl: 86400 * 7 });

      // Add event to session
      const sessionKey = `session:${todayKey}:${body.sessionId || ip}`;
      const session = JSON.parse(await env.ANALYTICS_KV.get(sessionKey) || "{}");
      if (session.startTime) {
        if (!session.events) session.events = [];
        session.events.push({ name: body.eventName, timestamp: now });
        await env.ANALYTICS_KV.put(sessionKey, JSON.stringify(session), { expirationTtl: 86400 * 7 });
      }
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
