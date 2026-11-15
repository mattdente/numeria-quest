// Shared helpers: random numbers, number/fraction formatting, answer checking.

export const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const nz = (a, b) => { let v; do { v = ri(a, b); } while (v === 0); return v; };
export const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
export const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
export const clean = (x) => { const v = parseFloat((+x).toFixed(9)); return Object.is(v, -0) ? 0 : v; };

/** Display a number: true minus sign, Cambridge-style space grouping for 10 000+. */
export function D(n) {
  const v = typeof n === 'number' ? clean(n) : n;
  let s = String(v);
  const neg = s.startsWith('-');
  if (neg) s = s.slice(1);
  let [ip, dp] = s.split('.');
  if (ip.length >= 5) ip = ip.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (neg ? '−' : '') + ip + (dp ? '.' + dp : '');
}
/** Negative numbers in brackets, for use after an operator. */
export const P = (n) => (clean(n) < 0 ? `(${D(n)})` : D(n));
/** Money with two decimals. */
export const $ = (n) => '$' + clean(n).toFixed(2);

/** Simplify a fraction. */
export function fr(n, d) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; }
/** Canonical ASCII fraction answer: "3/4", "-2/5", "7". */
export function fs(n, d) { [n, d] = fr(n, d); return d === 1 ? String(n) : `${n}/${d}`; }
/** Canonical ASCII mixed number: "2 1/3". */
export function ms(n, d) {
  [n, d] = fr(n, d); if (d === 1) return String(n);
  const neg = n < 0; n = Math.abs(n); const w = Math.floor(n / d), r = n % d;
  return (neg ? '-' : '') + (w ? `${w} ${r}/${d}` : `${r}/${d}`);
}
/** Display tokens for stacked fractions inside question text: {3/4} or {2 1/3}. */
export const F = (n, d) => { [n, d] = fr(n, d); return d === 1 ? D(n) : `{${n < 0 ? '−' : ''}${Math.abs(n)}/${d}}`; };
export const FU = (n, d) => `{${n}/${d}}`; // unsimplified display
export const FM = (n, d) => { const s = ms(n, d); if (!s.includes('/')) return D(+s); const neg = s.startsWith('-'); return (neg ? '−' : '') + '{' + s.replace('-', '') + '}'; };

/* ------------------------------------------------------------------ */
/* Answer parsing and checking                                          */
/* ------------------------------------------------------------------ */

const MINUS = /[−–—]/g;
export function normText(s) {
  return String(s).toLowerCase().replace(MINUS, '-').replace(/[×✕]/g, 'x').replace(/\s+/g, '').replace(/\.$/, '');
}
function stripVar(s) { return s.replace(/^\s*[a-z]\s*=\s*/i, ''); }

/** Parse a rational number from "3", "-2.5", "3/4", "2 1/3", "25%". Returns [n, d] or null. */
export function parseRational(raw) {
  let s = stripVar(String(raw).trim().replace(MINUS, '-').replace(/[$£€]/g, ''));
  s = s.replace(/(\d)[ ,](?=\d{3}(\D|$))/g, '$1'); // 12 000 or 12,000
  let pct = false; if (s.endsWith('%')) { pct = true; s = s.slice(0, -1).trim(); }
  let m, n, d;
  if ((m = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/))) { d = +m[4]; n = +m[2] * d + +m[3]; if (m[1]) n = -n; }
  else if ((m = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/))) { n = +m[1]; d = +m[2]; }
  else if ((m = s.match(/^(-?)(\d*)\.?(\d*)$/)) && (m[2] || m[3])) {
    const dec = m[3] || ''; d = 10 ** dec.length; n = +(m[2] || '0') * d + +(dec || '0'); if (m[1]) n = -n;
  } else return null;
  if (!d) return null;
  if (pct) d *= 100;
  return fr(n, d);
}
const eqR = (a, b) => a && b && a[0] * b[1] === b[0] * a[1];

