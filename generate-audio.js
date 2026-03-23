/**
 * generate-audio.js
 * Vygeneruje zvukové soubory pro všechny zastávky pomocí macOS příkazu `say`.
 * Použije hlas Zuzana (Enhanced) přímo ze systému – mnohem lepší než prohlížeč.
 *
 * Spuštění: node generate-audio.js
 * Požadavky: macOS s nainstalovaným hlasem Zuzana (nebo Enhanced)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ── Načti data ──────────────────────────────────────────────────────────────
let src = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');
src = src.replace(/const STOP_TO_LINES[\s\S]*$/, '');
eval(src.replace('const TRAM_DATA', 'var TRAM_DATA'));

// ── Pomocné funkce ──────────────────────────────────────────────────────────

/** Převede název zastávky na bezpečný název souboru (bez diakritiky). */
function toFilename(text) {
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // odstraň diakritiku
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_,.\-]/g, '')
    .substring(0, 80);
}

/** Přečte text pomocí `say` a uloží jako .m4a. */
function generate(text, filename, rate = 130) {
  const outPath = path.join(__dirname, 'audio', filename + '.m4a');
  if (fs.existsSync(outPath)) {
    process.stdout.write('.');
    return; // přeskoč existující
  }
  try {
    // Escapuj uvozovky v textu
    const escaped = text.replace(/"/g, '\\"');
    execSync(`say -v Zuzana -r ${rate} -o "${outPath}" "${escaped}"`, { stdio: 'inherit' });
    process.stdout.write('✓');
  } catch (e) {
    console.error(`\nChyba při generování: ${text}`, e.message);
  }
}

// ── Vytvoř složku audio ─────────────────────────────────────────────────────
const audioDir = path.join(__dirname, 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir);
  console.log('Vytvořena složka audio/');
}

// ── Sbírej unikátní zastávky ─────────────────────────────────────────────────
const allStops = new Set();
TRAM_DATA.lines.forEach(l => l.stops.forEach(s => allStops.add(s)));

console.log(`\nGeneruji audio pro ${allStops.size} zastávek + ${TRAM_DATA.lines.length} linek...\n`);

// ── Generuj zastávky ─────────────────────────────────────────────────────────
for (const stop of allStops) {
  generate(stop, toFilename(stop));
}

// ── Generuj úvodní oznámení linek ────────────────────────────────────────────
console.log('\n\nGeneruji oznámení linek...\n');
for (const line of TRAM_DATA.lines) {
  const first = line.stops[0];
  const last  = line.stops[line.stops.length - 1];
  const text  = `Linka číslo ${line.number}. Trasa z ${first} do ${last}.`;
  generate(text, `_linka_${line.number}`, 125);
}

// ── Exportuj mapu názvů → souborů pro app.js ────────────────────────────────
const mapping = {};
for (const stop of allStops) {
  mapping[stop] = toFilename(stop);
}
for (const line of TRAM_DATA.lines) {
  mapping[`_linka_${line.number}`] = `_linka_${line.number}`;
}
fs.writeFileSync(
  path.join(__dirname, 'audio-map.json'),
  JSON.stringify(mapping, null, 2),
  'utf8'
);

console.log('\n\nHotovo! Soubory jsou v audio/');
console.log('Mapa názvů uložena do audio-map.json');
console.log('\nDalší krok: git add audio/ audio-map.json && git push');
