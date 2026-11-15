// Numeria Quest: the game shell. Progress, gems and the cash-out log live in this device's local storage.
import { UNITS, LEVELS, QUESTIONS_PER_TRIAL, findSection } from './curriculum.js';
import { buildQuiz, similarQuestion } from './bank.js';
import { check, pick } from './util.js';
import * as Art from './art.js';

const KEY = 'numeria-quest-v1';
const blank = () => ({ v: 1, hero: null, balance: 0, lifetime: 0, paid: 0, trials: {}, history: [], active: null, settings: { rate: 100, pin: null, sound: true }, lastUnit: 1 });
function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return { ...blank(), ...s, settings: { ...blank().settings, ...(s.settings || {}) } }; } catch (e) {} return null; }
let state = load() || blank();
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { toast('Progress could not be saved on this device.'); } }
try { navigator.storage?.persist?.(); } catch (e) {}

const ui = { screen: state.hero ? 'map' : 'welcome', unit: state.lastUnit || 1, result: null, parentOK: false, tab: 'wallet', pin: '', pinFirst: null, input: '', sel: null, hint: false, confirm: null };
const app = document.getElementById('app');
const TOTAL_TRIALS = UNITS.reduce((s, u) => s + u.sections.length * 3, 0);
const CHEERS = ['Treasure found!', 'The rune glows!', 'Brilliant, hero!', 'Gate unlocked!', 'Magnificent!', 'The crystal shines!', 'Sharp as a sword!', 'Legendary!', 'Spot on!', 'The path opens!'];
const key = (code, L) => `${code}|${L}`;
const lvl = (L) => LEVELS[L - 1];
const money = (gems) => '$' + (gems / (state.settings.rate || 100)).toFixed(2);
const when = (t) => new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

/* ---------- tiny DOM helpers ---------- */
function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) n.append(c.nodeType ? c : document.createTextNode(String(c)));
  return n;
}
const svgEl = (markup, cls) => { const s = el('span', { class: cls || '', html: markup }); return s.firstElementChild || s; };
/** Render question text with {a/b} and {w a/b} fraction tokens and line breaks. */
function math(text) {
  const frag = document.createDocumentFragment();
  String(text).split('\n').forEach((line, li) => {
    if (li) frag.append(el('br'));
    const re = /\{(−?\d+) (\d+)\/(\d+)\}|\{([^{}\/]+)\/([^{}\/]+)\}/g; let last = 0, m;
    while ((m = re.exec(line))) {
      frag.append(line.slice(last, m.index));
      if (m[1]) frag.append(el('span', { class: 'mixed' }, m[1], el('span', { class: 'frac' }, el('span', { class: 'n', text: m[2] }), el('span', { class: 'd', text: m[3] }))));
      else frag.append(el('span', { class: 'frac' }, el('span', { class: 'n', text: m[4] }), el('span', { class: 'd', text: m[5] })));
      last = re.lastIndex;
    }
    frag.append(line.slice(last));
  });
  return frag;
}
const plain = (t) => String(t).replace(/\{(−?\d+) (\d+)\/(\d+)\}/g, '$1 $2/$3').replace(/\{([^{}]+)\}/g, '$1');
let toastTimer;
function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 3200); }

/* ---------- sound ---------- */
let actx;
const SFX = { ok: [[660, 0.09, 0], [880, 0.09, 0.08], [1320, 0.16, 0.16]], no: [[233, 0.16, 0], [175, 0.26, 0.14]], chest: [[523, 0.1, 0], [659, 0.1, 0.1], [784, 0.1, 0.2], [1047, 0.32, 0.3]], tap: [[520, 0.03, 0]] };
function sfx(name) {
  if (!state.settings.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const t0 = actx.currentTime + 0.01;
    for (const [f, d, s] of SFX[name]) { const o = actx.createOscillator(), g = actx.createGain(); o.type = 'square'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t0 + s); g.gain.exponentialRampToValueAtTime(0.06, t0 + s + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + s + d); o.connect(g).connect(actx.destination); o.start(t0 + s); o.stop(t0 + s + d + 0.03); }
  } catch (e) {}
}

/* ---------- progress queries ---------- */
const trialOf = (code, L) => state.trials[key(code, L)];
function unitStats(u) {
  let done = 0, perfect = 0, fix = 0;
  for (const [c] of u.sections) for (const L of [1, 2, 3]) { const t = trialOf(c, L); if (t) { done++; if (!t.missed.length) perfect++; else fix += t.missed.length; } }
  return { done, perfect, fix, total: u.sections.length * 3 };
}
const allDone = () => Object.keys(state.trials).length;

/* ---------- navigation ---------- */
function go(screen, extra = {}) { Object.assign(ui, { screen }, extra); render(); window.scrollTo(0, 0); }
function render() {
  app.replaceChildren();
  if (ui.screen !== 'welcome') app.append(topbar());
  const wrap = el('main', { class: 'wrap' });
  app.append(wrap);
  ({ welcome: welcomeScreen, map: mapScreen, region: regionScreen, quiz: quizScreen, result: resultScreen, parent: parentScreen })[ui.screen](wrap);
}

