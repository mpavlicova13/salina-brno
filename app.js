/**
 * app.js – UI kontrolér, navigace, audio, flashkarty
 * Řídí celou aplikaci: obrazovky, přechody, kvíz, TTS.
 */

/* ========================================================
   GLOBÁLNÍ STAV APLIKACE
======================================================== */

const AppState = {
  // Aktuálně zobrazená obrazovka
  screen: 'home',

  // Nastavení
  settings: {
    enabledTypesA: [...questionTypesA],
    enabledTypesB: [...questionTypesB],
    sessionLength: 10,        // 5, 10, 20, 0 (endless)
    ttsSpeed: 1.0,
    ttsEnabled: true,
    selectedVoiceName: null   // null = automatický výběr
  },

  // Vybrané linky (pro sekce A a B)
  selectedLinesA: TRAM_DATA.lines.map(l => l.number),
  selectedLinesB: TRAM_DATA.lines.map(l => l.number),

  // Procvič linku
  practiceLineNum: null,
  practiceMode: null,  // 'audio', 'quiz', 'audioquiz'

  // Aktuální kvíz
  quiz: null,

  // Audio stav
  audio: {
    line: null,
    stopIndex: 0,
    isPlaying: false,
    utterance: null,
    speed: 1.0,
    loop: false
  },

  // Streak
  streak: 0,
  totalScore: 0,
  totalAnswered: 0
};

/* ========================================================
   TTS – TEXT TO SPEECH
======================================================== */

/* ========================================================
   AUDIO SOUBORY – přehrávání předgenerovaných .m4a souborů
======================================================== */

/** Převede název zastávky na název souboru (stejná logika jako generate-audio.js). */
function stopToFilename(text) {
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_,.\-]/g, '')
    .substring(0, 80);
}

/** Přehraje soubor audio/NAME.m4a, vrátí Promise. Při chybě odmítne. */
function playAudioFile(filename, speed = 1.0) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(`audio/${filename}.m4a`);
    audio.playbackRate = Math.min(Math.max(speed, 0.5), 2.0);
    audio.onended = resolve;
    audio.onerror = reject;
    AudioPlayer._currentAudio = audio;
    audio.play().catch(reject);
  });
}

const TTS = {
  synth: window.speechSynthesis,
  czechVoice: null,
  czechVoices: [],
  available: false,

  /** Inicializace – najde a seřadí české hlasy dle kvality. */
  init() {
    const load = () => {
      const voices = this.synth.getVoices();
      const czech = voices.filter(v => v.lang === 'cs-CZ' || v.lang.startsWith('cs'));
      this.czechVoices = czech;

      if (czech.length > 0) {
        // Preferuj kvalitnější hlasy: nejdřív podle názvu, pak lokální (device-installed = enhanced na Apple)
        const quality = ['enhanced', 'neural', 'natural', 'premium'];
        const best = czech.find(v =>
          quality.some(k => v.name.toLowerCase().includes(k))
        ) || czech.find(v => v.localService) || czech[0];

        // Pokud má uživatel uloženou preferenci, použij ji
        const savedName = AppState.settings.selectedVoiceName;
        const saved = savedName ? czech.find(v => v.name === savedName) : null;
        this.czechVoice = saved || best;
        this.available = true;
      } else {
        this.available = voices.length > 0;
      }
      renderVoiceSelector();
    };
    load();
    this.synth.onvoiceschanged = load;
  },

  /** Přečte text. Vrátí Promise, který se vyřeší po dokončení. */
  speak(text, speed = 1.0) {
    return new Promise((resolve, reject) => {
      this.synth.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'cs-CZ';
      utt.rate = speed;
      utt.pitch = 1.0;
      if (this.czechVoice) utt.voice = this.czechVoice;
      utt.onend = resolve;
      utt.onerror = reject;
      AppState.audio.utterance = utt;
      this.synth.speak(utt);
    });
  },

  /** Zastaví přehrávání. */
  stop() {
    this.synth.cancel();
    AppState.audio.isPlaying = false;
  },

  /** Pozastaví / obnoví. */
  pauseResume() {
    if (this.synth.paused) {
      this.synth.resume();
    } else if (this.synth.speaking) {
      this.synth.pause();
    }
  }
};

/* ========================================================
   AUDIO PŘEHRÁVAČ LINEK
======================================================== */

