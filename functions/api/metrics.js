// Cloudflare Pages Function — DISABLED
// Site is out of service. Returns 410 Gone for all requests.

export async function onRequest(context) {
  return new Response(
    JSON.stringify({ error: "Service Unavailable" }),
    {
      status: 410,
      headers: { "Content-Type": "application/json" },
    }
  );
}