function topbar() {
  return el('header', { class: 'bar' }, el('div', { class: 'bar-in' },
    el('button', { class: 'brand', onclick: () => go('map'), 'aria-label': 'World map' }, svgEl(Art.hero('')), 'Numeria Quest'),
    el('span', { class: 'spacer' }),
    el('span', { class: 'chip gold', title: 'Gems to cash in' }, svgEl(Art.gem()), String(state.balance)),
    state.hero ? el('span', { class: 'chip' }, state.hero.name) : null,
    el('button', { class: 'iconbtn', 'aria-pressed': String(state.settings.sound), onclick: () => { state.settings.sound = !state.settings.sound; save(); render(); } }, state.settings.sound ? 'Sound on' : 'Sound off'),
    el('button', { class: 'iconbtn', onclick: () => go('parent', { parentOK: false, pin: '', pinFirst: null, confirm: null }) }, svgEl(Art.lock()), 'Parents'),
  ));
}

/* ---------- welcome / sign in ---------- */
function welcomeScreen(w) {
  const input = el('input', { id: 'heroName', maxlength: '20', autocomplete: 'off', placeholder: 'Your name', 'aria-label': 'Your name' });
  const start = () => { const name = input.value.trim(); if (!name) { input.focus(); toast('Type your name to begin.'); return; } state.hero = { name, since: Date.now() }; save(); sfx('chest'); go('map'); };
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') start(); });
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone;
  w.append(el('section', { class: 'welcome' }, el('div', { class: 'panel' },
    svgEl(Art.hero()),
    el('h1', { text: 'Numeria Quest' }),
    el('p', { style: 'margin:0', text: 'Sixteen regions. Sixty-six shrines. Every trial you finish earns gems.' }),
    el('label', { for: 'heroName', class: 'muted', text: 'What is your name, hero?' }),
    input,
    el('button', { class: 'btn green', onclick: start, text: 'Begin the quest' }),
    standalone ? null : el('p', { class: 'tip', text: 'On iPad: tap Share, then "Add to Home Screen" to play full screen. Progress is saved on this device.' }),
  )));
  setTimeout(() => input.focus(), 50);
}

/* ---------- world map ---------- */
function mapScreen(w) {
  const a = state.active;
  if (a && a.mode !== 'practice') {
    const s = findSection(a.code);
    w.append(el('div', { class: 'panel continue' },
      el('div', {}, el('strong', { text: a.mode === 'fix' ? 'A fix-it quest is waiting' : 'A trial is waiting' }), el('div', { text: `${s.code} ${s.title} · ${lvl(a.L).name} · question ${Math.min(a.i + 1, a.qs.length)} of ${a.qs.length}` })),
      el('button', { class: 'btn', onclick: () => resume(), text: 'Continue' })));
  }
  const pct = Math.round((allDone() / TOTAL_TRIALS) * 100);
  w.append(el('div', { class: 'mapintro' },
    el('div', {}, el('h2', { class: 'onsea', text: `Where to, ${state.hero.name}?` }), el('div', { class: 'onsea', text: `${allDone()} of ${TOTAL_TRIALS} trials complete · ${state.lifetime} gems found so far` })),
    el('div', { style: 'flex:0 1 280px;min-width:200px' }, el('div', { class: 'meter', role: 'img', 'aria-label': `${pct}% complete` }, el('i', { style: `width:${pct}%` })))));
  const grid = el('div', { class: 'world' });
  for (const u of UNITS) {
    const st = unitStats(u);
    const b = el('button', { class: 'region', onclick: () => { state.lastUnit = u.n; save(); go('region', { unit: u.n }); }, 'aria-label': `Region ${u.n}: ${u.region}, ${u.title}` },
      svgEl(Art.scene(u.terrain)),
      el('span', { class: 'num', text: u.n }),
      st.perfect === st.total ? el('span', { class: 'flag clear', text: 'Cleared!' }) : st.fix ? el('span', { class: 'flag fix', text: `${st.fix} to fix` }) : null,
      el('div', { class: 'info' }, el('span', { class: 'name', text: u.region }), el('span', { class: 'sub', text: u.title }),
        el('div', { class: 'meter' }, el('i', { style: `width:${(st.done / st.total) * 100}%` })),
        el('span', { class: 'sub', text: `${st.done}/${st.total} trials` })));
    if (u.n === state.lastUnit) b.append(svgEl(Art.hero('here')));
    grid.append(b);
  }
  w.append(grid);
}

