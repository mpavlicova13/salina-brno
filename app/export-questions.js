/**
 * export-questions.js
 * Vygeneruje VŠECHNY možné otázky z aplikace a uloží do CSV.
 * Spustit: node export-questions.js
 */

const fs = require('fs');

// ============================================================
// DATA (kopie z data.js)
// ============================================================
const TRAM_LINES = [
  { id: 1, from: 'Bystrc, Rakovecká', to: 'Řečkovice',
    stops: ['Řečkovice','Filkukova','Kořískova','Hudcova','Vozovna Medlánky','Tylova','Semilasso (Palackého z centra)','Husitská (Palackého)','Jungmannova','Kartouzská','Šumavská','Hrnčířská','Pionýrská','Antonínská','Moravské náměstí (Královo Pole)','Malinovského náměstí (Rooseveltova)','Hlavní nádraží (kolej 1)','Nové sady (kolej 1)','Hybešova','Václavská','Mendlovo náměstí (tram Pisárky)','Výstaviště hlavní vstup','Výstaviště vstup G2','Arena Brno (vozovna Pisárky)','Pisárky (tunel)','Bráfova','Stránského','Vozovna Komín','Svratecká (Kníničská)','Branka','Podlesí','Kamenolom','Zoologická zahrada (Obvodová)','Přístaviště','Bystrc Rakovecká'] },
  { id: 2, from: 'Ústřední hřbitov / Modřice', to: 'Židenice, Stará osada',
    stops: ['Židenice Stará osada','Kuldova','Vojenská nemocnice','Tkalcovská','Körnerova','Malinovského náměstí (divadlo)','Hlavní nádraží (kolej 1)','Nové sady (kolej 1)','Hybešova','Václavská','Mendlovo náměstí (tram Česká)','Poříčí','Nemocnice Milosrdných bratří','Celní','Hluboká','Ústřední hřbitov (Vídeňská)','Ústřední hřbitov smyčka','Bohunická','Ořechovská','Moravanské lány','Moravanská','Modřická cihelna','Modřice Tyršova','Modřice smyčka'] },
  { id: 3, from: 'Bystrc, Ečerova', to: 'Židenice, Stará osada',
    stops: ['Židenice Stará osada','Kuldova','Vojenská nemocnice','Jugoslávská (Cejl)','Dětská nemocnice','Náměstí 28. října','Moravské náměstí (Černá Pole)','Česká (Česká)','Grohova','Konečného náměstí','Rybkova','Tábor (Veveří)','Králova','Burianovo náměstí','Mozolky','Rosického náměstí','Sochorova','Vozovna Komín','Svratecká (Kníničská)','Branka','Podlesí','Kamenolom','Zoologická zahrada (Obvodová)','Přístaviště','Kubíčkova','Ondrouškova','Bystrc Ečerova'] },
  { id: 4, from: 'Masarykova čtvrť, Náměstí Míru', to: 'Obřany, Babická',
    stops: ['Obřany Babická','Obřanský most (Obřanská)','Čtvery hony','Obřanská u školy','Proškovo náměstí','Maloměřický most (u mostu)','Tomkovo náměstí (pod mostem)','Náměstí Republiky','Vozovna Husovice','Mostecká','Trávníčkova','Tkalcovská','Körnerova','Malinovského náměstí (divadlo)','Hlavní nádraží (kolej 1)','Zelný trh','Náměstí Svobody','Česká (Joštova)','Komenského náměstí','Obilní trh','Úvoz (Údolní)','Všetičkova','Masarykova čtvrť Náměstí Míru'] },
  { id: 5, from: 'Mendlovo náměstí / Ústřední hřbitov', to: 'Štefánikova čtvrť',
    stops: ['Štefánikova čtvrť (smyčka)','Venhudova','Zdráhalova','Jugoslávská (Štefánikova čtvrť)','Dětská nemocnice','Náměstí 28. října','Moravské náměstí (Černá Pole)','Česká (Joštova)','Šilingrovo náměstí (Pekařská)','Nemocnice u svaté Anny','Mendlovo náměstí (tram Česká)','Poříčí','Nemocnice Milosrdných bratří','Celní','Hluboká','Ústřední hřbitov (Vídeňská)','Ústřední hřbitov smyčka'] },
  { id: 6, from: 'Starý Lískovec', to: 'Královo Pole, nádraží',
    stops: ['Královo Pole nádraží','Semilasso (Kosmova do centra)','Husitská (Palackého)','Jungmannova','Kartouzská','Šumavská','Hrnčířská','Pionýrská','Antonínská','Moravské náměstí (Královo Pole)','Česká (Joštova)','Šilingrovo náměstí (Pekařská)','Nemocnice u svaté Anny','Mendlovo náměstí (tram Česká)','Poříčí','Nemocnice Milosrdných bratří','Celní','Krematorium','Běloruská','Švermova','Osová','Karpatská','Dunajská','Starý Lískovec'] },
  { id: 7, from: 'Starý Lískovec', to: 'Černá Pole, Zemědělská / Lesná, Čertova rokle',
    stops: ['Lesná Čertova rokle','Halasovo náměstí','Fügnerova','Bieblova','Lesnická','Černá Pole Zemědělská (Lesnická)','Tomanova','Jugoslávská (Lesná)','Jugoslávská (Cejl)','Tkalcovská','Körnerova','Malinovského náměstí (divadlo)','Hlavní nádraží (kolej 1)','Nové sady (kolej 3)','Soukenická','Křídlovická','Vojtova','Vsetínská','Krematorium','Běloruská','Švermova','Osová','Karpatská','Dunajská','Starý Lískovec'] },
  { id: 8, from: 'Nemocnice Bohunice', to: 'Líšeň, Mifkova',
    stops: ['Líšeň Mifkova','Jírova (tunel)','Kotlanova','Masarova','Novolíšeňská','Líšeňská','Bílá hora','Bělohorská','Krásného','Židovský hřbitov','Geislerova','Životského','Masná (Křenová)','Vlhká','Hlavní nádraží (kolej 3)','Nové sady (kolej 3)','Soukenická','Křídlovická','Vojtova','Vsetínská','Krematorium','Běloruská','Švermova','Osová','Západní brána (tunel)','Nemocnice Bohunice (terminál tramvaj)'] },
  { id: 9, from: 'Juliánov', to: 'Lesná, Čertova rokle',
    stops: ['Lesná Čertova rokle','Halasovo náměstí','Fügnerova','Bieblova','Lesnická','Zemědělská (Lesnická)','Tomanova','Jugoslávská (Lesná)','Dětská nemocnice','Náměstí 28. října','Moravské náměstí (Černá Pole)','Česká (před kostelem)','Náměstí Svobody','Zelný trh','Hlavní nádraží (kolej 2)','Vlhká','Masná (Křenová)','Životského','Geislerova','Buzkova','Otakara Ševčíka (Táborská)','Dělnický dům','Židenice Juliánov'] },
  { id: 10, from: 'Vozovna Komín / Bystrc, Rakovecká', to: 'Stránská skála / Novolíšeňská',
    stops: ['Stránská skála smyčka','Stránská skála','Podstránská','Novolíšeňská','Líšeňská','Bílá hora','Bělohorská','Krásného','Židovský hřbitov','Geislerova','Životského','Masná (Křenová)','Vlhká','Hlavní nádraží (spojka u Grandu)','Malinovského náměstí (Rooseveltova)','Česká (Česká)','Grohova','Konečného náměstí','Rybkova','Tábor (Veveří)','Králova','Burianovo náměstí','Mozolky','Rosického náměstí','Sochorova','Vozovna Komín','Svratecká (Kníničská)','Branka','Podlesí','Kamenolom','Zoologická zahrada (Obvodová)','Přístaviště','Bystrc Rakovecká'] },
  { id: 12, from: 'Technologický park', to: 'Komárov',
    stops: ['Komárov','Konopná','Železniční','Autobusové nádraží (Plotní)','Úzká (Dornych)','Hlavní nádraží (kolej 3)','Nové sady (kolej 1)','Šilingrovo náměstí (Husova)','Česká (Česká)','Grohova','Konečného náměstí','Nerudova','Klusáčkova','Tererova','Dobrovského','Skácelova','Červinkova','Technické muzeum','Technologický park'] },
];

