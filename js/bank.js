// Question bank: every section's generators, plus quiz building.
import { shuffle } from './util.js';
import { UNITS_1_5 } from './bank1.js';
import { UNITS_6_10 } from './bank2.js';
import { UNITS_11_16 } from './bank3.js';

export const BANK = { ...UNITS_1_5, ...UNITS_6_10, ...UNITS_11_16 };

const sig = (q) => q.q + '|' + (q.choices ? [...q.choices].sort().join('|') : q.ans);

/** One question from template ti at level L, or null if that template does not apply at this level. */
export function makeQuestion(code, L, ti, avoid = new Set()) {
  const t = BANK[code]?.[ti]; if (!t) return null;
  let last = null;
  for (let i = 0; i < 30; i++) {
    let q; try { q = t(L); } catch (e) { q = null; }
    if (!q) continue;
    q.ti = ti; last = q;
    if (!avoid.has(sig(q))) return q;
  }
  return last;
}

/** Which templates can produce a question at this level. */
export function templatesFor(code, L) {
  const out = [];
  (BANK[code] || []).forEach((t, ti) => { for (let i = 0; i < 20; i++) { let q = null; try { q = t(L); } catch (e) {} if (q) { out.push(ti); return; } } });
  return out;
}

/** Build a quiz of n varied questions. */
export function buildQuiz(code, L, n) {
  const tis = templatesFor(code, L); if (!tis.length) return [];
  const seen = new Set(), qs = [];
  let order = [];
  for (let guard = 0; qs.length < n && guard < 200; guard++) {
    if (!order.length) order = shuffle(tis);
    const ti = order.pop(), q = makeQuestion(code, L, ti, seen);
    if (q && !seen.has(sig(q))) { seen.add(sig(q)); qs.push(q); }
  }
  return shuffle(qs);
}

/** A fresh, different question from the same template, for fix-it quests. */
export function similarQuestion(code, L, original) {
  const avoid = new Set([sig(original)]);
  return makeQuestion(code, L, original.ti, avoid);
}
export const questionSig = sig;