/* ---------- region: shrines and trials ---------- */
function regionScreen(w) {
  const u = UNITS.find((x) => x.n === ui.unit);
  w.append(el('button', { class: 'btn white small back', onclick: () => go('map'), text: '← World map' }));
  w.append(el('div', { class: 'panel banner' }, svgEl(Art.scene(u.terrain)), el('div', {}, el('div', { class: 'muted', text: `Region ${u.n}` }), el('h2', { text: u.region }), el('p', { text: `${u.title}. Each shrine has three trials. Finish a trial to earn its gems, then fix any misses to earn the rest.` }))));
  const list = el('div', { class: 'shrines' });
  for (const [code, title] of u.sections) {
    const trials = el('div', { class: 'trials' });
    for (const lv of LEVELS) {
      const t = trialOf(code, lv.L), max = QUESTIONS_PER_TRIAL * lv.perQ;
      let cls = 'trial', what, action;
      if (!t) { cls += ' go'; what = [svgEl(Art.gem()), `+${max}`]; action = () => startTrial(code, lv.L); }
      else if (t.missed.length) { cls += ' fix'; what = [`Fix ${t.missed.length} · +${t.missed.length * lv.perQ}`]; action = () => startFix(code, lv.L); }
      else { what = ['Practice']; action = () => startTrial(code, lv.L, true); }
      const resumeHere = state.active && state.active.code === code && state.active.L === lv.L && state.active.mode !== 'practice';
      if (resumeHere) { what = ['Continue']; action = () => resume(); }
      trials.append(el('button', { class: cls, onclick: action, 'aria-label': `${lv.name} trial for ${code}` }, svgEl(Art.seal(lv.color, !!t, t && !t.missed.length)), el('span', { class: 'lv', text: lv.name }), el('span', { class: 'what' }, ...what)));
    }
    list.append(el('div', { class: 'panel shrine' }, el('div', {}, el('div', { class: 'code', text: code }), el('div', { class: 'title', text: title })), trials));
  }
  w.append(list);
}

/* ---------- starting and resuming trials ---------- */
function blocked(code, L) {
  const a = state.active;
  if (a && a.mode !== 'practice' && !(a.code === code && a.L === L)) { toast(`Finish your ${a.mode === 'fix' ? 'fix-it quest' : 'trial'} in ${a.code} first.`); resume(); return true; }
  return false;
}
function startTrial(code, L, practice = false) {
  if (blocked(code, L)) return;
  const done = !!trialOf(code, L), mode = practice || done ? 'practice' : 'trial';
  const qs = buildQuiz(code, L, QUESTIONS_PER_TRIAL);
  if (!qs.length) { toast('This trial could not be built. Try another.'); return; }
  state.active = { code, L, mode, qs, i: 0, answers: [], started: Date.now() }; save();
  ui.input = ''; ui.sel = null; ui.hint = false; go('quiz');
}
function startFix(code, L) {
  if (blocked(code, L)) return;
  const t = trialOf(code, L); if (!t || !t.missed.length) return;
  const qs = t.missed.map((m, idx) => ({ ...(similarQuestion(code, L, m) || m), fixOf: idx }));
  state.active = { code, L, mode: 'fix', qs, i: 0, answers: [], started: Date.now() }; save();
  ui.input = ''; ui.sel = null; ui.hint = false; go('quiz');
}
function resume() { const a = state.active; if (!a) return; ui.unit = findSection(a.code).unit.n; ui.input = ''; ui.sel = null; ui.hint = false; go('quiz'); }

/* ---------- the quiz ---------- */
const PADS = {
  num: ['7', '8', '9', '⌫', '4', '5', '6', '−', '1', '2', '3', '/', '0', '.'],
  frac: ['7', '8', '9', '⌫', '4', '5', '6', '/', '1', '2', '3', 'space', '0', '−'],
  coord: ['7', '8', '9', '⌫', '4', '5', '6', '−', '1', '2', '3', ',', '0', '.'],
  ratio: ['7', '8', '9', '⌫', '4', '5', '6', ':', '1', '2', '3', '0'],
};
const padFor = (q) => (q.pad === 'expr' ? ['7', '8', '9', '⌫', '4', '5', '6', '+', '1', '2', '3', '−', '0', ...(q.letters || ['x'])] : PADS[q.pad] || PADS.num);
const shown = (s) => s.replace(/-/g, '−');