// Mapa zastávka → linky
const stopToLines = {};
TRAM_LINES.forEach(line => {
  line.stops.forEach(stop => {
    if (!stopToLines[stop]) stopToLines[stop] = [];
    if (!stopToLines[stop].includes(line.id)) stopToLines[stop].push(line.id);
  });
});

// ============================================================
// GENERÁTORY OTÁZEK
// ============================================================
const questions = [];

function addQ(sekce, typ, otazka, spravnaOdpoved, vysvetleni) {
  questions.push({ sekce, typ, otazka, spravnaOdpoved, vysvetleni });
}

// --- SEKCE A ---

// A1: Odkud kam jede linka X?
TRAM_LINES.forEach(line => {
  addQ('A', 'Odkud → Kam',
    `Odkud kam jede linka č. ${line.id}?`,
    `${line.stops[0]} ↔ ${line.stops[line.stops.length - 1]}`,
    `Linka ${line.id} jede z ${line.stops[0]} do ${line.stops[line.stops.length - 1]}.`
  );
});

// A2: Která linka jede z A do B?
TRAM_LINES.forEach(line => {
  addQ('A', 'Která linka jede z–do',
    `Která linka jede z "${line.stops[0]}" do "${line.stops[line.stops.length - 1]}"?`,
    `Linka ${line.id}`,
    `Z ${line.stops[0]} do ${line.stops[line.stops.length - 1]} jede linka ${line.id}.`
  );
});