const AudioPlayer = {
  currentLine: null,
  currentIdx: 0,
  playing: false,
  paused: false,
  speed: 1.0,
  _gen: 0,           // generační čítač – zruší stará přehrávání okamžitě
  _currentAudio: null,

  isTurtleMode() { return this.speed <= 0.5; },

  async play(line, speed = 1.0) {
    // Nová generace zruší jakýkoli předchozí loop
    this._gen++;
    const gen = this._gen;

    this.currentLine = line;
    this.currentIdx = 0;
    this.playing = true;
    this.paused = false;
    this.speed = speed;
    if (this._currentAudio) { this._currentAudio.pause(); this._currentAudio = null; }
    TTS.stop();
    updateAudioPlayBtn();

    // Oznámení linky
    renderAudioHighlight(-1);
    const introRate = this.isTurtleMode() ? 1.0 : this.speed;
    try {
      await playAudioFile(`_linka_${line.number}`, introRate);
    } catch {
      const intro = `Linka číslo ${line.number}.`;
      await TTS.speak(intro, introRate).catch(() => {});
    }
    if (this._gen !== gen) return;

    // Čtení zastávek
    for (let i = 0; i < line.stops.length; i++) {
      // Čekej pokud je pozastaveno
      while (this.paused && this._gen === gen) {
        await new Promise(r => setTimeout(r, 100));
      }
      if (this._gen !== gen) return;

      this.currentIdx = i;
      renderAudioHighlight(i);

      const rate = this.isTurtleMode() ? 1.0 : this.speed;
      try {
        await this._playFile(stopToFilename(line.stops[i]), rate);
      } catch {
        await TTS.speak(cleanStopForTTS(line.stops[i]), rate).catch(() => {});
      }
      if (this._gen !== gen) return;

      // Pauza mezi zastávkami
      this._currentAudio = null;
      await new Promise(r => setTimeout(r, this.isTurtleMode() ? 3000 : 300));
      if (this._gen !== gen) return;
    }

    this.playing = false;
    this._currentAudio = null;
    renderAudioHighlight(-1);
    updateAudioPlayBtn();
    onAudioFinished();
  },

  _playFile(filename, speed) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(`audio/${filename}.m4a`);
      audio.playbackRate = Math.min(Math.max(speed, 0.5), 2.0);
      this._currentAudio = audio;
      audio.onended = resolve;
      audio.onerror = reject;
      audio.play().catch(reject);
    });
  },

  stop() {
    this._gen++;     // zruší aktivní loop
    this.playing = false;
    this.paused = false;
    if (this._currentAudio) { this._currentAudio.pause(); this._currentAudio = null; }
    TTS.stop();
    updateAudioPlayBtn();
  },

  togglePause() {
    if (!this.playing) return;
    this.paused = !this.paused;
    if (this._currentAudio) {
      if (this.paused) this._currentAudio.pause();
      else this._currentAudio.play();
    }
    updateAudioPlayBtn();
  },

  setSpeed(spd) {
    this.speed = spd;
    AppState.settings.ttsSpeed = spd;
  }
};

/* ========================================================
   NAVIGACE OBRAZOVEK
======================================================== */

/** Zobrazí zadanou obrazovku, skryje ostatní. */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(`screen-${id}`);
  if (el) {
    el.classList.add('active');
    AppState.screen = id;
    window.scrollTo(0, 0);
  }
}

/* ========================================================
   DOMOVSKÁ OBRAZOVKA
======================================================== */

function initHome() {
  showScreen('home');
}

/* ========================================================
   NASTAVENÍ
======================================================== */

function openSettings() {
  renderSettings();
  showScreen('settings');
}

function renderSettings() {
  const s = AppState.settings;

  // Session length
  document.querySelectorAll('.session-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.val) === s.sessionLength);
  });

  // Typy otázek A
  document.querySelectorAll('.type-toggle[data-section="A"]').forEach(cb => {
    cb.checked = s.enabledTypesA.includes(cb.dataset.type);
  });

  // Typy otázek B
  document.querySelectorAll('.type-toggle[data-section="B"]').forEach(cb => {
    cb.checked = s.enabledTypesB.includes(cb.dataset.type);
  });

  renderVoiceSelector();
}

/** Naplní select hlasů dostupnými českými hlasy. */
function renderVoiceSelector() {
  const select = document.getElementById('voice-select');
  if (!select) return;
  const voices = TTS.czechVoices;

  if (voices.length === 0) {
    select.innerHTML = '<option value="">Žádný český hlas nenalezen</option>';
    select.disabled = true;
    return;
  }

  const currentName = TTS.czechVoice ? TTS.czechVoice.name : '';
  select.innerHTML = voices.map(v => {
    const quality = ['enhanced', 'neural', 'natural', 'premium'];
    const isHQ = quality.some(k => v.name.toLowerCase().includes(k)) || v.localService;
    const label = v.name + (isHQ ? ' ★' : '');
    return `<option value="${v.name}" ${v.name === currentName ? 'selected' : ''}>${label}</option>`;
  }).join('');
  select.disabled = false;
}

function saveSettings() {
  // Session length
  const activeLen = document.querySelector('.session-btn.active');
  if (activeLen) AppState.settings.sessionLength = parseInt(activeLen.dataset.val);

  // Typy A
  AppState.settings.enabledTypesA = [];
  document.querySelectorAll('.type-toggle[data-section="A"]:checked').forEach(cb => {
    AppState.settings.enabledTypesA.push(cb.dataset.type);
  });

  // Typy B
  AppState.settings.enabledTypesB = [];
  document.querySelectorAll('.type-toggle[data-section="B"]:checked').forEach(cb => {
    AppState.settings.enabledTypesB.push(cb.dataset.type);
  });

  // Hlas
  const voiceSelect = document.getElementById('voice-select');
  if (voiceSelect && voiceSelect.value) {
    AppState.settings.selectedVoiceName = voiceSelect.value;
    const chosen = TTS.czechVoices.find(v => v.name === voiceSelect.value);
    if (chosen) TTS.czechVoice = chosen;
  }

  showScreen('home');
}

/* ========================================================
   SEKCE A – ODKUD → KAM
======================================================== */

function openSectionA() {
  renderLineFilterA();
  showScreen('section-a');
}

function renderLineFilterA() {
  const container = document.getElementById('filter-a');
  container.innerHTML = '';
  TRAM_DATA.lines.forEach(line => {
    const btn = document.createElement('button');
    btn.className = 'line-filter-btn' + (AppState.selectedLinesA.includes(line.number) ? ' selected' : '');
    btn.textContent = line.number;
    btn.title = `${line.stops[0]} ↔ ${line.stops[line.stops.length - 1]}`;
    btn.onclick = () => {
      toggleLineSelection(AppState.selectedLinesA, line.number);
      btn.classList.toggle('selected');
    };
    container.appendChild(btn);
  });
}

function startFlashcards() {
  const lines = TRAM_DATA.lines.filter(l => AppState.selectedLinesA.includes(l.number));
  if (lines.length === 0) { alert('Vyber alespoň jednu linku!'); return; }
  renderFlashcards(lines);
  showScreen('flashcards');
}

