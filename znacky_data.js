/**
 * znacky_data.js – Návěstní soustava DPMB (Příloha č.1 směrnice D21/7)
 * Data pro kartičky a kvíz se značkami.
 */

/* ── SVG helpers ─────────────────────────────────────────────── */

// Základní tvar kosoštvorce (80×80 viewBox)
const _D = `<polygon points="40,3 77,40 40,77 3,40" stroke="#111" stroke-width="3" fill="white"/>`;

// Semafór TB1-01 (40×98 viewBox): r=červená, y=žlutá, g=zelená; každá je "#rrggbb" nebo null=tmavá
function _TL(r, y, g) {
  const c = (col) => col || '#1a1a1a';
  return `<svg viewBox="0 0 40 98" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="38" height="96" fill="#1e1e1e" rx="5" stroke="#333" stroke-width="1"/>
  <circle cx="20" cy="20" r="13" fill="${c(r)}"/>
  <circle cx="20" cy="49" r="13" fill="${c(y)}"/>
  <circle cx="20" cy="78" r="13" fill="${c(g)}"/>
</svg>`;
}

// Kosoštvorec se symbolem (80×80)
function _DIA(inner) {
  return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <polygon points="40,3 77,40 40,77 3,40" stroke="#111" stroke-width="3" fill="white"/>
  ${inner}
</svg>`;
}

/* ── KATEGORIE ───────────────────────────────────────────────── */

const ZNACKY_DATA = {
  categories: [

    /* ══════════════════════════════════════════════════
       5.1 – ŘÍZENÍ JÍZDY (tabulkové)
    ══════════════════════════════════════════════════ */
    {
      id: 'rizeni_jizdy',
      number: '5.1',
      name: 'Řízení jízdy',
      color: '#c0392b',
      icon: '🚃',
      signs: [
        {
          id: 'rj_01', number: '01',
          name: 'Toplikání / omezení rychlosti',
          description: 'Úsek, v němž musí řidič troubit a dodržovat předepsanou rychlost. Platí zpravidla pro přejezdy a zúžená místa.',
          svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="48" fill="#FFD700" rx="3" stroke="#111" stroke-width="2"/>
  <polygon points="18,15 28,15 40,10 40,40 28,35 18,35" fill="#111"/>
  <path d="M44,16 Q54,25 44,34" stroke="#111" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M48,12 Q62,25 48,38" stroke="#111" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_02', number: '02',
          name: 'Bezpečnostní zastávka',
          description: 'Místo povinného zastavení vozidla. Řidič musí zastavit a ověřit bezpečnost před pokračováním v jízdě.',
          svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="58" fill="#1565C0" rx="3" stroke="#0d47a1" stroke-width="2"/>
  <text x="40" y="28" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="white">BEZ.</text>
  <text x="40" y="44" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="white">STOP</text>
</svg>`
        },
        {
          id: 'rj_05', number: '05',
          name: 'Zvonit',
          description: 'V tomto úseku je řidič povinen použít zvukové výstražné znamení (zvonek/houkačka).',
          svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="58" fill="#FFD700" rx="3" stroke="#111" stroke-width="2"/>
  <path d="M40,8 C28,8 21,17 21,27 L21,38 L59,38 L59,27 C59,17 52,8 40,8Z" fill="#111"/>
  <rect x="34" y="38" width="12" height="7" fill="#111" rx="2"/>
  <circle cx="40" cy="48" r="5" fill="#111"/>
</svg>`
        },
        {
          id: 'rj_06', number: '06',
          name: 'Výstraha',
          description: 'Upozornění na nebezpečné nebo nepřehledné místo. Řidič musí jet opatrně a být připraven zastavit.',
          svg: `<svg viewBox="0 0 80 72" xmlns="http://www.w3.org/2000/svg">
  <polygon points="40,4 76,68 4,68" fill="#FFD700" stroke="#111" stroke-width="3"/>
  <text x="40" y="62" text-anchor="middle" font-family="Arial,sans-serif" font-size="38" font-weight="bold" fill="#111">!</text>
</svg>`
        },
        {
          id: 'rj_07', number: '07',
          name: 'Zhoršené rozhledové poměry',
          description: 'Místo se zhoršeným výhledem – řidič musí jet zvlášť opatrně a zajistit bezpečný průjezd.',
          svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="58" fill="#FFD700" rx="3" stroke="#111" stroke-width="2"/>
  <path d="M12,30 Q40,12 68,30 Q40,48 12,30Z" fill="white" stroke="#111" stroke-width="2"/>
  <circle cx="40" cy="30" r="9" fill="#111"/>
  <circle cx="40" cy="30" r="4" fill="white"/>
  <line x1="16" y1="16" x2="64" y2="44" stroke="#cc0000" stroke-width="3.5" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_11', number: '11',
          name: 'Pomalu',
          description: 'Příkaz k jízdě malou rychlostí. Zpravidla doprovázen maximální povolenou rychlostí.',
          svg: `<svg viewBox="0 0 90 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="88" height="48" fill="#FFD700" rx="3" stroke="#111" stroke-width="2"/>
  <text x="45" y="33" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" font-weight="bold" fill="#111">POMALU</text>
</svg>`
        },
        {
          id: 'rj_13', number: '13',
          name: 'Signály pro tramvaje',
          description: 'Označuje místo, kde platí zvláštní světelné signály určené výhradně pro tramvaje.',
          svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="48" fill="#1a1a1a" rx="3"/>
  <circle cx="20" cy="25" r="10" fill="#FFD700"/>
  <circle cx="40" cy="25" r="10" fill="#FFD700"/>
  <circle cx="60" cy="25" r="10" fill="#FFD700"/>
  <circle cx="20" cy="25" r="5" fill="#1a1a1a"/>
  <circle cx="40" cy="25" r="5" fill="#1a1a1a"/>
  <circle cx="60" cy="25" r="5" fill="#1a1a1a"/>
</svg>`
        },
        {
          id: 'rj_14', number: '14',
          name: 'Traťová rychlost',
          description: 'Dovolená traťová rychlost na daném úseku. Číslo udává maximální povolenou rychlost v km/h.',
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40" cy="40" r="38" fill="white" stroke="#cc0000" stroke-width="5"/>
  <circle cx="40" cy="40" r="29" fill="white" stroke="#cc0000" stroke-width="1"/>
  <text x="40" y="52" text-anchor="middle" font-family="Arial,sans-serif" font-size="32" font-weight="bold" fill="#111">60</text>
</svg>`
        },
        {
          id: 'rj_15', number: '15',
          name: 'Omezení rychlosti',
          description: 'Snížení dovolené rychlosti na úseku. Číslo udává maximální povolenou rychlost v km/h.',
          svg: `<svg viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="48" height="68" fill="#FFD700" rx="4" stroke="#111" stroke-width="2"/>
  <text x="25" y="50" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="bold" fill="#111">15</text>
</svg>`
        },
        {
          id: 'rj_20', number: '20',
          name: 'Konec toplikání / omezení rychlosti',
          description: 'Konec úseku s povinným houkáním a omezenou rychlostí.',
          svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="48" fill="#FFD700" rx="3" stroke="#111" stroke-width="2"/>
  <polygon points="18,15 28,15 40,10 40,40 28,35 18,35" fill="#111" opacity="0.35"/>
  <path d="M44,16 Q54,25 44,34" stroke="#111" stroke-width="2" fill="none" opacity="0.35"/>
  <line x1="10" y1="8" x2="70" y2="42" stroke="#cc0000" stroke-width="4" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_21', number: '21',
          name: 'Ukončení omezené rychlosti',
          description: 'Konec úseku s omezenou rychlostí – obnoví se traťová rychlost.',
          svg: `<svg viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="48" height="68" fill="#FFD700" rx="4" stroke="#111" stroke-width="2"/>
  <text x="25" y="45" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="#111" opacity="0.3">15</text>
  <line x1="6" y1="12" x2="44" y2="58" stroke="#cc0000" stroke-width="4" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_22', number: '22',
          name: 'Konec úseku s toplikáním a omezenou rychlostí',
          description: 'Ukončení platnosti obou omezení – toplikání i snížené rychlosti – zároveň.',
          svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="48" fill="#e0e0e0" rx="3" stroke="#111" stroke-width="2"/>
  <text x="40" y="20" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#111">KONEC</text>
  <text x="40" y="38" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="#111">01 + 15</text>
</svg>`
        },
        {
          id: 'rj_24', number: '24',
          name: 'Konec úseku tramvajové přednosti',
          description: 'Konec úseku, kde měl tramvajový provoz přednost. Platnost přednostní jízdy končí.',
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <polygon points="40,4 76,68 4,68" fill="white" stroke="#111" stroke-width="3"/>
  <text x="40" y="56" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#111">🚃</text>
  <line x1="8" y1="14" x2="72" y2="70" stroke="#cc0000" stroke-width="4" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_25', number: '25',
          name: 'Dej přednost tramvajovému provozu',
          description: 'Ostatní vozidla musí dát přednost projíždějícím tramvajím.',
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <polygon points="40,4 76,68 4,68" fill="white" stroke="#111" stroke-width="3"/>
  <rect x="32" y="28" width="16" height="24" fill="#FFD700" rx="2"/>
  <rect x="28" y="22" width="24" height="8" fill="#1565C0" rx="2"/>
  <circle cx="33" cy="54" r="4" fill="#111"/>
  <circle cx="47" cy="54" r="4" fill="#111"/>
</svg>`
        },
        {
          id: 'rj_27', number: '27',
          name: 'Zákaz souběžné jízdy po kolejích',
          description: 'Zákaz jízdy jiných vozidel souběžně nebo po tramvajových kolejích.',
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40" cy="40" r="37" fill="white" stroke="#cc0000" stroke-width="5"/>
  <line x1="27" y1="20" x2="27" y2="60" stroke="#111" stroke-width="4"/>
  <line x1="40" y1="20" x2="40" y2="60" stroke="#111" stroke-width="4"/>
  <line x1="53" y1="20" x2="53" y2="60" stroke="#111" stroke-width="4"/>
  <line x1="8" y1="8" x2="72" y2="72" stroke="#cc0000" stroke-width="7" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_28', number: '28',
          name: 'Konec zákazu souběžné jízdy',
          description: 'Konec úseku, kde byl zakázán souběžný provoz po tramvajových kolejích.',
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40" cy="40" r="37" fill="white" stroke="#111" stroke-width="3"/>
  <line x1="27" y1="20" x2="27" y2="60" stroke="#111" stroke-width="3" opacity="0.3"/>
  <line x1="40" y1="20" x2="40" y2="60" stroke="#111" stroke-width="3" opacity="0.3"/>
  <line x1="53" y1="20" x2="53" y2="60" stroke="#111" stroke-width="3" opacity="0.3"/>
  <text x="40" y="48" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#1a6b3a" font-weight="bold">KONEC</text>
</svg>`
        },
        {
          id: 'rj_30', number: '30',
          name: 'Úsekové světelné signály',
          description: 'Označení místa, kde začíná nebo končí platnost úsekových světelných signálů pro tramvaje.',
          svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="58" fill="#1a1a1a" rx="3"/>
  <circle cx="20" cy="20" r="8" fill="#cc0000"/>
  <circle cx="40" cy="20" r="8" fill="#FFD700"/>
  <circle cx="60" cy="20" r="8" fill="#00cc44"/>
  <circle cx="20" cy="40" r="8" fill="#cc0000" opacity="0.3"/>
  <circle cx="40" cy="40" r="8" fill="#FFD700" opacity="0.3"/>
  <circle cx="60" cy="40" r="8" fill="#00cc44" opacity="0.3"/>
</svg>`
        },
        {
          id: 'rj_31', number: '31',
          name: 'Zákaz couvání',
          description: 'Přísný zákaz jízdy zpět (couvání) v tomto místě nebo úseku.',
          svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="58" fill="#cc0000" rx="3"/>
  <polygon points="55,30 38,18 38,24 22,24 22,36 38,36 38,42" fill="white"/>
  <line x1="14" y1="12" x2="66" y2="48" stroke="white" stroke-width="5" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_32', number: '32',
          name: 'Zákaz vjezdu do jízdy na hlavní trati',
          description: 'Vjezd na hlavní trať z odbočky nebo vedlejší koleje je zakázán.',
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <polygon points="40,4 76,68 4,68" fill="#FFD700" stroke="#111" stroke-width="3"/>
  <polygon points="40,68 76,4 4,4" fill="white" stroke="#111" stroke-width="2" opacity="0.6"/>
  <text x="40" y="58" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="#111">ZÁKAZ</text>
  <text x="40" y="70" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#111">VJEZDU</text>
</svg>`
        },
        {
          id: 'rj_33', number: '33',
          name: 'Přednost v jízdě na hlavní trati',
          description: 'Vozidlo má přednost v jízdě na hlavní trati oproti vozidlům přijíždějícím z vedlejší trati.',
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <polygon points="40,68 76,4 4,4" fill="#FFD700" stroke="#111" stroke-width="3"/>
  <polygon points="40,4 76,68 4,68" fill="white" stroke="#111" stroke-width="2" opacity="0.6"/>
  <text x="40" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="#111">PŘED-</text>
  <text x="40" y="42" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="#111">NOST</text>
</svg>`
        },
        {
          id: 'rj_34', number: '34',
          name: 'Práce na trati',
          description: 'Výstraha před probíhajícími pracemi na trati. Řidič musí jet opatrně a sledovat pokyny pracovníků.',
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <polygon points="40,4 76,68 4,68" fill="#FFD700" stroke="#111" stroke-width="3"/>
  <text x="40" y="58" text-anchor="middle" font-family="Arial,sans-serif" font-size="28">⚒</text>
</svg>`
        },
        {
          id: 'rj_35', number: '35',
          name: 'Konec práce na trati',
          description: 'Konec úseku s pracemi na trati. Provoz se vrací do normálního stavu.',
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <polygon points="40,4 76,68 4,68" fill="#FFD700" stroke="#111" stroke-width="3"/>
  <text x="40" y="52" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" opacity="0.3">⚒</text>
  <line x1="16" y1="18" x2="64" y2="62" stroke="#cc0000" stroke-width="4" stroke-linecap="round"/>
</svg>`
        },
      ]
    },

    /* ══════════════════════════════════════════════════
       5.1 – RUČNÍ NÁVĚSTÍ
    ══════════════════════════════════════════════════ */
    {
      id: 'rucni_navestni',
      number: '5.1R',
      name: 'Ruční návěsti',
      color: '#2c3e50',
      icon: '🙋',
      signs: [
        {
          id: 'rn_01', number: '01',
          name: 'Stůj',
          description: 'Pravá ruka zdvižena kolmo vzhůru, dlaní vpřed. Vozidlo musí okamžitě zastavit.',
          svg: `<svg viewBox="0 0 80 130" xmlns="http://www.w3.org/2000/svg">
  <rect x="24" y="2" width="32" height="7" fill="#111" rx="2"/>
  <circle cx="40" cy="20" r="13" fill="#111"/>
  <rect x="30" y="33" width="20" height="32" fill="#111" rx="3"/>
  <line x1="30" y1="42" x2="12" y2="60" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <line x1="50" y1="38" x2="62" y2="16" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <rect x="55" y="5" width="13" height="18" fill="#111" rx="3" transform="rotate(-15 62 14)"/>
  <line x1="37" y1="65" x2="30" y2="98" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <line x1="43" y1="65" x2="50" y2="98" stroke="#111" stroke-width="8" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rn_03', number: '03',
          name: 'Přiblížit',
          description: 'Paže vodorovně rozpažena, pohyb dlaní k sobě. Pokyn k přijetí vozidla (přiblížení).',
          svg: `<svg viewBox="0 0 80 130" xmlns="http://www.w3.org/2000/svg">
  <rect x="24" y="2" width="32" height="7" fill="#111" rx="2"/>
  <circle cx="40" cy="20" r="13" fill="#111"/>
  <rect x="30" y="33" width="20" height="32" fill="#111" rx="3"/>
  <line x1="30" y1="42" x2="4" y2="42" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <polygon points="4,36 16,42 4,48" fill="#111"/>
  <line x1="50" y1="42" x2="76" y2="42" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <line x1="37" y1="65" x2="30" y2="98" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <line x1="43" y1="65" x2="50" y2="98" stroke="#111" stroke-width="8" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rn_04', number: '04',
          name: 'Vzdálit',
          description: 'Paže vodorovně rozpaženа, pohyb dlaní od sebe. Pokyn k odjezdu vozidla (vzdálení).',
          svg: `<svg viewBox="0 0 80 130" xmlns="http://www.w3.org/2000/svg">
  <rect x="24" y="2" width="32" height="7" fill="#111" rx="2"/>
  <circle cx="40" cy="20" r="13" fill="#111"/>
  <rect x="30" y="33" width="20" height="32" fill="#111" rx="3"/>
  <line x1="30" y1="42" x2="4" y2="42" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <polygon points="16,36 4,42 16,48" fill="#111"/>
  <line x1="50" y1="42" x2="76" y2="42" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <polygon points="64,36 76,42 64,48" fill="#111"/>
  <line x1="37" y1="65" x2="30" y2="98" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <line x1="43" y1="65" x2="50" y2="98" stroke="#111" stroke-width="8" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rn_08', number: '08',
          name: 'Nebezpečí – zastavte všemi prostředky!',
          description: 'Obě paže zdviženy a zkříženy nad hlavou. Okamžité zastavení všemi dostupnými prostředky!',
          svg: `<svg viewBox="0 0 80 130" xmlns="http://www.w3.org/2000/svg">
  <rect x="24" y="2" width="32" height="7" fill="#111" rx="2"/>
  <circle cx="40" cy="20" r="13" fill="#111"/>
  <rect x="30" y="33" width="20" height="32" fill="#111" rx="3"/>
  <line x1="30" y1="38" x2="10" y2="10" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <line x1="50" y1="38" x2="70" y2="10" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <line x1="10" y1="10" x2="70" y2="10" stroke="#cc0000" stroke-width="5" stroke-linecap="round"/>
  <line x1="37" y1="65" x2="30" y2="98" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <line x1="43" y1="65" x2="50" y2="98" stroke="#111" stroke-width="8" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rn_10', number: '10',
          name: 'Pomalu',
          description: 'Paže vodorovně rozpažena a pomalu klesá dolů. Pokyn k jízdě malou rychlostí.',
          svg: `<svg viewBox="0 0 80 130" xmlns="http://www.w3.org/2000/svg">
  <rect x="24" y="2" width="32" height="7" fill="#111" rx="2"/>
  <circle cx="40" cy="20" r="13" fill="#111"/>
  <rect x="30" y="33" width="20" height="32" fill="#111" rx="3"/>
  <line x1="30" y1="44" x2="4" y2="36" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <line x1="50" y1="44" x2="76" y2="52" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <path d="M14,52 Q40,58 66,60" stroke="#111" stroke-width="2.5" fill="none" stroke-dasharray="4,3"/>
  <line x1="37" y1="65" x2="30" y2="98" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <line x1="43" y1="65" x2="50" y2="98" stroke="#111" stroke-width="8" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rn_31', number: '31',
          name: 'Stáhni sběrač',
          description: 'Obě paže zdviženy nad hlavu a spojeny dlaněmi dohromady. Pokyn ke stažení trolejového sběrače.',
          svg: `<svg viewBox="0 0 80 130" xmlns="http://www.w3.org/2000/svg">
  <rect x="24" y="2" width="32" height="7" fill="#111" rx="2"/>
  <circle cx="40" cy="20" r="13" fill="#111"/>
  <rect x="30" y="33" width="20" height="32" fill="#111" rx="3"/>
  <line x1="30" y1="36" x2="18" y2="8" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <line x1="50" y1="36" x2="62" y2="8" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <ellipse cx="40" cy="6" rx="18" ry="5" fill="none" stroke="#111" stroke-width="4"/>
  <line x1="37" y1="65" x2="30" y2="98" stroke="#111" stroke-width="8" stroke-linecap="round"/>
  <line x1="43" y1="65" x2="50" y2="98" stroke="#111" stroke-width="8" stroke-linecap="round"/>
</svg>`
        },
      ]
    },

    /* ══════════════════════════════════════════════════
       5.2 – ZABEZPEČENÁ TRAŤ
    ══════════════════════════════════════════════════ */
    {
      id: 'zabezpecena_trat',
      number: '5.2',
      name: 'Zabezpečená trať',
      color: '#1a6b3a',
      icon: '🚦',
      signs: [
        {
          id: 'zt_41', number: '41',
          name: 'Začátek zabezpečeného úseku',
          description: 'Tabule „Z" označuje místo, od kterého začíná zabezpečený úsek trati s automatickým řízením provozu.',
          svg: `<svg viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="68" fill="#111" rx="3"/>
  <text x="30" y="54" text-anchor="middle" font-family="Arial,sans-serif" font-size="52" font-weight="bold" fill="white">Z</text>
</svg>`
        },
        {
          id: 'zt_42', number: '42',
          name: 'Konec zabezpečeného úseku',
          description: 'Tabule „K" označuje konec zabezpečeného úseku trati.',
          svg: `<svg viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="68" fill="#111" rx="3"/>
  <text x="30" y="54" text-anchor="middle" font-family="Arial,sans-serif" font-size="52" font-weight="bold" fill="white">K</text>
</svg>`
        },
        {
          id: 'zt_43', number: '43',
          name: 'Volná trať',
          description: 'TB1-01: Všechny tři světla svítí zeleně – trať je volná, vozidlo může pokračovat v jízdě.',
          svg: `${_TL('#006622','#006622','#00cc44')}`
        },
        {
          id: 'zt_44', number: '44',
          name: 'Výstraha',
          description: 'TB1-01: Žluté světlo – výstraha. Vozidlo musí snížit rychlost a být připraveno zastavit.',
          svg: `${_TL(null,'#ffcc00',null)}`
        },
        {
          id: 'zt_45', number: '45',
          name: 'Stůj',
          description: 'TB1-01: Červené světlo – stůj. Vozidlo nesmí pokračovat v jízdě.',
          svg: `${_TL('#cc0000',null,null)}`
        },
        {
          id: 'zt_46', number: '46',
          name: 'Nezabezpečený úsek (TB1-03)',
          description: 'TB1-03: Symbol slunce označuje nezabezpečený úsek – jede se bez automatické ochrany.',
          svg: `<svg viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="68" height="68" fill="#1e1e1e" rx="5"/>
  <circle cx="35" cy="35" r="18" fill="#f39c12"/>
  <g stroke="#f39c12" stroke-width="3" stroke-linecap="round">
    <line x1="35" y1="9" x2="35" y2="4"/>
    <line x1="35" y1="61" x2="35" y2="66"/>
    <line x1="9" y1="35" x2="4" y2="35"/>
    <line x1="61" y1="35" x2="66" y2="35"/>
    <line x1="18" y1="18" x2="13" y2="13"/>
    <line x1="52" y1="18" x2="57" y2="13"/>
    <line x1="18" y1="52" x2="13" y2="57"/>
    <line x1="52" y1="52" x2="57" y2="57"/>
  </g>
</svg>`
        },
        {
          id: 'zt_47', number: '47',
          name: 'Nezabezpečený úsek (TB1-01)',
          description: 'TB1-01 se symbolem slunce – varianta označení nezabezpečeného úseku na jiném místě trati.',
          svg: `<svg viewBox="0 0 40 98" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="38" height="96" fill="#1e1e1e" rx="5"/>
  <circle cx="20" cy="20" r="13" fill="#f39c12"/>
  <g stroke="#f39c12" stroke-width="2" stroke-linecap="round">
    <line x1="20" y1="4" x2="20" y2="1"/>
    <line x1="28" y1="8" x2="31" y2="6"/>
    <line x1="32" y1="16" x2="35" y2="14"/>
    <line x1="20" y1="33" x2="20" y2="36"/>
    <line x1="12" y1="8" x2="9" y2="6"/>
  </g>
  <circle cx="20" cy="49" r="13" fill="#1a1a1a"/>
  <circle cx="20" cy="78" r="13" fill="#1a1a1a"/>
</svg>`
        },
      ]
    },

    /* ══════════════════════════════════════════════════
       5.3 – TROLEJOVÉ VEDENÍ
    ══════════════════════════════════════════════════ */
    {
      id: 'trolejove_vedeni',
      number: '5.3',
      name: 'Trolejové vedení',
      color: '#16a085',
      icon: '⚡',
      signs: [
        {
          id: 'tv_51', number: '51',
          name: 'Úsekový dělič',
          description: 'Místo, kde dochází k elektrickému dělení trolejového vedení na samostatné napájecí úseky.',
          svg: _DIA(`<rect x="36" y="5" width="8" height="8" fill="#111"/>
  <rect x="67" y="36" width="8" height="8" fill="#111"/>
  <rect x="36" y="67" width="8" height="8" fill="#111"/>
  <rect x="5" y="36" width="8" height="8" fill="#111"/>`)
        },
        {
          id: 'tv_52', number: '52',
          name: 'Diodový úsekový dělič',
          description: 'Úsekový dělič vybavený diodou – propouští proud pouze jedním směrem.',
          svg: _DIA(`<polygon points="29,32 51,40 29,48" fill="#111"/>
  <line x1="51" y1="32" x2="51" y2="48" stroke="#111" stroke-width="5"/>`)
        },
        {
          id: 'tv_53', number: '53',
          name: 'Staňní sběrač',
          description: 'Příkaz ke stažení (snížení) trolejového sběrače. Řidič musí sběrač stáhnout před průjezdem.',
          svg: _DIA(`<rect x="37" y="18" width="6" height="24" fill="#111"/>
  <polygon points="40,56 27,38 53,38" fill="#111"/>`)
        },
        {
          id: 'tv_54', number: '54',
          name: 'Zvední sběrač',
          description: 'Příkaz ke zdvižení trolejového sběrače. Za tímto místem je sběrač opět zdvižen.',
          svg: _DIA(`<polygon points="40,24 27,42 53,42" fill="#111"/>
  <rect x="37" y="42" width="6" height="24" fill="#111"/>`)
        },
        {
          id: 'tv_55', number: '55',
          name: 'Začátek snížené výšky trolejového drátu',
          description: 'Upozornění na začátek úseku, kde je trolejový drát zavěšen níže než standardně.',
          svg: _DIA(`<line x1="14" y1="20" x2="60" y2="56" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <polygon points="60,56 46,50 52,40" fill="#111"/>`)
        },
        {
          id: 'tv_56', number: '56',
          name: 'Konec snížené výšky trolejového drátu',
          description: 'Konec úseku se sníženou výškou trolejového drátu – drát se vrací do standardní výšky.',
          svg: _DIA(`<line x1="14" y1="56" x2="60" y2="20" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <polygon points="60,20 46,26 52,38" fill="#111"/>`)
        },
        {
          id: 'tv_57', number: '57',
          name: 'Nižší potenciál',
          description: 'Upozornění na úsek trolejového vedení s nižším napájecím napětím (jiný napájecí okruh).',
          svg: _DIA(`<polyline points="47,18 35,42 44,42 33,62" stroke="#111" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`)
        },
        {
          id: 'tv_58', number: '58',
          name: 'Návěst trolejové výhybky (směr)',
          description: 'Označuje povolený směr průjezdu trolejovou výhybkou. Šipka ukazuje nastavený směr.',
          svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="48" fill="#1565C0" rx="3"/>
  <polygon points="40,10 65,25 40,40 40,32 16,32 16,18 40,18" fill="white"/>
</svg>`
        },
        {
          id: 'tv_58z', number: '58Z',
          name: 'Zákaz vjezdu na trolejovou výhybku',
          description: 'Zákaz průjezdu přes trolejovou výhybku – vozidlo nesmí na výhybku vjet.',
          svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="48" fill="#1565C0" rx="3"/>
  <line x1="16" y1="10" x2="64" y2="40" stroke="white" stroke-width="7" stroke-linecap="round"/>
  <line x1="64" y1="10" x2="16" y2="40" stroke="white" stroke-width="7" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'tv_59', number: '59',
          name: 'Číslo trolejové výhybky',
          description: 'Identifikační číslo trolejové výhybky. Umožňuje její jednoznačné označení při komunikaci.',
          svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="48" height="48" fill="white" rx="6" stroke="#111" stroke-width="2"/>
  <text x="25" y="36" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="bold" fill="#111">4</text>
</svg>`
        },
        {
          id: 'tv_60', number: '60',
          name: 'Proudová slavná výhybka',
          description: 'Výhybka ovládaná proudovým impulsem z vozidla. Označení Z-0 udává výchozí nastavení.',
          svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="68" height="48" fill="white" rx="4" stroke="#111" stroke-width="2.5"/>
  <text x="35" y="35" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="bold" fill="#111">Z-0</text>
</svg>`
        },
        {
          id: 'tv_61', number: '61',
          name: 'Rychlostní trolejová výhybka',
          description: 'Výhybka s předepsanými rychlostmi pro každý směr. Čísla udávají max. rychlost v km/h.',
          svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="34" height="26" fill="white" rx="3" stroke="#111" stroke-width="2"/>
  <text x="19" y="20" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="#111">30</text>
  <polygon points="40,15 48,10 48,20" fill="#111"/>
  <rect x="2" y="32" width="34" height="26" fill="white" rx="3" stroke="#111" stroke-width="2"/>
  <text x="19" y="50" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="#111">45</text>
  <polygon points="40,45 48,40 48,50" fill="#111"/>
</svg>`
        },
      ]
    },

    /* ══════════════════════════════════════════════════
       5.4 – KOLEJOVÉ VÝHYBKY
    ══════════════════════════════════════════════════ */
    {
      id: 'kolejove_vyhybky',
      number: '5.4',
      name: 'Kolejové výhybky',
      color: '#8e44ad',
      icon: '🔀',
      signs: [
        {
          id: 'kv_62', number: '62',
          name: 'Základní postavení výhybky zrušeno',
          description: 'Výhybka nemá pevné základní postavení – nelze předpokládat žádný určitý polohu výhybkových jazyků.',
          svg: `<svg viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="68" height="68" fill="white" rx="4" stroke="#111" stroke-width="2"/>
  <line x1="14" y1="14" x2="56" y2="56" stroke="#cc0000" stroke-width="7" stroke-linecap="round"/>
  <line x1="56" y1="14" x2="14" y2="56" stroke="#cc0000" stroke-width="7" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'kv_63', number: '63',
          name: 'Elektrické zabezpečování výhybky',
          description: 'Výhybka je vybavena elektrickým zabezpečením. Šipka ukazuje povolený směr jízdy na výhybku.',
          svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="68" height="48" fill="#1565C0" rx="3"/>
  <polygon points="55,25 36,13 36,20 15,20 15,30 36,30 36,37" fill="white"/>
</svg>`
        },
        {
          id: 'kv_64a', number: '64a',
          name: 'Číslo ruční výhybky',
          description: 'Identifikační číslo ruční kolejové výhybky ovládané ručně obsluhou.',
          svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="68" height="48" fill="#1565C0" rx="5" stroke="#003d82" stroke-width="2"/>
  <text x="35" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="bold" fill="#FFD700">1202</text>
</svg>`
        },
        {
          id: 'kv_64c', number: '64c',
          name: 'Číslo vratné výhybky',
          description: 'Identifikační číslo vratné kolejové výhybky – po průjezdu se automaticky vrací do základní polohy.',
          svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="68" height="48" fill="white" rx="5" stroke="#111" stroke-width="2"/>
  <text x="35" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="bold" fill="#111">110</text>
</svg>`
        },
        {
          id: 'kv_64e', number: '64e',
          name: 'Číslo elektrické výhybky',
          description: 'Identifikační číslo elektrické výhybky přestavované dálkově nebo automaticky. Šipky označují směry.',
          svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="48" fill="#e67e22" rx="5" stroke="#c0392b" stroke-width="2"/>
  <text x="40" y="32" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="bold" fill="white">153</text>
  <polygon points="10,25 20,18 20,22 38,22 38,28 20,28 20,32" fill="white" opacity="0.8"/>
</svg>`
        },
        {
          id: 'kv_64g', number: '64g',
          name: 'Číslo elektrické výhybky (zajištěná)',
          description: 'Identifikační číslo zajištěné elektrické výhybky – je elektricky blokována v jedné poloze.',
          svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="68" height="48" fill="#1565C0" rx="5" stroke="#003d82" stroke-width="2"/>
  <text x="35" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="bold" fill="#FFD700">1004</text>
</svg>`
        },
        {
          id: 'kv_65', number: '65',
          name: 'Předvolený směr pro jízdu zajištěnou výhybkou',
          description: 'Označuje předvolený směr průjezdu zajištěnou výhybkou. Vozidlo projede ve směru šipky.',
          svg: `<svg viewBox="0 0 70 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="68" height="58" fill="white" rx="4" stroke="#111" stroke-width="2"/>
  <path d="M20,30 Q35,10 55,30" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>
  <polygon points="55,30 44,22 48,34" fill="#111"/>
</svg>`
        },
        {
          id: 'kv_67', number: '67',
          name: 'Světelný rychlostník',
          description: 'Elektronický ukazatel povolené rychlosti na výhybce nebo v daném úseku. Číslo svítí LED diodami.',
          svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="58" fill="#111" rx="5" stroke="#333" stroke-width="1"/>
  <text x="30" y="42" text-anchor="middle" font-family="Arial,sans-serif" font-size="32" font-weight="bold" fill="#FFD700">40</text>
</svg>`
        },
        {
          id: 'kv_68', number: '68',
          name: 'Rychlostník',
          description: 'Tabulový ukazatel povolené rychlosti na výhybce – uvádí max. rychlost v km/h.',
          svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="38" height="48" fill="white" rx="3" stroke="#111" stroke-width="2"/>
  <text x="20" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="bold" fill="#111">15</text>
  <rect x="41" y="1" width="38" height="48" fill="white" rx="3" stroke="#111" stroke-width="2"/>
  <text x="60" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="bold" fill="#111">30</text>
</svg>`
        },
        {
          id: 'kv_69', number: '69',
          name: 'Stůj – zákaz jízdy na výhybku',
          description: 'Přísný zákaz vjezdu na výhybku. Vozidlo musí zastavit a vyčkat na příslušný povolující signál.',
          svg: `<svg viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
  <polygon points="35,4 66,60 4,60" fill="#FFD700" stroke="#111" stroke-width="3"/>
  <line x1="35" y1="22" x2="35" y2="44" stroke="#111" stroke-width="5" stroke-linecap="round"/>
  <circle cx="35" cy="52" r="3.5" fill="#111"/>
</svg>`
        },
        {
          id: 'kv_70', number: '70',
          name: 'Základní postavení výhybky',
          description: 'Označuje základní (výchozí) polohu kolejové výhybky, do které se vrací po průjezdu vozidla.',
          svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="68" height="48" fill="white" rx="4" stroke="#111" stroke-width="2"/>
  <line x1="10" y1="25" x2="60" y2="25" stroke="#111" stroke-width="3"/>
  <polygon points="60,25 45,18 45,32" fill="#111"/>
  <line x1="44" y1="24" x2="36" y2="12" stroke="#111" stroke-width="3"/>
  <polygon points="36,12 31,22 42,22" fill="#111"/>
</svg>`
        },
        {
          id: 'kv_71', number: '71',
          name: 'Přibližovací místo',
          description: 'Místo, kde má řidič aktivovat výhybku (přiblížením nebo signálem) pro nastavení požadovaného směru.',
          svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="68" height="48" fill="white" rx="4" stroke="#111" stroke-width="4" stroke-dasharray="8,4"/>
</svg>`
        },
      ]
    },

    /* ══════════════════════════════════════════════════
       5.5 – INFORMATIVNÍ NÁVĚSTÍ
    ══════════════════════════════════════════════════ */
    {
      id: 'informativni',
      number: '5.5',
      name: 'Informativní návěstí',
      color: '#2980b9',
      icon: 'ℹ️',
      signs: [
        {
          id: 'in_81', number: '81',
          name: 'Pozemní komunikace',
          description: 'Označuje místo, kde tramvajová trať kříží nebo přechází do pozemní komunikace sdílené s ostatním provozem.',
          svg: `<svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="68" fill="white" rx="3" stroke="#111" stroke-width="2"/>
  <rect x="10" y="40" width="60" height="14" fill="#888"/>
  <rect x="30" y="42" width="20" height="10" fill="#FFD700" rx="2"/>
  <circle cx="22" cy="50" r="8" fill="#333"/>
  <circle cx="58" cy="50" r="8" fill="#333"/>
  <rect x="18" y="28" width="44" height="18" fill="#333" rx="3"/>
  <rect x="22" y="30" width="10" height="8" fill="#7ec8e3"/>
  <rect x="34" y="30" width="10" height="8" fill="#7ec8e3"/>
  <rect x="46" y="30" width="8" height="8" fill="#7ec8e3"/>
</svg>`
        },
        {
          id: 'in_82', number: '82',
          name: 'Konec pozemní komunikace',
          description: 'Konec úseku, kde tramvajová trať sdílí pozemní komunikaci s ostatním provozem.',
          svg: `<svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="68" fill="white" rx="3" stroke="#111" stroke-width="2"/>
  <rect x="10" y="40" width="60" height="14" fill="#888" opacity="0.4"/>
  <rect x="30" y="42" width="20" height="10" fill="#FFD700" rx="2" opacity="0.4"/>
  <circle cx="22" cy="50" r="8" fill="#333" opacity="0.4"/>
  <circle cx="58" cy="50" r="8" fill="#333" opacity="0.4"/>
  <rect x="18" y="28" width="44" height="18" fill="#333" rx="3" opacity="0.4"/>
  <line x1="8" y1="8" x2="72" y2="62" stroke="#cc0000" stroke-width="5" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'in_83', number: '83',
          name: 'Přejezd nezabezpečený',
          description: 'Tramvajový přejezd přes komunikaci bez světelného zabezpečení. Řidič si zajišťuje volnou cestu sám.',
          svg: `<svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="68" fill="white" rx="3" stroke="#111" stroke-width="2"/>
  <line x1="10" y1="35" x2="70" y2="35" stroke="#888" stroke-width="8"/>
  <line x1="40" y1="10" x2="40" y2="60" stroke="#888" stroke-width="8"/>
  <line x1="14" y1="11" x2="66" y2="59" stroke="#cc0000" stroke-width="5" stroke-linecap="round"/>
  <line x1="66" y1="11" x2="14" y2="59" stroke="#cc0000" stroke-width="5" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'in_84', number: '84',
          name: 'Přejezd s předností tramvaje',
          description: 'Tramvaj má na tomto přejezdu přednost. Ostatní vozidla musejí tramvaji dát přednost v jízdě.',
          svg: `<svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="68" fill="#1e1e1e" rx="3"/>
  <line x1="10" y1="35" x2="70" y2="35" stroke="#888" stroke-width="6"/>
  <rect x="28" y="18" width="24" height="34" fill="#FFD700" rx="2"/>
  <rect x="24" y="14" width="32" height="8" fill="#1565C0" rx="2"/>
  <circle cx="34" cy="52" r="5" fill="#111"/>
  <circle cx="46" cy="52" r="5" fill="#111"/>
  <polygon points="40,6 36,14 44,14" fill="#FFD700"/>
</svg>`
        },
        {
          id: 'in_85', number: '85',
          name: 'Přejezd zabezpečený světelnou signalizací',
          description: 'Tramvajový přejezd je vybaven světelnou signalizací pro ostatní vozidla. Tramvaj má automatickou ochranu.',
          svg: `<svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="68" fill="#1e1e1e" rx="3"/>
  <line x1="10" y1="35" x2="70" y2="35" stroke="#888" stroke-width="6"/>
  <rect x="7" y="10" width="12" height="28" fill="#333" rx="3"/>
  <circle cx="13" cy="17" r="4" fill="#cc0000"/>
  <circle cx="13" cy="29" r="4" fill="#00cc44"/>
  <rect x="61" y="10" width="12" height="28" fill="#333" rx="3"/>
  <circle cx="67" cy="17" r="4" fill="#cc0000"/>
  <circle cx="67" cy="29" r="4" fill="#00cc44"/>
  <rect x="28" y="16" width="24" height="22" fill="#FFD700" rx="2"/>
  <rect x="24" y="11" width="32" height="8" fill="#1565C0" rx="2"/>
</svg>`
        },
        {
          id: 'in_86', number: '86',
          name: 'Rychlostní přikazník',
          description: 'Přikazuje jízdu předepsanou rychlostí (v km/h). Číslo v žluté oblasti určuje povinnou rychlost.',
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40" cy="40" r="38" fill="#FFD700" stroke="#111" stroke-width="3"/>
  <text x="40" y="52" text-anchor="middle" font-family="Arial,sans-serif" font-size="38" font-weight="bold" fill="#111">2</text>
</svg>`
        },
        {
          id: 'in_87', number: '87',
          name: 'Očekávej stůj (1. varianta)',
          description: 'Upozornění, že za tímto místem bude návěst „Stůj". Řidič musí snížit rychlost a připravit se k zastavení.',
          svg: `<svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="68" fill="#FFD700" rx="3" stroke="#111" stroke-width="2"/>
  <text x="40" y="52" text-anchor="middle" font-family="Arial,sans-serif" font-size="42" font-weight="bold" fill="#111">P</text>
</svg>`
        },
        {
          id: 'in_88', number: '88',
          name: 'Očekávej stůj (2. varianta)',
          description: 'Druhá varianta upozornění na blížící se signál „Stůj" – černé P na bílém pozadí.',
          svg: `<svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="68" fill="white" rx="3" stroke="#111" stroke-width="2"/>
  <text x="40" y="52" text-anchor="middle" font-family="Arial,sans-serif" font-size="42" font-weight="bold" fill="#111">P</text>
</svg>`
        },
        {
          id: 'in_89', number: '89',
          name: 'Výzvové návěstidlo',
          description: 'Zařízení vydávající světelnou výzvu řidiči. Řidič musí reagovat na zobrazený signál.',
          svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="58" fill="#1a1a1a" rx="3"/>
  <g fill="#FFD700">
    <rect x="12" y="12" width="8" height="8" rx="2"/>
    <rect x="24" y="12" width="8" height="8" rx="2"/>
    <rect x="36" y="12" width="8" height="8" rx="2"/>
    <rect x="48" y="12" width="8" height="8" rx="2"/>
    <rect x="60" y="12" width="8" height="8" rx="2"/>
    <rect x="12" y="25" width="8" height="8" rx="2"/>
    <rect x="60" y="25" width="8" height="8" rx="2"/>
    <rect x="12" y="38" width="8" height="8" rx="2"/>
    <rect x="24" y="38" width="8" height="8" rx="2"/>
    <rect x="36" y="38" width="8" height="8" rx="2"/>
    <rect x="48" y="38" width="8" height="8" rx="2"/>
    <rect x="60" y="38" width="8" height="8" rx="2"/>
  </g>
</svg>`
        },
        {
          id: 'in_90', number: '90',
          name: 'Nepřesnost návěstidla',
          description: 'Upozornění na to, že poloha návěstidla neodpovídá skutečnému stavu trati. Jednat podle platného rozkazu.',
          svg: `<svg viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="68" height="68" fill="white" rx="4" stroke="#111" stroke-width="2"/>
  <line x1="15" y1="15" x2="55" y2="55" stroke="#cc0000" stroke-width="7" stroke-linecap="round"/>
  <line x1="55" y1="15" x2="15" y2="55" stroke="#cc0000" stroke-width="7" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'in_91', number: '91',
          name: 'Srovnač blokovaný',
          description: 'Srovnávací zařízení je zablokováno – nelze je aktivovat. Tmavý kruh signalizuje nefunkční stav.',
          svg: `<svg viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="68" height="68" fill="white" rx="4" stroke="#111" stroke-width="2"/>
  <circle cx="35" cy="35" r="22" fill="#111"/>
</svg>`
        },
        {
          id: 'in_92', number: '92',
          name: 'Srovnač odblokovaný',
          description: 'Srovnávací zařízení je aktivní a funkční. Světlý kruh signalizuje připravenost ke srovnání polohy.',
          svg: `<svg viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="68" height="68" fill="white" rx="4" stroke="#111" stroke-width="2"/>
  <circle cx="35" cy="35" r="22" fill="white" stroke="#111" stroke-width="3"/>
</svg>`
        },
        {
          id: 'in_93', number: '93',
          name: 'Zastavení',
          description: 'Označuje místo povinného zastavení tramvaje (například na konci přijížděcí koleje nebo ve smyčce).',
          svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="4" width="72" height="52" fill="white" rx="4" stroke="#111" stroke-width="3" stroke-dasharray="10,5"/>
</svg>`
        },
        {
          id: 'in_94', number: '94',
          name: 'Začátek zóny',
          description: 'Označuje začátek regulované zóny (časového omezení provozu nebo zvláštního režimu).',
          svg: `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="88" height="58" fill="#FFD700" rx="3" stroke="#111" stroke-width="2"/>
  <text x="45" y="22" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="#111">ZÓNA</text>
  <text x="45" y="42" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="bold" fill="#111">22–6</text>
</svg>`
        },
        {
          id: 'in_95', number: '95',
          name: 'Konec zóny',
          description: 'Označuje konec regulované zóny. Za tímto místem opět platí standardní provozní podmínky.',
          svg: `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="88" height="58" fill="#e0e0e0" rx="3" stroke="#111" stroke-width="2"/>
  <text x="45" y="22" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#111" opacity="0.4">ZÓNA</text>
  <text x="45" y="42" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="bold" fill="#111" opacity="0.4">22–6</text>
  <line x1="8" y1="10" x2="82" y2="50" stroke="#cc0000" stroke-width="4" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'in_96', number: '96',
          name: 'Námezník',
          description: 'Označuje konec úseku, za kterým se tramvaj může bezpečně pohybovat bez rizika kolize se sousední kolejí.',
          svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="58" fill="white" rx="3" stroke="#111" stroke-width="2"/>
  <line x1="40" y1="8" x2="40" y2="52" stroke="#111" stroke-width="3"/>
  <line x1="10" y1="30" x2="70" y2="30" stroke="#111" stroke-width="3"/>
  <circle cx="40" cy="30" r="6" fill="#111"/>
</svg>`
        },
        {
          id: 'in_97', number: '97',
          name: 'Žlutý projízdný průřez',
          description: 'Označuje průjezdný průřez trati. Žluto-černé pruhy upozorňují na omezení průjezdného profilu.',
          svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="58" fill="#FFD700" rx="3"/>
  <rect x="1" y="1" width="20" height="58" fill="#111" rx="3 0 0 3"/>
  <rect x="59" y="1" width="20" height="58" fill="#111" rx="0 3 3 0"/>
  <line x1="10" y1="1" x2="10" y2="59" stroke="#FFD700" stroke-width="2"/>
  <line x1="21" y1="1" x2="21" y2="59" stroke="#111" stroke-width="2"/>
  <line x1="59" y1="1" x2="59" y2="59" stroke="#111" stroke-width="2"/>
  <line x1="70" y1="1" x2="70" y2="59" stroke="#FFD700" stroke-width="2"/>
</svg>`
        },
        {
          id: 'in_98', number: '98',
          name: 'Bezbariérová zastávka',
          description: 'Zastávka je vybavena nízkopodlažním nástupem přizpůsobeným pro osoby s omezenou pohyblivostí.',
          svg: `<svg viewBox="0 0 70 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="68" height="78" fill="#1565C0" rx="4"/>
  <circle cx="35" cy="18" r="8" fill="white"/>
  <path d="M28,28 L28,50 L20,65 M28,50 L38,60 L50,55" stroke="white" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="50" cy="66" r="8" fill="none" stroke="white" stroke-width="4"/>
</svg>`
        },
        {
          id: 'in_99', number: '99',
          name: 'Tunelový úsek tratě',
          description: 'Označuje začátek nebo konec tunelového úseku tramvajové trati. Platí zvláštní provozní předpisy.',
          svg: `<svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="68" fill="white" rx="3" stroke="#111" stroke-width="2"/>
  <path d="M8,60 L8,30 Q8,10 40,10 Q72,10 72,30 L72,60 Z" fill="#555" stroke="#111" stroke-width="2"/>
  <path d="M16,60 L16,32 Q16,18 40,18 Q64,18 64,32 L64,60 Z" fill="#1a1a1a"/>
  <line x1="8" y1="60" x2="72" y2="60" stroke="#111" stroke-width="2"/>
  <line x1="32" y1="18" x2="32" y2="60" stroke="#555" stroke-width="1.5" stroke-dasharray="4,3"/>
  <line x1="48" y1="18" x2="48" y2="60" stroke="#555" stroke-width="1.5" stroke-dasharray="4,3"/>
</svg>`
        },
      ]
    },
  ]
};

/* ══════════════════════════════════════════════════
   POMOCNÉ FUNKCE
══════════════════════════════════════════════════ */

/** Vrátí všechny značky ze zadaných kategorií. */
function getSignsByCategories(categoryIds) {
  const result = [];
  ZNACKY_DATA.categories.forEach(cat => {
    if (categoryIds.includes(cat.id)) {
      cat.signs.forEach(s => result.push({ ...s, categoryId: cat.id, categoryName: cat.name }));
    }
  });
  return result;
}

/** Vrátí všechny značky ze všech kategorií. */
function getAllSigns() {
  return getSignsByCategories(ZNACKY_DATA.categories.map(c => c.id));
}
