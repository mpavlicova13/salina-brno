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
  totalAnswered: 0,

  // Ze které sekce byl kvíz spuštěn (pro správný návrat)
  quizSource: 'home',

  // Aktivní tab na home screenu
  activeTab: 'home'
};

/* ========================================================
   NAVIGAČNÍ HISTORIE
======================================================== */
const NavHistory = {
  _stack: [],
  push(screenId, tabId) {
    this._stack.push({ screen: screenId, tab: tabId || null });
    if (this._stack.length > 50) this._stack.shift();
  },
  pop() {
    return this._stack.pop() || null;
  }
};

/* ========================================================
   TTS – TEXT TO SPEECH
======================================================== */

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
   BACKGROUND AUDIO KEEPALIVE + MEDIA SESSION
======================================================== */

/**
 * Vygeneruje blob s tichým WAV souborem (3 sekundy, 8kHz mono).
 * Slouží jako keepalive — iOS nezabíjí nativní <audio> element při zamčení.
 */
function createSilentWavBlob() {
  const sampleRate = 8000;
  const numSamples = sampleRate * 3; // 3 sekundy
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const v = new DataView(buffer);
  const str = (off, s) => { for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i)); };
  str(0,  'RIFF'); v.setUint32(4,  36 + numSamples * 2, true);
  str(8,  'WAVE'); str(12, 'fmt '); v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sampleRate, true); v.setUint32(28, sampleRate * 2, true);
  v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, 'data'); v.setUint32(40, numSamples * 2, true);
  // vzorky jsou 0 = ticho
  return new Blob([buffer], { type: 'audio/wav' });
}