function startQuizA() {
  const count = AppState.settings.sessionLength;
  const questions = generateSession('A', AppState.selectedLinesA, count, AppState.settings.enabledTypesA);
  if (questions.length === 0) { alert('Nepodařilo se vygenerovat otázky.'); return; }
  AppState.quiz = new QuizState(questions);
  renderQuizQuestion();
  showScreen('quiz');
}

/* Flashkarty */
let flashcardIndex = 0;
let flashcardLines = [];
let flashcardFlipped = false;

function renderFlashcards(lines) {
  flashcardLines = shuffle(lines);
  flashcardIndex = 0;
  flashcardFlipped = false;
  showFlashcard();
}

function showFlashcard() {
  const line = flashcardLines[flashcardIndex];
  const counter = document.getElementById('fc-counter');
  const front = document.getElementById('fc-front-text');
  const back = document.getElementById('fc-back-text');
  const card = document.getElementById('fc-card');

  counter.textContent = `${flashcardIndex + 1} / ${flashcardLines.length}`;
  front.innerHTML = `<span class="fc-line-num">${line.number}</span><svg class="icon fc-flip-icon" aria-hidden="true"><use href="#icon-refresh"/></svg>`;
  back.innerHTML = `
    <div class="fc-line-num">${line.number}</div>
    <div class="fc-route">
      <span class="fc-from">${line.stops[0]}</span>
      <span class="fc-arrow">↔</span>
      <span class="fc-to">${line.stops[line.stops.length - 1]}</span>
    </div>
    <div class="fc-stops-count">${line.stops.length} zastávek</div>
  `;

  // Resetuj otočení
  card.classList.remove('flipped');
  flashcardFlipped = false;
}

function flipFlashcard() {
  const card = document.getElementById('fc-card');
  flashcardFlipped = !flashcardFlipped;
  card.classList.toggle('flipped', flashcardFlipped);
}

function nextFlashcard() {
  if (flashcardIndex < flashcardLines.length - 1) {
    flashcardIndex++;
    showFlashcard();
  } else {
    // Dokončeno
    showScreen('section-a');
  }
}

function prevFlashcard() {
  if (flashcardIndex > 0) {
    flashcardIndex--;
    showFlashcard();
  }
}

/* ========================================================
   SEKCE B – ZASTÁVKY
======================================================== */

function openSectionB() {
  renderLineFilterB();
  showScreen('section-b');
}

function renderLineFilterB() {
  const container = document.getElementById('filter-b');
  container.innerHTML = '';
  TRAM_DATA.lines.forEach(line => {
    const btn = document.createElement('button');
    btn.className = 'line-filter-btn' + (AppState.selectedLinesB.includes(line.number) ? ' selected' : '');
    btn.textContent = line.number;
    btn.title = `${line.stops[0]} ↔ ${line.stops[line.stops.length - 1]}`;
    btn.onclick = () => {
      toggleLineSelection(AppState.selectedLinesB, line.number);
      btn.classList.toggle('selected');
    };
    container.appendChild(btn);
  });
}

function startQuizB() {
  const count = AppState.settings.sessionLength;
  const questions = generateSession('B', AppState.selectedLinesB, count, AppState.settings.enabledTypesB);
  if (questions.length === 0) { alert('Nepodařilo se vygenerovat otázky.'); return; }
  AppState.quiz = new QuizState(questions);
  renderQuizQuestion();
  showScreen('quiz');
}

/* ========================================================
   SEKCE C – PROCVIČ LINKU
======================================================== */

function openSectionC() {
  renderLineButtons();
  showScreen('section-c');
}

function renderLineButtons() {
  const container = document.getElementById('line-buttons');
  container.innerHTML = '';
  TRAM_DATA.lines.forEach(line => {
    const btn = document.createElement('button');
    btn.className = 'line-big-btn';
    btn.innerHTML = `<span class="line-num">${line.number}</span>`;
    btn.onclick = () => selectPracticeLine(line.number);
    container.appendChild(btn);
  });
}

function selectPracticeLine(lineNum) {
  AppState.practiceLineNum = lineNum;
  const line = getLineByNumber(lineNum);
  // Zobraz info o lince
  document.getElementById('practice-line-num').textContent = `Linka ${lineNum}`;
  document.getElementById('practice-line-from').textContent = line.stops[0];
  document.getElementById('practice-line-to').textContent = line.stops[line.stops.length - 1];
  document.getElementById('practice-line-stops').textContent = `${line.stops.length} zastávek`;
  document.getElementById('practice-line-info').style.display = 'block';
  // Označ aktivní
  document.querySelectorAll('.line-big-btn').forEach((btn, i) => {
    btn.classList.toggle('active', TRAM_DATA.lines[i].number === lineNum);
  });
}

function startPracticeMode(mode) {
  if (!AppState.practiceLineNum) { alert('Nejprve vyber linku!'); return; }
  AppState.practiceMode = mode;
  const line = getLineByNumber(AppState.practiceLineNum);

  if (mode === 'audio') {
    startAudio(line);
  } else if (mode === 'quiz') {
    startPracticeQuiz(line);
  }
}

/* ========================================================
   AUDIO PŘEHRÁVAČ
======================================================== */

function startAudio(line) {
  AppState.audio.line = line;
  AppState.audio.speed = AppState.settings.ttsSpeed;

  renderAudioScreen(line);
  showScreen('audio');
  updateAudioPlayBtn();
}