function quizScreen(w) {
  const a = state.active; if (!a) { go('map'); return; }
  const s = findSection(a.code), q = a.qs[a.i], done = a.answers[a.i], lv = lvl(a.L);
  const modeLabel = { trial: `Trial · ${lv.perQ} gems each`, fix: `Fix-it quest · ${lv.perQ} gems each`, practice: 'Practice · no gems' }[a.mode];
  w.append(el('div', { class: 'quizbar' },
    el('button', { class: 'btn white small', onclick: leaveQuiz, text: a.mode === 'practice' ? '✕ Stop' : '← Leave' }),
    el('span', { class: 'where onsea', text: `${s.code} ${s.title} · ${lv.name}` }),
    el('span', { class: `mode ${a.mode}`, text: modeLabel })));
  w.append(el('div', { class: 'pips', 'aria-label': `Question ${a.i + 1} of ${a.qs.length}` }, a.qs.map((_, j) => { const r = a.answers[j]; return el('span', { class: 'pip' + (r ? (r.ok ? ' ok' : ' no') : j === a.i ? ' now' : '') }); })));

  const left = el('section', { class: 'textbox' },
    el('div', { class: 'qn' }, el('span', { text: `Question ${a.i + 1} of ${a.qs.length}` }), q.unit && q.unit !== '$' && q.kind !== 'mc' ? el('span', { text: `answer in ${q.unit}` }) : null),
    el('div', { class: 'qtext' }, math(q.q)));
  if (q.svg) left.append(el('div', { class: 'figure', html: q.svg }));
  if (q.table) left.append(el('div', { class: 'tablewrap' }, el('table', { class: 'data' }, el('thead', {}, el('tr', {}, q.table.head.map((h) => el('th', { text: h })))), el('tbody', {}, q.table.rows.map((r) => el('tr', {}, r.map((c, i) => el(i === 0 ? 'th' : 'td', { text: c }))))))));

  const right = el('section', { class: 'answerpane' });
  if (q.kind === 'mc') {
    const box = el('div', { class: 'choices', role: 'group', 'aria-label': 'Choices' });
    q.choices.forEach((c, i) => {
      let cls = 'choice'; if (done) { if (c === q.ans) cls += ' right'; else if (c === done.given) cls += ' wrong'; }
      box.append(el('button', { class: cls, 'aria-pressed': String((done ? done.given : ui.sel) === c), disabled: !!done, 'data-i': i, onclick: () => { ui.sel = c; sfx('tap'); render(); } }, el('span', { class: 'k', text: 'ABCD'[i] || i + 1 }), el('span', { class: 't' }, math(c))));
    });
    right.append(box);
  } else {
    const val = done ? done.given : ui.input;
    right.append(el('div', { class: 'answer', 'aria-live': 'polite' },
      el('span', { class: 'typed' + (val ? '' : ' empty') }, val ? shown(val) : q.pad === 'frac' ? 'Type like 3/4 or 2 1/3' : q.pad === 'coord' ? 'Type like 3, −2' : q.pad === 'ratio' ? 'Type like 2:3' : 'Your answer', done ? null : el('span', { class: 'caret' })),
      q.unit ? el('span', { class: 'unit', text: q.unit === '$' ? 'dollars' : q.unit }) : null));
    if (!done) right.append(el('div', { class: 'keypad' }, padFor(q).map((k) => el('button', { class: 'key' + (k === '⌫' ? ' del' : /[0-9]/.test(k) ? '' : ' alt'), onclick: () => press(k), 'aria-label': k === '⌫' ? 'Delete' : k === 'space' ? 'Space' : k, text: k }))));
  }
  if (!done) {
    if (ui.hint && q.hint) right.append(el('div', { class: 'hint' }, el('b', { text: 'Hint: ' }), math(q.hint)));
    const ready = q.kind === 'mc' ? ui.sel != null : ui.input.trim() !== '';
    right.append(el('div', { class: 'actions' },
      el('button', { class: 'btn white', disabled: ui.hint || !q.hint, onclick: () => { ui.hint = true; render(); }, text: 'Hint' }),
      el('button', { class: 'btn green', id: 'checkBtn', disabled: !ready, onclick: checkAnswer, text: 'Check' })));
  } else {
    right.append(feedback(q, done, a));
    const last = a.i === a.qs.length - 1;
    right.append(el('div', { class: 'actions' }, el('span'), el('button', { class: 'btn', id: 'nextBtn', onclick: nextQuestion, text: last ? (a.mode === 'practice' ? 'Finish' : 'Open the chest') : 'Next question' })));
  }
  w.append(el('div', { class: 'quiz' }, left, right));
}

function feedback(q, r, a) {
  const per = lvl(a.L).perQ;
  if (r.ok) return el('div', { class: 'fb ok pop' }, el('div', { class: 'head' }, r.cheer || 'Correct!', a.mode !== 'practice' ? el('span', { class: 'plus' }, svgEl(Art.gem()), `+${per}`) : null));
  const ansText = q.kind === 'mc' ? q.ans : (q.unit === '$' ? '$' : '') + shown(q.ans) + (q.unit && q.unit !== '$' ? (/^[°%]/.test(q.unit) ? '' : ' ') + q.unit : '');
  return el('div', { class: 'fb no shake' },
    el('div', { class: 'head', text: 'Not this time.' }),
    el('div', { class: 'ans' }, 'The answer is ', el('b', {}, math(ansText))),
    q.steps?.length ? el('ol', {}, q.steps.map((s) => el('li', {}, math(s)))) : null,
    el('div', { class: 'muted', text: a.mode === 'trial' ? `You can win these ${per} gems back in a fix-it quest.` : a.mode === 'fix' ? 'You will get a new question like this next time.' : 'Practice makes it stick.' }));
}

