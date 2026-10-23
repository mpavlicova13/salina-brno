// Uplatnění kódu. Kód se váže na jedno zařízení — druhé už ho nepoužije.

export async function onRequestPost({ request, env }) {
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json; charset=utf-8" },
    });

  let code;
  try {
    ({ code } = await request.json());
  } catch {
    return json({ error: "Nečitelný požadavek." }, 400);
  }

  code = String(code || "").trim().toUpperCase();
  if (!code) return json({ error: "Zadej prosím kód." }, 400);

  const raw = await env.CODES.get(`code:${code}`);
  if (!raw) return json({ error: "Takový kód neznám. Zkontroluj prosím překlepy." }, 404);

  const rec = JSON.parse(raw);
  if (rec.token) {
    return json(
      { error: "Tenhle kód už je uplatněný na jiném zařízení. Napiš mi a odemknu ho." },
      409
    );
  }

  const token = crypto.randomUUID().replace(/-/g, "");
  rec.token = token;
  rec.claimedAt = new Date().toISOString();
  rec.ua = (request.headers.get("User-Agent") || "").slice(0, 120);

  // Pořadí je důležité: token zapsat dřív než kód, ať nevznikne kód bez tokenu.
  await env.CODES.put(`token:${token}`, code);
  await env.CODES.put(`code:${code}`, JSON.stringify(rec));

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "set-cookie": `sb_token=${token}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}
