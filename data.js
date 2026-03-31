/**
 * data.js – Brněnská tramvajová data (DPMB)
 * Obsahuje všechny linky, jejich koncové stanice a seznam zastávek v pořadí.
 */

const TRAM_DATA = {
  lines: [
    {
      number: 1,
      from: "Bystrc, Rakovecká",
      to: "Řečkovice",
      stops: [
        "Řečkovice", "Filkukova", "Kořískova", "Hudcova", "Vozovna Medlánky",
        "Tylova", "Semilasso (Palackého z centra)", "Husitská (Palackého)", "Jungmannova",
        "Kartouzská", "Šumavská", "Hrnčířská", "Pionýrská", "Antonínská",
        "Moravské náměstí (Královo Pole)", "Malinovského náměstí (Rooseveltova)",
        "Hlavní nádraží (kolej 1)", "Nové sady (kolej 1)", "Hybešova", "Václavská",
        "Mendlovo náměstí (tram Pisárky)", "Výstaviště hlavní vstup", "Výstaviště vstup G2",
        "Arena Brno (vozovna Pisárky)", "Pisárky (tunel)", "Bráfova", "Stránského",
        "Vozovna Komín", "Svratecká (Kníničská)", "Branka", "Podlesí", "Kamenolom",
        "Zoologická zahrada (Obvodová)", "Přístaviště", "Bystrc Rakovecká"
      ]
    },
    {
      number: 2,
      from: "Ústřední hřbitov / Modřice",
      to: "Židenice, Stará osada",
      stops: [
        "Židenice Stará osada", "Kuldova", "Vojenská nemocnice", "Tkalcovská", "Körnerova",
        "Malinovského náměstí (divadlo)", "Hlavní nádraží (kolej 1)", "Nové sady (kolej 1)",
        "Hybešova", "Václavská", "Mendlovo náměstí (tram Česká)", "Poříčí",
        "Nemocnice Milosrdných bratří", "Celní", "Hluboká", "Ústřední hřbitov (Vídeňská)",
        "Ústřední hřbitov smyčka", "Bohunická", "Ořechovská", "Moravanské lány",
        "Moravanská", "Modřická cihelna", "Modřice Tyršova", "Modřice smyčka"
      ]
    },
    {
      number: 3,
      from: "Bystrc, Ečerova",
      to: "Židenice, Stará osada",
      stops: [
        "Židenice Stará osada", "Kuldova", "Vojenská nemocnice", "Jugoslávská (Cejl)",
        "Dětská nemocnice", "Náměstí 28. října", "Moravské náměstí (Černá Pole)",
        "Česká (Česká)", "Grohova", "Konečného náměstí", "Rybkova", "Tábor (Veveří)",
        "Králova", "Burianovo náměstí", "Mozolky", "Rosického náměstí", "Sochorova",
        "Vozovna Komín", "Svratecká (Kníničská)", "Branka", "Podlesí", "Kamenolom",
        "Zoologická zahrada (Obvodová)", "Přístaviště", "Kubíčkova", "Ondrouškova",
        "Bystrc Ečerova"
      ]
    },
    {
      number: 4,
      from: "Masarykova čtvrť, Náměstí Míru",
      to: "Obřany, Babická",
      stops: [
        "Obřany Babická", "Obřanský most (Obřanská)", "Čtvery hony", "Obřanská u školy",
        "Proškovo náměstí", "Maloměřický most (u mostu)", "Tomkovo náměstí (pod mostem)",
        "Náměstí Republiky", "Vozovna Husovice", "Mostecká", "Trávníčkova", "Tkalcovská",
        "Körnerova", "Malinovského náměstí (divadlo)", "Hlavní nádraží (kolej 1)",
        "Zelný trh", "Náměstí Svobody", "Česká (Joštova)", "Komenského náměstí",
        "Obilní trh", "Úvoz (Údolní)", "Všetičkova", "Masarykova čtvrť Náměstí Míru"
      ]
    },
    {
      number: 5,
      from: "Mendlovo náměstí / Ústřední hřbitov",
      to: "Štefánikova čtvrť",
      stops: [
        "Štefánikova čtvrť (smyčka)", "Venhudova", "Zdráhalova",
        "Jugoslávská (Štefánikova čtvrť)", "Dětská nemocnice", "Náměstí 28. října",
        "Moravské náměstí (Černá Pole)", "Česká (Joštova)", "Šilingrovo náměstí (Pekařská)",
        "Nemocnice u svaté Anny", "Mendlovo náměstí (tram Česká)", "Poříčí",
        "Nemocnice Milosrdných bratří", "Celní", "Hluboká", "Ústřední hřbitov (Vídeňská)",
        "Ústřední hřbitov smyčka"
      ]
    },
    {
      number: 6,
      from: "Starý Lískovec",
      to: "Královo Pole, nádraží",
      stops: [
        "Královo Pole nádraží", "Semilasso (Kosmova do centra)", "Husitská (Palackého)",
        "Jungmannova", "Kartouzská", "Šumavská", "Hrnčířská", "Pionýrská", "Antonínská",
        "Moravské náměstí (Královo Pole)", "Česká (Joštova)", "Šilingrovo náměstí (Pekařská)",
        "Nemocnice u svaté Anny", "Mendlovo náměstí (tram Česká)", "Poříčí",
        "Nemocnice Milosrdných bratří", "Celní", "Krematorium", "Běloruská", "Švermova",
        "Osová", "Karpatská", "Dunajská", "Starý Lískovec"
      ]
    },
    {
      number: 7,
      from: "Starý Lískovec",
      to: "Černá Pole, Zemědělská / Lesná, Čertova rokle",
      stops: [
        "Lesná Čertova rokle", "Halasovo náměstí", "Fügnerova", "Bieblova", "Lesnická",
        "Černá Pole Zemědělská (Lesnická)", "Tomanova", "Jugoslávská (Lesná)",
        "Jugoslávská (Cejl)", "Tkalcovská", "Körnerova", "Malinovského náměstí (divadlo)",
        "Hlavní nádraží (kolej 1)", "Nové sady (kolej 3)", "Soukenická", "Křídlovická",
        "Vojtova", "Vsetínská", "Krematorium", "Běloruská", "Švermova", "Osová",
        "Karpatská", "Dunajská", "Starý Lískovec"
      ]
    },
    {
      number: 8,
      from: "Nemocnice Bohunice",
      to: "Líšeň, Mifkova",
      stops: [
        "Líšeň Mifkova", "Jírova (tunel)", "Kotlanova", "Masarova", "Novolíšeňská",
        "Líšeňská", "Bílá hora", "Bělohorská", "Krásného", "Židovský hřbitov",
        "Geislerova", "Životského", "Masná (Křenová)", "Vlhká", "Hlavní nádraží (kolej 3)",
        "Nové sady (kolej 3)", "Soukenická", "Křídlovická", "Vojtova", "Vsetínská",
        "Krematorium", "Běloruská", "Švermova", "Osová", "Západní brána (tunel)",
        "Nemocnice Bohunice (terminál tramvaj)"
      ]
    },
    {
      number: 9,
      from: "Juliánov",
      to: "Lesná, Čertova rokle",
      stops: [
        "Lesná Čertova rokle", "Halasovo náměstí", "Fügnerova", "Bieblova", "Lesnická",
        "Zemědělská (Lesnická)", "Tomanova", "Jugoslávská (Lesná)", "Dětská nemocnice",
        "Náměstí 28. října", "Moravské náměstí (Černá Pole)", "Česká (před kostelem)",
        "Náměstí Svobody", "Zelný trh", "Hlavní nádraží (kolej 2)", "Vlhká",
        "Masná (Křenová)", "Životského", "Geislerova", "Buzkova",
        "Otakara Ševčíka (Táborská)", "Dělnický dům", "Židenice Juliánov"
      ]
    },
    {
      number: 10,
      from: "Vozovna Komín / Bystrc, Rakovecká",
      to: "Stránská skála",
      stops: [
        "Stránská skála smyčka", "Stránská skála", "Podstránská", "Krásného", "Židovský hřbitov",
        "Geislerova", "Životského", "Masná (Křenová)", "Vlhká",
        "Hlavní nádraží (spojka u Grandu)", "Malinovského náměstí (Rooseveltova)",
        "Česká (Česká)", "Grohova", "Konečného náměstí", "Rybkova", "Tábor (Veveří)",
        "Králova", "Burianovo náměstí", "Mozolky", "Rosického náměstí", "Sochorova",
        "Vozovna Komín", "Svratecká (Kníničská)", "Branka", "Podlesí", "Kamenolom",
        "Zoologická zahrada (Obvodová)", "Přístaviště", "Bystrc Rakovecká"
      ]
    },
    {
      number: 12,
      from: "Technologický park",
      to: "Komárov",
      stops: [
        "Komárov", "Konopná", "Železniční", "Autobusové nádraží (Plotní)",
        "Úzká (Dornych)", "Hlavní nádraží (kolej 3)", "Nové sady (kolej 1)",
        "Šilingrovo náměstí (Husova)", "Česká (Česká)", "Grohova", "Konečného náměstí",
        "Nerudova", "Klusáčkova", "Tererova", "Dobrovského", "Skácelova",
        "Červinkova", "Technické muzeum", "Technologický park"
      ]
    }
  ]
};

