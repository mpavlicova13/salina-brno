// Brána před aplikací. Běží na každý požadavek dřív, než Pages vydá jakýkoli soubor.
// Bez platného tokenu se ven nedostane nic kromě přihlašovací stránky a API.

const COOKIE = "sb_token";

function gatePage(error) {
  const msg = error
    ? `<p class="err">${error}</p>`
    : `<p class="hint">Kód dostaneš ode mě osobně. Zadej ho na zařízení, na kterém budeš appku používat — váže se na něj.</p>`;

  return `<!doctype html>
<html lang="cs"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Šalina Brno</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100dvh; display:grid; place-items:center;
         font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
         background:#0d1b2a; color:#fff; padding:24px; }
  .bg { position:fixed; inset:0; background:url('/nahled.png') center/cover no-repeat;
        filter:blur(14px) saturate(.6) brightness(.35); transform:scale(1.1); z-index:0; }
  .card { position:relative; z-index:1; width:100%; max-width:380px; text-align:center;
          background:rgba(13,27,42,.82); border:1px solid rgba(255,209,0,.25);
          border-radius:16px; padding:32px 28px; backdrop-filter:blur(6px); }
  h1 { margin:0 0 4px; font-size:24px; color:#FFD100; }
  .sub { margin:0 0 24px; opacity:.75; font-size:14px; }
  input { width:100%; padding:14px; font-size:18px; text-align:center; letter-spacing:.08em;
          text-transform:uppercase; border:1px solid rgba(255,255,255,.25); border-radius:10px;
          background:rgba(0,0,0,.35); color:#fff; }
  input:focus { outline:2px solid #FFD100; outline-offset:1px; }
  button { width:100%; margin-top:12px; padding:14px; font-size:16px; font-weight:600;
           border:0; border-radius:10px; background:#FFD100; color:#0d1b2a; cursor:pointer; }
  button[disabled] { opacity:.5; cursor:default; }
  .hint, .err { font-size:13px; margin:16px 0 0; }
  .hint { opacity:.6; }
  .err { color:#ff8f8f; }
</style></head>
<body>
<div class="bg"></div>
<div class="card">
  <h1>Šalina Brno</h1>
  <p class="sub">Appka je teď jen pro účastníky výzkumu.</p>
  <form id="f" autocomplete="off">
    <input id="c" name="code" placeholder="SALINA-XXXXX" required
           autocapitalize="characters" spellcheck="false">
    <button id="b" type="submit">Odemknout</button>
  </form>
  ${msg}
</div>
<script>
const f=document.getElementById('f'),c=document.getElementById('c'),b=document.getElementById('b');
f.addEventListener('submit',async e=>{
  e.preventDefault(); b.disabled=true; b.textContent='Ověřuji…';
  try{
    const r=await fetch('/api/claim',{method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify({code:c.value.trim().toUpperCase()})});
    if(r.ok){ location.reload(); return; }
    const d=await r.json().catch(()=>({}));
    document.querySelector('.hint,.err')?.remove();
    const p=document.createElement('p'); p.className='err';
    p.textContent=d.error||'Něco se nepovedlo, zkus to prosím znovu.';
    document.querySelector('.card').appendChild(p);
  }catch{ }
  b.disabled=false; b.textContent='Odemknout';
});
</script>
</body></html>`;
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // API a náhledový obrázek musí projít i bez tokenu, jinak by nešlo nic odemknout
  if (url.pathname.startsWith("/api/") || url.pathname === "/nahled.png") {
    return next();
  }

  const cookie = request.headers.get("Cookie") || "";
  const token = cookie.match(new RegExp(`${COOKIE}=([^;]+)`))?.[1];

  if (token) {
    const owner = await env.CODES.get(`token:${token}`);
    if (owner) return next();
  }

  return new Response(gatePage(null), {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}