function renderAudioScreen(line) {
  document.getElementById('audio-line-title').textContent = `Linka ${line.number}`;
  document.getElementById('audio-line-route').textContent = `${line.stops[0]} ↔ ${line.stops[line.stops.length - 1]}`;

  const list = document.getElementById('audio-stop-list');
  list.innerHTML = '';
  line.stops.forEach((stop, i) => {
    const li = document.createElement('li');
    li.id = `audio-stop-${i}`;
    li.className = 'audio-stop-item';
    li.innerHTML = `<span class="stop-num">${i + 1}</span><span class="stop-name">${stop}</span>`;
    list.appendChild(li);
  });

  // Speed buttons
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.classList.toggle('active', parseFloat(btn.dataset.speed) === AppState.audio.speed);
  });

  updateAudioProgress(0, line.stops.length);
}

function renderAudioHighlight(idx) {
  document.querySelectorAll('.audio-stop-item').forEach(el => el.classList.remove('current'));
  if (idx >= 0) {
    const el = document.getElementById(`audio-stop-${idx}`);
    if (el) {
      el.classList.add('current');
    }
    updateAudioProgress(idx + 1, AppState.audio.line.stops.length);
  }
}

function updateAudioProgress(current, total) {
  const el = document.getElementById('audio-progress-text');
  if (el) el.textContent = `Zastávka ${current} / ${total}`;
  const bar = document.getElementById('audio-progress-bar');
  if (bar) bar.style.width = `${total > 0 ? (current / total) * 100 : 0}%`;
}

function updateAudioPlayBtn() {
  const btn = document.getElementById('audio-play-btn');
  if (!btn) return;
  if (AudioPlayer.playing && !AudioPlayer.paused) {
    btn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-pause"/></svg> Pozastavit';
    btn.className = 'btn-play playing';
  } else if (AudioPlayer.paused) {
    btn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-play"/></svg> Pokračovat';
    btn.className = 'btn-play paused';
  } else {
    btn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-play"/></svg> Přehrát';
    btn.className = 'btn-play';
  }
}

function onAudioFinished() {
  if (AppState.audio.loop) {
    // Smyčka – krátká pauza a znovu od začátku
    setTimeout(() => {
      AudioPlayer.play(AppState.audio.line, AppState.audio.speed);
    }, 1000);
    return;
  }
  updateAudioPlayBtn();
  const finishedBanner = document.getElementById('audio-finished-banner');
  if (finishedBanner) finishedBanner.style.display = 'block';
}

function toggleAudioLoop() {
  AppState.audio.loop = !AppState.audio.loop;
  const btn = document.getElementById('audio-loop-btn');
  if (btn) btn.classList.toggle('active', AppState.audio.loop);
}

function toggleAudioPlayback() {
  if (!AudioPlayer.playing) {
    document.getElementById('audio-finished-banner').style.display = 'none';
    AudioPlayer.play(AppState.audio.line, AppState.audio.speed);
  } else {
    AudioPlayer.togglePause();
  }
}

function setAudioSpeed(speed) {
  const wasPlaying = AudioPlayer.playing;
  AudioPlayer.stop();
  AudioPlayer.setSpeed(speed);
  AppState.audio.speed = speed;
  document.querySelectorAll('.speed-btn[data-speed]').forEach(btn => {
    btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speed);
  });
  if (wasPlaying) {
    setTimeout(() => AudioPlayer.play(AppState.audio.line, speed), 150);
  }
}

/* ========================================================
   KVÍZ
======================================================== */

function startPracticeQuiz(line) {
  const count = AppState.settings.sessionLength;
  const questions = generateSession('B', [line.number], count, AppState.settings.enabledTypesB);
  if (questions.length === 0) {
    alert('Nepodařilo se vygenerovat otázky pro tuto linku.');
    return;
  }
  AppState.quiz = new QuizState(questions);
  renderQuizQuestion();
  showScreen('quiz');
}

/** Vykreslí aktuální otázku kvízu. */
function renderQuizQuestion() {
  const quiz = AppState.quiz;
  if (!quiz || quiz.isFinished) {
    showResults();
    return;
  }

  const q = quiz.current;
  const container = document.getElementById('quiz-container');
  const counterEl = document.getElementById('quiz-counter');
  const scoreEl = document.getElementById('quiz-score');
  const progressBar = document.getElementById('quiz-progress-bar');
  const streakEl = document.getElementById('quiz-streak');

  counterEl.textContent = `Otázka ${quiz.currentIndex + 1} z ${quiz.total}`;
  scoreEl.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#icon-check"/></svg> ${quiz.score}`;
  streakEl.innerHTML = quiz.streak >= 3 ? `<svg class="icon" aria-hidden="true"><use href="#icon-zap"/></svg> ${quiz.streak}` : '';
  progressBar.style.width = `${quiz.progressPercent}%`;

  container.innerHTML = '';

  // Otázka
  const questionEl = document.createElement('div');
  questionEl.className = 'quiz-question';
  questionEl.textContent = q.question;
  container.appendChild(questionEl);

  // Tlačítko nahlásit chybu
  const reportBtn = document.createElement('button');
  reportBtn.className = 'btn-report-inline';
  reportBtn.id = 'quiz-report-btn';
  reportBtn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-alert"/></svg> Nahlásit chybu v otázce';
  reportBtn.onclick = openReportModal;
  container.appendChild(reportBtn);

  // Možnosti podle typu
  if (q.isOrdering) {
    renderOrderingQuestion(container, q, quiz);
  } else if (q.isMultiSelect) {
    renderMultiSelectQuestion(container, q, quiz);
  } else {
    renderStandardQuestion(container, q, quiz);
  }
}

/** Standardní otázka s 4 možnostmi. */
function renderStandardQuestion(container, q, quiz) {
  const optionsEl = document.createElement('div');
  optionsEl.className = 'quiz-options';

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.textContent = opt;
    btn.onclick = () => {
      if (quiz.answered) return;
      const result = quiz.answer(opt);
      highlightOptions(optionsEl, opt, q.correct, result.isCorrect);
      showExplanation(container, q.explanation, result.isCorrect);
      showNextButton(container);
    };
    optionsEl.appendChild(btn);
  });

  container.appendChild(optionsEl);
}

