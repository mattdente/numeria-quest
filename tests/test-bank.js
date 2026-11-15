// Generates thousands of questions for every section and level and checks each one.
import { BANK, buildQuiz, templatesFor, similarQuestion } from '../js/bank.js';
import { check } from '../js/util.js';
import { UNITS, QUESTIONS_PER_TRIAL } from '../js/curriculum.js';

const N = +process.argv[2] || 150;
const bad = /undefined|NaN|Infinity|\[object|null/;
const errors = []; const warns = []; let total = 0;
const err = (code, L, ti, msg, q) => errors.push(`${code} L${L} t${ti}: ${msg}\n   q: ${q && q.q}\n   ans: ${q && q.ans}${q && q.choices ? '\n   choices: ' + q.choices.join(' | ') : ''}`);

const codes = UNITS.flatMap((u) => u.sections.map((s) => s[0]));
for (const code of codes) if (!BANK[code]) errors.push(`missing bank for ${code}`);
for (const code of Object.keys(BANK)) if (!codes.includes(code)) errors.push(`bank has unknown section ${code}`);

for (const code of codes) {
  for (const L of [1, 2, 3]) {
    const tis = templatesFor(code, L);
    if (tis.length < 2) warns.push(`${code} L${L}: only ${tis.length} template(s)`);
    for (const ti of tis) {
      for (let i = 0; i < N; i++) {
        let q; try { q = BANK[code][ti](L); } catch (e) { err(code, L, ti, 'THROW ' + e.message, null); break; }
        if (!q) continue; q.ti = ti; total++;
        const text = [q.q, q.ans, q.hint, ...(q.steps || []), ...(q.choices || []), q.unit || ''].join(' ');
        if (bad.test(text)) { err(code, L, ti, 'bad token in text', q); continue; }
        if (!q.q || !q.hint || !Array.isArray(q.steps) || !q.steps.length) { err(code, L, ti, 'missing q/hint/steps', q); continue; }
        if (/[+−×÷=] −\d/.test(q.q.replace(/= −/g, '=X'))) warns.push(`${code} L${L} t${ti}: unbracketed negative: ${q.q}`);
        if (q.svg && (!q.svg.startsWith('<svg') || /NaN|undefined/.test(q.svg))) { err(code, L, ti, 'bad svg', q); continue; }
        if (q.kind === 'mc') {
          if (q.choices.length < 2) { err(code, L, ti, 'too few choices', q); continue; }
          if (q.choices.length < 3) warns.push(`${code} L${L} t${ti}: ${q.choices.length} choices`);
          if (new Set(q.choices).size !== q.choices.length) { err(code, L, ti, 'duplicate choices', q); continue; }
          if (!q.choices.includes(q.ans)) { err(code, L, ti, 'answer not in choices', q); continue; }
        } else {
          if (!check(q, q.ans)) { err(code, L, ti, 'own answer fails checker', q); continue; }
          for (const a of q.accept || []) if (!check(q, a)) { err(code, L, ti, `accept "${a}" fails`, q); }
          if (q.kind === 'num' && !isFinite(+q.ans)) { err(code, L, ti, 'non-numeric num answer', q); continue; }
        }
        if (i === 0) { const s = similarQuestion(code, L, q); if (!s) err(code, L, ti, 'no similar question', q); }
      }
    }
    for (let r = 0; r < 5; r++) { const quiz = buildQuiz(code, L, QUESTIONS_PER_TRIAL); if (quiz.length < QUESTIONS_PER_TRIAL) { warns.push(`${code} L${L}: quiz only ${quiz.length} questions`); break; } }
  }
}
// spot checks of the checker
const spot = [
  [{ kind: 'num', ans: '-3' }, '−3', true], [{ kind: 'num', ans: '0.75' }, '3/4', true], [{ kind: 'num', ans: '5' }, 'x = 5', true],
  [{ kind: 'frac', ans: '3/4', exact: true, form: 'simplest' }, '6/8', false], [{ kind: 'frac', ans: '7/3', exact: true, form: 'simplest' }, '2 1/3', true],
  [{ kind: 'frac', ans: '2 1/3', exact: true, form: 'mixed' }, '7/3', false], [{ kind: 'frac', ans: '7/3', exact: true, form: 'improper' }, '2 1/3', false],
  [{ kind: 'frac', ans: '1/3', exact: false }, '2/6', true], [{ kind: 'frac', ans: '1/3', exact: false }, '0.5', false],
  [{ kind: 'expr', ans: '6x+4' }, '4 + 6x', true], [{ kind: 'expr', ans: '6x+4' }, '3x+3x+4', false], [{ kind: 'expr', ans: '6x+4' }, '2(3x+2)', false], [{ kind: 'expr', ans: '5g-h' }, '-h + 5g', true],
  [{ kind: 'coord', ans: '(3, -2)' }, '3,−2', true], [{ kind: 'ratio', ans: '2:3', exact: true }, '4:6', false], [{ kind: 'ratio', ans: '2:3', exact: true }, '2 : 3', true],
  [{ kind: 'num', ans: '40', unit: '%' }, '40%', true], [{ kind: 'num', ans: '12000' }, '12 000', true],
];
for (const [q, g, want] of spot) if (check(q, g) !== want) errors.push(`checker: ${JSON.stringify(q)} given "${g}" expected ${want}`);

const uw = [...new Set(warns)];
console.log(`Checked ${total} generated questions across ${codes.length} sections.`);
console.log(`Warnings (${uw.length}):\n  ` + uw.slice(0, 60).join('\n  '));
console.log(`Errors (${errors.length}):\n` + [...new Set(errors)].slice(0, 40).join('\n'));
process.exit(errors.length ? 1 : 0);
