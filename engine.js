/**
 * engine.js – Generátor otázek a kvízová logika
 * Obsahuje všechny typy otázek pro sekce A (Odkud→Kam) a B (Zastávky).
 */

/* ========================================================
   POMOCNÉ FUNKCE
======================================================== */

/** Zamíchá pole (Fisher-Yates) a vrátí kopii. */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Vrátí náhodný prvek z pole. */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Vrátí N unikátních náhodných prvků z pole (bez opakování). */
function pickN(arr, n) {
  return shuffle(arr).slice(0, n);
}

/** Vrátí N různých prvků z pole, které NEjsou v excludeArr. */
function pickExcluding(arr, exclude, n) {
  const filtered = arr.filter(x => !exclude.includes(x));
  return pickN(filtered, n);
}

/**
 * Vytvoří 4 možnosti: 1 správná + 3 náhodné z kandidátů.
 * Zamíchá výsledek.
 */
function buildOptions(correct, candidates, stringify = x => x) {
  const wrongPool = candidates.filter(c => stringify(c) !== stringify(correct));
  const wrongs = pickN(wrongPool, 3);
  const options = shuffle([correct, ...wrongs]);
  return options;
}

/**
 * Vrátí popis trasy linky (např. "z Řečkovic do Bystrc, Rakovecká").
 */
function routeLabel(line) {
  return `z ${line.stops[0]} do ${line.stops[line.stops.length - 1]}`;
}

/* ========================================================
   SEKCE A – ODKUD → KAM (trasy linek)
======================================================== */

const questionTypesA = [
  'A_odkudKam',
  'A_ktaraLinkaJede',
  'A_zacina',
  'A_pravdaLez',
  'A_konecne'
];

/**
 * Generuje otázku typu A1: "Odkud kam jede linka č. X?"
 */
function generateA_odkudKam(lines) {
  const line = pick(lines);
  const correct = `${line.stops[0]} ↔ ${line.stops[line.stops.length - 1]}`;
  const wrongLines = TRAM_DATA.lines.filter(l => l.number !== line.number);
  const wrongs = pickN(wrongLines, 3).map(l => `${l.stops[0]} ↔ ${l.stops[l.stops.length - 1]}`);
  const options = shuffle([correct, ...wrongs]);
  return {
    type: 'A_odkudKam',
    question: `🚋 Odkud kam jede linka č. ${line.number}?`,
    options,
    correct,
    explanation: `Linka ${line.number} jede z ${line.stops[0]} do ${line.stops[line.stops.length - 1]}.`
  };
}

/**
 * Generuje otázku typu A2: "Která linka jede z [A] do [B]?"
 */
function generateA_ktaraLinkaJede(lines) {
  const line = pick(lines);
  const from = line.stops[0];
  const to = line.stops[line.stops.length - 1];
  const correct = `Linka ${line.number}`;
  const wrongLines = TRAM_DATA.lines.filter(l => l.number !== line.number);
  const wrongs = pickN(wrongLines, 3).map(l => `Linka ${l.number}`);
  const options = shuffle([correct, ...wrongs]);
  return {
    type: 'A_ktaraLinkaJede',
    question: `🚋 Která linka jede z ${from} do ${to}?`,
    options,
    correct,
    explanation: `Z ${from} do ${to} jede linka ${line.number}.`
  };
}

/**
 * Generuje otázku typu A3: "Která linka začíná/končí v [terminus]?"
 */
function generateA_zacina(lines) {
  const line = pick(lines);
  const useFirst = Math.random() < 0.5;
  const terminus = useFirst ? line.stops[0] : line.stops[line.stops.length - 1];
  const verb = useFirst ? 'začíná' : 'končí';
  const correct = `Linka ${line.number}`;
  const wrongLines = TRAM_DATA.lines.filter(l => l.number !== line.number);
  const wrongs = pickN(wrongLines, 3).map(l => `Linka ${l.number}`);
  const options = shuffle([correct, ...wrongs]);
  return {
    type: 'A_zacina',
    question: `🛑 Která linka ${verb} v zastávce ${terminus}?`,
    options,
    correct,
    explanation: `Zastávka ${terminus} je ${verb === 'začíná' ? 'první' : 'konečná'} zastávka linky ${line.number}.`
  };
}