/** Otázka pro seřazení zastávek. */
function renderOrderingQuestion(container, q, quiz) {
  const orderingDiv = document.createElement('div');
  orderingDiv.className = 'ordering-container';

  const userOrder = [...q.options]; // začínáme s promíchaným pořadím
  quiz.orderingAnswer = [...userOrder];

  const renderList = () => {
    orderingDiv.innerHTML = '<p class="ordering-hint">Klikni na zastávky ve správném pořadí od první po poslední:</p>';
    const selected = [];
    const available = [...userOrder];

    const selectedDiv = document.createElement('div');
    selectedDiv.className = 'ordering-selected';
    selectedDiv.innerHTML = '<div class="ordering-label">Tvoje pořadí:</div>';
    const selectedList = document.createElement('div');
    selectedList.className = 'ordering-slots';
    for (let i = 0; i < q.correct.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'ordering-slot empty';
      slot.dataset.idx = i;
      slot.textContent = `${i + 1}.`;
      selectedList.appendChild(slot);
    }
    selectedDiv.appendChild(selectedList);
    orderingDiv.appendChild(selectedDiv);

    const availableDiv = document.createElement('div');
    availableDiv.className = 'ordering-available';
    availableDiv.innerHTML = '<div class="ordering-label">Dostupné zastávky:</div>';
    const chips = document.createElement('div');
    chips.className = 'ordering-chips';

    let clickOrder = [];

    available.forEach((stop, i) => {
      const chip = document.createElement('button');
      chip.className = 'ordering-chip';
      chip.textContent = stop;
      chip.dataset.stop = stop;
      chip.onclick = () => {
        if (quiz.answered) return;
        if (clickOrder.includes(stop)) return;
        clickOrder.push(stop);
        chip.classList.add('used');
        chip.disabled = true;

        // Vlož do slotu
        const slotIdx = clickOrder.length - 1;
        const slot = selectedList.children[slotIdx];
        if (slot) {
          slot.textContent = `${slotIdx + 1}. ${stop}`;
          slot.classList.remove('empty');
          slot.classList.add('filled');
        }

        // Pokud jsou všechny vybrány, vyhodnoť
        if (clickOrder.length === q.correct.length) {
          const result = quiz.answer(clickOrder);
          // Obarvi sloty
          clickOrder.forEach((s, idx) => {
            const sl = selectedList.children[idx];
            if (sl) {
              sl.classList.add(s === q.correct[idx] ? 'correct' : 'wrong');
            }
          });
          showExplanation(container, q.explanation, result.isCorrect);
          showNextButton(container);
        }
      };
      chips.appendChild(chip);
    });
    availableDiv.appendChild(chips);
    orderingDiv.appendChild(availableDiv);
  };

  renderList();
  container.appendChild(orderingDiv);
}

/** Otázka s více správnými odpověďmi (checkboxy). */
function renderMultiSelectQuestion(container, q, quiz) {
  const msDiv = document.createElement('div');
  msDiv.className = 'multiselect-container';

  const checkboxes = [];
  q.options.forEach(opt => {
    const label = document.createElement('label');
    label.className = 'multiselect-label';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = opt;
    cb.className = 'multiselect-cb';
    label.appendChild(cb);
    label.appendChild(document.createTextNode(` ${opt}`));
    msDiv.appendChild(label);
    checkboxes.push(cb);
  });

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn-primary mt-16';
  confirmBtn.textContent = 'Potvrdit odpověď';
  confirmBtn.onclick = () => {
    if (quiz.answered) return;
    const selected = checkboxes.filter(cb => cb.checked).map(cb => cb.value);
    const result = quiz.answer(selected);
    checkboxes.forEach(cb => {
      const lbl = cb.parentElement;
      const isSelected = cb.checked;
      const isCorrect = Array.isArray(q.correct) && q.correct.includes(cb.value);
      if (isCorrect) lbl.classList.add('correct');
      else if (isSelected) lbl.classList.add('wrong');
    });
    showExplanation(container, q.explanation, result.isCorrect);
    showNextButton(container);
  };

  msDiv.appendChild(confirmBtn);
  container.appendChild(msDiv);
}

/** Zvýrazní správnou/špatnou odpověď. */
function highlightOptions(container, chosen, correct, isCorrect) {
  container.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add('correct');
    else if (btn.textContent === chosen && !isCorrect) btn.classList.add('wrong');
  });

  // Animace na celý kvíz kontejner
  const quizBox = document.getElementById('quiz-container');
  if (quizBox) {
    quizBox.classList.add(isCorrect ? 'flash-correct' : 'flash-wrong');
    setTimeout(() => quizBox.classList.remove('flash-correct', 'flash-wrong'), 700);
  }
}

/** Zobrazí vysvětlení pod otázkou. */
function showExplanation(container, text, isCorrect) {
  const el = document.createElement('div');
  el.className = `quiz-explanation ${isCorrect ? 'correct' : 'wrong'}`;
  const iconId = isCorrect ? 'check-circle' : 'x-circle';
  el.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#icon-${iconId}"/></svg> ${text}`;
  container.appendChild(el);
}