// A3: Která linka začíná / končí v X?
TRAM_LINES.forEach(line => {
  addQ('A', 'Výchozí zastávka linky',
    `Která je VÝCHOZÍ (první) zastávka linky ${line.id}?`,
    line.stops[0],
    `Výchozí zastávka linky ${line.id} je ${line.stops[0]}.`
  );
  addQ('A', 'Konečná zastávka linky',
    `Která je KONEČNÁ (poslední) zastávka linky ${line.id}?`,
    line.stops[line.stops.length - 1],
    `Konečná zastávka linky ${line.id} je ${line.stops[line.stops.length - 1]}.`
  );
});

// A4: Pravda nebo lež
TRAM_LINES.forEach(line => {
  const first = line.stops[0];
  const last = line.stops[line.stops.length - 1];
  // pravdivá tvrzení – oba směry jsou správné (obousměrná linka)
  addQ('A', 'Pravda / Lež',
    `PRAVDA nebo LEŽ: „Linka ${line.id} jede z ${first} do ${last}."`,
    'PRAVDA',
    `Ano, linka ${line.id} jede mezi ${first} a ${last} (obousměrně).`
  );
  addQ('A', 'Pravda / Lež',
    `PRAVDA nebo LEŽ: „Linka ${line.id} jede z ${last} do ${first}."`,
    'PRAVDA',
    `Ano, linka ${line.id} jede obousměrně, tedy i z ${last} do ${first}.`
  );
  // lživé tvrzení – OBĚ konečné zastávky patří jiné lince
  const other = TRAM_LINES.find(l => l.id !== line.id);
  const otherLast = other.stops[other.stops.length - 1];
  addQ('A', 'Pravda / Lež',
    `PRAVDA nebo LEŽ: „Linka ${line.id} jede z ${other.stops[0]} do ${otherLast}."`,
    'LEŽ',
    `Ne, linka ${line.id} jede mezi ${first} a ${last}. Z ${other.stops[0]} do ${otherLast} jede linka ${other.id}.`
  );
});

// A5: Jaká linka spojuje tyto konečné zastávky?
TRAM_LINES.forEach(line => {
  addQ('A', 'Jaká linka spojuje tyto zastávky',
    `Jaká linka spojuje konečné zastávky: „${line.stops[0]}" a „${line.stops[line.stops.length - 1]}"?`,
    `Linka ${line.id}`,
    `Tyto dvě konečné zastávky spojuje linka ${line.id}.`
  );
});

// --- SEKCE B ---