/**
 * Generuje otázku typu A4: "Pravda nebo lež: Linka X jede z A do B?"
 */
function generateA_pravdaLez(lines) {
  const line = pick(lines);
  const isTrue = Math.random() < 0.5;
  const first = line.stops[0];
  const last = line.stops[line.stops.length - 1];
  let statedFrom, statedTo;

  if (isTrue) {
    // Linka je obousměrná – oba směry jsou správná odpověď
    [statedFrom, statedTo] = Math.random() < 0.5 ? [first, last] : [last, first];
  } else {
    // Lž = OBĚ konečné zastávky patří jiné lince (vždy ze všech linek)
    const wrongLine = pick(TRAM_DATA.lines.filter(l => l.number !== line.number));
    statedFrom = wrongLine.stops[0];
    statedTo = wrongLine.stops[wrongLine.stops.length - 1];
  }

  const correct = isTrue ? 'Pravda ✅' : 'Lež ❌';
  const options = ['Pravda ✅', 'Lež ❌'];
  return {
    type: 'A_pravdaLez',
    question: `❓ Pravda nebo lež?\nLinka ${line.number} jede z ${statedFrom} do ${statedTo}.`,
    options,
    correct,
    isTrueFalse: true,
    explanation: isTrue
      ? `Správně! Linka ${line.number} jede mezi ${first} a ${last} (obousměrně).`
      : `Linka ${line.number} jede mezi ${first} a ${last}, ne z ${statedFrom} do ${statedTo}.`
  };
}

/**
 * Generuje otázku typu A5: "Která linka má tyto konečné zastávky: A a B?"
 */
function generateA_konecne(lines) {
  const line = pick(lines);
  const from = line.stops[0];
  const to = line.stops[line.stops.length - 1];
  const correct = `Linka ${line.number}`;
  const wrongLines = TRAM_DATA.lines.filter(l => l.number !== line.number);
  const wrongs = pickN(wrongLines, 3).map(l => `Linka ${l.number}`);
  const options = shuffle([correct, ...wrongs]);
  return {
    type: 'A_konecne',
    question: `🚋 Která linka má tyto konečné zastávky:\n${from} a ${to}?`,
    options,
    correct,
    explanation: `Konečné zastávky linky ${line.number} jsou ${from} a ${to}.`
  };
}

/* ========================================================
   SEKCE B – ZASTÁVKY
======================================================== */

const questionTypesB = [
  'B_nasleduje',
  'B_predchazi',
  'B_doplnChybejici',
  'B_jeNaLince',
  'B_neniNaLince',
  'B_naJakeLince',
  'B_jakeLinkySdili',
  'B_kolikataZastavka',
  'B_nZastavka',
  'B_seradZastavky',
  'B_konecna',
  'B_pocetZastavek'
];

/**
 * B1: "Jaká zastávka NÁSLEDUJE po [stop] na lince X směrem do [terminus]?"
 */
function generateB_nasleduje(lines) {
  const line = pick(lines);
  // Obousměrná linka – náhodně vybereme směr
  const stops = Math.random() < 0.5 ? line.stops : [...line.stops].reverse();
  const idx = Math.floor(Math.random() * (stops.length - 1));
  const stop = stops[idx];
  const correct = stops[idx + 1];
  const direction = stops[stops.length - 1];
  const candidates = stops.filter((_, i) => i !== idx + 1);
  const options = buildOptions(correct, candidates);
  return {
    type: 'B_nasleduje',
    question: `🚋 Linka ${line.number} – jaká zastávka NÁSLEDUJE po zastávce\n${stop}\nve směru ${direction}?`,
    options,
    correct,
    explanation: `Po zastávce ${stop} na lince ${line.number} (směr ${direction}) následuje ${correct}.`
  };
}

/**
 * B2: "Jaká zastávka PŘEDCHÁZÍ [stop] na lince X?"
 */