/** Zobrazí tlačítko „Další otázka". */
function showNextButton(container) {
  const btn = document.createElement('button');
  btn.className = 'btn-next';
  btn.innerHTML = AppState.quiz.currentIndex + 1 >= AppState.quiz.total
    ? '<svg class="icon" aria-hidden="true"><use href="#icon-award"/></svg> Zobrazit výsledky'
    : 'Další otázka →';
  btn.onclick = () => {
    AppState.quiz.next();
    renderQuizQuestion();
  };
  container.appendChild(btn);
  btn.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

/* ========================================================
   VÝSLEDKOVÁ OBRAZOVKA
======================================================== */

function showResults() {
  const quiz = AppState.quiz;
  const pct = quiz.total > 0 ? Math.round((quiz.score / quiz.total) * 100) : 0;
  const stars = quiz.stars;

  document.getElementById('result-score').textContent = `${quiz.score} / ${quiz.total}`;
  document.getElementById('result-percent').textContent = `${pct} %`;
  const starSVG = (filled) => `<svg class="icon${filled ? ' icon-star-filled' : ''}" aria-hidden="true"><use href="${filled ? '#icon-star-full' : '#icon-star'}"/></svg>`;
  document.getElementById('result-stars').innerHTML = starSVG(true).repeat(stars) + starSVG(false).repeat(5 - stars);
  document.getElementById('result-correct').innerHTML = `<svg class="icon" aria-hidden="true"><use href="#icon-check-circle"/></svg> Správně: ${quiz.score}`;
  document.getElementById('result-wrong').innerHTML = `<svg class="icon" aria-hidden="true"><use href="#icon-x-circle"/></svg> Špatně: ${quiz.total - quiz.score}`;
  document.getElementById('result-streak').innerHTML = `<svg class="icon" aria-hidden="true"><use href="#icon-zap"/></svg> Nejlepší série: ${quiz.maxStreak}`;

  // Seznam chybných odpovědí
  const wrongList = document.getElementById('result-wrong-list');
  wrongList.innerHTML = '';
  const wrongs = quiz.results.filter(r => !r.isCorrect);
  if (wrongs.length === 0) {
    wrongList.innerHTML = '<p class="all-correct">Všechno správně! Perfektní výkon!</p>';
  } else {
    wrongs.forEach(r => {
      const item = document.createElement('div');
      item.className = 'wrong-item';
      const correctStr = Array.isArray(r.question.correct)
        ? r.question.correct.join(', ')
        : r.question.correct;
      item.innerHTML = `
        <div class="wrong-q">${r.question.question}</div>
        <div class="wrong-ans">Správná odpověď: <strong>${correctStr}</strong></div>
      `;
      wrongList.appendChild(item);
    });
  }

  // ── Gamifikace ──────────────────────────────────────────
  const gam = loadGamState();
  const isPerfect = quiz.score === quiz.total && quiz.total > 0;

  // XP: 10 za každou správnou + 50 bonus za perfektní + streak bonus
  let xpEarned = quiz.score * 10;
  if (isPerfect) xpEarned += 50;
  xpEarned += Math.min(quiz.maxStreak * 2, 20);

  // Statistiky
  gam.stats.totalCorrect += quiz.score;
  gam.stats.totalQuizzes += 1;
  if (isPerfect) gam.stats.perfectQuizzes += 1;
  if (quiz.maxStreak > gam.stats.maxStreak) gam.stats.maxStreak = quiz.maxStreak;

  addXPAndLevel(xpEarned, gam);
  checkAchievements(gam);

  // Zobraz získané XP
  const xpEl = document.getElementById('result-xp-earned');
  if (xpEl) {
    xpEl.textContent = `+${xpEarned} XP získáno!`;
    xpEl.style.display = 'inline-block';
  }

  // Konfety při perfektním kvízu
  if (isPerfect) setTimeout(launchConfetti, 400);
  // ────────────────────────────────────────────────────────

  showScreen('results');
}

function retryQuiz() {
  // Regeneruj stejný typ sezení
  AppState.quiz = new QuizState(shuffle(AppState.quiz.questions));
  AppState.quiz.questions.forEach(q => { /* reset */ });
  // Jednodušeji: generuj nové sezení
  startQuizB(); // fallback – vrátí na sekci B
  showScreen('home');
}

/* ========================================================
   POMOCNÉ FUNKCE UI
======================================================== */

/** Přepíná výběr linky v poli čísel. */
function toggleLineSelection(arr, num) {
  const idx = arr.indexOf(num);
  if (idx >= 0) {
    if (arr.length > 1) arr.splice(idx, 1); // Nech aspoň 1
  } else {
    arr.push(num);
    arr.sort((a, b) => a - b);
  }
}

/** Vybere/odebere všechny linky v filtru. */
function toggleAllLines(arrRef, allNums, containerSelector) {
  const allSelected = allNums.every(n => arrRef.includes(n));
  if (allSelected) {
    // Odeber vše kromě první
    arrRef.length = 0;
    arrRef.push(allNums[0]);
  } else {
    arrRef.length = 0;
    allNums.forEach(n => arrRef.push(n));
  }
  document.querySelectorAll(containerSelector + ' .line-filter-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', arrRef.includes(TRAM_DATA.lines[i].number));
  });
}

/* ========================================================
   GAMIFIKACE
======================================================== */

const LEVELS = [
  { level: 1, name: 'Nováček',          xpRequired: 0     },
  { level: 2, name: 'Cestující',         xpRequired: 500   },
  { level: 3, name: 'Pravidelný host',   xpRequired: 1500  },
  { level: 4, name: 'Znalec MHD',        xpRequired: 3500  },
  { level: 5, name: 'Průvodčí',          xpRequired: 6500  },
  { level: 6, name: 'Řidič tramvaje',    xpRequired: 10500 },
  { level: 7, name: 'Dispečer',          xpRequired: 16000 },
  { level: 8, name: 'Legenda Brna',      xpRequired: 24000 },
];