/** Is the typed fraction written in simplest form, in the requested shape? */
function fracFormOK(raw, form) {
  const s = stripVar(String(raw).trim().replace(MINUS, '-'));
  let m;
  if ((m = s.match(/^-?(\d+)\s+(\d+)\s*\/\s*(\d+)$/))) { const r = +m[2], d = +m[3]; return form !== 'improper' && r < d && gcd(r, d) === 1; }
  if ((m = s.match(/^-?(\d+)\s*\/\s*(\d+)$/))) {
    const n = +m[1], d = +m[2]; if (gcd(n, d) !== 1 || d === 1) return false;
    if (form === 'mixed' && n > d) return false; return true;
  }
  if (form === 'improper' && /\s/.test(s)) return false;
  return /^-?\d+$/.test(s);
}

/** Parse a linear expression like "6x + 4" or "5g - 2h + 7" into {map, terms}. */
export function parseLinear(raw) {
  let s = String(raw).toLowerCase().replace(MINUS, '-').replace(/\s+/g, '').replace(/[*×]/g, '');
  if (!s || /[^0-9a-z+\-.]/.test(s)) return null;
  if (s[0] !== '+' && s[0] !== '-') s = '+' + s;
  const re = /([+-])(\d+(?:\.\d+)?)?([a-z]*)/y; const map = {}; let terms = 0;
  while (re.lastIndex < s.length) {
    const m = re.exec(s); if (!m || m[0].length < 2) return null;
    const coef = (m[1] === '-' ? -1 : 1) * (m[2] !== undefined ? parseFloat(m[2]) : 1);
    if (m[2] === undefined && !m[3]) return null;
    const key = m[3].split('').sort().join('');
    map[key] = (map[key] || 0) + coef; terms++;
  }
  for (const k of Object.keys(map)) if (map[k] === 0) delete map[k];
  return { map, terms };
}
function sameMap(a, b) { const ka = Object.keys(a), kb = Object.keys(b); return ka.length === kb.length && ka.every((k) => Math.abs(a[k] - (b[k] ?? NaN)) < 1e-9); }

function parseCoord(raw) {
  const m = String(raw).replace(MINUS, '-').replace(/\s+/g, '').match(/^\(?(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)\)?$/);
  return m ? [+m[1], +m[2]] : null;
}
function parseRatio(raw) {
  const parts = String(raw).replace(/\s+/g, '').split(':');
  if (parts.length < 2 || parts.some((p) => !/^\d+(\.\d+)?$/.test(p))) return null;
  return parts.map(Number);
}

/** Check an answer. Returns true/false. */
export function check(q, given) {
  if (given == null) return false;
  let g = String(given).trim(); if (!g) return false;
  if (q.unit === '%') g = g.replace(/\s*%$/, '');
  if (q.kind === 'mc') return g === q.ans;
  const targets = [q.ans, ...(q.accept || [])];
  if (targets.some((t) => normText(t) === normText(g))) {
    if (q.kind === 'frac' && q.exact) return fracFormOK(g, q.form);
    return true;
  }
  switch (q.kind) {
    case 'num': { const a = parseRational(g); return targets.some((t) => eqR(a, parseRational(t))); }
    case 'frac': {
      const a = parseRational(g); if (!eqR(a, parseRational(q.ans))) return false;
      return q.exact ? fracFormOK(g, q.form) : true;
    }
    case 'expr': {
      if (/[()]/.test(g)) return false;
      const a = parseLinear(g), b = parseLinear(q.ans); if (!a || !b) return false;
      if (!sameMap(a.map, b.map)) return false;
      return a.terms === Object.keys(a.map).length || Object.keys(a.map).length === 0;
    }
    case 'coord': { const a = parseCoord(g), b = parseCoord(q.ans); return !!(a && b && a[0] === b[0] && a[1] === b[1]); }
    case 'ratio': {
      const a = parseRatio(g), b = parseRatio(q.ans); if (!a || !b || a.length !== b.length) return false;
      if (q.exact) return a.every((x, i) => x === b[i]);
      return a.every((x, i) => Math.abs(x * b[0] - b[i] * a[0]) < 1e-9);
    }
    default: return false;
  }
}