function generateB_predchazi(lines) {
  const line = pick(lines);
  // Obousměrná linka – náhodně vybereme směr
  const stops = Math.random() < 0.5 ? line.stops : [...line.stops].reverse();
  const idx = 1 + Math.floor(Math.random() * (stops.length - 1));
  const stop = stops[idx];
  const correct = stops[idx - 1];
  const direction = stops[stops.length - 1];
  const candidates = stops.filter((_, i) => i !== idx - 1);
  const options = buildOptions(correct, candidates);
  return {
    type: 'B_predchazi',
    question: `🚋 Linka ${line.number} – jaká zastávka PŘEDCHÁZÍ zastávce\n${stop}\nve směru ${direction}?`,
    options,
    correct,
    explanation: `Před zastávkou ${stop} na lince ${line.number} (směr ${direction}) je ${correct}.`
  };
}

/**
 * B3: "Doplň chybějící zastávku: [A] → ??? → [C] na lince X"
 */
function generateB_doplnChybejici(lines) {
  const line = pick(lines);
  // Obousměrná linka – náhodně vybereme směr
  const stops = Math.random() < 0.5 ? line.stops : [...line.stops].reverse();
  if (stops.length < 3) return generateB_nasleduje(lines);
  const idx = 1 + Math.floor(Math.random() * (stops.length - 2));
  const prev = stops[idx - 1];
  const correct = stops[idx];
  const next = stops[idx + 1];
  const candidates = stops.filter((_, i) => i !== idx);
  const options = buildOptions(correct, candidates);
  return {
    type: 'B_doplnChybejici',
    question: `🚋 Linka ${line.number} – doplň chybějící zastávku:\n${prev} → ??? → ${next}`,
    options,
    correct,
    explanation: `Chybějící zastávka mezi ${prev} a ${next} na lince ${line.number} je ${correct}.`
  };
}

/**
 * B4: "Je zastávka [stop] na lince X?" (Ano/Ne)
 */
function generateB_jeNaLince(lines) {
  const line = pick(lines);
  const isTrue = Math.random() < 0.5;
  let stop;
  if (isTrue) {
    stop = pick(line.stops);
  } else {
    // Vezměme zastávku z jiné linky, která NENÍ na vybrané lince
    const allStops = getAllStops();
    const foreignStops = allStops.filter(s => !line.stops.includes(s));
    if (foreignStops.length === 0) {
      stop = pick(line.stops);
      return generateB_jeNaLince(lines); // fallback
    }
    stop = pick(foreignStops);
  }
  const correct = isTrue ? 'Ano ✅' : 'Ne ❌';
  const options = ['Ano ✅', 'Ne ❌'];
  return {
    type: 'B_jeNaLince',
    question: `❓ Je zastávka ${stop} na lince ${line.number}?`,
    options,
    correct,
    isTrueFalse: true,
    explanation: isTrue
      ? `Ano, zastávka ${stop} se nachází na lince ${line.number}.`
      : `Ne, zastávka ${stop} není na lince ${line.number}.`
  };
}

/**
 * B5: "Která ze zastávek NENÍ na lince X?" (3 skutečné + 1 falešná)
 */
function generateB_neniNaLince(lines) {
  const line = pick(lines);
  const allStops = getAllStops();
  const foreignStops = allStops.filter(s => !line.stops.includes(s));
  if (foreignStops.length === 0) return generateB_nasleduje(lines);
  const fake = pick(foreignStops);
  const realOnes = pickN(line.stops, 3);
  const options = shuffle([fake, ...realOnes]);
  return {
    type: 'B_neniNaLince',
    question: `🚋 Linka ${line.number} – která z těchto zastávek na ní NENÍ?`,
    options,
    correct: fake,
    explanation: `Zastávka ${fake} se nenachází na lince ${line.number}.`
  };
}

/**
 * B6: "Na jaké lince se nachází zastávka [stop]?" (pro unikátní zastávky)
 */
