/**
 * znacky_data.js – Návěstní soustava DPMB (Příloha č.1 směrnice D21/7)
 * Data pro kartičky a kvíz se značkami.
 */

/* ── SVG helpers ─────────────────────────────────────────────── */

// Základní tvar kosoštvorce (80×80 viewBox)
const _D = `<polygon points="40,3 77,40 40,77 3,40" stroke="#111" stroke-width="3" fill="white"/>`;

// Semafór TB1-01 (46×112 viewBox): r/y/g = barva pokud svítí, jinak null = tmavý kroužek
function _TL(r, y, g) {
  const off = '#2e2e2e';
  return `<svg viewBox="0 0 46 112" xmlns="http://www.w3.org/2000/svg">
  <!-- tělo semaforu -->
  <rect x="1" y="1" width="44" height="110" fill="#3c3c3c" rx="6" stroke="#222" stroke-width="1.5"/>
  <!-- odraz/lesk nahoře -->
  <rect x="4" y="4" width="38" height="18" fill="#484848" rx="4"/>
  <!-- kruh horní (červená) -->
  <circle cx="23" cy="24" r="14" fill="${r || off}"/>
  ${r ? `<circle cx="19" cy="20" r="4" fill="rgba(255,255,255,0.2)"/>` : ''}
  <!-- kruh střední (žlutá) -->
  <circle cx="23" cy="56" r="14" fill="${y || off}"/>
  ${y ? `<circle cx="19" cy="52" r="4" fill="rgba(255,255,255,0.2)"/>` : ''}
  <!-- kruh dolní (zelená) -->
  <circle cx="23" cy="88" r="14" fill="${g || off}"/>
  ${g ? `<circle cx="19" cy="84" r="4" fill="rgba(255,255,255,0.2)"/>` : ''}
  <!-- štítek TB1-01 -->
  <rect x="4" y="104" width="38" height="6" fill="#2a2a2a" rx="2"/>
  <text x="23" y="109" text-anchor="middle" font-family="Arial,sans-serif" font-size="4" fill="#888">TB1-01</text>
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
          id: 'rj_01', number: '1',
          name: 'Stůj',
          description: 'Příkaz k okamžitému zastavení vozidla. Řidič musí zastavit na místě.',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="54" height="78" fill="#cc0000" stroke="white" stroke-width="5"/>
</svg>`
        },
        {
          id: 'rj_02', number: '2',
          name: 'Bezpečnostní zastavení',
          description: '',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="54" height="78" fill="white" stroke="#2e7d32" stroke-width="4"/>
  <polygon points="43,3 53,3 13,77 3,77" fill="#4caf50"/>
</svg>`
        },
        {
          id: 'rj_05', number: '5',
          name: 'Zvoňte',
          description: '',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="54" height="78" fill="white" stroke="#111" stroke-width="2"/>
  <circle cx="28" cy="13" r="5" fill="#111"/>
  <circle cx="28" cy="13" r="2.5" fill="white"/>
  <path d="M28,17 C24,17 21,20 21,24 C15,28 10,39 10,51 L10,59 Q10,63 14,63 L42,63 Q46,63 46,59 L46,51 C46,39 41,28 35,24 C35,20 32,17 28,17Z" fill="#111"/>
  <ellipse cx="28" cy="63" rx="6" ry="3" fill="white"/>
  <ellipse cx="28" cy="68" rx="5" ry="4" fill="#111"/>
</svg>`
        },
        {
          id: 'rj_06', number: '6',
          name: 'Výstraha',
          description: 'Upozornění na nebezpečné nebo nepřehledné místo. Řidič musí jet opatrně a být připraven zastavit.',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="54" height="78" fill="#FFD700" stroke="#111" stroke-width="2"/>
  <text x="28" y="66" text-anchor="middle" font-family="Arial,sans-serif" font-size="60" font-weight="bold" fill="#cc0000">!</text>
</svg>`
        },
        {
          id: 'rj_09', number: '9',
          name: 'Zhoršené rozhledové poměry',
          description: 'Místo se zhoršeným výhledem – řidič musí jet zvlášť opatrně a zajistit bezpečný průjezd.',
          svg: `<svg viewBox="0 0 56 148" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="54" height="74" fill="#FFD700" stroke="#111" stroke-width="2"/>
  <text x="28" y="64" text-anchor="middle" font-family="Arial,sans-serif" font-size="58" font-weight="bold" fill="#cc0000">!</text>
  <rect x="1" y="82" width="54" height="54" fill="#FFD700" stroke="#111" stroke-width="2"/>
  <path d="M8,109 Q28,93 48,109 Q28,125 8,109Z" fill="white" stroke="#111" stroke-width="1.5"/>
  <circle cx="28" cy="109" r="8" fill="#111"/>
  <circle cx="25" cy="106" r="2.5" fill="white"/>
</svg>`
        },
        {
          id: 'rj_11', number: '11',
          name: 'Pomalu',
          description: 'Příkaz k jízdě malou rychlostí. Zpravidla doprovázen maximální povolenou rychlostí.',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="54" height="78" fill="#FFD700" stroke="#111" stroke-width="2"/>
</svg>`
        },
        {
          id: 'rj_13', number: '13',
          name: 'Signály pro tramvaje',
          description: 'Označuje místo, kde platí zvláštní světelné signály určené výhradně pro tramvaje.',
          svg: `<svg viewBox="0 0 44 32" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="42" height="30" fill="#444"/>
  <circle cx="11" cy="11" r="5" fill="#bbb"/>
  <circle cx="22" cy="11" r="5" fill="#bbb"/>
  <circle cx="33" cy="11" r="5" fill="#bbb"/>
  <circle cx="22" cy="23" r="5" fill="#bbb"/>
</svg>`
        },
        {
          id: 'rj_16', number: '16',
          name: 'Traťová rychlost',
          description: 'Dovolená traťová rychlost na daném úseku. Číslo udává maximální povolenou rychlost v km/h.',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="54" height="78" fill="white" stroke="#111" stroke-width="3"/>
  <text x="28" y="56" text-anchor="middle" font-family="Arial,sans-serif" font-size="44" font-weight="bold" fill="#111">60</text>
</svg>`
        },
        {
          id: 'rj_19', number: '19',
          name: 'Omezení rychlosti',
          description: 'Snížení dovolené rychlosti na úseku. Číslo udává maximální povolenou rychlost v km/h.',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="54" height="78" fill="#FFD700" stroke="white" stroke-width="4"/>
  <text x="28" y="56" text-anchor="middle" font-family="Arial,sans-serif" font-size="44" font-weight="bold" fill="#111">15</text>
</svg>`
        },
        {
          id: 'rj_19a', number: '19a',
          name: 'Dodatková tabulka A',
          description: '',
          svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="48" fill="white" stroke="#111" stroke-width="2.5"/>
  <!-- plná šipka doprava -->
  <polygon points="15,21 50,21 50,13 65,25 50,37 50,29 15,29" fill="#111"/>
</svg>`
        },
        {
          id: 'rj_19b', number: '19b',
          name: 'Dodatková tabulka B',
          description: '',
          svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="48" fill="white" stroke="#111" stroke-width="2.5"/>
  <!-- dvě svislé čáry (rovná kolej) -->
  <line x1="30" y1="8" x2="30" y2="42" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <line x1="50" y1="8" x2="50" y2="42" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <!-- dvě paralelní odbočky nahoru a doprava (jako kolejnice výhybky) -->
  <path d="M 30,37 Q 30,18 58,8" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <path d="M 50,37 Q 50,22 71,14" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_19c', number: '19c',
          name: 'Dodatková tabulka C',
          description: '',
          svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="48" fill="white" stroke="#111" stroke-width="2.5"/>
  <!-- dvě svislé čáry -->
  <line x1="30" y1="8" x2="30" y2="42" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <line x1="50" y1="8" x2="50" y2="42" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <!-- dvě vodorovné čáry (zkrácené na délku svislých čar) -->
  <line x1="18" y1="19" x2="62" y2="19" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <line x1="18" y1="31" x2="62" y2="31" stroke="#111" stroke-width="4" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_20', number: '20',
          name: 'Teplotní omezení rychlosti',
          description: '',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="54" height="78" fill="#FFD700" stroke="white" stroke-width="4"/>
  <text x="28" y="58" text-anchor="middle" font-family="Arial,sans-serif" font-size="52" font-weight="bold" fill="#111">T</text>
</svg>`
        },
        {
          id: 'rj_21', number: '21',
          name: 'Ukončení omezené rychlosti',
          description: 'Konec úseku s omezenou rychlostí – obnoví se traťová rychlost.',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="54" height="78" fill="#FFD700" stroke="white" stroke-width="4"/>
  <line x1="50" y1="8" x2="6" y2="72" stroke="#111" stroke-width="5" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_22', number: '22',
          name: 'Konec úseku s teplotním omezením rychlosti',
          description: '',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="54" height="78" fill="white" stroke="#111" stroke-width="3"/>
  <text x="28" y="58" text-anchor="middle" font-family="Arial,sans-serif" font-size="52" font-weight="bold" fill="#aaa">T</text>
  <line x1="50" y1="8" x2="6" y2="72" stroke="#111" stroke-width="4" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_dod_tramvaj', number: '',
          name: 'Dodatková tabulka – tramvaj',
          description: 'Dodatková tabulka zobrazující tramvaj zepředu. Upřesňuje platnost nadřazené značky.',
          svg: `<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="88" fill="white" stroke="#111" stroke-width="3"/>
  <rect x="24" y="5" width="32" height="20" fill="none" stroke="#111" stroke-width="2"/>
  <line x1="24" y1="5" x2="56" y2="25" stroke="#111" stroke-width="2"/>
  <line x1="56" y1="5" x2="24" y2="25" stroke="#111" stroke-width="2"/>
  <line x1="28" y1="25" x2="26" y2="30" stroke="#111" stroke-width="2"/>
  <line x1="52" y1="25" x2="54" y2="30" stroke="#111" stroke-width="2"/>
  <rect x="17" y="28" width="46" height="52" fill="#111" rx="4"/>
  <rect x="24" y="32" width="32" height="22" fill="white" rx="1"/>
  <line x1="40" y1="32" x2="40" y2="54" stroke="#111" stroke-width="2"/>
  <circle cx="25" cy="64" r="5" fill="white"/>
  <circle cx="55" cy="64" r="5" fill="white"/>
  <rect x="20" y="73" width="40" height="6" fill="white" rx="1"/>
</svg>`
        },
        {
          id: 'rj_23', number: '23',
          name: 'Přednost v jízdě před protijedoucí tramvají',
          description: '',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="27" height="78" fill="#cc0000"/>
  <rect x="28" y="1" width="27" height="78" fill="#4caf50"/>
  <rect x="1" y="1" width="54" height="78" fill="none" stroke="#111" stroke-width="2"/>
</svg>`
        },
        {
          id: 'rj_24', number: '24',
          name: 'Konec úseku v přednosti před protijedoucí tramvají',
          description: '',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="27" height="78" fill="#cc0000"/>
  <rect x="28" y="1" width="27" height="78" fill="#4caf50"/>
  <rect x="1" y="1" width="54" height="78" fill="none" stroke="#111" stroke-width="2"/>
  <line x1="55" y1="1" x2="1" y2="79" stroke="#111" stroke-width="4" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_25', number: '25',
          name: 'Dej přednost v jízdě před protijedoucí tramvají',
          description: '',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="27" height="78" fill="#4caf50"/>
  <rect x="28" y="1" width="27" height="78" fill="#cc0000"/>
  <rect x="1" y="1" width="54" height="78" fill="none" stroke="#111" stroke-width="2"/>
</svg>`
        },
        {
          id: 'rj_26', number: '26',
          name: 'Konec úseku dej přednost v jízdě před protijedoucí tramvají',
          description: '',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="27" height="78" fill="#4caf50"/>
  <rect x="28" y="1" width="27" height="78" fill="#cc0000"/>
  <rect x="1" y="1" width="54" height="78" fill="none" stroke="#111" stroke-width="2"/>
  <line x1="55" y1="1" x2="1" y2="79" stroke="#111" stroke-width="4" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_27', number: '27',
          name: 'Zákaz souběžné jízdy po sousedních kolejích',
          description: '',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <polygon points="1,1 55,1 55,40" fill="#4caf50"/>
  <polygon points="1,79 55,79 55,40" fill="#4caf50"/>
  <polygon points="1,1 1,79 55,40" fill="#cc0000"/>
  <rect x="1" y="1" width="54" height="78" fill="none" stroke="#111" stroke-width="2"/>
</svg>`
        },
        {
          id: 'rj_28', number: '28',
          name: 'Konec zákazu souběžné jízdy po sousedních kolejích',
          description: '',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <polygon points="1,1 55,1 55,40" fill="#4caf50"/>
  <polygon points="1,79 55,79 55,40" fill="#4caf50"/>
  <polygon points="1,1 1,79 55,40" fill="#cc0000"/>
  <rect x="1" y="1" width="54" height="78" fill="none" stroke="#111" stroke-width="2"/>
  <line x1="55" y1="1" x2="1" y2="79" stroke="#111" stroke-width="4" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_30a_1', number: '30Aa',
          name: 'Úsečkový světelný signál – Kolejové rozvětvení – Stůj!',
          description: '',
          svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="58" fill="#888" rx="8"/>
  <rect x="7" y="26" width="46" height="8" fill="#FFD700" rx="4"/>
</svg>`
        },
        {
          id: 'rj_30a_2', number: '30Ab',
          name: 'Úsečkový světelný signál – Kolejové rozvětvení – Stůj!',
          description: '',
          svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="58" fill="#888" rx="8"/>
  <rect x="7" y="26" width="46" height="8" fill="#cc0000" rx="4"/>
</svg>`
        },
        {
          id: 'rj_30a_3', number: '30Ac',
          name: 'Úsečkový světelný signál – Kolejové rozvětvení – Stůj! Poptávka přijata',
          description: '',
          svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="58" fill="#888" rx="8"/>
  <rect x="7" y="26" width="46" height="8" fill="#FFD700" rx="4"/>
  <circle cx="12" cy="48" r="7" fill="#1565c0"/>
</svg>`
        },
        {
          id: 'rj_30b_1', number: '30AD',
          name: 'Úsečkový světelný signál – Povolení jízdy vyznačeným směrem',
          description: 'Svislá žlutá pomlčka – signál pro jízdu rovně.',
          svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="58" fill="#888" rx="8"/>
  <line x1="30" y1="8" x2="30" y2="52" stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_30b_2', number: '30AE',
          name: 'Úsečkový světelný signál – Povolení jízdy vyznačeným směrem',
          description: 'Diagonální žlutá pomlčka zleva nahoře doprava dolů – signál pro odbočení.',
          svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="58" fill="#888" rx="8"/>
  <line x1="12" y1="12" x2="48" y2="48" stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_30b_3', number: '30AF',
          name: 'Úsečkový světelný signál – Povolení jízdy vyznačeným směrem',
          description: 'Dvě diagonální žluté pomlčky – signál pro rozvětvení trati.',
          svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="58" fill="#888" rx="8"/>
  <line x1="12" y1="12" x2="48" y2="48" stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
  <line x1="48" y1="12" x2="48" y2="50" stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_30b_h', number: '30BA',
          name: 'Úsečkový světelný signál – Jízda do jednokolejného úseku – Zákaz jízdy',
          description: '',
          svg: `<svg viewBox="0 0 60 86" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="58" fill="#888" rx="8"/>
  <line x1="7" y1="30" x2="53" y2="30" stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
  <rect x="1" y="64" width="58" height="20" fill="white" stroke="#111" stroke-width="2"/>
  <line x1="16" y1="82" x2="26" y2="70" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="34" y1="70" x2="44" y2="82" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_30b_v', number: '30BB',
          name: 'Úsečkový světelný signál – Jízda do jednokolejného úseku – Povolení jízdy',
          description: '',
          svg: `<svg viewBox="0 0 60 86" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="58" fill="#888" rx="8"/>
  <line x1="30" y1="8" x2="30" y2="52" stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
  <rect x="1" y="64" width="58" height="20" fill="white" stroke="#111" stroke-width="2"/>
  <line x1="16" y1="82" x2="26" y2="70" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="34" y1="70" x2="44" y2="82" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'rj_30c_h', number: '30Ca',
          name: 'Úsečkový světelný signál – Omezení jízdy v záplavovém úseku – Zákaz jízdy',
          description: '',
          svg: `<svg viewBox="0 0 60 88" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="58" fill="#888" rx="8"/>
  <line x1="7" y1="30" x2="53" y2="30" stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
  <rect x="1" y="64" width="58" height="22" fill="white" stroke="#111" stroke-width="2"/>
  <path d="M 3,86 L 3,83 Q 10,68 17,83 Q 23,68 30,83 Q 37,68 44,83 Q 50,68 57,83 L 57,86 Z" fill="#1565c0"/>
</svg>`
        },
        {
          id: 'rj_30c_v', number: '30Cb',
          name: 'Úsečkový světelný signál – Omezení jízdy v záplavovém úseku – Pokračuj v jízdě se zvýšenou opatrností (10 km/h)',
          description: '',
          svg: `<svg viewBox="0 0 60 88" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="58" fill="#888" rx="8"/>
  <line x1="30" y1="8" x2="30" y2="52" stroke="#FFD700" stroke-width="8" stroke-linecap="round"/>
  <rect x="1" y="64" width="58" height="22" fill="white" stroke="#111" stroke-width="2"/>
  <path d="M 3,86 L 3,83 Q 10,68 17,83 Q 23,68 30,83 Q 37,68 44,83 Q 50,68 57,83 L 57,86 Z" fill="#1565c0"/>
</svg>`
        },
        {
          id: 'rj_31', number: '31',
          name: 'Zákaz couvání',
          description: 'Přísný zákaz jízdy zpět (couvání) v tomto místě nebo úseku.',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="54" height="78" fill="white" stroke="#cc0000" stroke-width="4"/>
  <polygon points="22,12 34,12 34,48 44,48 28,68 12,48 22,48" fill="#cc0000"/>
</svg>`
        },
        {
          id: 'rj_32', number: '32',
          name: 'Přednost v jízdě na hlavní trati',
          description: 'Vozidlo má přednost v jízdě na hlavní trati oproti vozidlům přijíždějícím z vedlejší trati.',
          svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="50,4 96,50 50,96 4,50" fill="white" stroke="#2e7d32" stroke-width="3"/>
  <rect x="41" y="28" width="18" height="11" fill="none" stroke="#111" stroke-width="1.5"/>
  <line x1="41" y1="28" x2="59" y2="39" stroke="#111" stroke-width="1.5"/>
  <line x1="59" y1="28" x2="41" y2="39" stroke="#111" stroke-width="1.5"/>
  <line x1="44" y1="39" x2="43" y2="42" stroke="#111" stroke-width="1.5"/>
  <line x1="56" y1="39" x2="57" y2="42" stroke="#111" stroke-width="1.5"/>
  <rect x="38" y="41" width="24" height="28" fill="#111" rx="2"/>
  <rect x="42" y="44" width="16" height="11" fill="white" rx="1"/>
  <line x1="50" y1="44" x2="50" y2="55" stroke="#111" stroke-width="1.5"/>
  <circle cx="41" cy="59" r="3" fill="white"/>
  <circle cx="59" cy="59" r="3" fill="white"/>
  <rect x="40" y="64" width="20" height="4" fill="white" rx="1"/>
</svg>`
        },
        {
          id: 'rj_33', number: '33',
          name: 'Dej přednost jízdě na hlavní trati',
          description: 'Příkaz dát přednost vozidlům na hlavní trati.',
          svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="5,11 95,11 50,89" fill="white" stroke="#cc0000" stroke-width="5"/>
  <rect x="41" y="17" width="18" height="11" fill="none" stroke="#111" stroke-width="1.5"/>
  <line x1="41" y1="17" x2="59" y2="28" stroke="#111" stroke-width="1.5"/>
  <line x1="59" y1="17" x2="41" y2="28" stroke="#111" stroke-width="1.5"/>
  <line x1="44" y1="28" x2="43" y2="31" stroke="#111" stroke-width="1.5"/>
  <line x1="56" y1="28" x2="57" y2="31" stroke="#111" stroke-width="1.5"/>
  <rect x="38" y="31" width="24" height="26" fill="#111" rx="2"/>
  <rect x="42" y="34" width="16" height="11" fill="white" rx="1"/>
  <line x1="50" y1="34" x2="50" y2="45" stroke="#111" stroke-width="1.5"/>
  <circle cx="41" cy="49" r="3" fill="white"/>
  <circle cx="59" cy="49" r="3" fill="white"/>
  <rect x="40" y="54" width="20" height="4" fill="white" rx="1"/>
</svg>`
        },
        {
          id: 'rj_34', number: '34',
          name: 'Práce na trati',
          description: '',
          svg: `<img src="Značky2/fotky/34.png" style="max-width:100%;max-height:100%;object-fit:contain;">`
        },
        {
          id: 'rj_35', number: '35',
          name: 'Konec práce na trati',
          description: '',
          svg: `<img src="Značky2/fotky/35.png" style="max-width:100%;max-height:100%;object-fit:contain;">`
        },
      ]
    },

    /* ══════════════════════════════════════════════════
       5.1R – RUČNÍ NÁVĚSTÍ
    ══════════════════════════════════════════════════ */
    {
      id: 'rucni_navestni',
      number: '5.1R',
      name: 'Ruční návěsti',
      color: '#2c3e50',
      icon: '🙋',
      signs: [
        {
          id: 'rn_1r', number: '01',
          name: 'Stůj!',
          description: '',
          svg: `<img src="Značky2/fotky/1r.png" style="max-width:100%;max-height:100%;object-fit:contain;">`
        },
        {
          id: 'rn_2r', number: '02',
          name: 'Přiblížit!',
          description: '',
          svg: `<img src="Značky2/fotky/2r.png" style="max-width:100%;max-height:100%;object-fit:contain;">`
        },
        {
          id: 'rn_3r', number: '04',
          name: 'Vzdálit!',
          description: '',
          svg: `<img src="Značky2/fotky/3r.png" style="max-width:100%;max-height:100%;object-fit:contain;">`
        },
        {
          id: 'rn_4r', number: '08',
          name: 'Nebezpečí – Zastavte všemi prostředky!',
          description: '',
          svg: `<img src="Značky2/fotky/4r.png" style="max-width:100%;max-height:100%;object-fit:contain;">`
        },
        {
          id: 'rn_5r', number: '010',
          name: 'Pomalu!',
          description: '',
          svg: `<img src="Značky2/fotky/5r.png" style="max-width:100%;max-height:100%;object-fit:contain;">`
        },
        {
          id: 'rn_6r', number: '031A',
          name: 'Stáhni sběrač! – Začátek úseku',
          description: '',
          svg: `<img src="Značky2/fotky/6r.png" style="max-width:100%;max-height:100%;object-fit:contain;">`
        },
        {
          id: 'rn_7r', number: '031B',
          name: 'Stáhni sběrač! – Konec úseku',
          description: '',
          svg: `<img src="Značky2/fotky/7r.png" style="max-width:100%;max-height:100%;object-fit:contain;">`
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
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="76" height="76" fill="#c8c8c8" rx="4" stroke="#888" stroke-width="1.5"/>
  <text x="40" y="62" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="62" font-weight="900" fill="#111">Z</text>
</svg>`
        },
        {
          id: 'zt_42', number: '42',
          name: 'Konec zabezpečeného úseku',
          description: 'Tabule „K" označuje konec zabezpečeného úseku trati.',
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="76" height="76" fill="#c8c8c8" rx="4" stroke="#888" stroke-width="1.5"/>
  <text x="40" y="62" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="62" font-weight="900" fill="#111">K</text>
</svg>`
        },
        {
          id: 'zt_43', number: '43',
          name: 'Volná trať',
          description: 'TB1-01: Dolní zelené světlo – trať je volná, vozidlo může pokračovat v jízdě.',
          svg: `${_TL(null, null, '#00cc44')}`
        },
        {
          id: 'zt_44', number: '44',
          name: 'Výstraha',
          description: 'TB1-01: Střední žluté světlo – výstraha. Vozidlo musí snížit rychlost a být připraveno zastavit.',
          svg: `${_TL(null, '#ffcc00', null)}`
        },
        {
          id: 'zt_45', number: '45',
          name: 'Stůj',
          description: 'TB1-01: Horní červené světlo – stůj. Vozidlo nesmí pokračovat v jízdě.',
          svg: `${_TL('#e60000', null, null)}`
        },
        {
          id: 'zt_46', number: '46A',
          name: 'Nezabezpečený úsek (bliká)',
          description: '',
          svg: `<svg viewBox="0 0 80 122" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(23,0) scale(0.75)">
    <rect x="1" y="1" width="44" height="110" fill="#3c3c3c" rx="6" stroke="#222" stroke-width="1.5"/>
    <rect x="4" y="4" width="38" height="18" fill="#484848" rx="4"/>
    <circle cx="23" cy="24" r="14" fill="#2e2e2e"/>
    <circle cx="23" cy="56" r="14" fill="#f39c12"/>
    <circle cx="23" cy="56" r="8" fill="#ffcc00"/>
    <g stroke="#f39c12" stroke-width="2.5" stroke-linecap="round">
      <line x1="23" y1="39" x2="23" y2="36"/>
      <line x1="23" y1="73" x2="23" y2="76"/>
      <line x1="7"  y1="56" x2="4"  y2="56"/>
      <line x1="39" y1="56" x2="42" y2="56"/>
      <line x1="12" y1="45" x2="9"  y2="43"/>
      <line x1="34" y1="45" x2="37" y2="43"/>
      <line x1="12" y1="67" x2="9"  y2="69"/>
      <line x1="34" y1="67" x2="37" y2="69"/>
    </g>
    <circle cx="23" cy="88" r="14" fill="#2e2e2e"/>
    <rect x="4" y="104" width="38" height="6" fill="#2a2a2a" rx="2"/>
    <text x="23" y="109" text-anchor="middle" font-family="Arial,sans-serif" font-size="4" fill="#888">TB1-01</text>
  </g>
  <!-- Dodatková tabulka -->
  <rect x="1" y="87" width="78" height="33" fill="white" stroke="#111" stroke-width="2"/>
  <text x="40" y="109" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="bold" fill="#111">TB1-01</text>
</svg>`
        },
        {
          id: 'zt_48', number: '46B',
          name: 'Nezabezpečený úsek',
          description: '',
          svg: `<svg viewBox="0 0 70 123" xmlns="http://www.w3.org/2000/svg">
  <!-- tělo TB1-03 – čtvercovitý tvar -->
  <rect x="1" y="1" width="68" height="88" fill="#3c3c3c" rx="6" stroke="#222" stroke-width="1.5"/>
  <rect x="4" y="4" width="62" height="14" fill="#484848" rx="4"/>
  <!-- velký kruh se sluncem uprostřed -->
  <circle cx="35" cy="48" r="28" fill="#f39c12"/>
  <circle cx="35" cy="48" r="16" fill="#ffcc00"/>
  <g stroke="#f39c12" stroke-width="3.5" stroke-linecap="round">
    <line x1="35" y1="16" x2="35" y2="11"/>
    <line x1="35" y1="80" x2="35" y2="85"/>
    <line x1="5"  y1="48" x2="1"  y2="48"/>
    <line x1="65" y1="48" x2="69" y2="48"/>
    <line x1="15" y1="28" x2="11" y2="24"/>
    <line x1="55" y1="28" x2="59" y2="24"/>
    <line x1="15" y1="68" x2="11" y2="72"/>
    <line x1="55" y1="68" x2="59" y2="72"/>
  </g>
  <!-- štítek TB1-03 -->
  <rect x="4" y="80" width="62" height="7" fill="#2a2a2a" rx="2"/>
  <text x="35" y="86" text-anchor="middle" font-family="Arial,sans-serif" font-size="5" fill="#888">TB1-03</text>
  <!-- Dodatková tabulka -->
  <rect x="1" y="93" width="68" height="28" fill="white" stroke="#111" stroke-width="2"/>
  <text x="35" y="112" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="#111">TB1-03</text>
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
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <polygon points="40,5 75,40 40,75 5,40" fill="#4caf50" stroke="white" stroke-width="8" paint-order="stroke fill"/>
  <circle cx="14" cy="40" r="5" fill="white"/>
  <circle cx="27" cy="40" r="5" fill="white"/>
  <circle cx="53" cy="40" r="5" fill="white"/>
  <circle cx="66" cy="40" r="5" fill="white"/>
</svg>`
        },
        {
          id: 'tv_52', number: '52',
          name: 'Diodový úsekový dělič',
          description: 'Úsekový dělič vybavený diodou – propouští proud pouze jedním směrem.',
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <!-- zelený kosočtverec s bílým rámečkem (stejný tvar jako 51) -->
  <polygon points="40,5 75,40 40,75 5,40" fill="#4caf50" stroke="white" stroke-width="8" paint-order="stroke fill"/>
  <!-- dlouhá pomlčka uprostřed -->
  <rect x="17" y="36" width="46" height="8" fill="white" rx="4"/>
</svg>`
        },
        {
          id: 'tv_53', number: '53',
          name: 'Stáhni sběrač',
          description: '',
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <!-- zelený kosočtverec s bílým rámečkem (stejný tvar jako 51) -->
  <polygon points="40,5 75,40 40,75 5,40" fill="#4caf50" stroke="white" stroke-width="8" paint-order="stroke fill"/>
  <!-- 1 tečka dole -->
  <circle cx="40" cy="65" r="5" fill="white"/>
  <!-- 2 tečky po levé stěně (zdola nahoru) -->
  <circle cx="28" cy="55" r="5" fill="white"/>
  <circle cx="17" cy="45" r="5" fill="white"/>
  <!-- 2 tečky po pravé stěně (zdola nahoru) -->
  <circle cx="52" cy="55" r="5" fill="white"/>
  <circle cx="63" cy="45" r="5" fill="white"/>
</svg>`
        },
        {
          id: 'tv_54', number: '54',
          name: 'Zvední sběrač',
          description: 'Příkaz ke zdvižení trolejového sběrače. Za tímto místem je sběrač opět zdvižen.',
          svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <polygon points="40,5 75,40 40,75 5,40" fill="#4caf50" stroke="white" stroke-width="8" paint-order="stroke fill"/>
  <circle cx="40" cy="15" r="5" fill="white"/>
  <circle cx="28" cy="25" r="5" fill="white"/>
  <circle cx="17" cy="35" r="5" fill="white"/>
  <circle cx="52" cy="25" r="5" fill="white"/>
  <circle cx="63" cy="35" r="5" fill="white"/>
</svg>`
        },
        {
          id: 'tv_55', number: '55',
          name: 'Začátek snížené výšky trolejového drátu',
          description: '',
          svg: `<img src="Značky2/fotky/55.png" style="max-width:100%;max-height:100%;object-fit:contain;">`
        },
        {
          id: 'tv_56', number: '56',
          name: 'Konec snížené výšky trolejového drátu',
          description: '',
          svg: `<img src="Značky2/fotky/56.png" style="max-width:100%;max-height:100%;object-fit:contain;">`
        },
        {
          id: 'tv_59', number: '59',
          name: 'Číslo trolejové výhybky',
          description: 'Označení čísla trolejové výhybky. Číslo v modrém obdélníku identifikuje konkrétní výhybku trolejového vedení.',
          svg: `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="38" fill="#1565c0" rx="3"/>
  <text x="30" y="29" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="white">4</text>
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
          description: 'Výhybka nemá pevné základní postavení – nelze předpokládat žádnou určitou polohu výhybkových jazyků.',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="54" height="78" fill="white" stroke="#cc0000" stroke-width="4"/>
  <line x1="5" y1="5" x2="51" y2="75" stroke="#cc0000" stroke-width="5" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'kv_63a', number: '63A',
          name: 'Elektrické zablokování výhybky – Výhybka nezablokovaná',
          description: '',
          svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="56" height="56" fill="#999" rx="8"/>
</svg>`
        },
        {
          id: 'kv_63b', number: '63B',
          name: 'Elektrické zablokování výhybky – Směr postavení nezablokované výhybky',
          description: '',
          svg: `<svg viewBox="0 0 128 60" xmlns="http://www.w3.org/2000/svg">
  <!-- levý čtverec – s modrou diagonální pomlčkou -->
  <rect x="2" y="2" width="56" height="56" fill="#999" rx="8"/>
  <line x1="14" y1="14" x2="46" y2="46" stroke="#1565C0" stroke-width="7" stroke-linecap="round"/>
  <!-- pravý čtverec – modrá pomlčka od spodního levého k pravému hornímu rohu -->
  <rect x="70" y="2" width="56" height="56" fill="#999" rx="8"/>
  <line x1="82" y1="46" x2="114" y2="14" stroke="#1565C0" stroke-width="7" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'kv_63c', number: '63C',
          name: 'Elektrické zablokování výhybky – Zákaz vjezdu na výhybku',
          description: '',
          svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="56" height="56" fill="#999" rx="8"/>
  <line x1="14" y1="14" x2="46" y2="46" stroke="#1565C0" stroke-width="7" stroke-linecap="round"/>
  <line x1="46" y1="14" x2="14" y2="46" stroke="#1565C0" stroke-width="7" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'kv_64a', number: '64A',
          name: 'Ruční výhybka',
          description: '',
          svg: `<svg viewBox="0 0 90 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="88" height="48" fill="#111"/>
  <text x="45" y="35" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="white">1202</text>
</svg>`
        },
        {
          id: 'kv_64b', number: '64B',
          name: 'Ruční výhybka – zajištěná',
          description: '',
          svg: `<svg viewBox="0 0 90 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="88" height="48" fill="#111"/>
  <text x="45" y="35" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="#FFD700">1023</text>
</svg>`
        },
        {
          id: 'kv_64c', number: '64C',
          name: 'Vratná výhybka',
          description: '',
          svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="48" fill="white" stroke="#111" stroke-width="3"/>
  <text x="40" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="#111">110</text>
</svg>`
        },
        {
          id: 'kv_64d', number: '64D',
          name: 'Elektrická výhybka',
          description: '',
          svg: `<svg viewBox="0 0 90 78" xmlns="http://www.w3.org/2000/svg">
  <!-- horní část: černý obdélník, 3 čtverce -->
  <rect x="1" y="1" width="88" height="38" fill="#111"/>
  <!-- levý bílý čtverec -->
  <rect x="2" y="2" width="27" height="36" fill="white"/>
  <!-- pravý bílý čtverec -->
  <rect x="61" y="2" width="27" height="36" fill="white"/>
  <!-- levá plná šipka doleva -->
  <polygon points="5,20 16,12 16,16 28,16 28,24 16,24 16,28" fill="#111"/>
  <!-- pravá plná šipka doprava -->
  <polygon points="85,20 74,12 74,16 62,16 62,24 74,24 74,28" fill="#111"/>
  <!-- dolní část: žlutý obdélník s číslem -->
  <rect x="1" y="42" width="88" height="35" fill="#FFD700"/>
  <text x="45" y="66" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="#111">153</text>
</svg>`
        },
        {
          id: 'kv_64e', number: '64E',
          name: 'Dvojitá elektrická výhybka',
          description: '',
          svg: `<svg viewBox="0 0 90 78" xmlns="http://www.w3.org/2000/svg">
  <!-- horní část: černý obdélník, 3 čtverce -->
  <rect x="1" y="1" width="88" height="38" fill="#111"/>
  <!-- levý bílý čtverec -->
  <rect x="2" y="2" width="27" height="36" fill="white"/>
  <!-- střední bílý čtverec -->
  <rect x="31" y="2" width="28" height="36" fill="white"/>
  <!-- pravý bílý čtverec -->
  <rect x="61" y="2" width="27" height="36" fill="white"/>
  <!-- levá plná šipka doleva -->
  <polygon points="5,20 16,12 16,16 28,16 28,24 16,24 16,28" fill="#111"/>
  <!-- střední plná šipka nahoru -->
  <polygon points="45,4 53,14 49,14 49,36 41,36 41,14 37,14" fill="#111"/>
  <!-- pravá plná šipka doprava -->
  <polygon points="85,20 74,12 74,16 62,16 62,24 74,24 74,28" fill="#111"/>
  <!-- dolní část: žlutý obdélník -->
  <rect x="1" y="42" width="88" height="35" fill="#FFD700"/>
  <text x="45" y="65" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="bold" fill="#111">143-144</text>
</svg>`
        },
        {
          id: 'kv_64f', number: '64F',
          name: 'Elektrická výhybka – zajištěná',
          description: '',
          svg: `<svg viewBox="0 0 90 78" xmlns="http://www.w3.org/2000/svg">
  <!-- horní část: černý obdélník, 3 čtverce -->
  <rect x="1" y="1" width="88" height="38" fill="#111"/>
  <!-- levý bílý čtverec -->
  <rect x="2" y="2" width="27" height="36" fill="white"/>
  <!-- pravý bílý čtverec -->
  <rect x="61" y="2" width="27" height="36" fill="white"/>
  <!-- levá plná šipka doleva -->
  <polygon points="5,20 16,12 16,16 28,16 28,24 16,24 16,28" fill="#111"/>
  <!-- pravá plná šipka doprava -->
  <polygon points="85,20 74,12 74,16 62,16 62,24 74,24 74,28" fill="#111"/>
  <!-- dolní část: zelený obdélník -->
  <rect x="1" y="42" width="88" height="35" fill="#4caf50"/>
  <text x="45" y="66" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="#111">1004</text>
</svg>`
        },
        {
          id: 'kv_64g', number: '64G',
          name: 'Elektrická výhybka zajištěná – pojížděná po hrotu',
          description: '',
          svg: `<svg viewBox="0 0 90 78" xmlns="http://www.w3.org/2000/svg">
  <!-- horní část: černý obdélník, 3 bílé prázdné čtverce -->
  <rect x="1" y="1" width="88" height="38" fill="#111"/>
  <rect x="2" y="2" width="27" height="36" fill="white"/>
  <rect x="31" y="2" width="28" height="36" fill="white"/>
  <rect x="61" y="2" width="27" height="36" fill="white"/>
  <!-- dolní část: zelený obdélník -->
  <rect x="1" y="42" width="88" height="35" fill="#4caf50"/>
  <text x="45" y="66" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="#111">1004</text>
</svg>`
        },
        {
          id: 'kv_64h', number: '64H',
          name: 'Elektrická výhybka zajištěná – pojížděná po hrotu i proti hrotu',
          description: '',
          svg: `<svg viewBox="0 0 90 78" xmlns="http://www.w3.org/2000/svg">
  <!-- horní část: černý obdélník, 3 čtverce -->
  <rect x="1" y="1" width="88" height="38" fill="#111"/>
  <!-- levý bílý čtverec -->
  <rect x="2" y="2" width="27" height="36" fill="white"/>
  <!-- pravý bílý čtverec -->
  <rect x="61" y="2" width="27" height="36" fill="white"/>
  <!-- levá plná šipka doleva -->
  <polygon points="5,20 16,12 16,16 28,16 28,24 16,24 16,28" fill="#111"/>
  <!-- pravá plná šipka doprava -->
  <polygon points="85,20 74,12 74,16 62,16 62,24 74,24 74,28" fill="#111"/>
  <!-- dolní část: tmavě zelený obdélník -->
  <rect x="1" y="42" width="88" height="35" fill="#1b5e20"/>
  <text x="45" y="66" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="#111">1004</text>
</svg>`
        },
        {
          id: 'kv_65', number: '65',
          name: 'Přejezd zabezpečený světelným signalizačním zařízením',
          description: '',
          svg: `<svg viewBox="0 0 80 124" xmlns="http://www.w3.org/2000/svg">
  <!-- horní šedý čtverec -->
  <rect x="1" y="2" width="78" height="60" fill="#999" rx="8"/>
  <!-- dvě úzké světle zelené svislé čáry vpravo -->
  <line x1="56" y1="8" x2="56" y2="56" stroke="#81c784" stroke-width="3" stroke-linecap="round"/>
  <line x1="63" y1="8" x2="63" y2="56" stroke="#81c784" stroke-width="3" stroke-linecap="round"/>
  <!-- dolní doplňková tabulka (jako 19b) -->
  <rect x="1" y="68" width="78" height="54" fill="white" stroke="#111" stroke-width="2.5"/>
  <!-- dvě svislé čáry -->
  <line x1="30" y1="76" x2="30" y2="110" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <line x1="50" y1="76" x2="50" y2="110" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <!-- zahnuté odbočky nahoru a doprava -->
  <path d="M 30,105 Q 30,86 52,76" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>
  <path d="M 50,105 Q 50,90 71,82" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'kv_66', number: '66',
          name: 'Světelný rychlostní předvěstník',
          description: 'Šedý obdélník se dvěma úzkými žlutými rovnoběžkami tvořícími zalomenou dráhu (dolů→doprava→dolů). Pod ním žlutý trojúhelník s bílým rámem a černým písmenem P.',
          svg: `<svg viewBox="0 0 80 118" xmlns="http://www.w3.org/2000/svg">
  <!-- šedý obdélník -->
  <rect x="1" y="1" width="78" height="56" fill="#999" rx="8"/>
  <!-- dvě žluté úzké rovnoběžky – zalomená dráha: dolů → doprava → dolů -->
  <polyline points="37,5 37,28 68,28 68,53" fill="none" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="43,5 43,34 74,34 74,53" fill="none" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- žlutý trojúhelník s bílým rámem -->
  <polygon points="40,62 5,116 75,116" fill="#FFD700" stroke="white" stroke-width="4" stroke-linejoin="round"/>
  <!-- černé P uprostřed trojúhelníku -->
  <text x="40" y="103" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="bold" fill="#111">P</text>
</svg>`
        },
        {
          id: 'kv_67', number: '67',
          name: 'Světelný rychlostník',
          description: '',
          svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
  <!-- šedý obdélník -->
  <rect x="1" y="2" width="78" height="56" fill="#999" rx="8"/>
  <!-- levá polovina: zalomená dráha ↓→↓ (jako v 66) -->
  <polyline points="13,6 13,28 33,28 33,54" fill="none" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="19,6 19,34 39,34 39,54" fill="none" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- pravá polovina: digitální "0" -->
  <!-- horní dvě krátké čáry -->
  <line x1="46" y1="8" x2="74" y2="8" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="46" y1="13" x2="74" y2="13" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
  <!-- dolní dvě krátké čáry -->
  <line x1="46" y1="47" x2="74" y2="47" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="46" y1="52" x2="74" y2="52" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
  <!-- levá dlouhá čára -->
  <line x1="46" y1="8" x2="46" y2="52" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="51" y1="8" x2="51" y2="52" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
  <!-- pravá dlouhá čára -->
  <line x1="69" y1="8" x2="69" y2="52" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="74" y1="8" x2="74" y2="52" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'kv_68', number: '68',
          name: 'Rychlostník',
          description: 'Bílý obdélník s černým ohraničením. Uvnitř dva šedé čtverce oddělené bílou mezerou. Vlevo žluté číslo 15, vpravo 30.',
          svg: `<svg viewBox="0 0 94 56" xmlns="http://www.w3.org/2000/svg">
  <!-- bílý vnější obdélník -->
  <rect x="1" y="1" width="92" height="54" fill="white" stroke="#111" stroke-width="3"/>
  <!-- levý černý čtverec -->
  <rect x="4" y="4" width="40" height="48" fill="#111"/>
  <!-- pravý černý čtverec -->
  <rect x="50" y="4" width="40" height="48" fill="#111"/>
  <!-- žlutá čísla -->
  <text x="24" y="36" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="#FFD700">15</text>
  <text x="70" y="36" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="#FFD700">30</text>
</svg>`
        },
        {
          id: 'kv_69', number: '69',
          name: 'Stůj – zákaz jízdy na výhybku',
          description: 'Šedý obdélník se zaoblenými rohy. Uprostřed červený trojúhelník směřující dolů.',
          svg: `<svg viewBox="0 0 80 56" xmlns="http://www.w3.org/2000/svg">
  <!-- šedý obdélník -->
  <rect x="1" y="1" width="78" height="54" fill="#999" rx="8"/>
  <!-- červený trojúhelník špičkou dolů -->
  <polygon points="40,46 16,12 64,12" fill="#cc0000"/>
</svg>`
        },
        {
          id: 'kv_70', number: '70',
          name: 'Základní postavení výhybky',
          description: 'Tři černé čtverce vedle sebe. Vlevo bílá pomlčka z levého horního na pravý dolní roh, uprostřed bílá svislá pomlčka, vpravo bílá pomlčka z levého dolního na pravý horní roh.',
          svg: `<svg viewBox="0 0 100 34" xmlns="http://www.w3.org/2000/svg">
  <!-- levý černý čtverec + pomlčka \  -->
  <rect x="1" y="1" width="30" height="32" fill="#111"/>
  <line x1="7" y1="6" x2="25" y2="27" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <!-- střední černý čtverec + svislá pomlčka | -->
  <rect x="35" y="1" width="30" height="32" fill="#111"/>
  <line x1="50" y1="6" x2="50" y2="27" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <!-- pravý černý čtverec + pomlčka / -->
  <rect x="69" y="1" width="30" height="32" fill="#111"/>
  <line x1="75" y1="27" x2="93" y2="6" stroke="white" stroke-width="4" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'kv_71', number: '71',
          name: 'Přibližovací místo',
          description: 'Nahoře: černý obdélník, krajní čtverce prázdné bílé, střed bílý s šipkou nahoru. Dole: černý obdélník se žlutým symbolem \\|/ (sloučení kolejí).',
          svg: `<svg viewBox="0 0 90 78" xmlns="http://www.w3.org/2000/svg">
  <!-- horní část: černý obdélník -->
  <rect x="1" y="1" width="88" height="38" fill="#111"/>
  <!-- levý bílý čtverec (prázdný) -->
  <rect x="2" y="2" width="27" height="36" fill="white"/>
  <!-- střední bílý čtverec s šipkou nahoru -->
  <rect x="31" y="2" width="28" height="36" fill="white"/>
  <polygon points="45,4 53,14 49,14 49,36 41,36 41,14 37,14" fill="#111"/>
  <!-- pravý bílý čtverec (prázdný) -->
  <rect x="61" y="2" width="27" height="36" fill="white"/>
  <!-- dolní část: černý obdélník -->
  <rect x="1" y="42" width="88" height="35" fill="#111"/>
  <!-- žlutý symbol \|/ -->
  <line x1="22" y1="47" x2="38" y2="71" stroke="#FFD700" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="45" y1="47" x2="45" y2="71" stroke="#FFD700" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="52" y1="71" x2="68" y2="47" stroke="#FFD700" stroke-width="3.5" stroke-linecap="round"/>
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
          description: 'Bílý obdélník na výšku s černým ohraničením. Uprostřed velká černá ilustrace auta zepředu.',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="54" height="78" fill="white" stroke="#111" stroke-width="1"/>
  <!-- silueta auta zmenšená, vycentrovaná -->
  <path d="M 21,18 Q 16,18 15,23 L 12,31 L 11,38 L 11,47 L 12,54 L 13,60 L 43,60 L 44,54 L 45,47 L 45,38 L 44,31 L 41,23 Q 40,18 35,18 Z" fill="#111"/>
  <!-- čelní sklo -->
  <path d="M 16,25 Q 13,33 13,41 L 43,41 Q 43,33 40,25 Z" fill="white"/>
  <!-- levý světlomet -->
  <path d="M 11,46 L 13,44 L 21,45 L 19,51 L 13,52 L 11,50 Z" fill="white"/>
  <!-- pravý světlomet -->
  <path d="M 45,46 L 43,44 L 35,45 L 37,51 L 43,52 L 45,50 Z" fill="white"/>
  <!-- zpětná zrcátka -->
  <rect x="10" y="34" width="4" height="5" fill="#111" rx="1"/>
  <rect x="42" y="34" width="4" height="5" fill="#111" rx="1"/>
  <!-- kola -->
  <circle cx="19" cy="62" r="4" fill="#111"/>
  <circle cx="37" cy="62" r="4" fill="#111"/>
</svg>`
        },
        {
          id: 'in_82', number: '82',
          name: 'Konec pozemní komunikace',
          description: 'Stejné jako 81 ale ilustrace auta je šedá a přes znak vede černá čára od levého dolního k pravému hornímu rohu.',
          svg: `<svg viewBox="0 0 56 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="54" height="78" fill="white" stroke="#111" stroke-width="1"/>
  <!-- šedá silueta auta (stejná jako 81, jen šedá) -->
  <path d="M 21,18 Q 16,18 15,23 L 12,31 L 11,38 L 11,47 L 12,54 L 13,60 L 43,60 L 44,54 L 45,47 L 45,38 L 44,31 L 41,23 Q 40,18 35,18 Z" fill="#999"/>
  <!-- čelní sklo -->
  <path d="M 16,25 Q 13,33 13,41 L 43,41 Q 43,33 40,25 Z" fill="white"/>
  <!-- levý světlomet -->
  <path d="M 11,46 L 13,44 L 21,45 L 19,51 L 13,52 L 11,50 Z" fill="white"/>
  <!-- pravý světlomet -->
  <path d="M 45,46 L 43,44 L 35,45 L 37,51 L 43,52 L 45,50 Z" fill="white"/>
  <!-- zpětná zrcátka -->
  <rect x="10" y="34" width="4" height="5" fill="#999" rx="1"/>
  <rect x="42" y="34" width="4" height="5" fill="#999" rx="1"/>
  <!-- kola -->
  <circle cx="19" cy="62" r="4" fill="#999"/>
  <circle cx="37" cy="62" r="4" fill="#999"/>
  <!-- černá čára od levého dolního k pravému hornímu rohu -->
  <line x1="3" y1="77" x2="53" y2="3" stroke="#111" stroke-width="3" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'in_83', number: '83',
          name: 'Přejezd nezabezpečený',
          description: 'Tramvajový přejezd přes komunikaci bez světelného zabezpečení. Řidič si zajišťuje volnou cestu sám.',
          svg: `<svg viewBox="0 0 14 98" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="12" height="96" fill="white" stroke="#111" stroke-width="1.5"/>
  <rect x="1" y="1" width="12" height="24" fill="#cc0000"/>
  <rect x="1" y="49" width="12" height="24" fill="#cc0000"/>
  <line x1="1" y1="25" x2="13" y2="25" stroke="#111" stroke-width="1"/>
  <line x1="1" y1="49" x2="13" y2="49" stroke="#111" stroke-width="1"/>
  <line x1="1" y1="73" x2="13" y2="73" stroke="#111" stroke-width="1"/>
  <rect x="1" y="1" width="12" height="96" fill="none" stroke="#111" stroke-width="1.5"/>
</svg>`
        },
        {
          id: 'in_84', number: '84',
          name: 'Přejezd s předností v jízdě tramvaje',
          description: '',
          svg: `<svg viewBox="0 0 44 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="42" height="58" fill="#111"/>
  <rect x="2.5" y="2.5" width="39" height="55" fill="white"/>
  <rect x="6" y="6" width="32" height="48" fill="#1a8a3a"/>
</svg>`
        },
        {
          id: 'in_85', number: '85',
          name: 'Přejezd zabezpečený světelnou signalizací',
          description: 'Tramvajový přejezd je vybaven světelnou signalizací pro ostatní vozidla. Tramvaj má automatickou ochranu.',
          svg: `<svg viewBox="0 0 70 132" xmlns="http://www.w3.org/2000/svg">
  <polygon points="35,2 1,62 69,62" fill="white" stroke="#cc0000" stroke-width="6"/>
  <circle cx="35" cy="22" r="5" fill="#cc0000" stroke="white" stroke-width="1.5"/>
  <circle cx="35" cy="36" r="5" fill="#FFD700" stroke="white" stroke-width="1.5"/>
  <circle cx="35" cy="50" r="5" fill="#00cc44" stroke="white" stroke-width="1.5"/>
  <rect x="29" y="62" width="12" height="17" fill="#cc0000"/>
  <rect x="29" y="96" width="12" height="17" fill="#cc0000"/>
  <line x1="29" y1="79" x2="41" y2="79" stroke="#111" stroke-width="1"/>
  <line x1="29" y1="96" x2="41" y2="96" stroke="#111" stroke-width="1"/>
  <line x1="29" y1="113" x2="41" y2="113" stroke="#111" stroke-width="1"/>
  <rect x="29" y="62" width="12" height="68" fill="none" stroke="#111" stroke-width="1.5"/>
</svg>`
        },
        {
          id: 'in_86', number: '86',
          name: 'Rychlostní předvěstník',
          description: '',
          svg: `<svg viewBox="0 0 80 74" xmlns="http://www.w3.org/2000/svg">
  <polygon points="40,3 3,71 77,71" fill="#FFD700" stroke="white" stroke-width="6" stroke-linejoin="round"/>
  <text x="40" y="60" text-anchor="middle" font-family="Arial,sans-serif" font-size="38" font-weight="bold" fill="#111">2</text>
</svg>`
        },
        {
          id: 'in_87', number: '87',
          name: 'Očekávej stůj',
          description: '',
          svg: `<svg viewBox="0 0 42 110" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="40" height="36" fill="#aaa" rx="5"/>
  <circle cx="9" cy="14" r="4" fill="white"/>
  <circle cx="21" cy="14" r="4" fill="none" stroke="#111" stroke-width="1"/>
  <circle cx="33" cy="14" r="4" fill="white"/>
  <circle cx="21" cy="26" r="4" fill="none" stroke="#111" stroke-width="1"/>
  <rect x="1" y="39" width="40" height="70" fill="#FFD700" rx="3"/>
  <rect x="5" y="43" width="32" height="62" fill="none" stroke="white" stroke-width="4"/>
  <text x="21" y="85" text-anchor="middle" font-family="Arial,sans-serif" font-size="36" font-weight="bold" fill="#111">P</text>
</svg>`
        },
        {
          id: 'in_88', number: '88',
          name: 'Očekávej volno',
          description: '',
          svg: `<svg viewBox="0 0 42 110" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="40" height="36" fill="#aaa" rx="5"/>
  <circle cx="9" cy="14" r="4" fill="none" stroke="#111" stroke-width="1"/>
  <circle cx="21" cy="14" r="4" fill="white"/>
  <circle cx="33" cy="14" r="4" fill="none" stroke="#111" stroke-width="1"/>
  <circle cx="21" cy="26" r="4" fill="white"/>
  <rect x="1" y="39" width="40" height="70" fill="#FFD700" rx="3"/>
  <rect x="5" y="43" width="32" height="62" fill="none" stroke="white" stroke-width="4"/>
  <text x="21" y="85" text-anchor="middle" font-family="Arial,sans-serif" font-size="36" font-weight="bold" fill="#111">P</text>
</svg>`
        },
        {
          id: 'in_89', number: '89',
          name: 'Výzvové návěstidlo',
          description: 'Zařízení vydávající světelnou výzvu řidiči. Řidič musí reagovat na zobrazený signál.',
          svg: `<svg viewBox="0 0 72 42" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="70" height="40" fill="#111" rx="2"/>
  <circle cx="36" cy="5"  r="2" fill="#FFD700"/>
  <circle cx="36" cy="12" r="2" fill="#FFD700"/>
  <circle cx="36" cy="19" r="2" fill="#FFD700"/>
  <circle cx="36" cy="26" r="2" fill="#FFD700"/>
  <circle cx="36" cy="33" r="2" fill="#FFD700"/>
  <circle cx="31" cy="33" r="2" fill="#bbb"/>
  <circle cx="26" cy="28" r="2" fill="#bbb"/>
  <circle cx="21" cy="23" r="2" fill="#bbb"/>
  <circle cx="16" cy="18" r="2" fill="#bbb"/>
  <circle cx="41" cy="33" r="2" fill="#bbb"/>
  <circle cx="46" cy="28" r="2" fill="#bbb"/>
  <circle cx="51" cy="23" r="2" fill="#bbb"/>
  <circle cx="56" cy="18" r="2" fill="#bbb"/>
</svg>`
        },
        {
          id: 'in_89b', number: '89b',
          name: 'Výzvové návěstidlo',
          description: '',
          svg: `<svg viewBox="0 0 72 42" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="70" height="40" fill="#111" rx="2"/>
  <circle cx="36" cy="5"  r="2" fill="#FFD700"/>
  <circle cx="36" cy="12" r="2" fill="#FFD700"/>
  <circle cx="36" cy="19" r="2" fill="#FFD700"/>
  <circle cx="36" cy="26" r="2" fill="#FFD700"/>
  <circle cx="36" cy="33" r="2" fill="#FFD700"/>
  <circle cx="31" cy="33" r="2" fill="#bbb"/>
  <circle cx="26" cy="28" r="2" fill="#bbb"/>
  <circle cx="21" cy="23" r="2" fill="#bbb"/>
  <circle cx="16" cy="18" r="2" fill="#bbb"/>
  <circle cx="41" cy="33" r="2" fill="#FFD700"/>
  <circle cx="46" cy="28" r="2" fill="#FFD700"/>
  <circle cx="51" cy="23" r="2" fill="#FFD700"/>
  <circle cx="56" cy="18" r="2" fill="#FFD700"/>
</svg>`
        },
        {
          id: 'in_90', number: '90',
          name: 'Neplatnost návěstidla',
          description: '',
          svg: `<svg viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="68" height="68" fill="white" stroke="#111" stroke-width="1.5"/>
  <line x1="16" y1="16" x2="54" y2="54" stroke="#111" stroke-width="9" stroke-linecap="round"/>
  <line x1="54" y1="16" x2="16" y2="54" stroke="#111" stroke-width="9" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'in_91', number: '91',
          name: 'Snímač blokovací',
          description: '',
          svg: `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="34" height="34" fill="white" stroke="#111" stroke-width="0.8"/>
  <circle cx="18" cy="18" r="10" fill="#FFD700"/>
</svg>`
        },
        {
          id: 'in_92', number: '92',
          name: 'Snímač odblokovací',
          description: '',
          svg: `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="34" height="34" fill="white" stroke="#111" stroke-width="0.8"/>
  <circle cx="18" cy="18" r="10" fill="#ccc"/>
</svg>`
        },
        {
          id: 'in_93', number: '93',
          name: 'Zastavení',
          description: 'Označuje místo povinného zastavení tramvaje (například na konci přijížděcí koleje nebo ve smyčce).',
          svg: `<svg viewBox="0 0 50 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="3" width="44" height="74" fill="white" stroke="#111" stroke-width="6"/>
</svg>`
        },
        {
          id: 'in_94', number: '94',
          name: 'Začátek zóny',
          description: 'Označuje začátek regulované zóny (časového omezení provozu nebo zvláštního režimu).',
          svg: `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="88" height="58" fill="white" stroke="#111" stroke-width="1.5"/>
  <text x="45" y="26" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="20" font-weight="900" fill="#111">ZÓNA</text>
  <text x="45" y="50" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="20" font-weight="900" fill="#111">22-6</text>
</svg>`
        },
        {
          id: 'in_95', number: '95',
          name: 'Konec zóny',
          description: 'Označuje konec regulované zóny. Za tímto místem opět platí standardní provozní podmínky.',
          svg: `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="88" height="58" fill="white" stroke="#111" stroke-width="1.5"/>
  <text x="45" y="26" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="20" font-weight="900" fill="#bbb">ZÓNA</text>
  <text x="45" y="50" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-size="20" font-weight="900" fill="#bbb">22-6</text>
  <line x1="1" y1="59" x2="89" y2="1" stroke="#111" stroke-width="5" stroke-linecap="round"/>
</svg>`
        },
        {
          id: 'in_96', number: '96',
          name: 'Námezník',
          description: 'Označuje konec úseku, za kterým se tramvaj může bezpečně pohybovat bez rizika kolize se sousední kolejí.',
          svg: `<svg viewBox="0 0 108 34" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="3" width="102" height="28" fill="none" stroke="#bbb" stroke-width="5"/>
  <rect x="6" y="6" width="96" height="22" fill="white" stroke="#111" stroke-width="1.5"/>
</svg>`
        },
        {
          id: 'in_97', number: '97',
          name: 'Zúžený průjezdný průřez',
          description: '',
          svg: `<img src="Značky2/fotky/97.png" style="max-width:100%;max-height:100%;object-fit:contain;">`
        },
        {
          id: 'in_98a', number: '98a',
          name: 'Bezbariérová zastávka',
          description: '',
          svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="58" fill="#1565C0" rx="6"/>
  <polygon points="4,56 56,56 56,42" fill="white"/>
  <g transform="translate(22,18) scale(1.3)">
    <circle cx="9" cy="4" r="2" fill="white"/>
    <path fill="white" d="M16.98 14.804A1 1 0 0 0 16 14h-4.133l-.429-3H16V9h-4.847l-.163-1.142A1 1 0 0 0 10 7H9a1.003 1.003 0 0 0-.99 1.142l.877 6.142A2.009 2.009 0 0 0 10.867 16h4.313l.839 4.196c.094.467.504.804.981.804h3v-2h-2.181l-.839-4.196z"/>
    <path fill="white" d="M12.51 17.5c-.739 1.476-2.25 2.5-4.01 2.5A4.505 4.505 0 0 1 4 15.5a4.503 4.503 0 0 1 2.817-4.167l-.289-2.025C3.905 10.145 2 12.604 2 15.5C2 19.084 4.916 22 8.5 22a6.497 6.497 0 0 0 5.545-3.126l-.274-1.374H12.51z"/>
  </g>
</svg>`
        },
        {
          id: 'in_98b', number: '98b',
          name: 'Bezbariérová zastávka – Přístup do tramvaje s použitím plošiny a s průvodcem',
          description: '',
          svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="58" fill="#1565C0" rx="6"/>
  <polygon points="4,56 56,56 56,42" fill="white"/>
  <!-- stojící osoba tlačící vozík (vlevo) -->
  <circle cx="20" cy="22" r="3" fill="white"/>
  <line x1="20" y1="25" x2="20" y2="38" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="29" x2="27" y2="31" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="29" x2="16" y2="33" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="38" x2="17" y2="48" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="38" x2="23" y2="48" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <!-- vozíčkář (vpravo) -->
  <g transform="translate(24,20) scale(1.1)">
    <circle cx="9" cy="4" r="2" fill="white"/>
    <path fill="white" d="M16.98 14.804A1 1 0 0 0 16 14h-4.133l-.429-3H16V9h-4.847l-.163-1.142A1 1 0 0 0 10 7H9a1.003 1.003 0 0 0-.99 1.142l.877 6.142A2.009 2.009 0 0 0 10.867 16h4.313l.839 4.196c.094.467.504.804.981.804h3v-2h-2.181l-.839-4.196z"/>
    <path fill="white" d="M12.51 17.5c-.739 1.476-2.25 2.5-4.01 2.5A4.505 4.505 0 0 1 4 15.5a4.503 4.503 0 0 1 2.817-4.167l-.289-2.025C3.905 10.145 2 12.604 2 15.5C2 19.084 4.916 22 8.5 22a6.497 6.497 0 0 0 5.545-3.126l-.274-1.374H12.51z"/>
  </g>
</svg>`
        },
        {
          id: 'in_98c', number: '98c',
          name: 'Bezbariérová zastávka – Přístup do tramvaje bez použití plošiny a s průvodcem',
          description: '',
          svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="58" height="58" fill="#1565C0" rx="6"/>
  <!-- stojící osoba tlačící vozík (vlevo) -->
  <circle cx="20" cy="22" r="3" fill="white"/>
  <line x1="20" y1="25" x2="20" y2="38" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="29" x2="27" y2="31" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="29" x2="16" y2="33" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="38" x2="17" y2="48" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="38" x2="23" y2="48" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <!-- vozíčkář (vpravo) -->
  <g transform="translate(24,20) scale(1.1)">
    <circle cx="9" cy="4" r="2" fill="white"/>
    <path fill="white" d="M16.98 14.804A1 1 0 0 0 16 14h-4.133l-.429-3H16V9h-4.847l-.163-1.142A1 1 0 0 0 10 7H9a1.003 1.003 0 0 0-.99 1.142l.877 6.142A2.009 2.009 0 0 0 10.867 16h4.313l.839 4.196c.094.467.504.804.981.804h3v-2h-2.181l-.839-4.196z"/>
    <path fill="white" d="M12.51 17.5c-.739 1.476-2.25 2.5-4.01 2.5A4.505 4.505 0 0 1 4 15.5a4.503 4.503 0 0 1 2.817-4.167l-.289-2.025C3.905 10.145 2 12.604 2 15.5C2 19.084 4.916 22 8.5 22a6.497 6.497 0 0 0 5.545-3.126l-.274-1.374H12.51z"/>
  </g>
</svg>`
        },
        {
          id: 'in_99', number: '99',
          name: 'Tunelový úsek tratě',
          description: 'Označuje začátek nebo konec tunelového úseku tramvajové trati. Platí zvláštní provozní předpisy.',
          svg: `<svg viewBox="0 0 80 72" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="78" height="70" fill="white" rx="2" stroke="#111" stroke-width="1.5"/>
  <!-- Pětiúhelníkový portál -->
  <polygon points="6,68 74,68 74,28 40,10 6,28" fill="white" stroke="#111" stroke-width="2"/>
  <!-- Tmavý oblouk – vjezd do tunelu -->
  <path d="M 19,68 L 19,44 A 21,21 0 0 1 61,44 L 61,68 Z" fill="#1a1a1a"/>
  <!-- Radiální spáry klenby (voussoirs) -->
  <line x1="40" y1="23" x2="40" y2="10" stroke="#111" stroke-width="1"/>
  <line x1="58" y1="34" x2="71" y2="26" stroke="#111" stroke-width="1"/>
  <line x1="51" y1="26" x2="55" y2="18" stroke="#111" stroke-width="1"/>
  <line x1="61" y1="44" x2="74" y2="44" stroke="#111" stroke-width="1"/>
  <line x1="22" y1="34" x2="9"  y2="26" stroke="#111" stroke-width="1"/>
  <line x1="29" y1="26" x2="25" y2="18" stroke="#111" stroke-width="1"/>
  <line x1="19" y1="44" x2="6"  y2="44" stroke="#111" stroke-width="1"/>
  <!-- Vodorovné spáry bočních zdí -->
  <line x1="6"  y1="52" x2="19" y2="52" stroke="#111" stroke-width="1"/>
  <line x1="6"  y1="60" x2="19" y2="60" stroke="#111" stroke-width="1"/>
  <line x1="61" y1="52" x2="74" y2="52" stroke="#111" stroke-width="1"/>
  <line x1="61" y1="60" x2="74" y2="60" stroke="#111" stroke-width="1"/>
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