function press(k) {
  if (state.active?.answers[state.active.i]) return;
  if (k === '⌫') ui.input = ui.input.slice(0, -1);
  else if (k === 'space') ui.input += ' ';
  else ui.input += k === '−' ? '-' : k;
  ui.input = ui.input.slice(0, 24); sfx('tap'); render();
}
function checkAnswer() {
  const a = state.active, q = a.qs[a.i]; if (a.answers[a.i]) return;
  const given = q.kind === 'mc' ? ui.sel : ui.input.trim(); if (given == null || given === '') return;
  const ok = check(q, given);
  a.answers[a.i] = { given, ok, hint: ui.hint, cheer: ok ? pick(CHEERS) : null }; save();
  sfx(ok ? 'ok' : 'no'); render();
  document.getElementById('nextBtn')?.focus();
}
function nextQuestion() {
  const a = state.active; if (!a || !a.answers[a.i]) return;
  if (a.i < a.qs.length - 1) { a.i++; save(); ui.input = ''; ui.sel = null; ui.hint = false; render(); window.scrollTo(0, 0); return; }
  finish();
}
function leaveQuiz() {
  const a = state.active;
  if (a?.mode === 'practice') state.active = null;
  save(); go('region', { unit: findSection(a.code).unit.n });
  if (a && a.mode !== 'practice') toast('Your trial is saved. Continue it any time.');
}

function finish() {
  const a = state.active, per = lvl(a.L).perQ, k = key(a.code, a.L), right = a.answers.filter((r) => r.ok).length;
  let earned = 0, fixed = 0, stillMissing = 0;
  if (a.mode === 'trial') {
    earned = right * per;
    const missed = a.qs.filter((_, j) => !a.answers[j].ok).map(({ fixOf, ...q }) => q);
    state.trials[k] = { at: Date.now(), right, total: a.qs.length, earned, missed };
    stillMissing = missed.length;
    if (earned) state.history.push({ t: Date.now(), kind: 'earn', code: a.code, L: a.L, gems: earned, note: `${right}/${a.qs.length} correct` });
  } else if (a.mode === 'fix') {
    const t = state.trials[k], fixedIdx = new Set(a.qs.filter((_, j) => a.answers[j].ok).map((q) => q.fixOf));
    fixed = fixedIdx.size; earned = fixed * per;
    t.missed = t.missed.filter((_, idx) => !fixedIdx.has(idx)); t.earned += earned; stillMissing = t.missed.length;
    if (earned) state.history.push({ t: Date.now(), kind: 'fix', code: a.code, L: a.L, gems: earned, note: `fixed ${fixed} of ${a.qs.length}` });
  }
  state.balance += earned; state.lifetime += earned;
  ui.result = { code: a.code, L: a.L, mode: a.mode, right, total: a.qs.length, earned, fixed, stillMissing };
  state.active = null; save(); sfx('chest'); go('result');
}

/* ---------- results ---------- */
function resultScreen(w) {
  const r = ui.result; if (!r) { go('map'); return; }
  const s = findSection(r.code), lv = lvl(r.L), per = lv.perQ;
  const title = r.mode === 'fix' ? (r.stillMissing ? 'Good fixing!' : 'All fixed!') : r.right === r.total ? 'Flawless!' : r.right >= r.total * 0.75 ? 'Great quest!' : r.right >= r.total / 2 ? 'Well fought!' : 'Every hero starts somewhere!';
  const line = r.mode === 'fix' ? `You fixed ${r.fixed} of ${r.total}.` : `You answered ${r.right} of ${r.total} correctly.`;
  w.append(el('section', { class: 'panel result' },
    svgEl(Art.chest(r.earned > 0 || r.mode === 'practice')),
    el('h2', { text: title }),
    el('div', { class: 'bigline', text: line }),
    r.mode === 'practice' ? el('div', { class: 'muted', text: 'Practice runs do not earn gems.' }) : el('div', { class: 'earned' }, svgEl(Art.gem()), `+${r.earned}`),
    r.stillMissing ? el('div', { text: `${r.stillMissing} question${r.stillMissing > 1 ? 's' : ''} left to fix. Fix them to earn ${r.stillMissing * per} more gems.` }) : r.mode !== 'practice' ? el('div', { text: `${s.code} ${lv.name} trial complete with every question right. Seal earned!` }) : null,
    el('div', { class: 'row', style: 'justify-content:center' },
      r.stillMissing ? el('button', { class: 'btn green', onclick: () => startFix(r.code, r.L), text: `Start fix-it quest (+${r.stillMissing * per})` }) : null,
      el('button', { class: 'btn white', onclick: () => go('region', { unit: s.unit.n }), text: `Back to ${s.unit.region}` }),
      el('button', { class: 'btn white', onclick: () => go('map'), text: 'World map' }))));
}