function generateB_naJakeLince(lines) {
  // Hledáme zastávky, které jsou pouze na 1 lince (ze zvolených)
  const selectedNums = lines.map(l => l.number);
  const uniqueStops = [];
  lines.forEach(line => {
    line.stops.forEach(stop => {
      const linesForStop = (STOP_TO_LINES[stop] || []).filter(n => selectedNums.includes(n));
      if (linesForStop.length === 1) uniqueStops.push({ stop, lineNum: line.number });
    });
  });
  if (uniqueStops.length === 0) return generateB_neniNaLince(lines);
  const { stop, lineNum } = pick(uniqueStops);
  const correct = `Linka ${lineNum}`;
  // Špatné možnosti: nejdřív ze zvolených, pak doplní ze všech linek (vždy 3 distractory)
  const wrongPool = TRAM_DATA.lines.filter(l => l.number !== lineNum);
  const wrongs = pickN(wrongPool, 3).map(l => `Linka ${l.number}`);
  const options = shuffle([correct, ...wrongs]);
  return {
    type: 'B_naJakeLince',
    question: `🛑 Na jaké lince se nachází zastávka ${stop}?`,
    options,
    correct,
    explanation: `Zastávka ${stop} se nachází na lince ${lineNum}.`
  };
}

/**
 * B7: "Jaké linky zastavují na zastávce [stop]?" (multiple select – pro sdílené zastávky)
 */
function generateB_jakeLinkySdili(lines) {
  const selectedNums = lines.map(l => l.number);
  // Hledáme zastávky na více linkách
  const sharedStops = [];
  const allStops = getAllStops(selectedNums);
  allStops.forEach(stop => {
    const linesForStop = (STOP_TO_LINES[stop] || []).filter(n => selectedNums.includes(n));
    if (linesForStop.length >= 2 && linesForStop.length <= 5) {
      sharedStops.push({ stop, lineNums: linesForStop });
    }
  });
  if (sharedStops.length === 0) return generateB_naJakeLince(lines);
  const { stop, lineNums } = pick(sharedStops);
  // Nabídneme zaškrtávací políčka pro všechny vybrané linky
  const allOptions = selectedNums.map(n => `Linka ${n}`);
  const correctSet = lineNums.map(n => `Linka ${n}`);
  return {
    type: 'B_jakeLinkySdili',
    question: `🛑 Jaké linky zastavují na zastávce ${stop}?\n(Vyber všechny správné odpovědi)`,
    options: allOptions,
    correct: correctSet, // pole správných odpovědí
    isMultiSelect: true,
    explanation: `Na zastávce ${stop} zastavují linky: ${lineNums.join(', ')}.`
  };
}

/**
 * B8: "Kolikátá zastávka je [stop] na lince X od [endpoint]?"
 */
function generateB_kolikataZastavka(lines) {
  const line = pick(lines);
  // Obousměrná linka – náhodně vybereme směr
  const stops = Math.random() < 0.5 ? line.stops : [...line.stops].reverse();
  const idx = Math.floor(Math.random() * stops.length);
  const stop = stops[idx];
  const fromTerminus = stops[0];
  const correct = `${idx + 1}.`;
  // Generujeme 3 špatné číselné možnosti (blízké hodnoty)
  const wrongNums = new Set();
  while (wrongNums.size < 3) {
    const offset = Math.floor(Math.random() * 6) - 3;
    const candidate = idx + 1 + offset;
    if (candidate !== idx + 1 && candidate >= 1 && candidate <= stops.length) {
      wrongNums.add(candidate);
    }
  }
  const options = shuffle([correct, ...[...wrongNums].map(n => `${n}.`)]);
  return {
    type: 'B_kolikataZastavka',
    question: `🚋 Linka ${line.number} – kolikátá zastávka je ${stop}\nod zastávky ${fromTerminus}?`,
    options,
    correct,
    explanation: `Zastávka ${stop} je ${idx + 1}. zastávka linky ${line.number} od ${fromTerminus}.`
  };
}

/**
 * B9: "Jaká je [N]. zastávka na lince X ve směru [terminus]?"
 */
function generateB_nZastavka(lines) {
  const line = pick(lines);
  // Obousměrná linka – náhodně vybereme směr
  const stops = Math.random() < 0.5 ? line.stops : [...line.stops].reverse();
  const idx = Math.floor(Math.random() * stops.length);
  const correct = stops[idx];
  const n = idx + 1;
  const direction = stops[stops.length - 1];
  const candidates = stops.filter((_, i) => i !== idx);
  const options = buildOptions(correct, candidates);
  return {
    type: 'B_nZastavka',
    question: `🚋 Linka ${line.number} – jaká je ${n}. zastávka\nve směru ${direction}?`,
    options,
    correct,
    explanation: `${n}. zastávka linky ${line.number} ve směru ${direction} je ${correct}.`
  };
}

