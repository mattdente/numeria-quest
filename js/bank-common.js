// Question constructors shared by every unit's generators.
import { clean, shuffle, fs, ms } from './util.js';

export const num = (q, ans, o = {}) => ({ kind: 'num', pad: 'num', q, ans: String(clean(ans)), ...o });
export const frq = (q, n, d, o = {}) => ({ kind: 'frac', pad: 'frac', q, ans: o.form === 'mixed' ? ms(n, d) : fs(n, d), exact: o.exact ?? true, form: o.form || 'simplest', ...o });
export const expr = (q, ans, o = {}) => ({ kind: 'expr', pad: 'expr', q, ans, letters: o.letters || [...new Set(ans.replace(/[^a-z]/g, ''))].sort(), ...o });
export const coord = (q, x, y, o = {}) => ({ kind: 'coord', pad: 'coord', q, ans: `(${clean(x)}, ${clean(y)})`, ...o });
export const ratio = (q, parts, o = {}) => ({ kind: 'ratio', pad: 'ratio', q, ans: parts.join(':'), exact: o.exact ?? true, ...o });
export function mc(q, ans, wrongs, o = {}) {
  const a = String(ans), seen = new Set([a]), w = [];
  for (const x of wrongs) { const s = String(x); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const choices = o.order ? o.order.map(String) : shuffle([a, ...shuffle(w).slice(0, o.n ? o.n - 1 : 3)]);
  return { kind: 'mc', q, ans: a, choices, ...o };
}

/** Linear expression text from [[coef, letters], ...]. pretty: true minus and spaces. */
export function lin(terms, pretty = true) {
  let s = '';
  for (const [c0, v] of terms) {
    const c = clean(c0); if (c === 0) continue;
    const abs = Math.abs(c), body = (abs === 1 && v ? '' : String(abs)) + v;
    if (!s) s = (c < 0 ? (pretty ? '−' : '-') : '') + body;
    else s += c < 0 ? (pretty ? ' − ' : '-') : (pretty ? ' + ' : '+'), s += body;
  }
  return s || '0';
}
export const LETTERS = ['x', 'y', 'n', 'a', 'b', 'm', 'p', 'k', 't', 'w'];