/* ---------- parents ---------- */
function parentScreen(w) {
  const box = el('section', { class: 'parent' });
  w.append(box);
  if (!ui.parentOK) { box.append(pinScreen()); return; }
  box.append(el('div', { class: 'row', style: 'justify-content:space-between' }, el('h2', { class: 'onsea', text: `Parent area · ${state.hero?.name || ''}` }), el('button', { class: 'btn white small', onclick: () => go('map', { parentOK: false }), text: 'Lock and exit' })));
  const tabs = [['wallet', 'Gems and cash-outs'], ['history', 'Earning history'], ['progress', 'Progress'], ['settings', 'Settings']];
  box.append(el('div', { class: 'tabs', role: 'tablist' }, tabs.map(([id, label]) => el('button', { class: 'tab', role: 'tab', 'aria-selected': String(ui.tab === id), onclick: () => { ui.tab = id; ui.confirm = null; render(); }, text: label }))));
  const p = el('div', { class: 'panel', style: 'display:grid;gap:16px' }); box.append(p);
  ({ wallet: walletTab, history: historyTab, progress: progressTab, settings: settingsTab })[ui.tab](p);
}

function pinScreen() {
  const setting = !state.settings.pin;
  const msg = setting ? (ui.pinFirst ? 'Type the same 4-digit PIN again.' : 'Choose a 4-digit parent PIN.') : 'Enter the parent PIN.';
  const dots = el('div', { class: 'pindots' }, [0, 1, 2, 3].map((i) => el('i', { class: i < ui.pin.length ? 'on' : '' })));
  const tap = (d) => {
    if (d === '⌫') { ui.pin = ui.pin.slice(0, -1); render(); return; }
    if (d === '✕') { go('map'); return; }
    ui.pin += d; if (ui.pin.length < 4) { render(); return; }
    if (setting) {
      if (!ui.pinFirst) { ui.pinFirst = ui.pin; ui.pin = ''; render(); return; }
      if (ui.pinFirst === ui.pin) { state.settings.pin = ui.pin; save(); ui.parentOK = true; ui.pin = ''; ui.pinFirst = null; toast('PIN saved.'); render(); return; }
      ui.pinFirst = null; ui.pin = ''; toast('The PINs did not match. Start again.'); render(); return;
    }
    if (ui.pin === state.settings.pin) { ui.parentOK = true; ui.pin = ''; render(); } else { ui.pin = ''; toast('That PIN is not right.'); render(); }
  };
  return el('div', { class: 'panel pinpad' }, svgEl(Art.lock()), el('h2', { text: 'Parents only' }), el('div', { text: msg }), dots,
    el('div', { class: 'keypad' }, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '✕', '0', '⌫'].map((d) => el('button', { class: 'key' + (d === '⌫' || d === '✕' ? ' del' : ''), onclick: () => tap(d), 'aria-label': d === '⌫' ? 'Delete' : d === '✕' ? 'Cancel' : d, text: d }))));
}

function walletTab(p) {
  p.append(el('div', { class: 'stats' },
    el('div', { class: 'stat' }, el('b', { text: `${state.balance}` }), el('span', { text: `gems to cash in · worth ${money(state.balance)}` })),
    el('div', { class: 'stat' }, el('b', { text: `${state.lifetime}` }), el('span', { text: 'gems earned all-time' })),
    el('div', { class: 'stat' }, el('b', { text: '$' + (state.paid || 0).toFixed(2) }), el('span', { text: 'paid out all-time' }))));
  p.append(el('h3', { text: 'Cash out' }));
  if (!state.balance) p.append(el('p', { class: 'muted', style: 'margin:0', text: 'No gems to cash in yet. Gems appear here when trials are finished.' }));
  else {
    const amt = el('input', { id: 'cashGems', type: 'number', inputmode: 'numeric', min: '1', max: String(state.balance), value: String(state.balance) });
    const note = el('input', { id: 'cashNote', type: 'text', maxlength: '60', placeholder: 'For example: Saturday cash' });
    const preview = el('div', { class: 'muted', text: `= ${money(state.balance)} at ${state.settings.rate} gems per $1` });
    amt.addEventListener('input', () => { const g = Math.max(0, Math.min(state.balance, Math.floor(+amt.value || 0))); preview.textContent = `= ${money(g)} at ${state.settings.rate} gems per $1`; });
    p.append(el('div', { class: 'row', style: 'align-items:end' },
      el('div', { class: 'field' }, el('label', { for: 'cashGems', text: 'Gems to cash in' }), amt),
      el('div', { class: 'field', style: 'flex:1;min-width:200px' }, el('label', { for: 'cashNote', text: 'Note (optional)' }), note)), preview);
    if (ui.confirm?.type === 'cash') {
      const g = ui.confirm.gems;
      p.append(el('div', { class: 'confirm' }, el('div', { text: `Pay ${state.hero.name} ${money(g)} and remove ${g} gems from the balance? Game progress is kept.` }),
        el('div', { class: 'row' }, el('button', { class: 'btn green small', onclick: () => cashOut(g, ui.confirm.note), text: `Yes, paid ${money(g)}` }), el('button', { class: 'btn white small', onclick: () => { ui.confirm = null; render(); }, text: 'Cancel' }))));
    } else p.append(el('div', {}, el('button', { class: 'btn', onclick: () => { const g = Math.floor(+amt.value || 0); if (g < 1 || g > state.balance) { toast(`Enter a number of gems from 1 to ${state.balance}.`); return; } ui.confirm = { type: 'cash', gems: g, note: note.value.trim() }; render(); }, text: 'Cash out' })));
  }
  const outs = state.history.filter((h) => h.kind === 'cashout').slice().reverse();
  p.append(el('h3', { text: 'Cash-out log' }));
  p.append(outs.length ? el('div', { class: 'scroll' }, el('table', { class: 'ledger' }, el('thead', {}, el('tr', {}, el('th', { text: 'Date' }), el('th', { class: 'num', text: 'Gems' }), el('th', { class: 'num', text: 'Paid' }), el('th', { text: 'Note' }))),
    el('tbody', {}, outs.map((h) => el('tr', {}, el('td', { text: when(h.t) }), el('td', { class: 'num minus', text: `−${h.gems}` }), el('td', { class: 'num', text: '$' + h.dollars.toFixed(2) }), el('td', { text: h.note || '' }))))))
    : el('p', { class: 'muted', style: 'margin:0', text: 'No cash-outs yet.' }));
}
function cashOut(g, note) {
  const dollars = +(g / state.settings.rate).toFixed(2);
  state.balance -= g; state.paid = +((state.paid || 0) + dollars).toFixed(2);
  state.history.push({ t: Date.now(), kind: 'cashout', gems: g, dollars, rate: state.settings.rate, note });
  ui.confirm = null; save(); toast(`Cashed out ${g} gems for $${dollars.toFixed(2)}.`); render();
}