const BackgroundAudio = {
  _audioEl: null,
  _blobUrl: null,
  _timer: null,

  start(line) {
    this.stop();

    // Nativní <audio> ve smyčce — iOS ho nezastaví při zamčení obrazovky.
    // AudioContext empty buffery iOS při zamčení zabíjí, proto je nepoužíváme.
    if (!this._blobUrl) {
      this._blobUrl = URL.createObjectURL(createSilentWavBlob());
    }
    this._audioEl = new Audio(this._blobUrl);
    this._audioEl.loop = true;
    this._audioEl.volume = 0.001; // téměř neslyšitelné, ale ne 0 (iOS muted session může zabít)
    this._audioEl.play().catch(() => {});

    // Záloha: speechSynthesis se po ~5 s v pozadí může pozastavit — krátký nudge
    this._timer = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 5000);

    // MediaSession — zobrazí ovládání na zamčené obrazovce
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: line ? `Linka ${line.number}` : 'Šalina Brno',
        artist: line ? `${line.stops[0]} ↔ ${line.stops[line.stops.length - 1]}` : 'Procvičování zastávek',
        album: 'DPMB Brno'
      });
      navigator.mediaSession.playbackState = 'playing';
      navigator.mediaSession.setActionHandler('play',  () => { if (AudioPlayer.paused)  AudioPlayer.togglePause(); });
      navigator.mediaSession.setActionHandler('pause', () => { if (!AudioPlayer.paused) AudioPlayer.togglePause(); });
      navigator.mediaSession.setActionHandler('stop',  () => AudioPlayer.stop());
    }
  },

  stop() {
    if (this._timer)   { clearInterval(this._timer); this._timer = null; }
    if (this._audioEl) { this._audioEl.pause(); this._audioEl = null; }
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'none';
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
  _gen: 0,

  isTurtleMode() { return this.speed <= 0.5; },

  async play(line, speed = 1.0) {
    this._gen++;
    const gen = this._gen;

    this.currentLine = line;
    this.currentIdx = 0;
    this.playing = true;
    this.paused = false;
    this.speed = speed;
    TTS.stop();
    BackgroundAudio.start(line);
    updateAudioPlayBtn();

    // Oznámení linky
    renderAudioHighlight(-1);
    const introRate = this.isTurtleMode() ? 1.0 : this.speed;
    await TTS.speak(`Linka číslo ${line.number}.`, introRate).catch(() => {});
    if (this._gen !== gen) return;

    // Čtení zastávek
    for (let i = 0; i < line.stops.length; i++) {
      while (this.paused && this._gen === gen) {
        await new Promise(r => setTimeout(r, 100));
      }
      if (this._gen !== gen) return;

      this.currentIdx = i;
      renderAudioHighlight(i);

      const rate = this.isTurtleMode() ? 1.0 : this.speed;
      await TTS.speak(cleanStopForTTS(line.stops[i]), rate).catch(() => {});
      if (this._gen !== gen) return;

      await new Promise(r => setTimeout(r, this.isTurtleMode() ? 3000 : 300));
      if (this._gen !== gen) return;
    }

    this.playing = false;
    BackgroundAudio.stop();
    renderAudioHighlight(-1);
    updateAudioPlayBtn();
    onAudioFinished();
  },

  stop() {
    this._gen++;
    this.playing = false;
    this.paused = false;
    TTS.stop();
    BackgroundAudio.stop();
    updateAudioPlayBtn();
  },

  togglePause() {
    if (!this.playing) return;
    this.paused = !this.paused;
    TTS.pauseResume();
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
function showScreen(id, skipHistory = false) {
  if (!skipHistory && AppState.screen && AppState.screen !== id) {
    NavHistory.push(AppState.screen, AppState.screen === 'home' ? AppState.activeTab : null);
  }
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(`screen-${id}`);
  if (el) {
    el.classList.add('active');
    AppState.screen = id;
    window.scrollTo(0, 0);
  }
  const nav = document.getElementById('bottom-nav');
  if (nav) nav.style.display = (id === 'home' || id === 'settings') ? 'flex' : 'none';
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
  const allNums = TRAM_DATA.lines.map(l => l.number);
  const allSelected = allNums.every(n => AppState.selectedLinesA.includes(n));
  const selectAll = document.createElement('button');
  selectAll.className = 'line-filter-select-all' + (allSelected ? ' selected' : '');
  selectAll.innerHTML = `${allSelected ? '☑' : '☐'} Vybrat vše`;
  selectAll.onclick = () => {
    AppState.selectedLinesA = allSelected ? [allNums[0]] : [...allNums];
    renderLineFilterA();
  };
  container.appendChild(selectAll);
  TRAM_DATA.lines.forEach(line => {
    const active = AppState.selectedLinesA.includes(line.number);
    const btn = document.createElement('button');
    btn.className = 'line-big-btn' + (active ? ' filter-active' : '');
    btn.innerHTML = `<span class="line-num">${line.number}</span>`;
    btn.onclick = () => {
      toggleLineSelection(AppState.selectedLinesA, line.number);
      renderLineFilterA();
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
  AppState.lastQuizQuestions = questions;
  AppState.quizSource = 'section-a';
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
  const allNums = TRAM_DATA.lines.map(l => l.number);
  const allSelected = allNums.every(n => AppState.selectedLinesB.includes(n));
  const selectAll = document.createElement('button');
  selectAll.className = 'line-filter-select-all' + (allSelected ? ' selected' : '');
  selectAll.innerHTML = `${allSelected ? '☑' : '☐'} Vybrat vše`;
  selectAll.onclick = () => {
    AppState.selectedLinesB = allSelected ? [allNums[0]] : [...allNums];
    renderLineFilterB();
  };
  container.appendChild(selectAll);
  TRAM_DATA.lines.forEach(line => {
    const active = AppState.selectedLinesB.includes(line.number);
    const btn = document.createElement('button');
    btn.className = 'line-big-btn' + (active ? ' filter-active' : '');
    btn.innerHTML = `<span class="line-num">${line.number}</span>`;
    btn.onclick = () => {
      toggleLineSelection(AppState.selectedLinesB, line.number);
      renderLineFilterB();
    };
    container.appendChild(btn);
  });
}

function startQuizB() {
  const count = AppState.settings.sessionLength;
  const questions = generateSession('B', AppState.selectedLinesB, count, AppState.settings.enabledTypesB);
  if (questions.length === 0) { alert('Nepodařilo se vygenerovat otázky.'); return; }
  AppState.quiz = new QuizState(questions);
  AppState.lastQuizQuestions = questions;
  AppState.quizSource = 'section-b';
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

/* ========================================================
   SEKCE D – DOPRAVNÍ UZLY
======================================================== */

const HubState = {
  selectedHubs: [],   // [] = nic nevybráno
  activeTypes: []     // [] = nic nevybráno
};

function openSectionD() {
  HubState.selectedHubs = [];
  HubState.activeTypes = [];
  document.querySelectorAll('.hub-type-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('d-select-all').textContent = 'Vybrat vše';
  renderHubButtons();
  updateHubQuizBtn();
  showScreen('section-d');
}

function renderHubButtons() {
  const container = document.getElementById('hub-buttons');
  container.innerHTML = '';
  const allSelected = HubState.selectedHubs.length === HUB_DATA.length;
  const selectAll = document.createElement('button');
  selectAll.className = 'hub-node-btn' + (allSelected ? ' active' : '');
  selectAll.innerHTML = `<span class="hub-node-check">${allSelected ? '☑' : '☐'}</span>Vybrat vše`;
  selectAll.onclick = () => {
    HubState.selectedHubs = allSelected ? [] : HUB_DATA.map(h => h.name);
    renderHubButtons();
    updateHubQuizBtn();
  };
  container.appendChild(selectAll);
  HUB_DATA.forEach(hub => {
    const btn = document.createElement('button');
    const active = HubState.selectedHubs.includes(hub.name);
    btn.className = 'hub-node-btn' + (active ? ' active' : '');
    btn.innerHTML = `<span class="hub-node-check">${active ? '☑' : '☐'}</span>${hub.name}`;
    btn.onclick = () => {
      if (HubState.selectedHubs.includes(hub.name)) {
        HubState.selectedHubs = HubState.selectedHubs.filter(n => n !== hub.name);
      } else {
        HubState.selectedHubs.push(hub.name);
      }
      renderHubButtons();
      updateHubQuizBtn();
    };
    container.appendChild(btn);
  });
  updateNodeSummary();
}

function updateHubQuizBtn() {
  const btn = document.getElementById('d-start-quiz');
  const hint = document.getElementById('hub-start-hint');
  const ok = HubState.selectedHubs.length > 0 && HubState.activeTypes.length > 0;
  btn.disabled = !ok;
  btn.style.opacity = ok ? '1' : '0.4';
  if (hint) hint.style.display = ok ? 'none' : 'block';
  updateTypeSummary();
}

const TYPE_LABELS = { tramvaje: 'Tramvaje', trolejbusy: 'Trolejbusy', autobusy: 'Autobusy' };

function updateTypeSummary() {
  const el = document.getElementById('hub-type-summary');
  if (!el) return;
  if (HubState.activeTypes.length === 0) {
    el.textContent = 'Nic nevybráno';
    el.className = 'hub-selection-summary empty';
  } else {
    el.textContent = 'Vybráno: ' + HubState.activeTypes.map(t => TYPE_LABELS[t]).join(', ');
    el.className = 'hub-selection-summary';
  }
}

function updateNodeSummary() {
  const el = document.getElementById('hub-node-summary');
  if (!el) return;
  const n = HubState.selectedHubs.length;
  if (n === 0) {
    el.textContent = 'Nic nevybráno';
    el.className = 'hub-selection-summary empty';
  } else {
    el.textContent = `Vybráno: ${n} ${n === 1 ? 'uzel' : n < 5 ? 'uzly' : 'uzlů'}`;
    el.className = 'hub-selection-summary';
  }
}

function startHubQuiz() {
  const types = HubState.activeTypes;
  if (HubState.selectedHubs.length === 0 || types.length === 0) return;
  const count = AppState.settings.sessionLength;
  const questions = generateHubSession(HubState.selectedHubs, types, count);
  if (questions.length === 0) { alert('Nepodařilo se vygenerovat otázky.'); return; }
  AppState.quiz = new QuizState(questions);
  AppState.lastQuizQuestions = questions;
  AppState.quizSource = 'section-d';
  renderQuizQuestion();
  showScreen('quiz');
}

function renderLineButtons() {
  const container = document.getElementById('line-buttons');
  container.innerHTML = '';
  TRAM_DATA.lines.forEach(line => {
    const active = AppState.practiceLineNum === line.number;
    const btn = document.createElement('button');
    btn.className = 'line-big-btn' + (active ? ' filter-active' : '');
    btn.innerHTML = `<span class="line-num">${line.number}</span>`;
    btn.onclick = () => selectPracticeLine(line.number);
    container.appendChild(btn);
  });
}

function selectPracticeLine(lineNum) {
  AppState.practiceLineNum = lineNum;
  const line = getLineByNumber(lineNum);
  document.getElementById('practice-line-num').textContent = `Linka ${lineNum}`;
  document.getElementById('practice-line-from').textContent = line.stops[0];
  document.getElementById('practice-line-to').textContent = line.stops[line.stops.length - 1];
  document.getElementById('practice-line-stops').textContent = `${line.stops.length} zastávek`;
  document.getElementById('practice-line-info').style.display = 'block';
  renderLineButtons();
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
  AppState.lastQuizQuestions = questions;
  AppState.quizSource = 'section-c';
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
  scoreEl.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#icon-check"/></svg> ${quiz.score}/${quiz.total}`;
  streakEl.innerHTML = quiz.streak >= 3 ? `<svg class="icon" aria-hidden="true"><use href="#icon-zap"/></svg> ${quiz.streak}` : '';
  progressBar.style.width = `${quiz.progressPercent}%`;

  container.innerHTML = '';

  // SVG obrázek značky (pouze pro kvíz o značkách)
  if (q.svgContent) {
    const svgWrap = document.createElement('div');
    svgWrap.className = 'quiz-sign-display';
    svgWrap.innerHTML = q.svgContent;
    container.appendChild(svgWrap);
  }

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

  // Pořadí zastávek – začínáme s promíchaným pořadím
  const order = [...q.options];
  let dragSrcIdx = null;

  const hint = document.createElement('p');
  hint.className = 'ordering-hint';
  hint.textContent = '↕ Přetáhni zastávky do správného pořadí, pak potvrď.';
  orderingDiv.appendChild(hint);

  const list = document.createElement('div');
  list.className = 'ordering-dnd-list';
  orderingDiv.appendChild(list);

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn-primary ordering-confirm';
  confirmBtn.textContent = 'Potvrdit pořadí';
  orderingDiv.appendChild(confirmBtn);

  const renderItems = () => {
    list.innerHTML = '';
    order.forEach((stop, i) => {
      const item = document.createElement('div');
      item.className = 'ordering-dnd-item';
      item.draggable = true;
      item.dataset.idx = i;
      item.innerHTML = `<span class="dnd-handle">☰</span><span class="dnd-num">${i + 1}.</span><span class="dnd-stop">${stop}</span>`;

      // ── Desktop drag ──
      item.addEventListener('dragstart', e => {
        dragSrcIdx = i;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        list.querySelectorAll('.ordering-dnd-item').forEach(el => el.classList.remove('drag-over'));
      });
      item.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        list.querySelectorAll('.ordering-dnd-item').forEach(el => el.classList.remove('drag-over'));
        item.classList.add('drag-over');
      });
      item.addEventListener('drop', e => {
        e.preventDefault();
        if (dragSrcIdx === null || dragSrcIdx === i) return;
        const moved = order.splice(dragSrcIdx, 1)[0];
        order.splice(i, 0, moved);
        dragSrcIdx = null;
        renderItems();
      });

      // ── Touch drag ──
      let touchStartY = 0;
      item.addEventListener('touchstart', e => {
        dragSrcIdx = i;
        touchStartY = e.touches[0].clientY;
        item.classList.add('dragging');
      }, { passive: true });
      item.addEventListener('touchmove', e => {
        e.preventDefault();
        const y = e.touches[0].clientY;
        const items = [...list.querySelectorAll('.ordering-dnd-item')];
        items.forEach(el => el.classList.remove('drag-over'));
        // Najdi položku pod prstem
        const target = items.find(el => {
          const r = el.getBoundingClientRect();
          return y >= r.top && y <= r.bottom;
        });
        if (target && target !== item) target.classList.add('drag-over');
      }, { passive: false });
      item.addEventListener('touchend', e => {
        item.classList.remove('dragging');
        const y = e.changedTouches[0].clientY;
        const items = [...list.querySelectorAll('.ordering-dnd-item')];
        items.forEach(el => el.classList.remove('drag-over'));
        const target = items.find(el => {
          const r = el.getBoundingClientRect();
          return y >= r.top && y <= r.bottom;
        });
        if (target) {
          const targetIdx = parseInt(target.dataset.idx);
          if (targetIdx !== dragSrcIdx) {
            const moved = order.splice(dragSrcIdx, 1)[0];
            order.splice(targetIdx, 0, moved);
            renderItems();
          }
        }
        dragSrcIdx = null;
      });

      list.appendChild(item);
    });
  };

  confirmBtn.onclick = () => {
    if (quiz.answered) return;
    const result = quiz.answer([...order]);
    // Obarvi položky
    list.querySelectorAll('.ordering-dnd-item').forEach((item, idx) => {
      item.draggable = false;
      item.classList.add(order[idx] === q.correct[idx] ? 'correct' : 'wrong');
    });
    confirmBtn.remove();
    showExplanation(container, q.explanation, result.isCorrect);
    showNextButton(container);
  };

  renderItems();
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
    confirmBtn.remove();
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

  // Statistiky
  gam.stats.totalCorrect += quiz.score;
  gam.stats.totalQuizzes += 1;
  if (isPerfect) gam.stats.perfectQuizzes += 1;
  if (quiz.maxStreak > gam.stats.maxStreak) gam.stats.maxStreak = quiz.maxStreak;

  // Per-linka statistiky
  if (!gam.stats.lineStats) gam.stats.lineStats = {};
  quiz.results.forEach(r => {
    const ln = r.question.line;
    if (!ln) return;
    const key = String(ln);
    if (!gam.stats.lineStats[key]) gam.stats.lineStats[key] = { correct: 0, total: 0 };
    gam.stats.lineStats[key].total += 1;
    if (r.isCorrect) gam.stats.lineStats[key].correct += 1;
  });

  saveGamState(gam);
  checkAchievements(gam);

  // Konfety při perfektním kvízu
  if (isPerfect) setTimeout(launchConfetti, 400);
  // ────────────────────────────────────────────────────────

  updateGamUI();
  showScreen('results');
}

function retryQuiz() {
  if (AppState.lastQuizQuestions) {
    AppState.quiz = new QuizState([...AppState.lastQuizQuestions]);
    renderQuizQuestion();
    showScreen('quiz');
  } else {
    showScreen('home');
  }
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
function toggleAllLines(arrRef, allNums, containerSelector, btnId) {
  const allSelected = allNums.every(n => arrRef.includes(n));
  if (allSelected) {
    arrRef.length = 0;
    arrRef.push(allNums[0]);
  } else {
    arrRef.length = 0;
    allNums.forEach(n => arrRef.push(n));
  }
  document.querySelectorAll(containerSelector + ' .line-filter-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', arrRef.includes(TRAM_DATA.lines[i].number));
  });
  if (btnId) {
    const btn = document.getElementById(btnId);
    if (btn) btn.textContent = allNums.every(n => arrRef.includes(n)) ? 'Zrušit výběr' : 'Vybrat vše';
  }
}

/* ========================================================
   GAMIFIKACE
======================================================== */

const ACHIEVEMENTS = [
  { id: 'first_correct', name: 'První správná!',  desc: 'Odpověděla jsi správně poprvé',  icon: '🎯' },
  { id: 'streak_5',      name: 'Série 5!',         desc: '5× správně za sebou',            icon: '🔥' },
  { id: 'streak_10',     name: 'Série 10!',        desc: '10× správně za sebou',           icon: '⚡' },
  { id: 'perfect_quiz',  name: 'Perfektní kvíz!',  desc: '100 % správných odpovědí',       icon: '⭐' },
  { id: 'quizzes_5',     name: 'Vytrvalkyně',      desc: 'Dokončila jsi 5 kvízů',          icon: '💪' },
  { id: 'quizzes_10',    name: 'Maratonka',        desc: 'Dokončila jsi 10 kvízů',         icon: '🏆' },
];

const AVATARS = [
  '🚋','🚌','🚃','🚂','🏙️',
  '⭐','🌟','🎯','🏆','🥇',
  '🦊','🐱','🐶','🦁','🐸',
  '🐧','🦄','🌈','🎨','🎪',
  '👩','👨','👧','👦','🧑',
];

function loadProfiles() {
  try { const s = localStorage.getItem('salina_profiles'); if (s) return JSON.parse(s); } catch(e) {}
  return { current: null, list: [] };
}
function saveProfiles(data) {
  try { localStorage.setItem('salina_profiles', JSON.stringify(data)); } catch(e) {}
}
function getCurrentProfile() {
  const data = loadProfiles();
  if (!data.current) return null;
  return data.list.find(p => p.id === data.current) || null;
}
function createProfile(name, avatar) {
  const data = loadProfiles();
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const profile = { id, name: name.trim(), avatar, gam: { achievements: [], stats: { totalCorrect: 0, totalQuizzes: 0, perfectQuizzes: 0, maxStreak: 0 } } };
  data.list.push(profile);
  data.current = id;
  saveProfiles(data);
  return profile;
}
function switchToProfile(id) {
  const data = loadProfiles();
  data.current = id;
  saveProfiles(data);
}
function renderProfilesScreen() {
  const data = loadProfiles();
  const grid = document.getElementById('profiles-grid');
  if (!grid) return;
  grid.innerHTML = '';
  data.list.forEach(profile => {
    const card = document.createElement('button');
    card.className = 'profile-card' + (profile.id === data.current ? ' profile-card-active' : '');
    card.innerHTML = `<span class="profile-card-avatar">${profile.avatar}</span><span class="profile-card-name">${profile.name}</span>`;
    card.onclick = () => { switchToProfile(profile.id); updateGamUI(); showScreen('home'); };
    grid.appendChild(card);
  });
  const addCard = document.createElement('button');
  addCard.className = 'profile-card profile-card-add';
  addCard.innerHTML = '<span class="profile-card-plus">+</span><span>Nový hráč</span>';
  addCard.onclick = showProfileCreateForm;
  grid.appendChild(addCard);
}
function showProfileCreateForm() {
  const form = document.getElementById('profile-create-form');
  if (!form) return;
  form.style.display = 'block';
  document.getElementById('profiles-grid').style.display = 'none';
  document.getElementById('profile-name-input').value = '';
  const picker = document.getElementById('avatar-picker');
  picker.innerHTML = '';
  let selectedAvatar = AVATARS[0];
  AVATARS.forEach(emoji => {
    const btn = document.createElement('button');
    btn.className = 'avatar-option';
    btn.textContent = emoji;
    btn.onclick = () => { picker.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); selectedAvatar = emoji; };
    picker.appendChild(btn);
  });
  picker.querySelector('.avatar-option').classList.add('selected');
  document.getElementById('btn-confirm-profile').onclick = () => {
    const name = document.getElementById('profile-name-input').value.trim();
    if (!name) { document.getElementById('profile-name-input').focus(); return; }
    createProfile(name, selectedAvatar);
    updateGamUI();
    form.style.display = 'none';
    showScreen('home');
  };
  document.getElementById('btn-cancel-profile').onclick = () => {
    form.style.display = 'none';
    document.getElementById('profiles-grid').style.display = 'grid';
  };
}
function showProfileModal() {
  const overlay = document.getElementById('profile-modal-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.getElementById('modal-profile-name').value = '';
  const picker = document.getElementById('modal-avatar-picker');
  picker.innerHTML = '';
  let selectedAvatar = AVATARS[0];
  AVATARS.forEach(emoji => {
    const btn = document.createElement('button');
    btn.className = 'avatar-option';
    btn.textContent = emoji;
    btn.onclick = () => { picker.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); selectedAvatar = emoji; };
    picker.appendChild(btn);
  });
  picker.querySelector('.avatar-option').classList.add('selected');
  document.getElementById('btn-modal-confirm').onclick = () => {
    const name = document.getElementById('modal-profile-name').value.trim();
    if (!name) { document.getElementById('modal-profile-name').focus(); return; }
    createProfile(name, selectedAvatar);
    updateGamUI();
    overlay.style.display = 'none';
  };
}

function loadGamState() {
  const p = getCurrentProfile();
  if (p) return p.gam;
  return { achievements: [], stats: { totalCorrect: 0, totalQuizzes: 0, perfectQuizzes: 0, maxStreak: 0 } };
}
function saveGamState(g) {
  const data = loadProfiles();
  const p = data.list.find(p => p.id === data.current);
  if (p) { p.gam = g; saveProfiles(data); }
}
function updateGamUI() {
  const panel = document.getElementById('panel-profile');
  if (panel && panel.classList.contains('active')) renderProfileTab();
}
function renderProfileTab() {
  const profile = getCurrentProfile();
  if (!profile) return;
  const setText = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  setText('profile-tab-avatar', profile.avatar);
  setText('profile-tab-name', profile.name);
}
function switchHomeTab(tab) {
  AppState.activeTab = tab;
  ['home', 'stats', 'profile'].forEach(t => {
    const panel = document.getElementById('panel-' + t);
    const btn = document.getElementById('tab-btn-' + t);
    if (panel) panel.classList.toggle('active', t === tab);
    if (btn) btn.classList.toggle('active', t === tab);
  });
  document.getElementById('tab-btn-settings').classList.remove('active');
  if (tab === 'stats') renderStatsScreen();
  if (tab === 'profile') renderProfileTab();
}

function goBack() {
  const prev = NavHistory.pop();
  if (!prev) { showScreen('home', true); switchHomeTab('home'); return; }
  if (prev.screen === 'home') {
    showScreen('home', true);
    switchHomeTab(prev.tab || 'home');
  } else {
    showScreen(prev.screen, true);
  }
}
function renderStatsScreen() {
  const g = loadGamState();
  const profile = getCurrentProfile();
  if (profile) {
    document.getElementById('stats-avatar').textContent = profile.avatar;
    document.getElementById('stats-name').textContent = profile.name;
  }
  document.getElementById('stats-correct').textContent = g.stats.totalCorrect;
  document.getElementById('stats-quizzes').textContent = g.stats.totalQuizzes;
  document.getElementById('stats-perfect').textContent = g.stats.perfectQuizzes;
  document.getElementById('stats-streak').textContent = g.stats.maxStreak;

  // Per-linka výkon
  const lineEl = document.getElementById('stats-line-performance');
  if (lineEl) {
    const ls = g.stats.lineStats || {};
    const entries = Object.entries(ls)
      .filter(([, v]) => v.total >= 3)
      .map(([k, v]) => ({ line: k, pct: Math.round(v.correct / v.total * 100), correct: v.correct, total: v.total }))
      .sort((a, b) => a.line - b.line);

    if (entries.length === 0) {
      lineEl.innerHTML = '<p class="stats-empty">Zatím žádná data – udělej pár kvízů!</p>';
    } else {
      lineEl.innerHTML = entries.map(e => {
        const color = e.pct >= 80 ? 'var(--green)' : e.pct >= 50 ? 'var(--orange,#f59e0b)' : 'var(--red)';
        return `<div class="line-stat-row">
          <span class="line-stat-badge" style="background:${color}">🚋 ${e.line}</span>
          <div class="line-stat-bar-wrap">
            <div class="line-stat-bar" style="width:${e.pct}%;background:${color}"></div>
          </div>
          <span class="line-stat-pct">${e.pct}%</span>
          <span class="line-stat-count">${e.correct}/${e.total}</span>
        </div>`;
      }).join('');
    }
  }

  const achEl = document.getElementById('stats-achievements');
  achEl.innerHTML = '';
  ACHIEVEMENTS.forEach(a => {
    const unlocked = g.achievements.includes(a.id);
    const item = document.createElement('div');
    item.className = 'achievement-item' + (unlocked ? ' achievement-unlocked' : ' achievement-locked');
    const lockHint = unlocked ? '' : `<span class="ach-unlock-hint">K odemčení: ${a.desc}</span>`;
    item.innerHTML = `<span class="ach-icon">${a.icon}</span><div class="ach-info"><strong>${a.name}</strong>${unlocked ? `<span>${a.desc}</span>` : lockHint}</div>${unlocked ? '<span class="ach-check">✓</span>' : '<span class="ach-lock">🔒</span>'}`;
    achEl.appendChild(item);
  });
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

// Při odemknutí telefonu/návratu z pozadí obnoví přehrávání
document.addEventListener('visibilitychange', () => {
  if (document.hidden) return;
  if (AudioPlayer.playing && !AudioPlayer.paused) {
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  TTS.init();

  // Profil flow
  const profileData = loadProfiles();
  if (profileData.list.length === 0) {
    showScreen('home');
    showProfileModal();
  } else if (!profileData.current || !profileData.list.find(p => p.id === profileData.current)) {
    showScreen('profiles');
    renderProfilesScreen();
  } else {
    updateGamUI();
    showScreen('home');
  }

  document.getElementById('tab-btn-home').addEventListener('click', () => { showScreen('home'); switchHomeTab('home'); });
  document.getElementById('tab-btn-stats').addEventListener('click', () => { showScreen('home'); switchHomeTab('stats'); });
  document.getElementById('tab-btn-profile').addEventListener('click', () => { showScreen('home'); switchHomeTab('profile'); });
  document.getElementById('tab-btn-settings').addEventListener('click', () => {
    ['home','stats','profile'].forEach(t => document.getElementById('tab-btn-' + t)?.classList.remove('active'));
    document.getElementById('tab-btn-settings').classList.add('active');
    showScreen('settings');
  });
  document.getElementById('stats-switch-btn').addEventListener('click', () => { renderProfilesScreen(); showScreen('profiles'); });
  document.getElementById('profile-tab-switch-btn').addEventListener('click', () => { renderProfilesScreen(); showScreen('profiles'); });
  document.getElementById('profiles-back').addEventListener('click', () => goBack());
  document.getElementById('stats-tab-back').addEventListener('click', () => goBack());
  document.getElementById('profile-tab-back').addEventListener('click', () => goBack());

  // === Domovská obrazovka ===
  document.getElementById('btn-section-a').addEventListener('click', openSectionA);
  document.getElementById('btn-section-b').addEventListener('click', openSectionB);
  document.getElementById('btn-section-c').addEventListener('click', openSectionC);
  document.getElementById('btn-section-d').addEventListener('click', openSectionD);
  document.getElementById('btn-section-e').addEventListener('click', openSectionE);
  document.getElementById('d-back').addEventListener('click', () => goBack());

  // === Sekce E – Značky ===
  document.getElementById('e-back').addEventListener('click', () => goBack());
  document.getElementById('e-start-cards').addEventListener('click', startZnackyCards);
  document.getElementById('e-start-quiz').addEventListener('click', startZnackyQuiz);

  // === Kartičky – Značky ===
  document.getElementById('znacky-cards-back').addEventListener('click', () => goBack());
  document.getElementById('znacky-card').addEventListener('click', flipZnackyCard);
  document.getElementById('znacky-prev').addEventListener('click', prevZnackyCard);
  document.getElementById('znacky-next').addEventListener('click', nextZnackyCard);
  document.getElementById('d-start-quiz').addEventListener('click', startHubQuiz);
  document.querySelector('.hub-type-filter').addEventListener('click', (e) => {
    const btn = e.target.closest('.hub-type-btn');
    if (!btn) return;
    const type = btn.dataset.type;
    if (HubState.activeTypes.includes(type)) {
      HubState.activeTypes = HubState.activeTypes.filter(t => t !== type);
      btn.classList.remove('active');
    } else {
      HubState.activeTypes.push(type);
      btn.classList.add('active');
    }
    updateHubQuizBtn();
  });

  // === Nastavení ===
  document.getElementById('settings-save').addEventListener('click', saveSettings);
  document.getElementById('voice-test-btn').addEventListener('click', () => {
    const select = document.getElementById('voice-select');
    const chosen = select ? TTS.czechVoices.find(v => v.name === select.value) : null;
    if (chosen) TTS.czechVoice = chosen;
    TTS.speak('Příští zastávka Náměstí Svobody. Přestupní stanice.', 1.0);
  });
  document.getElementById('settings-back').addEventListener('click', () => goBack());
  document.querySelectorAll('.session-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.val);
      AppState.settings.sessionLength = val;
      document.querySelectorAll('.session-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.val) === val);
      });
    });
  });

  // === Sekce A ===
  document.getElementById('a-back').addEventListener('click', () => goBack());
  document.getElementById('a-start-flashcards').addEventListener('click', startFlashcards);
  document.getElementById('a-start-quiz').addEventListener('click', startQuizA);

  // === Flashkarty ===
  document.getElementById('fc-back').addEventListener('click', () => {
    AudioPlayer.stop();
    goBack();
  });
  document.getElementById('fc-card').addEventListener('click', flipFlashcard);
  document.getElementById('fc-prev').addEventListener('click', prevFlashcard);
  document.getElementById('fc-next').addEventListener('click', nextFlashcard);

  // === Sekce B ===
  document.getElementById('b-back').addEventListener('click', () => goBack());
  document.getElementById('b-start-quiz').addEventListener('click', startQuizB);

  // === Sekce C ===
  document.getElementById('c-back').addEventListener('click', () => goBack());
  document.getElementById('practice-mode-audio').addEventListener('click', () => startPracticeMode('audio'));
  document.getElementById('practice-mode-quiz').addEventListener('click', () => startPracticeMode('quiz'));

  // === Audio ===
  document.getElementById('audio-back').addEventListener('click', () => {
    AudioPlayer.stop();
    AppState.audio.loop = false;
    const loopBtn = document.getElementById('audio-loop-btn');
    if (loopBtn) loopBtn.classList.remove('active');
    goBack();
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
    if (!confirm('Opravdu chceš odejít? Postup v kvízu se ztratí.')) return;
    AudioPlayer.stop();
    goBack();
  });

  // === Výsledky ===
  document.getElementById('results-back').addEventListener('click', () => goBack());
  document.getElementById('result-retry').addEventListener('click', () => {
    retryQuiz();
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
   SEKCE E – ZNAČKY
======================================================== */

const ZnackyState = {
  selectedCategories: [],  // id kategorií
};

function openSectionE() {
  ZnackyState.selectedCategories = [];
  renderZnackyCategories();
  updateZnackyButtons();
  showScreen('section-e');
}

function renderZnackyCategories() {
  const container = document.getElementById('znacky-cat-filter');
  container.innerHTML = '';
  const allIds = ZNACKY_DATA.categories.map(c => c.id);
  const allSelected = allIds.every(id => ZnackyState.selectedCategories.includes(id));
  const selectAll = document.createElement('button');
  selectAll.className = 'znacky-cat-btn' + (allSelected ? ' active' : '');
  selectAll.innerHTML = `<span class="znacky-cat-check">${allSelected ? '☑' : '☐'}</span>
    <span class="znacky-cat-label"><span class="znacky-cat-name">Vybrat vše</span></span>`;
  selectAll.onclick = () => {
    ZnackyState.selectedCategories = allSelected ? [] : [...allIds];
    renderZnackyCategories();
    updateZnackyButtons();
  };
  container.appendChild(selectAll);
  ZNACKY_DATA.categories.forEach(cat => {
    const btn = document.createElement('button');
    const active = ZnackyState.selectedCategories.includes(cat.id);
    btn.className = 'znacky-cat-btn' + (active ? ' active' : '');
    btn.innerHTML = `<span class="znacky-cat-check">${active ? '☑' : '☐'}</span>
      <span class="znacky-cat-label">
        <span class="znacky-cat-num">${cat.number}</span>
        <span class="znacky-cat-name">${cat.name}</span>
        <span class="znacky-cat-count">${cat.signs.length} značek</span>
      </span>`;
    btn.onclick = () => {
      if (ZnackyState.selectedCategories.includes(cat.id)) {
        ZnackyState.selectedCategories = ZnackyState.selectedCategories.filter(id => id !== cat.id);
      } else {
        ZnackyState.selectedCategories.push(cat.id);
      }
      const isActive = ZnackyState.selectedCategories.includes(cat.id);
      btn.classList.toggle('active', isActive);
      btn.querySelector('.znacky-cat-check').textContent = isActive ? '☑' : '☐';
      updateZnackyButtons();
      updateZnackyCatSummary();
    };
    container.appendChild(btn);
  });
  updateZnackyCatSummary();
}

function updateZnackyCatSummary() {
  const el = document.getElementById('znacky-cat-summary');
  if (!el) return;
  const n = ZnackyState.selectedCategories.length;
  if (n === 0) {
    el.textContent = 'Nic nevybráno';
    el.className = 'hub-selection-summary empty';
  } else {
    const totalSigns = getSignsByCategories(ZnackyState.selectedCategories).length;
    el.textContent = `Vybráno: ${n} ${n === 1 ? 'kategorie' : n < 5 ? 'kategorie' : 'kategorií'} (${totalSigns} značek)`;
    el.className = 'hub-selection-summary';
  }
}

function updateZnackyButtons() {
  const ok = ZnackyState.selectedCategories.length > 0;
  const cardsBtn = document.getElementById('e-start-cards');
  const quizBtn = document.getElementById('e-start-quiz');
  const hint = document.getElementById('znacky-start-hint');
  if (cardsBtn) { cardsBtn.disabled = !ok; cardsBtn.style.opacity = ok ? '1' : '0.4'; }
  if (quizBtn) { quizBtn.disabled = !ok; quizBtn.style.opacity = ok ? '1' : '0.4'; }
  if (hint) hint.style.display = ok ? 'none' : 'block';
}

/* ── Kartičky se značkami ─────────────────────────────── */

let znackyCardList = [];
let znackyCardIndex = 0;
let znackyCardFlipped = false;

function startZnackyCards() {
  const signs = getSignsByCategories(ZnackyState.selectedCategories);
  if (signs.length === 0) return;
  znackyCardList = shuffle([...signs]);
  znackyCardIndex = 0;
  znackyCardFlipped = false;
  showZnackyCard();
  showScreen('znacky-cards');
}

function showZnackyCard() {
  const sign = znackyCardList[znackyCardIndex];
  const cat = ZNACKY_DATA.categories.find(c => c.id === sign.categoryId);

  document.getElementById('znacky-counter').textContent =
    `${znackyCardIndex + 1} / ${znackyCardList.length}`;

  // Přední strana
  document.getElementById('znacky-card-svg').innerHTML = sign.svg;
  document.getElementById('znacky-card-num').textContent =
    `${cat.number} – č. ${sign.number}`;

  // Zadní strana
  document.getElementById('znacky-back-num').textContent =
    `${cat.number} – č. ${sign.number}`;
  document.getElementById('znacky-back-name').textContent = sign.name;
  document.getElementById('znacky-back-desc').textContent = sign.description;
  document.getElementById('znacky-back-cat').textContent = `Kategorie: ${cat.name}`;

  // Resetuj otočení okamžitě (bez animace)
  const card = document.getElementById('znacky-card');
  card.style.transition = 'none';
  card.classList.remove('flipped');
  znackyCardFlipped = false;
  card.offsetHeight; // force reflow
  card.style.transition = '';
}

function flipZnackyCard() {
  znackyCardFlipped = !znackyCardFlipped;
  document.getElementById('znacky-card').classList.toggle('flipped', znackyCardFlipped);
}

function nextZnackyCard() {
  if (znackyCardIndex < znackyCardList.length - 1) {
    znackyCardIndex++;
    showZnackyCard();
  } else {
    goBack();
  }
}

function prevZnackyCard() {
  if (znackyCardIndex > 0) {
    znackyCardIndex--;
    showZnackyCard();
  }
}

/* ── Kvíz se značkami ─────────────────────────────────── */

function startZnackyQuiz() {
  const signs = getSignsByCategories(ZnackyState.selectedCategories);
  if (signs.length < 2) { alert('Vyber alespoň jednu kategorii s více značkami!'); return; }
  const count = AppState.settings.sessionLength;
  const questions = generateZnackyQuestions(signs, count);
  if (questions.length === 0) { alert('Nepodařilo se vygenerovat otázky.'); return; }
  AppState.quiz = new QuizState(questions);
  AppState.lastQuizQuestions = questions;
  AppState.quizSource = 'section-e';
  renderQuizQuestion();
  showScreen('quiz');
}

function generateZnackyQuestions(signs, count) {
  const questions = [];

  signs.forEach(sign => {
    const others = signs.filter(s => s.id !== sign.id);
    if (others.length < 3) return;

    const wrongNames = shuffle([...others]).slice(0, 3).map(s => s.name);
    questions.push({
      question: 'Jak se jmenuje tato značka?',
      svgContent: `<div class="quiz-sign-svg-wrapper">${sign.svg}</div>`,
      options: shuffle([sign.name, ...wrongNames]),
      correct: sign.name,
      explanation: sign.description ? `${sign.name}: ${sign.description}` : sign.name,
    });
  });

  const shuffled = shuffle(questions);
  return count === 0 ? shuffled : shuffled.slice(0, Math.min(count, shuffled.length));
}

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