TRAM_LINES.forEach(line => {
  const stops = line.stops;
  const last = stops[stops.length - 1];

  // B1: Která zastávka NÁSLEDUJE po X?
  for (let i = 0; i < stops.length - 1; i++) {
    addQ('B', 'Následující zastávka',
      `Linka ${line.id} – jaká zastávka NÁSLEDUJE po „${stops[i]}" (směr ${last})?`,
      stops[i + 1],
      `Po zastávce ${stops[i]} na lince ${line.id} (směr ${last}) následuje ${stops[i + 1]}.`
    );
  }

  // B2: Která zastávka PŘEDCHÁZÍ X?
  for (let i = 1; i < stops.length; i++) {
    addQ('B', 'Předchozí zastávka',
      `Linka ${line.id} – jaká zastávka PŘEDCHÁZÍ zastávce „${stops[i]}" (směr ${last})?`,
      stops[i - 1],
      `Před zastávkou ${stops[i]} na lince ${line.id} je ${stops[i - 1]}.`
    );
  }

  // B3: Doplň chybějící zastávku: A → ??? → C
  for (let i = 1; i < stops.length - 1; i++) {
    addQ('B', 'Doplň chybějící zastávku',
      `Linka ${line.id} – doplň chybějící zastávku: „${stops[i - 1]}" → ??? → „${stops[i + 1]}"`,
      stops[i],
      `Chybějící zastávka mezi ${stops[i - 1]} a ${stops[i + 1]} na lince ${line.id} je ${stops[i]}.`
    );
  }

  // B4: Je zastávka X na lince Y? – jen pro zastávky, které na lince JSOU
  stops.forEach(stop => {
    addQ('B', 'Je zastávka na lince? (ANO)',
      `Je zastávka „${stop}" na lince ${line.id}?`,
      'ANO',
      `Ano, zastávka ${stop} se nachází na lince ${line.id}.`
    );
  });

  // B5: Která zastávka NENÍ na lince X? – vybereme 1 zastávku z jiné linky
  const allOtherStops = TRAM_LINES
    .filter(l => l.id !== line.id)
    .flatMap(l => l.stops)
    .filter(s => !stops.includes(s));
  const uniqueOther = [...new Set(allOtherStops)];
  if (uniqueOther.length > 0) {
    // Pro každou cizí zastávku jedna otázka (omezíme na max 5 příkladů na linku)
    uniqueOther.slice(0, 5).forEach(fakeStop => {
      addQ('B', 'Která zastávka NENÍ na lince',
        `Linka ${line.id} – je zastávka „${fakeStop}" na této lince?`,
        'NE',
        `Zastávka ${fakeStop} se NENACHÁZÍ na lince ${line.id}.`
      );
    });
  }

  // B8: Kolikátá zastávka je X od začátku?
  stops.forEach((stop, i) => {
    addQ('B', 'Kolikátá zastávka',
      `Linka ${line.id} – kolikátá zastávka je „${stop}" od zastávky „${stops[0]}"?`,
      `${i + 1}. zastávka`,
      `Zastávka ${stop} je ${i + 1}. zastávka linky ${line.id} od ${stops[0]}.`
    );
  });

  // B9: Jaká je N. zastávka?
  stops.forEach((stop, i) => {
    addQ('B', 'Jaká je N. zastávka',
      `Linka ${line.id} – jaká je ${i + 1}. zastávka (počítáno od ${stops[0]})?`,
      stop,
      `${i + 1}. zastávka linky ${line.id} je ${stop}.`
    );
  });

  // B10: Seřaď 5 zastávek – vypíšeme správné pořadí jako text
  for (let i = 0; i <= stops.length - 5; i++) {
    const seg = stops.slice(i, i + 5);
    addQ('B', 'Seřaď zastávky',
      `Linka ${line.id} – seřaď tyto zastávky ve správném pořadí:\n${[...seg].sort().join(' | ')}`,
      seg.join(' → '),
      `Správné pořadí na lince ${line.id}: ${seg.join(' → ')}`
    );
  }

  // B11: Konečná zastávka
  addQ('B', 'Výchozí zastávka linky',
    `Která je VÝCHOZÍ zastávka linky ${line.id}?`,
    stops[0],
    `Výchozí zastávka linky ${line.id} je ${stops[0]}.`
  );
  addQ('B', 'Konečná zastávka linky',
    `Která je KONEČNÁ zastávka linky ${line.id}?`,
    last,
    `Konečná zastávka linky ${line.id} je ${last}.`
  );

  // B12: Počet zastávek
  addQ('B', 'Počet zastávek',
    `Kolik zastávek má linka ${line.id}?`,
    `${stops.length} zastávek`,
    `Linka ${line.id} má celkem ${stops.length} zastávek.`
  );
});

// B6: Na jaké lince se nachází zastávka X? (pouze unikátní zastávky – na 1 lince)
const uniqueStops = Object.entries(stopToLines).filter(([, lines]) => lines.length === 1);
uniqueStops.forEach(([stop, lines]) => {
  addQ('B', 'Na jaké lince je zastávka',
    `Na jaké tramvajové lince se nachází zastávka „${stop}"?`,
    `Linka ${lines[0]}`,
    `Zastávka ${stop} se nachází pouze na lince ${lines[0]}.`
  );
});

// B7: Jaké linky zastavují na zastávce X? (sdílené zastávky)
const sharedStops = Object.entries(stopToLines).filter(([, lines]) => lines.length >= 2);
sharedStops.forEach(([stop, lines]) => {
  addQ('B', 'Jaké linky zastavují na zastávce',
    `Jaké tramvajové linky zastavují na zastávce „${stop}"?`,
    `Linky: ${lines.join(', ')}`,
    `Na zastávce ${stop} zastavují linky: ${lines.join(', ')}.`
  );
});

// ============================================================
// EXPORT DO CSV
// ============================================================

function escapeCsv(str) {
  if (str == null) return '';
  const s = String(str).replace(/\n/g, ' ');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

const header = ['Sekce', 'Typ otázky', 'Otázka', 'Správná odpověď', 'Vysvětlení'];
const rows = [header, ...questions.map(q => [q.sekce, q.typ, q.otazka, q.spravnaOdpoved, q.vysvetleni])];
const csv = rows.map(row => row.map(escapeCsv).join(',')).join('\n');

// Přidáme BOM pro správné zobrazení češtiny v Excelu
const output = '\uFEFF' + csv;
fs.writeFileSync('vsechny-otazky.csv', output, 'utf8');

console.log(`✅ Hotovo! Vygenerováno ${questions.length} otázek.`);
console.log('📄 Soubor uložen: vsechny-otazky.csv');

// Statistiky
const byType = {};
questions.forEach(q => { byType[q.typ] = (byType[q.typ] || 0) + 1; });
console.log('\nPočty podle typu:');
Object.entries(byType).sort((a,b) => b[1]-a[1]).forEach(([typ, count]) => {
  console.log(`  ${typ}: ${count}`);
});