function historyTab(p) {
  const rows = state.history.slice().reverse();
  p.append(el('h3', { text: 'Every gem earned and cashed out' }));
  if (!rows.length) { p.append(el('p', { class: 'muted', style: 'margin:0', text: 'Nothing yet. Finished trials will be listed here.' })); return; }
  p.append(el('div', { class: 'scroll' }, el('table', { class: 'ledger' },
    el('thead', {}, el('tr', {}, el('th', { text: 'Date' }), el('th', { text: 'What' }), el('th', { class: 'num', text: 'Gems' }))),
    el('tbody', {}, rows.map((h) => {
      const s = h.code ? findSection(h.code) : null;
      const what = h.kind === 'cashout' ? `Cash-out: $${h.dollars.toFixed(2)}${h.note ? ' · ' + h.note : ''}` : `${h.kind === 'fix' ? 'Fix-it quest' : 'Trial'} · ${s.code} ${s.title} · ${lvl(h.L).name} · ${h.note}`;
      return el('tr', {}, el('td', { text: when(h.t) }), el('td', { text: what }), el('td', { class: 'num ' + (h.kind === 'cashout' ? 'minus' : 'plus'), text: (h.kind === 'cashout' ? '−' : '+') + h.gems }));
    })))));
}

function progressTab(p) {
  p.append(el('h3', { text: `${allDone()} of ${TOTAL_TRIALS} trials finished` }));
  p.append(el('div', { class: 'scroll' }, el('table', { class: 'ledger' },
    el('thead', {}, el('tr', {}, el('th', { text: 'Unit' }), el('th', { class: 'num', text: 'Trials done' }), el('th', { class: 'num', text: 'All correct' }), el('th', { class: 'num', text: 'Still to fix' }), el('th', { class: 'num', text: 'Gems earned' }))),
    el('tbody', {}, UNITS.map((u) => { const st = unitStats(u), gems = state.history.filter((h) => h.code && findSection(h.code).unit.n === u.n).reduce((s, h) => s + h.gems, 0); return el('tr', {}, el('td', { text: `${u.n}. ${u.title}` }), el('td', { class: 'num', text: `${st.done}/${st.total}` }), el('td', { class: 'num', text: st.perfect }), el('td', { class: 'num', text: st.fix }), el('td', { class: 'num', text: gems })); })))));
}