/**
 * B10: "Seřaď tyto zastávky ve správném pořadí ve směru [terminus]"
 * Vrací 5 po sobě jdoucích zastávek v náhodném pořadí.
 */
function generateB_seradZastavky(lines) {
  const line = pick(lines);
  // Obousměrná linka – náhodně vybereme směr
  const stops = Math.random() < 0.5 ? line.stops : [...line.stops].reverse();
  if (stops.length < 5) return generateB_nasleduje(lines);
  const startIdx = Math.floor(Math.random() * (stops.length - 4));
  const consecutive = stops.slice(startIdx, startIdx + 5);
  const direction = stops[stops.length - 1];
  const shuffled = shuffle(consecutive);
  return {
    type: 'B_seradZastavky',
    question: `🚋 Linka ${line.number} – seřaď zastávky ve směru ${direction}:`,
    options: shuffled,      // zobrazíme jako přetahovací / klikací
    correct: consecutive,   // správné pořadí
    isOrdering: true,
    explanation: `Správné pořadí na lince ${line.number} ve směru ${direction}: ${consecutive.join(' → ')}`
  };
}

/**
 * B11: "Která je KONEČNÁ zastávka linky X?"
 */
function generateB_konecna(lines) {
  const line = pick(lines);
  const useLast = Math.random() < 0.5;
  const correct = useLast ? line.stops[line.stops.length - 1] : line.stops[0];
  const direction = useLast ? 'konečná' : 'první (výchozí)';
  // Špatné možnosti: konečné zastávky jiných linek (vždy ze všech linek)
  const wrongLines = TRAM_DATA.lines.filter(l => l.number !== line.number);
  const wrongs = pickN(wrongLines, 3).map(l => useLast ? l.stops[l.stops.length - 1] : l.stops[0]);
  const options = shuffle([correct, ...wrongs]);
  return {
    type: 'B_konecna',
    question: `🚋 Která je ${direction} zastávka linky ${line.number}?`,
    options,
    correct,
    explanation: `${direction.charAt(0).toUpperCase() + direction.slice(1)} zastávka linky ${line.number} je ${correct}.`
  };
}

/**
 * B12: "Kolik zastávek má linka X?"
 */
function generateB_pocetZastavek(lines) {
  const line = pick(lines);
  const correct = `${line.stops.length}`;
  // Špatné možnosti: blízká čísla
  const wrongNums = new Set();
  while (wrongNums.size < 3) {
    const offset = Math.floor(Math.random() * 8) - 4;
    const candidate = line.stops.length + offset;
    if (String(candidate) !== correct && candidate > 0) wrongNums.add(candidate);
  }
  const options = shuffle([correct, ...[...wrongNums].map(String)]);
  return {
    type: 'B_pocetZastavek',
    question: `🚋 Kolik zastávek má linka ${line.number}?`,
    options,
    correct,
    explanation: `Linka ${line.number} má celkem ${line.stops.length} zastávek.`
  };
}

/* ========================================================
   HLAVNÍ GENERÁTOR SEZENÍ
======================================================== */

/**
 * Generuje pole otázek pro sezení.
 * @param {string} section - 'A', 'B', nebo 'AB' (mix)
 * @param {number[]} selectedLines - čísla vybraných linek
 * @param {number} count - počet otázek (0 = endless)
 * @param {string[]} enabledTypes - povolené typy otázek
 * @returns {object[]} pole otázek
 */