/**
 * Vrátí čistý název zastávky pro TTS (odstraní závorky a jejich obsah).
 * Např. "Husitská (Palackého)" → "Husitská"
 */
function cleanStopForTTS(stop) {
  return stop.replace(/\s*\([^)]*\)/g, '').trim();
}

/**
 * Vrátí linku podle čísla.
 */
function getLineByNumber(number) {
  return TRAM_DATA.lines.find(l => l.number === number);
}

/**
 * Vrátí všechny zastávky ze všech vybraných linek (bez duplicit).
 */
function getAllStops(selectedLineNumbers = null) {
  const lines = selectedLineNumbers
    ? TRAM_DATA.lines.filter(l => selectedLineNumbers.includes(l.number))
    : TRAM_DATA.lines;
  const stops = new Set();
  lines.forEach(l => l.stops.forEach(s => stops.add(s)));
  return Array.from(stops);
}

/**
 * Vrátí mapu: zastávka → pole čísel linek, které na ní zastavují.
 */
function buildStopToLinesMap() {
  const map = {};
  TRAM_DATA.lines.forEach(line => {
    line.stops.forEach(stop => {
      if (!map[stop]) map[stop] = [];
      if (!map[stop].includes(line.number)) map[stop].push(line.number);
    });
  });
  return map;
}