function settingsTab(p) {
  const rate = el('input', { id: 'rate', type: 'number', inputmode: 'numeric', min: '1', value: String(state.settings.rate) });
  const name = el('input', { id: 'hero', type: 'text', maxlength: '20', value: state.hero?.name || '' });
  p.append(el('h3', { text: 'Gem value' }),
    el('div', { class: 'row', style: 'align-items:end' }, el('div', { class: 'field' }, el('label', { for: 'rate', text: 'Gems per $1' }), rate), el('button', { class: 'btn small', onclick: () => { const v = Math.floor(+rate.value); if (!(v >= 1)) { toast('Enter a whole number of 1 or more.'); return; } state.settings.rate = v; save(); toast(`Saved: ${v} gems = $1.`); render(); }, text: 'Save' })),
    el('p', { class: 'muted', style: 'margin:0', text: `Trials pay ${LEVELS.map((l) => `${l.name} ${l.perQ * QUESTIONS_PER_TRIAL}`).join(', ')} gems. Finishing every trial in the book earns ${TOTAL_TRIALS / 3 * LEVELS.reduce((s, l) => s + l.perQ * QUESTIONS_PER_TRIAL, 0)} gems, which is ${money(TOTAL_TRIALS / 3 * LEVELS.reduce((s, l) => s + l.perQ * QUESTIONS_PER_TRIAL, 0))} at this rate.` }));
  p.append(el('h3', { text: 'Hero' }), el('div', { class: 'row', style: 'align-items:end' }, el('div', { class: 'field' }, el('label', { for: 'hero', text: 'Hero name' }), name), el('button', { class: 'btn small', onclick: () => { const v = name.value.trim(); if (!v) return; state.hero.name = v; save(); toast('Name saved.'); render(); }, text: 'Save' })));
  p.append(el('h3', { text: 'Parent PIN' }), el('div', {}, el('button', { class: 'btn white small', onclick: () => { state.settings.pin = null; save(); ui.parentOK = false; ui.pin = ''; ui.pinFirst = null; render(); }, text: 'Change PIN' })));
  p.append(el('h3', { text: 'Backup' }), el('p', { class: 'muted', style: 'margin:0', text: 'Progress lives only on this iPad. Save a backup now and then, especially before clearing Safari data.' }),
    el('div', { class: 'row' }, el('button', { class: 'btn white small', onclick: exportBackup, text: 'Save a backup file' }), el('label', { class: 'btn white small', for: 'importFile', text: 'Restore from a backup' }), el('input', { id: 'importFile', type: 'file', accept: 'application/json,.json', hidden: true, onchange: importBackup })));
  if (ui.confirm?.type === 'import') p.append(el('div', { class: 'confirm' }, el('div', { text: `Replace everything on this device with the backup from ${when(ui.confirm.data.savedAt || Date.now())}? Hero: ${ui.confirm.data.state.hero?.name}, ${ui.confirm.data.state.balance} gems.` }), el('div', { class: 'row' }, el('button', { class: 'btn red small', onclick: () => { state = { ...blank(), ...ui.confirm.data.state }; ui.confirm = null; save(); toast('Backup restored.'); render(); }, text: 'Yes, restore it' }), el('button', { class: 'btn white small', onclick: () => { ui.confirm = null; render(); }, text: 'Cancel' }))));
  const typed = el('input', { id: 'wipe', type: 'text', placeholder: 'Type RESET', autocomplete: 'off' });
  p.append(el('h3', { text: 'Start over' }), el('p', { class: 'muted', style: 'margin:0', text: 'Deletes all progress, gems and logs on this device.' }), el('div', { class: 'row', style: 'align-items:end' }, el('div', { class: 'field' }, el('label', { for: 'wipe', text: 'Type RESET to confirm' }), typed), el('button', { class: 'btn red small', onclick: () => { if (typed.value.trim() !== 'RESET') { toast('Type RESET first.'); return; } state = blank(); save(); go('welcome'); }, text: 'Delete everything' })));
}
async function exportBackup() {
  const data = JSON.stringify({ app: 'numeria-quest', savedAt: Date.now(), state }, null, 1), name = `numeria-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const file = new File([data], name, { type: 'application/json' });
  try { if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: 'Numeria Quest backup' }); return; } } catch (e) { if (e?.name === 'AbortError') return; }
  const a = el('a', { href: URL.createObjectURL(file), download: name }); document.body.append(a); a.click(); a.remove();
}
function importBackup(e) {
  const f = e.target.files?.[0]; if (!f) return;
  f.text().then((t) => { const d = JSON.parse(t); if (d?.app !== 'numeria-quest' || d.state?.v !== 1) throw new Error('bad'); ui.confirm = { type: 'import', data: d }; render(); }).catch(() => toast('That file is not a Numeria Quest backup.'));
}

/* ---------- keyboard support ---------- */
document.addEventListener('keydown', (e) => {
  if (ui.screen !== 'quiz' || e.metaKey || e.ctrlKey || e.altKey) return;
  const a = state.active; if (!a) return;
  const q = a.qs[a.i], done = a.answers[a.i];
  if (e.key === 'Enter') { e.preventDefault(); done ? nextQuestion() : checkAnswer(); return; }
  if (done) return;
  if (q.kind === 'mc') { const i = '1234'.indexOf(e.key) >= 0 ? '1234'.indexOf(e.key) : 'abcd'.indexOf(e.key.toLowerCase()); if (i >= 0 && q.choices[i] != null) { ui.sel = q.choices[i]; render(); } return; }
  if (e.key === 'Backspace') { e.preventDefault(); press('⌫'); return; }
  const allowed = q.pad === 'expr' ? '0123456789+-' + (q.letters || []).join('') : q.pad === 'ratio' ? '0123456789:' : q.pad === 'coord' ? '0123456789-,.' : q.pad === 'frac' ? '0123456789/- ' : '0123456789-./';
  if (e.key.length === 1 && allowed.includes(e.key.toLowerCase())) { e.preventDefault(); press(e.key === ' ' ? 'space' : e.key.toLowerCase()); }
});

if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('./sw.js').catch(() => {});
render();