const ACHIEVEMENTS = [
  { id: 'first_correct', name: 'První správná!',  desc: 'Odpověděla jsi správně poprvé',  icon: '🎯' },
  { id: 'streak_5',      name: 'Série 5!',         desc: '5× správně za sebou',            icon: '🔥' },
  { id: 'streak_10',     name: 'Série 10!',        desc: '10× správně za sebou',           icon: '⚡' },
  { id: 'perfect_quiz',  name: 'Perfektní kvíz!',  desc: '100 % správných odpovědí',       icon: '⭐' },
  { id: 'quizzes_5',     name: 'Vytrvalkyně',      desc: 'Dokončila jsi 5 kvízů',          icon: '💪' },
  { id: 'quizzes_10',    name: 'Maratonka',        desc: 'Dokončila jsi 10 kvízů',         icon: '🏆' },
  { id: 'level_5',       name: 'Průvodčí!',        desc: 'Dosáhla jsi úrovně 5',           icon: '🎖️' },
  { id: 'max_level',     name: 'Legenda Brna!',    desc: 'Dosáhla jsi nejvyšší úrovně',    icon: '👑' },
];

function loadGamState() {
  try {
    const s = localStorage.getItem('salina_gam');
    if (s) return JSON.parse(s);
  } catch(e) {}
  return { xp: 0, level: 1, achievements: [], stats: { totalCorrect: 0, totalQuizzes: 0, perfectQuizzes: 0, maxStreak: 0 } };
}
function saveGamState(g) {
  try { localStorage.setItem('salina_gam', JSON.stringify(g)); } catch(e) {}
}
function getLevelForXP(xp) {
  let cur = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.xpRequired) cur = l; }
  return cur;
}
function updateGamUI() {
  const g = loadGamState();
  const lv = getLevelForXP(g.xp);
  const next = LEVELS.find(l => l.level === lv.level + 1) || null;
  const xpInLv = g.xp - lv.xpRequired;
  const xpNeeded = next ? next.xpRequired - lv.xpRequired : 1;
  const pct = next ? Math.min(100, Math.round((xpInLv / xpNeeded) * 100)) : 100;
  const numEl = document.getElementById('gam-level-num');
  const nameEl = document.getElementById('gam-level-name');
  const fillEl = document.getElementById('gam-xp-fill');
  const textEl = document.getElementById('gam-xp-text');
  if (numEl) numEl.textContent = lv.level;
  if (nameEl) nameEl.textContent = lv.name;
  if (fillEl) fillEl.style.width = pct + '%';
  if (textEl) textEl.textContent = next ? `${xpInLv} / ${xpNeeded} XP` : 'MAX LEVEL!';
}
function addXPAndLevel(amount, g) {
  const oldLv = getLevelForXP(g.xp);
  g.xp += amount;
  const newLv = getLevelForXP(g.xp);
  g.level = newLv.level;
  saveGamState(g);
  updateGamUI();
}
function checkAchievements(g) {
  const unlocked = [];
  ACHIEVEMENTS.forEach(a => {
    if (g.achievements.includes(a.id)) return;
    let earned = false;
    if (a.id === 'first_correct' && g.stats.totalCorrect >= 1)   earned = true;
    if (a.id === 'streak_5'      && g.stats.maxStreak >= 5)      earned = true;
    if (a.id === 'streak_10'     && g.stats.maxStreak >= 10)     earned = true;
    if (a.id === 'perfect_quiz'  && g.stats.perfectQuizzes >= 1) earned = true;
    if (a.id === 'quizzes_5'     && g.stats.totalQuizzes >= 5)   earned = true;
    if (a.id === 'quizzes_10'    && g.stats.totalQuizzes >= 10)  earned = true;
    if (a.id === 'level_5'       && g.level >= 5)                earned = true;
    if (a.id === 'max_level'     && g.level >= 8)                earned = true;
    if (earned) { g.achievements.push(a.id); unlocked.push(a); }
  });
  if (unlocked.length) {
    saveGamState(g);
  }
}
function launchConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  container.innerHTML = '';
  const colors = ['#da2127','#3a71b2','#27ae60','#f39c12','#ffffff','#9b59b6','#FFD100'];
  for (let i = 0; i < 90; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-delay:${Math.random()*1}s;animation-duration:${1.4+Math.random()*1.6}s;width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;border-radius:${Math.random()>0.5?'50%':'3px'};`;
    container.appendChild(p);
  }
  setTimeout(() => { container.innerHTML = ''; }, 3500);
}

/* ========================================================
   INICIALIZACE APLIKACE
======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  TTS.init();
  // Reset XP pokud je level 2 s nízkou hodnotou (přechod na nové prahy)
  try {
    const g = loadGamState();
    if (g.xp > 0 && g.xp < 500) { g.xp = 0; g.level = 1; g.achievements = []; saveGamState(g); }
  } catch(e) {}
  updateGamUI();

  // === Domovská obrazovka ===
  document.getElementById('btn-section-a').addEventListener('click', openSectionA);
  document.getElementById('btn-section-b').addEventListener('click', openSectionB);
  document.getElementById('btn-section-c').addEventListener('click', openSectionC);
  document.getElementById('btn-settings').addEventListener('click', openSettings);

  // === Nastavení ===
  document.getElementById('settings-save').addEventListener('click', saveSettings);
  document.getElementById('voice-test-btn').addEventListener('click', () => {
    const select = document.getElementById('voice-select');
    const chosen = select ? TTS.czechVoices.find(v => v.name === select.value) : null;
    if (chosen) TTS.czechVoice = chosen;
    TTS.speak('Příští zastávka Náměstí Svobody. Přestupní stanice.', 1.0);
  });
  document.getElementById('settings-back').addEventListener('click', () => showScreen('home'));
  document.querySelectorAll('.session-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.session-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // === Sekce A ===
  document.getElementById('a-back').addEventListener('click', () => showScreen('home'));
  document.getElementById('a-start-flashcards').addEventListener('click', startFlashcards);
  document.getElementById('a-start-quiz').addEventListener('click', startQuizA);
  document.getElementById('a-select-all').addEventListener('click', () => {
    toggleAllLines(AppState.selectedLinesA, TRAM_DATA.lines.map(l => l.number), '#filter-a');
  });

  // === Flashkarty ===
  document.getElementById('fc-back').addEventListener('click', () => {
    AudioPlayer.stop();
    showScreen('section-a');
  });
  document.getElementById('fc-card').addEventListener('click', flipFlashcard);
  document.getElementById('fc-prev').addEventListener('click', prevFlashcard);
  document.getElementById('fc-next').addEventListener('click', nextFlashcard);

  // === Sekce B ===
  document.getElementById('b-back').addEventListener('click', () => showScreen('home'));
  document.getElementById('b-start-quiz').addEventListener('click', startQuizB);
  document.getElementById('b-select-all').addEventListener('click', () => {
    toggleAllLines(AppState.selectedLinesB, TRAM_DATA.lines.map(l => l.number), '#filter-b');
  });

  // === Sekce C ===
  document.getElementById('c-back').addEventListener('click', () => showScreen('home'));
  document.getElementById('practice-mode-audio').addEventListener('click', () => startPracticeMode('audio'));
  document.getElementById('practice-mode-quiz').addEventListener('click', () => startPracticeMode('quiz'));

  // === Audio ===
  document.getElementById('audio-back').addEventListener('click', () => {
    AudioPlayer.stop();
    AppState.audio.loop = false;
    const loopBtn = document.getElementById('audio-loop-btn');
    if (loopBtn) loopBtn.classList.remove('active');
    showScreen('section-c');
  });
  document.getElementById('audio-play-btn').addEventListener('click', toggleAudioPlayback);
  document.getElementById('audio-loop-btn').addEventListener('click', toggleAudioLoop);
  document.getElementById('audio-restart-btn').addEventListener('click', () => {
    AudioPlayer.stop();
    setTimeout(() => {
      document.getElementById('audio-finished-banner').style.display = 'none';
      AudioPlayer.play(AppState.audio.line, AppState.audio.speed);
      updateAudioPlayBtn();
    }, 300);
  });
  document.querySelectorAll('.speed-btn[data-speed]').forEach(btn => {
    btn.addEventListener('click', () => setAudioSpeed(parseFloat(btn.dataset.speed)));
  });

  // === Kvíz ===
  document.getElementById('quiz-back').addEventListener('click', () => {
    AudioPlayer.stop();
    showScreen('home');
  });

  // === Výsledky ===
  document.getElementById('result-retry').addEventListener('click', () => {
    // Zpět na domov, uživatel si vybere znovu
    showScreen('home');
  });
  document.getElementById('result-home').addEventListener('click', () => showScreen('home'));

  // === Nahlásit chybu ===
  document.getElementById('quiz-container').addEventListener('click', e => {
    if (e.target.id === 'quiz-report-btn') openReportModal();
  });
  document.getElementById('report-modal-close').addEventListener('click', closeReportModal);
  document.getElementById('report-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeReportModal();
  });
  document.getElementById('report-send-btn').addEventListener('click', sendReport);
  document.querySelectorAll('.report-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.report-cat').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Inicializuj domovskou obrazovku
  showScreen('home');
});

/* ========================================================
   NAHLÁSIT CHYBU – MODAL + FORMSPREE
======================================================== */

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mojkozzn';

function openReportModal() {
  const q = AppState.quiz && AppState.quiz.current;
  const preview = document.getElementById('report-question-preview');
  preview.textContent = q ? q.question : '(otázka není k dispozici)';

  // Reset formuláře
  document.querySelectorAll('.report-cat').forEach(b => b.classList.remove('selected'));
  document.getElementById('report-desc').value = '';
  const status = document.getElementById('report-status');
  status.style.display = 'none';
  status.className = 'report-status';
  document.getElementById('report-send-btn').disabled = false;
  document.getElementById('report-send-btn').innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-send"/></svg> Odeslat hlášení';

  document.getElementById('report-modal').style.display = 'flex';
}

function closeReportModal() {
  document.getElementById('report-modal').style.display = 'none';
}

async function sendReport() {
  const q = AppState.quiz && AppState.quiz.current;
  const category = document.querySelector('.report-cat.selected')?.dataset.cat;
  const desc = document.getElementById('report-desc').value.trim();
  const status = document.getElementById('report-status');
  const sendBtn = document.getElementById('report-send-btn');

  if (!category) {
    status.textContent = 'Vyber prosím typ problému.';
    status.className = 'report-status error';
    status.style.display = 'block';
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = 'Odesílám...';
  status.style.display = 'none';

  const payload = {
    kategorie: category,
    otazka: q ? q.question : '(neznámá)',
    spravna_odpoved: q ? (Array.isArray(q.correct) ? q.correct.join(', ') : q.correct) : '(neznámá)',
    popis: desc || '(bez popisu)',
    linka: AppState.practiceLineNum ? `Linka ${AppState.practiceLineNum}` : 'mix',
    cas: new Date().toLocaleString('cs-CZ')
  };

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      status.textContent = 'Hlášení odesláno, díky!';
      status.className = 'report-status success';
      status.style.display = 'block';
      sendBtn.textContent = 'Odesláno';
      setTimeout(closeReportModal, 2000);
    } else {
      throw new Error('server error');
    }
  } catch {
    status.textContent = 'Odeslání se nezdařilo. Zkus to znovu.';
    status.className = 'report-status error';
    status.style.display = 'block';
    sendBtn.disabled = false;
    sendBtn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-send"/></svg> Odeslat hlášení';
  }
}