// Předvypočítaná mapa zastávek → linek
const STOP_TO_LINES = buildStopToLinesMap();

/* ========================================================
   DOPRAVNÍ UZLY
======================================================== */

const HUB_DATA = [
  {
    name: 'Mendlovo náměstí',
    tramvaje:   ['1','5','6'],
    trolejbusy: ['25','26','35','37'],
    autobusy:   ['44','52','62','84','N97','N98']
  },
  {
    name: 'Česká – Komenského náměstí',
    tramvaje:   ['3','4','5','6','9','10','12'],
    trolejbusy: ['32','34','36','38','39'],
    autobusy:   ['80','N89','N92','N93','N95','N99']
  },
  {
    name: 'Hlavní nádraží',
    tramvaje:   ['1','2','4','7','8','9','10','12'],
    trolejbusy: ['31','33'],
    autobusy:   ['47','49','67','E76','N89','N90','N91','N92','N93','N94','N95','N96','N97','N98','N99']
  },
  {
    name: 'Stará osada',
    tramvaje:   ['2','3'],
    trolejbusy: ['27'],
    autobusy:   ['44','55','58','64','75','E75','78','84','N97','N99','201']
  },
  {
    name: 'Starý Lískovce a Bohunice',
    tramvaje:   ['6','7','8'],
    trolejbusy: ['25','37'],
    autobusy:   ['40','50','E50','E56','69','N90','N91','N96','161','401','402','403','404','405','406','502']
  },
  {
    name: 'Lesná',
    tramvaje:   ['5','7','9'],
    trolejbusy: ['25','26'],
    autobusy:   ['44','46','57','66','72','84','N92','N93']
  },
  {
    name: 'Konečného náměstí',
    tramvaje:   ['3','10','12'],
    trolejbusy: ['25','26'],
    autobusy:   ['N92','N93','N99']
  },
  {
    name: 'Bystrc – ZOO',
    tramvaje:   ['1','3','10'],
    trolejbusy: ['30'],
    autobusy:   ['50','52','54','N92','N98','161','302','303']
  },
  {
    name: 'Královo Pole – Semilasso',
    tramvaje:   ['1','6'],
    trolejbusy: ['30'],
    autobusy:   ['41','42','44','E56','70','72','84','N90','N91','301','304']
  },
  {
    name: 'Líšeň',
    tramvaje:   ['8','10'],
    trolejbusy: ['25','27'],
    autobusy:   ['55','58','78','N97','N98','N99','151']
  }
];