function generateSession(section, selectedLineNumbers, count, enabledTypes) {
  const lines = TRAM_DATA.lines.filter(l => selectedLineNumbers.includes(l.number));
  if (lines.length === 0) return [];

  // Mapování generátorů
  const generators = {
    'A_odkudKam': generateA_odkudKam,
    'A_ktaraLinkaJede': generateA_ktaraLinkaJede,
    'A_zacina': generateA_zacina,
    'A_pravdaLez': generateA_pravdaLez,
    'A_konecne': generateA_konecne,
    'B_nasleduje': generateB_nasleduje,
    'B_predchazi': generateB_predchazi,
    'B_doplnChybejici': generateB_doplnChybejici,
    'B_jeNaLince': generateB_jeNaLince,
    'B_neniNaLince': generateB_neniNaLince,
    'B_naJakeLince': generateB_naJakeLince,
    'B_jakeLinkySdili': generateB_jakeLinkySdili,
    'B_kolikataZastavka': generateB_kolikataZastavka,
    'B_nZastavka': generateB_nZastavka,
    'B_seradZastavky': generateB_seradZastavky,
    'B_konecna': generateB_konecna,
    'B_pocetZastavek': generateB_pocetZastavek
  };

  // Filtrujeme dostupné typy
  let availableTypes;
  if (section === 'A') availableTypes = questionTypesA;
  else if (section === 'B') availableTypes = questionTypesB;
  else availableTypes = [...questionTypesA, ...questionTypesB];

  if (enabledTypes && enabledTypes.length > 0) {
    availableTypes = availableTypes.filter(t => enabledTypes.includes(t));
  }
  if (availableTypes.length === 0) availableTypes = section === 'A' ? questionTypesA : questionTypesB;

  const questions = [];
  const maxQuestions = count > 0 ? count : 50;
  const recentTypes = [];

  for (let i = 0; i < maxQuestions; i++) {
    // Vyhni se opakování posledního typu
    let typeCandidates = availableTypes.filter(t => !recentTypes.slice(-2).includes(t));
    if (typeCandidates.length === 0) typeCandidates = availableTypes;
    const type = pick(typeCandidates);
    recentTypes.push(type);
    if (recentTypes.length > 4) recentTypes.shift();

    try {
      const q = generators[type](lines);
      questions.push(q);
    } catch (e) {
      console.warn('Chyba při generování otázky:', type, e);
      i--; // zkus znovu
    }
  }
  return questions;
}

/* ========================================================
   KVÍZOVÝ STAV
======================================================== */

class QuizState {
  constructor(questions) {
    this.questions = questions;
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.results = []; // { question, userAnswer, isCorrect }
    this.answered = false;
    this.orderingAnswer = []; // pro B_seradZastavky
    this.multiSelectAnswer = new Set(); // pro B_jakeLinkySdili
  }

  get current() {
    return this.questions[this.currentIndex];
  }

  get total() {
    return this.questions.length;
  }

  get isFinished() {
    return this.currentIndex >= this.total;
  }

  get progressPercent() {
    return Math.round((this.currentIndex / this.total) * 100);
  }

  /**
   * Odpovídá na aktuální otázku.
   * @param {string|string[]} answer - odpověď uživatele
   * @returns {{ isCorrect: boolean, correct: string|string[] }}
   */
  answer(answer) {
    if (this.answered) return null;
    this.answered = true;
    const q = this.current;
    let isCorrect = false;

    if (q.isOrdering) {
      // Porovnáme pořadí
      isCorrect = Array.isArray(answer) &&
        answer.length === q.correct.length &&
        answer.every((s, i) => s === q.correct[i]);
    } else if (q.isMultiSelect) {
      const userSet = new Set(Array.isArray(answer) ? answer : [answer]);
      const correctSet = new Set(q.correct);
      isCorrect = userSet.size === correctSet.size &&
        [...userSet].every(x => correctSet.has(x));
    } else {
      isCorrect = answer === q.correct;
    }

    if (isCorrect) {
      this.score++;
      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;
    } else {
      this.streak = 0;
    }

    this.results.push({ question: q, userAnswer: answer, isCorrect });
    return { isCorrect, correct: q.correct };
  }

  /** Přejde na další otázku. */
  next() {
    this.currentIndex++;
    this.answered = false;
    this.orderingAnswer = [];
    this.multiSelectAnswer = new Set();
  }

  /** Vrátí počet hvězdiček (0–5) podle skóre. */
  get stars() {
    const pct = this.total > 0 ? (this.score / this.total) * 100 : 0;
    if (pct >= 95) return 5;
    if (pct >= 80) return 4;
    if (pct >= 65) return 3;
    if (pct >= 45) return 2;
    if (pct >= 25) return 1;
    return 0;
  }
}
