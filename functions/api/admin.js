// Přehled kódů. Chráněno heslem v proměnné ADMIN_KEY.
// Otevři: https://salinabrno.fun/api/admin?key=TVOJE_HESLO

function esc(s) {
  return String(s ?? "").replace(/[<>&"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c])
  );
}

async function loadAll(env) {
  const out = [];
  let cursor;
  do {
    const page = await env.CODES.list({ prefix: "code:", cursor });
    for (const k of page.keys) {
      const rec = JSON.parse((await env.CODES.get(k.name)) || "{}");
      out.push({ code: k.name.slice(5), ...rec });
    }
    cursor = page.cursor;
    if (page.list_complete) break;
  } while (cursor);
  return out.sort((a, b) => a.code.localeCompare(b.code));
}

function page(rows, key, msg) {
  const used = rows.filter((r) => r.token).length;
  const body = rows
    .map((r) => {
      const when = r.claimedAt
        ? new Date(r.claimedAt).toLocaleString("cs-CZ", { timeZone: "Europe/Prague" })
        : "";
      return `<tr class="${r.token ? "used" : "free"}">
        <td><code>${esc(r.code)}</code></td>
        <td>${r.token ? "použitý" : "volný"}</td>
        <td>${esc(when)}</td>
        <td class="ua">${esc(r.ua || "")}</td>
        <td>${
          r.token
            ? `<form method="post"><input type="hidden" name="key" value="${esc(key)}">
                 <input type="hidden" name="code" value="${esc(r.code)}">
                 <button>Uvolnit</button></form>`
            : ""
        }</td></tr>`;
    })
    .join("");

  return `<!doctype html><html lang="cs"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Kódy — Šalina Brno</title>
<style>
 body{font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
      max-width:820px;margin:40px auto;padding:0 20px;color:#111}
 h1{font-size:22px;margin:0 0 4px} .sub{color:#666;margin:0 0 20px}
 table{border-collapse:collapse;width:100%} th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #e5e5e5}
 th{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#666}
 code{font:14px ui-monospace,Menlo,monospace}
 tr.free td:nth-child(2){color:#0a7d32;font-weight:600}
 tr.used td:nth-child(2){color:#999}
 .ua{color:#999;font-size:12px;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
 button{padding:5px 10px;border:1px solid #ccc;background:#fff;border-radius:6px;cursor:pointer;font-size:13px}
 button:hover{background:#f5f5f5}
 .msg{background:#e8f5e9;border:1px solid #a5d6a7;padding:10px 12px;border-radius:8px;margin-bottom:16px}
</style></head><body>
<h1>Přístupové kódy</h1>
<p class="sub">${used} z ${rows.length} použitých · ${rows.length - used} volných</p>
${msg ? `<div class="msg">${esc(msg)}</div>` : ""}
<table><thead><tr><th>Kód</th><th>Stav</th><th>Uplatněn</th><th>Zařízení</th><th></th></tr></thead>
<tbody>${body}</tbody></table>
</body></html>`;
}

export async function onRequestGet({ request, env }) {
  const key = new URL(request.url).searchParams.get("key");
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) return new Response("Nope", { status: 403 });
  return new Response(page(await loadAll(env), key, null), {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const key = form.get("key");
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) return new Response("Nope", { status: 403 });

  const code = String(form.get("code") || "").toUpperCase();
  const raw = await env.CODES.get(`code:${code}`);
  let msg = "Kód jsem nenašla.";
  if (raw) {
    const rec = JSON.parse(raw);
    if (rec.token) await env.CODES.delete(`token:${rec.token}`);
    await env.CODES.put(`code:${code}`, JSON.stringify({ code }));
    msg = `Kód ${code} je zase volný.`;
  }
  return new Response(page(await loadAll(env), key, msg), {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}
