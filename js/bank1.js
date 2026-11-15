// Units 1–5: Integers; Expressions, formulae and equations; Place value and rounding; Decimals; Angles.
import { ri, pick, shuffle, nz, gcd, lcm, clean, D, P, F, FU, $ } from './util.js';
import { num, frq, expr, mc, lin, LETTERS } from './bank-common.js';
import * as S from './svg.js';

const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const pow10 = (k) => '10' + String(k).split('').map((c) => SUP[c]).join('');
const mults = (n, upto) => { const a = []; for (let k = n; k <= upto && a.length < 10; k += n) a.push(k); return a.join(', ') + (upto / n > 10 ? ', …' : ''); };
const factors = (n) => { const f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; };
const range = (L, a) => a[L - 1];

export const UNITS_1_5 = {
  /* ---------------- 1.1 Adding and subtracting integers ---------------- */
  '1.1': [
    (L) => {
      const r = range(L, [10, 25, 60]); let a = nz(-r, r), b = nz(-r, r); if (a > 0 && b > 0) a = -a;
      return num(`Work out ${D(a)} + ${P(b)}.`, a + b, {
        hint: b < 0 ? 'Adding a negative number is the same as subtracting.' : `Start at ${D(a)} on a number line and move ${b} to the right.`,
        steps: b < 0 ? [`${D(a)} + ${P(b)} is the same as ${D(a)} − ${D(-b)}`, `= ${D(a + b)}`] : [`Start at ${D(a)} and move ${b} to the right.`, `= ${D(a + b)}`],
      });
    },
    (L) => {
      const r = range(L, [10, 25, 60]); const a = nz(-r, r); let b = nz(-r, r); if (Math.random() < 0.6 && b > 0) b = -b;
      return num(`Work out ${D(a)} − ${P(b)}.`, a - b, {
        hint: b < 0 ? 'Subtracting a negative number is the same as adding the positive number.' : `Start at ${D(a)} on a number line and move ${b} to the left.`,
        steps: b < 0 ? [`Subtracting ${D(b)} is the same as adding ${-b}.`, `${D(a)} + ${-b} = ${D(a - b)}`] : [`Start at ${D(a)} and move ${b} to the left.`, `= ${D(a - b)}`],
      });
    },
    (L) => {
      const r = range(L, [10, 20, 50]); const a = nz(-r, r), x = nz(-r, r), c = a + x;
      return num(`Find the missing number.\n${D(a)} + □ = ${D(c)}`, x, {
        hint: 'Work backwards: start with the answer and subtract the number you know.',
        steps: [`□ = ${D(c)} − ${P(a)}`, `= ${D(x)}`, `Check: ${D(a)} + ${P(x)} = ${D(c)} ✓`],
      });
    },
    (L) => {
      const t = ri(-12, 6) - (L === 3 ? 10 : 0), c = ri(3, L === 1 ? 12 : 22), rise = L === 1 ? true : Math.random() < 0.5, end = rise ? t + c : t - c;
      const place = pick(['on the mountain', 'in the ice cave', 'at the snowy pass', 'at the frozen lake']);
      return num(`At 6 am the temperature ${place} is ${D(t)}°C. By noon it has ${rise ? 'risen' : 'fallen'} by ${c} degrees. What is the temperature at noon, in °C?`, end, {
        unit: '°C', hint: rise ? 'Risen means add.' : 'Fallen means subtract.',
        steps: [`${D(t)} ${rise ? '+' : '−'} ${c} = ${D(end)}`, `The temperature at noon is ${D(end)}°C.`],
      });
    },
    (L) => {
      if (L === 1) return null;
      const r = L === 2 ? 15 : 40; const a = nz(-r, r), b = nz(-r, r), c = nz(-r, r);
      return num(`Work out ${D(a)} + ${P(b)} − ${P(c)}.`, a + b - c, {
        hint: 'Work from left to right, one step at a time.',
        steps: [`${D(a)} + ${P(b)} = ${D(a + b)}`, `${D(a + b)} − ${P(c)} = ${D(a + b - c)}`],
      });
    },
    (L) => {
      const r = range(L, [10, 20, 40]); const a = nz(-r, r), b = -ri(2, r), ans = a - b;
      return mc(`What is ${D(a)} − ${P(b)}?`, D(ans), [D(a + b), D(-ans), D(-a + b), D(ans + 2)], {
        hint: 'Two minus signs next to each other: subtracting a negative is adding.',
        steps: [`${D(a)} − ${P(b)} = ${D(a)} + ${-b}`, `= ${D(ans)}`],
      });
    },
  ],
  /* ---------------- 1.2 Multiplying and dividing integers ---------------- */
  '1.2': [
    (L) => {
      const r = range(L, [6, 12, 12]), m2 = () => pick([1, -1]) * ri(2, r); let a = m2(), b = m2(); if (a > 0 && b > 0) b = -b;
      if (L === 3) { const c = nz(-5, 5); return num(`Work out ${D(a)} × ${P(b)} × ${P(c)}.`, a * b * c, { hint: 'Multiply two numbers first, then multiply by the third.', steps: [`${D(a)} × ${P(b)} = ${D(a * b)}`, `${D(a * b)} × ${P(c)} = ${D(a * b * c)}`] }); }
      return num(`Work out ${D(a)} × ${P(b)}.`, a * b, {
        hint: 'Same signs give a positive answer. Different signs give a negative answer.',
        steps: [`${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(a * b)}`, (a < 0) === (b < 0) ? 'The signs are the same, so the answer is positive.' : 'The signs are different, so the answer is negative.', `= ${D(a * b)}`],
      });
    },
    (L) => {
      const r = range(L, [6, 10, 15]); let b = nz(-r, r); if (Math.abs(b) === 1) b = b * 3; const ans = nz(-r, r), a = ans * b;
      return num(`Work out ${D(a)} ÷ ${P(b)}.`, ans, {
        hint: 'The sign rules for dividing are the same as for multiplying.',
        steps: [`${Math.abs(a)} ÷ ${Math.abs(b)} = ${Math.abs(ans)}`, (a < 0) === (b < 0) ? 'Same signs, so the answer is positive.' : 'Different signs, so the answer is negative.', `= ${D(ans)}`],
      });
    },
    (L) => {
      if (L === 1) return null;
      const c = pick([1, -1]) * ri(2, 6), v = nz(-8, 8), a = nz(-12, 12);
      if (Math.random() < 0.5) { const b = v - a; return num(`Work out (${D(a)} + ${P(b)}) × ${P(c)}.`, v * c, { hint: 'Work out the bracket first.', steps: [`${D(a)} + ${P(b)} = ${D(v)}`, `${D(v)} × ${P(c)} = ${D(v * c)}`] }); }
      const k = nz(-6, 6), cc = Math.abs(c) === 1 ? 3 : c, inner = k * cc, b = a - inner;
      return num(`Work out (${D(a)} − ${P(b)}) ÷ ${P(cc)}.`, k, { hint: 'Work out the bracket first.', steps: [`${D(a)} − ${P(b)} = ${D(inner)}`, `${D(inner)} ÷ ${P(cc)} = ${D(k)}`] });
    },
    (L) => {
      const r = range(L, [6, 9, 12]); let b = nz(-r, r); if (Math.abs(b) === 1) b = -4; const x = nz(-r, r), p = x * b;
      return num(`Find the missing number.\n□ × ${P(b)} = ${D(p)}`, x, { hint: 'Divide to undo the multiplication.', steps: [`□ = ${D(p)} ÷ ${P(b)}`, `= ${D(x)}`] });
    },
    () => {
      const v = pick([
        ['A negative number is multiplied by a negative number. The answer is always…', 'positive', ['negative', 'zero', 'the same as the first number']],
        ['A negative number is divided by a positive number. The answer is always…', 'negative', ['positive', 'zero', 'bigger than both numbers']],
        ['A positive number is multiplied by a negative number. The answer is always…', 'negative', ['positive', 'zero', 'an even number']],
      ]);
      return mc(v[0], v[1], v[2], { hint: 'Try it with small numbers, like −2 and 3.', steps: ['Same signs → positive. Different signs → negative.', `So the answer is always ${v[1]}.`] });
    },
    (L) => {
      if (L < 3) return null;
      const c = pick([2, 3, 4, 5, -2, -3]), a = nz(-9, 9) * c, b = nz(-6, 6), ans = (a * b) / c;
      return num(`Work out ${D(a)} × ${P(b)} ÷ ${P(c)}.`, ans, { hint: 'Work from left to right.', steps: [`${D(a)} × ${P(b)} = ${D(a * b)}`, `${D(a * b)} ÷ ${P(c)} = ${D(ans)}`] });
    },
  ],
  /* ---------------- 1.3 Lowest common multiples ---------------- */
  '1.3': [
    (L) => {
      if (L === 3) {
        const [a, b, c] = shuffle([2, 3, 4, 5, 6, 8, 9, 10, 12]).slice(0, 3), l = lcm(lcm(a, b), c);
        if (l > 180) return null;
        return num(`Find the lowest common multiple (LCM) of ${a}, ${b} and ${c}.`, l, { hint: 'Find the LCM of two of the numbers first, then include the third.', steps: [`LCM of ${a} and ${b} = ${lcm(a, b)}`, `LCM of ${lcm(a, b)} and ${c} = ${l}`] });
      }
      let a, b; do { a = ri(2, L === 1 ? 10 : 20); b = ri(2, L === 1 ? 10 : 20); } while (a === b || a % b === 0 || b % a === 0);
      const l = lcm(a, b);
      return num(`Find the lowest common multiple (LCM) of ${a} and ${b}.`, l, { hint: `List the multiples of ${Math.max(a, b)} and find the first one that ${Math.min(a, b)} also goes into.`, steps: [`Multiples of ${a}: ${mults(a, l)}`, `Multiples of ${b}: ${mults(b, l)}`, `The lowest number in both lists is ${l}.`] });
    },
    (L) => {
      const n = ri(3, L === 1 ? 9 : 15);
      return mc(`Which list shows the first four multiples of ${n}?`, `${n}, ${2 * n}, ${3 * n}, ${4 * n}`, [`${2 * n}, ${3 * n}, ${4 * n}, ${5 * n}`, `0, ${n}, ${2 * n}, ${3 * n}`, `${n}, ${n + 1}, ${n + 2}, ${n + 3}`, `1, ${n}, ${2 * n}, ${3 * n}`], { hint: 'The first multiple of a number is the number itself.', steps: [`Multiply ${n} by 1, 2, 3 and 4.`, `${n}, ${2 * n}, ${3 * n}, ${4 * n}`] });
    },
    (L) => {
      let a, b; do { a = ri(3, L === 1 ? 10 : 16); b = ri(3, L === 1 ? 10 : 16); } while (a === b || lcm(a, b) > 120 || a % b === 0 || b % a === 0);
      const l = lcm(a, b), ctx = pick([
        [`Two buses leave the bus station at 8:00 am. One bus leaves every ${a} minutes and the other every ${b} minutes. After how many minutes will they next leave together?`, 'minutes'],
        [`A red light flashes every ${a} seconds and a blue light flashes every ${b} seconds. They flash together now. After how many seconds will they next flash together?`, 'seconds'],
        [`Hot dogs come in packs of ${a} and buns come in packs of ${b}. What is the smallest number of hot dogs you can buy to have exactly the same number of buns?`, 'hot dogs'],
      ]);
      return num(ctx[0], l, { hint: 'You need the lowest common multiple.', steps: [`Multiples of ${a}: ${mults(a, l)}`, `Multiples of ${b}: ${mults(b, l)}`, `LCM = ${l}`] });
    },
    (L) => {
      if (L === 1) return null;
      const n = ri(6, 23), lim = pick([100, 200]), c = Math.floor((lim - 1) / n);
      return num(`How many multiples of ${n} are less than ${lim}?`, c, { hint: `Divide ${lim} by ${n} and look at the whole-number part.`, steps: [`${lim} ÷ ${n} = ${Math.floor(lim / n)} remainder ${lim % n}`, lim % n === 0 ? `${lim} itself is a multiple but is not less than ${lim}, so the answer is ${c}.` : `So there are ${c} multiples less than ${lim}.`] });
    },
    (L) => {
      if (L < 3) return null;
      const [p, q] = pick([[5, 9], [4, 10], [6, 8], [3, 10], [4, 9], [6, 10], [4, 6], [3, 8]]); const s = p + q, l = lcm(p, q);
      const others = []; for (let x = 2; x < s / 2; x++) { const y = s - x; if (x !== p && x !== q && lcm(x, y) !== l) others.push(`${x} and ${y}`); }
      return mc(`Two numbers add up to ${s}. Their lowest common multiple is ${l}. What are the two numbers?`, `${Math.min(p, q)} and ${Math.max(p, q)}`, others, { hint: `List pairs that add up to ${s} and check the LCM of each.`, steps: [`${p} + ${q} = ${s}`, `Multiples of ${Math.max(p, q)}: ${mults(Math.max(p, q), l)}. ${l} is the first that ${Math.min(p, q)} goes into.`, `LCM = ${l} ✓`] });
    },
  ],
  /* ---------------- 1.4 Highest common factors ---------------- */
  '1.4': [
    (L) => {
      let h, m, n; do { h = ri(2, range(L, [6, 12, 15])); m = ri(1, range(L, [6, 8, 9])); n = ri(2, range(L, [7, 9, 11])); } while (m === n || gcd(m, n) !== 1 || h * Math.max(m, n) > (L === 1 ? 60 : 150));
      const a = h * m, b = h * n;
      return num(`Find the highest common factor (HCF) of ${a} and ${b}.`, h, { hint: `List the factors of the smaller number, then check which ones also go into the bigger number.`, steps: [`Factors of ${a}: ${factors(a).join(', ')}`, `Factors of ${b}: ${factors(b).join(', ')}`, `The highest number in both lists is ${h}.`] });
    },
    (L) => {
      let h, m, n; do { h = ri(2, L === 1 ? 6 : 12); m = ri(1, 8); n = ri(2, 11); } while (m >= n || gcd(m, n) !== 1);
      const a = h * m, b = h * n;
      return frq(`Use the HCF to write ${FU(a, b)} in its simplest form.`, a, b, { hint: `Find the HCF of ${a} and ${b}, then divide the top and bottom by it.`, steps: [`HCF of ${a} and ${b} is ${h}.`, `${a} ÷ ${h} = ${m} and ${b} ÷ ${h} = ${n}`, `${FU(a, b)} = ${F(m, n)}`] });
    },
    (L) => {
      let h, m, n; do { h = ri(3, L === 1 ? 8 : 12); m = ri(2, 6); n = ri(2, 7); } while (m === n || gcd(m, n) !== 1);
      const a = h * m, b = h * n, [t1, t2, thing] = pick([['red beads', 'blue beads', 'bracelets'], ['apples', 'oranges', 'fruit baskets'], ['pencils', 'erasers', 'gift bags'], ['potions', 'shields', 'treasure chests']]);
      return num(`Ana has ${a} ${t1} and ${b} ${t2}. She makes identical ${thing} and uses all of them. What is the greatest number of ${thing} she can make?`, h, { hint: 'The number of groups must divide both numbers exactly. You want the highest one.', steps: [`Factors of ${a}: ${factors(a).join(', ')}`, `Factors of ${b}: ${factors(b).join(', ')}`, `HCF = ${h}, so ${h} ${thing}.`] });
    },
    (L) => {
      const N = pick([24, 30, 36, 40, 42, 48, 54, 56, 60, 72, 84, 90]).valueOf() * (L === 3 ? 2 : 1), fs_ = factors(N).filter((f) => f > 2 && f < N);
      const yes = pick(fs_), no = []; for (let k = 3; k < 30 && no.length < 6; k++) if (N % k) no.push(k);
      return mc(`Which number is a factor of ${N}?`, yes, shuffle(no), { hint: `A factor divides into ${N} with no remainder.`, steps: [`${N} ÷ ${yes} = ${N / yes}, with no remainder.`, `So ${yes} is a factor of ${N}.`] });
    },
    (L) => {
      if (L < 3) return null;
      let h, a, b, c; do { h = ri(2, 9); [a, b, c] = shuffle([2, 3, 4, 5, 7]).slice(0, 3).map((x) => x * h); } while (gcd(gcd(a, b), c) !== h);
      return num(`Find the HCF of ${a}, ${b} and ${c}.`, h, { hint: 'Find the HCF of two numbers first, then check the third.', steps: [`HCF of ${a} and ${b} = ${gcd(a, b)}`, `HCF of ${gcd(a, b)} and ${c} = ${h}`] });
    },
    (L) => {
      const N = pick(L === 1 ? [12, 16, 18, 20, 15, 28] : [24, 30, 36, 40, 45, 48, 50, 60]), f = factors(N);
      return num(`How many factors does ${N} have?`, f.length, { hint: 'Find the factors in pairs that multiply to make the number.', steps: [`Factor pairs: ${f.filter((x) => x * x <= N).map((x) => `${x} × ${N / x}`).join(', ')}`, `Factors: ${f.join(', ')}`, `That is ${f.length} factors.`] });
    },
  ],
  /* ---------------- 1.5 Tests for divisibility ---------------- */
  '1.5': [
    (L) => {
      const k = pick(L === 1 ? [3, 4, 9] : L === 2 ? [3, 4, 6, 9] : [6, 8, 9, 11]);
      const tests = { 3: 'The sum of the digits is divisible by 3.', 4: 'The last two digits make a number divisible by 4.', 6: 'It is even and the sum of its digits is divisible by 3.', 8: 'The last three digits make a number divisible by 8.', 9: 'The sum of the digits is divisible by 9.', 11: 'The alternating sum of the digits (+ − + −) is 0 or a multiple of 11.' };
      const yes = k * ri(Math.ceil(1000 / k), Math.floor(9999 / k)); const no = []; while (no.length < 3) { const x = yes + ri(1, k - 1) * pick([1, -1]) + 10 * ri(0, 5); if (x % k && !no.includes(x)) no.push(x); }
      return mc(`Which of these numbers is divisible by ${k}?`, D(yes), no.map(D), { hint: tests[k], steps: [tests[k], k === 3 || k === 9 || k === 6 ? `${yes}: digit sum = ${String(yes).split('').join(' + ')} = ${String(yes).split('').reduce((s, d) => s + +d, 0)}` : `${D(yes)} ÷ ${k} = ${yes / k}`, `So ${D(yes)} is divisible by ${k}.`] });
    },
    (L) => {
      let digits, miss, pos; do { const len = L === 1 ? 4 : 5; digits = Array.from({ length: len }, (_, i) => (i === 0 ? ri(1, 9) : ri(0, 9))); pos = ri(1, len - 1); const s = digits.reduce((a, d, i) => a + (i === pos ? 0 : d), 0); miss = (9 - (s % 9)) % 9; } while (miss === 0);
      digits[pos] = miss; const shown = digits.map((d, i) => (i === pos ? '□' : d)).join('');
      return num(`The number ${shown} is divisible by 9. What is the missing digit?`, miss, { hint: 'For a number to be divisible by 9, its digits must add up to a multiple of 9.', steps: [`Add the digits you know: ${digits.filter((_, i) => i !== pos).join(' + ')} = ${digits.reduce((a, d, i) => a + (i === pos ? 0 : d), 0)}`, `The next multiple of 9 needs ${miss} more.`, `The missing digit is ${miss}.`] });
    },
    () => {
      const yes = Math.random() < 0.5; let n; do { n = ri(1000, 99999); } while ((n % 4 === 0) !== yes || n % 2);
      if (!yes && n % 2) n += 0; const last2 = n % 100; const l2 = String(last2).padStart(2, '0');
      const isEven = n % 2 === 0;
      return mc(`Is ${D(n)} divisible by 4?`, yes ? `Yes, because ${l2} is divisible by 4` : `No, because ${l2} is not divisible by 4`, [yes ? `No, because ${l2} is not divisible by 4` : `Yes, because ${l2} is divisible by 4`, isEven ? 'Yes, because it is an even number' : 'No, because it is an odd number', `Yes, because its digits add up to an even number`], { hint: 'Look at the last two digits only.', steps: [`The last two digits are ${l2}.`, `${last2} ÷ 4 = ${clean(last2 / 4)}`, yes ? 'No remainder, so it is divisible by 4.' : 'There is a remainder, so it is not divisible by 4.'] });
    },
    () => mc('A number is divisible by 6 if…', 'it is even and divisible by 3', ['it ends in 6', 'it is divisible by 2 or by 3', 'its digits add up to 6'], { hint: '6 = 2 × 3', steps: ['6 = 2 × 3, so the number must pass the test for 2 and the test for 3.', 'Even, and digit sum divisible by 3.'] }),
    (L) => {
      if (L === 1) return null;
      const opts = [2, 3, 4, 5, 6, 9, 10]; let N, notF; do { N = ri(100, 999) * pick([2, 3, 6, 10, 12]); const f = opts.filter((k) => N % k === 0), nf = opts.filter((k) => N % k); if (f.length >= 3 && nf.length >= 1) { notF = pick(nf); break; } } while (true);
      const fs2 = shuffle(opts.filter((k) => N % k === 0)).slice(0, 3);
      return mc(`Which of these is NOT a factor of ${D(N)}?`, notF, fs2, { hint: 'Use the divisibility tests for each number.', steps: [`${D(N)} ÷ ${notF} = ${Math.floor(N / notF)} remainder ${N % notF}`, `So ${notF} is not a factor.`] });
    },
    (L) => {
      if (L < 3) return null;
      const yes = 11 * ri(92, 908); const no = []; while (no.length < 3) { const x = yes + ri(1, 10); if (x % 11 && !no.includes(x)) no.push(x); }
      const ds = String(yes).split('').map(Number), alt = ds.reduce((s, d, i) => s + (i % 2 ? -d : d), 0);
      return mc('Which of these numbers is divisible by 11?', D(yes), no.map(D), { hint: 'Find the alternating sum of the digits: + − + −. If it is 0 or a multiple of 11, the number is divisible by 11.', steps: [`${ds.map((d, i) => (i ? (i % 2 ? '− ' : '+ ') : '') + d).join(' ')} = ${D(alt)}`, `${D(alt)} is 0 or a multiple of 11, so ${D(yes)} is divisible by 11.`] });
    },
  ],
  /* ---------------- 1.6 Square roots and cube roots ---------------- */
  '1.6': [
    (L) => { const k = ri(2, range(L, [12, 20, 25])); return num(`Work out √${k * k}.`, k, { hint: 'Which number multiplied by itself gives this number?', steps: [`${k} × ${k} = ${k * k}`, `So √${k * k} = ${k}`] }); },
    (L) => {
      const k = L === 1 ? ri(1, 5) : L === 2 ? nz(-5, 6) : nz(-10, 10);
      return num(`Work out ∛${D(k ** 3)}.`, k, { hint: 'Which number multiplied by itself three times gives this number?', steps: [`${P(k)} × ${P(k)} × ${P(k)} = ${D(k ** 3)}`, `So ∛${D(k ** 3)} = ${D(k)}`] });
    },
    (L) => {
      if (L === 1) return null;
      const s = ri(2, 12), c = L === 2 ? ri(1, 5) : nz(-6, 6), op = pick(['+', '−', '×']);
      const ans = op === '+' ? s + c : op === '−' ? c - s : s * c;
      const q = op === '−' ? `∛${D(c ** 3)} − √${s * s}` : `√${s * s} ${op} ∛${D(c ** 3)}`;
      return num(`Work out ${q}.`, ans, { hint: 'Work out each root first.', steps: [`√${s * s} = ${s} and ∛${D(c ** 3)} = ${D(c)}`, op === '−' ? `${D(c)} − ${s} = ${D(ans)}` : `${s} ${op} ${P(c)} = ${D(ans)}`] });
    },
    (L) => {
      let n; do { n = ri(5, L === 1 ? 60 : 200); } while (Number.isInteger(Math.sqrt(n)));
      const k = Math.floor(Math.sqrt(n));
      return mc(`√${n} lies between which two whole numbers?`, `${k} and ${k + 1}`, [`${k - 1} and ${k}`, `${k + 1} and ${k + 2}`, `${Math.floor(n / 2)} and ${Math.floor(n / 2) + 1}`], { hint: `Find the square numbers just below and just above ${n}.`, steps: [`${k}² = ${k * k} and ${k + 1}² = ${(k + 1) ** 2}`, `${k * k} < ${n} < ${(k + 1) ** 2}`, `So √${n} is between ${k} and ${k + 1}.`] });
    },
    (L) => {
      const cube = Math.random() < (L === 1 ? 0.3 : 0.5), k = cube ? ri(2, L === 3 ? 10 : 6) * (L === 3 && Math.random() < 0.4 ? -1 : 1) : ri(2, L === 1 ? 12 : 20);
      return cube ? num(`Work out ${P(k)}³.`, k ** 3, { hint: 'Cubed means multiply the number by itself three times.', steps: [`${P(k)} × ${P(k)} × ${P(k)}`, `= ${D(k ** 3)}`] }) : num(`Work out ${k}².`, k * k, { hint: 'Squared means multiply the number by itself.', steps: [`${k} × ${k} = ${k * k}`] });
    },
  ],

  /* ---------------- 2.1 Constructing expressions ---------------- */
  '2.1': [
    (L) => {
      const v = pick(LETTERS), k = ri(2, 12);
      const items = [
        [`${k} more than ${v}`, `${v} + ${k}`, [`${k}${v}`, `${v} − ${k}`, `${k} − ${v}`]],
        [`${k} less than ${v}`, `${v} − ${k}`, [`${k} − ${v}`, `${v} + ${k}`, `${k}${v}`]],
        [`${v} multiplied by ${k}`, `${k}${v}`, [`${v} + ${k}`, `{${v}/${k}}`, `${v} − ${k}`]],
        [`${v} divided by ${k}`, `{${v}/${k}}`, [`{${k}/${v}}`, `${k}${v}`, `${v} − ${k}`]],
        [`${k} subtracted from ${v}`, `${v} − ${k}`, [`${k} − ${v}`, `${v} + ${k}`, `{${v}/${k}}`]],
      ];
      const it = pick(items);
      return mc(`Write an expression for: ${it[0]}.`, it[1], it[2], { hint: 'Read it slowly. Which number or letter comes first?', steps: [`"${it[0]}" is written ${it[1]}.`] });
    },
    (L) => {
      if (L === 1) return null;
      const [v, w] = shuffle(LETTERS).slice(0, 2), k = ri(2, 9);
      const items = [
        [`${v} more than ${k} times ${w}`, `${k}${w} + ${v}`, [`${k}${v} + ${w}`, `${k}(${w} + ${v})`, `${w} + ${k} + ${v}`]],
        [`${k} times ${v} multiplied by ${w}`, `${k}${v}${w}`, [`${k}${v} + ${w}`, `${k} + ${v}${w}`, `${v} + ${k}${w}`]],
        [`${w} less than ${k} times ${v}`, `${k}${v} − ${w}`, [`${w} − ${k}${v}`, `${k}(${v} − ${w})`, `${k}${w} − ${v}`]],
        [`${v} added to ${w}, then multiplied by ${k}`, `${k}(${v} + ${w})`, [`${k}${v} + ${w}`, `${v} + ${k}${w}`, `${k} + ${v} + ${w}`]],
      ];
      const it = pick(items);
      return mc(`Write an expression for: ${it[0]}.`, it[1], it[2], { hint: 'Remember: multiplication is written with no × sign, like 3x.', steps: [`"${it[0]}" is written ${it[1]}.`] });
    },
    (L) => {
      const k = ri(2, 9), items = [
        [`A bag has b apples. Tom eats ${k} of them. How many apples are left?`, `b − ${k}`, [`${k} − b`, `${k}b`, `b + ${k}`]],
        [`Pens come in packs of n. Mia buys ${k} packs. How many pens does she have?`, `${k}n`, [`n + ${k}`, `{n/${k}}`, `${k} − n`]],
        [`A pizza is cut into s slices and shared equally between ${k} friends. How many slices does each friend get?`, `{s/${k}}`, [`${k}s`, `s − ${k}`, `{${k}/s}`]],
        [`Sam is a years old. His grandad is ${k} times as old. How old is his grandad?`, `${k}a`, [`a + ${k}`, `{a/${k}}`, `a${k}`]],
        [`Kai has x cards and Ana has y cards. How many cards do they have altogether?`, 'x + y', ['xy', 'x − y', '2x']],
        [`A rope is m metres long. ${k} metres are cut off. How long is the rope now?`, `m − ${k}`, [`${k} − m`, `{m/${k}}`, `m + ${k}`]],
      ];
      if (L === 3) items.push([`Adult tickets cost $t and child tickets cost $c. What is the cost of ${k} adult tickets and 3 child tickets?`, `${k}t + 3c`, [`3t + ${k}c`, `${k + 3}tc`, `${k}(t + 3c)`]]);
      const it = pick(items);
      return mc(it[0], it[1], it[2], { hint: 'Think: would you add, subtract, multiply or divide if the letters were numbers?', steps: [`The expression is ${it[1]}.`] });
    },
    (L) => {
      const v = pick(LETTERS), a = ri(2, 9), b = ri(2, 12);
      return mc(`Which description matches ${a}${v} + ${b}?`, `${b} more than ${a} times ${v}`, [`${a} more than ${b} times ${v}`, `${b} times ${v} plus ${a}`, `${v} more than ${a} times ${b}`, `${a} plus ${v} plus ${b}`], { hint: `${a}${v} means ${a} × ${v}.`, steps: [`${a}${v} means ${a} times ${v}.`, `+ ${b} means ${b} more.`] });
    },
  ],
  /* ---------------- 2.2 Using expressions and formulae ---------------- */
  '2.2': [
    (L) => {
      const v = pick(LETTERS), a = ri(2, 9), b = ri(1, 15) * (L === 1 ? 1 : pick([1, -1])), x = L === 1 ? ri(1, 10) : nz(-8, 10);
      const ans = a * x + b, e = lin([[a, v], [b, '']]);
      return num(`Work out the value of ${e} when ${v} = ${D(x)}.`, ans, { hint: `Replace ${v} with ${D(x)}. Multiply first, then add or subtract.`, steps: [`${a} × ${P(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)}`, `= ${D(a * x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)}`, `= ${D(ans)}`] });
    },
    (L) => {
      const [v, w] = shuffle(LETTERS).slice(0, 2), p = ri(2, 6), q = ri(1, 5), x = L === 1 ? ri(1, 9) : nz(-6, 9), y = L === 1 ? ri(1, 9) : nz(-6, 9), ans = p * x - q * y;
      return num(`Find the value of ${lin([[p, v], [-q, w]])} when ${v} = ${D(x)} and ${w} = ${D(y)}.`, ans, { hint: 'Substitute both values, then multiply before you subtract.', steps: [`${p} × ${P(x)} − ${q === 1 ? '' : q + ' × '}${P(y)}`, `= ${D(p * x)} − ${P(q * y)}`, `= ${D(ans)}`] });
    },
    (L) => {
      const items = [
        () => { const l = ri(3, 20), w = ri(2, 15); return [`The formula for the perimeter of a rectangle is P = 2l + 2w. Work out P when l = ${l} cm and w = ${w} cm.`, 2 * l + 2 * w, [`2 × ${l} + 2 × ${w}`, `= ${2 * l} + ${2 * w}`, `= ${2 * l + 2 * w}`], 'cm']; },
        () => { const n = ri(2, 15), c = ri(2, 9), f = ri(5, 20); return [`A cafe uses the formula C = ${c}n + ${f} to work out the cost, in dollars, of a party for n people. Work out C when n = ${n}.`, c * n + f, [`${c} × ${n} + ${f}`, `= ${c * n} + ${f}`, `= ${c * n + f}`], '$']; },
        () => { const m = ri(1, 6), a = pick([20, 25, 30, 40]), b = pick([15, 20, 30]); return [`The time, T minutes, to roast m kg of vegetables is T = ${a}m + ${b}. Work out T when m = ${m}.`, a * m + b, [`${a} × ${m} + ${b}`, `= ${a * m} + ${b}`, `= ${a * m + b}`], 'minutes']; },
        () => { const s = ri(3, 25); return [`The perimeter of a square is P = 4s. Work out P when s = ${s} m.`, 4 * s, [`4 × ${s}`, `= ${4 * s}`], 'm']; },
      ];
      const [q, ans, steps, unit] = pick(items)();
      return num(q, ans, { unit, hint: 'Replace each letter with its number. Multiply before you add.', steps });
    },
    (L) => {
      if (L < 3) return null;
      if (Math.random() < 0.5) { const x = nz(-9, 9), c = ri(1, 20) * pick([1, -1]); return num(`Work out the value of x² ${c < 0 ? '−' : '+'} ${Math.abs(c)} when x = ${D(x)}.`, x * x + c, { hint: 'A negative number squared is positive.', steps: [`${P(x)}² = ${x * x}`, `${x * x} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${D(x * x + c)}`] }); }
      const c = ri(2, 6), k = nz(-6, 9), a = ri(-10, 20), b = k * c - a;
      return num(`Work out the value of {(a + b)/c} when a = ${D(a)}, b = ${D(b)} and c = ${c}.`, k, { hint: 'Work out the top first, then divide.', steps: [`a + b = ${D(a)} + ${P(b)} = ${D(a + b)}`, `${D(a + b)} ÷ ${c} = ${D(k)}`] });
    },
    () => {
      const v = pick(['P = 4s', 'A = lw', 'C = 5n + 2', 'T = 30m + 15', 'y = 3x − 1']);
      return mc('Which of these is a formula?', v, ['4s + 3', '3x − 2y', '7mn', '2a + b − 5'], { hint: 'A formula has an = sign. It shows how one quantity is worked out from others.', steps: [`${v} has an = sign and letters on both sides, so it is a formula.`, 'The others are expressions (no = sign).'] });
    },
    (L) => {
      if (L === 1) return null;
      const a = ri(2, 6), b = ri(2, 9), [thing, per, base] = pick([['taxi ride of k km', 'per km', 'C'], ['bike hire for k hours', 'per hour', 'C'], ['phone call of k minutes', 'per minute', 'C']]);
      return mc(`A company charges $${b} plus $${a} ${per}. Which formula gives the cost, $C, of a ${thing}?`, `C = ${a}k + ${b}`, [`C = ${b}k + ${a}`, `C = ${a + b}k`, `C = k + ${a + b}`], { hint: `The $${a} is paid for every unit, so it multiplies k.`, steps: [`${per}: ${a} × k = ${a}k`, `Add the fixed charge: ${a}k + ${b}`, `C = ${a}k + ${b}`] });
    },
  ],
  /* ---------------- 2.3 Collecting like terms ---------------- */
  '2.3': [
    (L) => {
      const v = pick(LETTERS), a = ri(2, 12), b = ri(1, 9), plus = L === 1 || Math.random() < 0.5 || a <= b;
      const c = plus ? a + b : a - b;
      return expr(`Simplify ${a}${v} ${plus ? '+' : '−'} ${b === 1 ? '' : b}${v}.`, lin([[c, v]], false), { hint: `Add or subtract the numbers in front of ${v}.`, steps: [`${a} ${plus ? '+' : '−'} ${b} = ${c}`, `So the answer is ${lin([[c, v]])}.`] });
    },
    (L) => {
      const v = pick(LETTERS), a = ri(2, 9), b = ri(1, 12), c = ri(1, 8) * (L === 1 ? 1 : pick([1, -1])), d = ri(1, 12) * (L === 1 ? 1 : pick([1, -1]));
      const q = lin([[a, v], [b, ''], [c, v], [d, '']]), ans = lin([[a + c, v], [b + d, '']], false);
      return expr(`Simplify ${q}.`, ans, { hint: `Collect the ${v} terms together and the number terms together.`, steps: [`${v} terms: ${a}${v} ${c < 0 ? '−' : '+'} ${Math.abs(c)}${v} = ${lin([[a + c, v]])}`, `Numbers: ${b} ${d < 0 ? '−' : '+'} ${Math.abs(d)} = ${D(b + d)}`, `Answer: ${lin([[a + c, v], [b + d, '']])}`] });
    },
    (L) => {
      if (L === 1) return null;
      const [v, w] = shuffle(['g', 'h', 'x', 'y', 'a', 'b', 'm', 'n']).slice(0, 2), a = ri(2, 9), b = ri(1, 8), c = ri(1, 7) * (L === 3 ? pick([1, -1]) : 1), d = ri(1, 7) * pick([1, -1]);
      return expr(`Simplify ${lin([[a, v], [b, w], [c, v], [d, w]])}.`, lin([[a + c, v], [b + d, w]], false), { hint: `${v} terms and ${w} terms are different kinds. Collect each kind separately.`, steps: [`${v}: ${a} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${a + c}`, `${w}: ${b} ${d < 0 ? '−' : '+'} ${Math.abs(d)} = ${b + d}`, `Answer: ${lin([[a + c, v], [b + d, w]])}`] });
    },
    () => {
      const v = pick(LETTERS), a = ri(2, 8), b = ri(2, 7);
      return mc('Which statement is true?', `${a}${v} + ${b}${v} = ${a + b}${v}`, [`${a}${v} + ${b}${v} = ${a * b}${v}`, `${a}${v} + ${b} = ${a + b}${v}`, `${a}${v} × ${b} = ${a + b}${v}`, `${a + b}${v} − ${a}${v} = ${b}`], { hint: 'You can only add terms with the same letter.', steps: [`${a}${v} + ${b}${v}: ${a} + ${b} = ${a + b}`, `= ${a + b}${v}`] });
    },
    (L) => {
      if (Math.random() < 0.5) { const a = ri(2, 7), b = ri(1, 6); return expr(`A rectangle has length ${a}x cm and width ${b === 1 ? '' : b}x cm. Write an expression for its perimeter, in its simplest form.`, `${2 * (a + b)}x`, { hint: 'Perimeter = add all four sides.', steps: [`${a}x + ${b === 1 ? '' : b}x + ${a}x + ${b === 1 ? '' : b}x`, `= ${2 * (a + b)}x`] }); }
      const p = ri(1, 6), q = ri(2, 5), r = ri(2, 6), s = ri(1, 5);
      return expr(`A triangle has sides x + ${p}, ${q}x and ${r}x − ${s}. Write an expression for its perimeter, in its simplest form.`, lin([[1 + q + r, 'x'], [p - s, '']], false), { hint: 'Add the three sides, then collect like terms.', steps: [`x + ${p} + ${q}x + ${r}x − ${s}`, `x terms: 1 + ${q} + ${r} = ${1 + q + r}`, `numbers: ${p} − ${s} = ${D(p - s)}`, `= ${lin([[1 + q + r, 'x'], [p - s, '']])}`] });
    },
    (L) => {
      if (L < 3) return null;
      const a = ri(3, 8), b = ri(2, 6), c = ri(1, a - 1), d = ri(1, 7);
      return expr(`Simplify ${a}xy + ${b}x − ${c === 1 ? '' : c}xy + ${d}x.`, lin([[a - c, 'xy'], [b + d, 'x']], false), { letters: ['x', 'y'], hint: 'xy terms and x terms are different kinds of term.', steps: [`xy: ${a} − ${c} = ${a - c}`, `x: ${b} + ${d} = ${b + d}`, `= ${lin([[a - c, 'xy'], [b + d, 'x']])}`] });
    },
  ],
  /* ---------------- 2.4 Expanding brackets ---------------- */
  '2.4': [
    (L) => {
      const v = pick(LETTERS), a = ri(2, L === 1 ? 6 : 9), b = ri(1, 12), minus = L > 1 && Math.random() < 0.5;
      return expr(`Expand ${a}(${v} ${minus ? '−' : '+'} ${b}).`, lin([[a, v], [minus ? -a * b : a * b, '']], false), { hint: 'Multiply each term inside the bracket by the number outside.', steps: [`${a} × ${v} = ${a}${v}`, `${a} × ${b} = ${a * b}`, `= ${lin([[a, v], [minus ? -a * b : a * b, '']])}`] });
    },
    (L) => {
      if (L === 1) return null;
      const v = pick(LETTERS), a = ri(2, 8), b = ri(2, 6), c = ri(1, 9) * pick([1, -1]);
      return expr(`Expand ${a}(${lin([[b, v], [c, '']])}).`, lin([[a * b, v], [a * c, '']], false), { hint: 'Multiply both terms in the bracket.', steps: [`${a} × ${b}${v} = ${a * b}${v}`, `${a} × ${P(c)} = ${D(a * c)}`, `= ${lin([[a * b, v], [a * c, '']])}`] });
    },
    (L) => {
      if (L === 1) return null;
      const a = ri(2, 6), b = ri(1, 8), c = ri(2, 5), d = ri(1, 7) * (L === 3 ? pick([1, -1]) : 1);
      const ans = lin([[a + c, 'x'], [a * b + c * d, '']], false);
      return expr(`Expand and simplify ${a}(x + ${b}) + ${c}(${lin([[1, 'x'], [d, '']])}).`, ans, { hint: 'Expand each bracket, then collect like terms.', steps: [`${a}(x + ${b}) = ${a}x + ${a * b}`, `${c}(${lin([[1, 'x'], [d, '']])}) = ${lin([[c, 'x'], [c * d, '']])}`, `Total: ${lin([[a + c, 'x'], [a * b + c * d, '']])}`] });
    },
    (L) => {
      const a = ri(2, 9), p = ri(1, 5), q = ri(1, 9);
      return num(`Find the missing number.\n□(${p === 1 ? '' : p}x + ${q}) = ${a * p}x + ${a * q}`, a, { hint: `What do you multiply ${q} by to get ${a * q}?`, steps: [`${q} × □ = ${a * q}`, `□ = ${a * q} ÷ ${q} = ${a}`, `Check: ${a} × ${p === 1 ? '' : p}x = ${a * p}x ✓`] });
    },
    (L) => {
      const a = ri(2, 9), b = ri(2, 9);
      return mc(`What is ${a}(x + ${b}) expanded?`, `${a}x + ${a * b}`, [`${a}x + ${b}`, `x + ${a * b}`, `${a}x + ${a + b}`, `${a + b}x`], { hint: 'Both terms inside the bracket get multiplied.', steps: [`${a} × x = ${a}x`, `${a} × ${b} = ${a * b}`, `= ${a}x + ${a * b}`] });
    },
    (L) => {
      const a = ri(2, 9), b = ri(1, 12);
      return expr(`A rectangle is ${a} cm wide and (x + ${b}) cm long. Write an expression for its area, without brackets.`, `${a}x+${a * b}`, { unit: 'cm²', hint: 'Area = width × length.', steps: [`Area = ${a}(x + ${b})`, `= ${a}x + ${a * b}`] });
    },
  ],
  /* ---------------- 2.5 Constructing and solving equations ---------------- */
  '2.5': [
    (L) => {
      const v = pick(['x', 'y', 'n', 'm']), x = L === 1 ? ri(1, 20) : nz(-10, 25), a = ri(2, 20), plus = Math.random() < 0.5, b = plus ? x + a : x - a;
      return num(`Solve ${v} ${plus ? '+' : '−'} ${a} = ${D(b)}.`, x, { pad: 'num', hint: `Do the opposite: ${plus ? 'subtract' : 'add'} ${a} on both sides.`, steps: [`${v} = ${D(b)} ${plus ? '−' : '+'} ${a}`, `${v} = ${D(x)}`] });
    },
    (L) => {
      const v = pick(['x', 'y', 'n']), a = ri(2, 9), x = L === 1 ? ri(1, 12) : nz(-9, 12);
      if (Math.random() < 0.6) return num(`Solve ${a}${v} = ${D(a * x)}.`, x, { hint: `Divide both sides by ${a}.`, steps: [`${v} = ${D(a * x)} ÷ ${a}`, `${v} = ${D(x)}`] });
      return num(`Solve {${v}/${a}} = ${D(x)}.`, a * x, { hint: `Multiply both sides by ${a}.`, steps: [`${v} = ${D(x)} × ${a}`, `${v} = ${D(a * x)}`] });
    },
    (L) => {
      if (L === 1) return null;
      const v = pick(['x', 'y', 'n']), a = ri(2, 9), x = L === 2 ? ri(1, 12) : nz(-8, 12), b = ri(1, 20) * pick([1, -1]), c = a * x + b;
      return num(`Solve ${lin([[a, v], [b, '']])} = ${D(c)}.`, x, { hint: `First ${b > 0 ? 'subtract' : 'add'} ${Math.abs(b)}, then divide by ${a}.`, steps: [`${a}${v} = ${D(c)} ${b > 0 ? '−' : '+'} ${Math.abs(b)} = ${D(a * x)}`, `${v} = ${D(a * x)} ÷ ${a} = ${D(x)}`] });
    },
    (L) => {
      if (L < 3) return null;
      const a = ri(2, 6), b = ri(1, 9) * pick([1, -1]), x = nz(-6, 10), c = a * (x + b);
      return num(`Solve ${a}(${lin([[1, 'x'], [b, '']])}) = ${D(c)}.`, x, { hint: `Divide both sides by ${a} first, or expand the bracket.`, steps: [`${lin([[1, 'x'], [b, '']])} = ${D(c)} ÷ ${a} = ${D(x + b)}`, `x = ${D(x + b)} ${b > 0 ? '−' : '+'} ${Math.abs(b)} = ${D(x)}`] });
    },
    (L) => {
      if (L < 3) return null;
      const c = ri(1, 5), a = c + ri(1, 5), x = nz(-6, 10), b = ri(-15, 15), d = (a - c) * x + b;
      return num(`Solve ${lin([[a, 'x'], [b, '']])} = ${lin([[c, 'x'], [d, '']])}.`, x, { hint: `Subtract ${c}x from both sides so the x terms are on one side.`, steps: [`${lin([[a - c, 'x'], [b, '']])} = ${D(d)}`, `${a - c === 1 ? '' : a - c}x = ${D(d - b)}`, `x = ${D(x)}`] });
    },
    (L) => {
      if (L === 1) return null;
      const a = ri(2, 9), b = ri(1, 20), x = ri(2, 15), c = a * x + b, sub = L === 3 && Math.random() < 0.5;
      const c2 = sub ? a * x - b : c;
      return num(`I think of a number. I multiply it by ${a}, then ${sub ? 'subtract' : 'add'} ${b}. The answer is ${c2}. What number did I think of?`, x, { hint: 'Write an equation, or work backwards using inverse operations.', steps: [`${a}n ${sub ? '−' : '+'} ${b} = ${c2}`, `${a}n = ${c2} ${sub ? '+' : '−'} ${b} = ${a * x}`, `n = ${a * x} ÷ ${a} = ${x}`] });
    },
    (L) => {
      if (L < 3) return null;
      const a = ri(1, 9), x = ri(2, 15), P2 = 2 * (x + a) + 2 * x;
      return num(`A rectangle has length (x + ${a}) cm and width x cm. Its perimeter is ${P2} cm. Find x.`, x, { hint: 'Write an expression for the perimeter and set it equal to the perimeter given.', steps: [`Perimeter = 2(x + ${a}) + 2x = 4x + ${2 * a}`, `4x + ${2 * a} = ${P2}`, `4x = ${P2 - 2 * a}, so x = ${x}`] });
    },
  ],
  /* ---------------- 2.6 Inequalities ---------------- */
  '2.6': [
    () => {
      const k = ri(-9, 15), v = pick(['x', 'y', 'n']), sym = pick(['>', '<', '≥', '≤']), words = { '>': 'is greater than', '<': 'is less than', '≥': 'is greater than or equal to', '≤': 'is less than or equal to' };
      return mc(`What does ${v} ${sym} ${D(k)} mean?`, `${v} ${words[sym]} ${D(k)}`, Object.entries(words).filter(([s]) => s !== sym).map(([, w]) => `${v} ${w} ${D(k)}`), { hint: 'The small end of the sign points to the smaller number.', steps: [`${sym} means "${words[sym]}".`] });
    },
    (L) => {
      const k = ri(-4, 4) + (L === 1 ? 3 : 0), closed = Math.random() < 0.5, dir = pick([1, -1]), v = pick(['x', 'y']);
      const sym = dir > 0 ? (closed ? '≥' : '>') : (closed ? '≤' : '<');
      return mc('Which inequality is shown on the number line?', `${v} ${sym} ${D(k)}`, ['>', '<', '≥', '≤'].filter((s) => s !== sym).map((s) => `${v} ${s} ${D(k)}`), { svg: S.numberLine({ lo: k - 4, hi: k + 4, at: k, closed, dir }), hint: 'A filled circle means the number is included. An empty circle means it is not.', steps: [closed ? `The circle is filled, so ${D(k)} is included.` : `The circle is empty, so ${D(k)} is not included.`, `The arrow points ${dir > 0 ? 'right (bigger numbers)' : 'left (smaller numbers)'}.`, `So ${v} ${sym} ${D(k)}.`] });
    },
    (L) => {
      if (L === 1) return null;
      const a = ri(-6, 3), b = a + ri(2, 6), s1 = pick(['<', '≤']), s2 = pick(['<', '≤']);
      const lo = s1 === '<' ? a + 1 : a, hi = s2 === '<' ? b - 1 : b, list = []; for (let i = lo; i <= hi; i++) list.push(D(i));
      return num(`How many integers satisfy ${D(a)} ${s1} x ${s2} ${D(b)}?`, list.length, { hint: '< means the end number is not included. ≤ means it is.', steps: [`The integers are ${list.join(', ')}.`, `That is ${list.length} integers.`] });
    },
    (L) => {
      const k = ri(-5, 8), sym = pick(['>', '<']), v = 'x';
      const good = sym === '>' ? k + ri(1, 4) : k - ri(1, 4), bad = shuffle([k, sym === '>' ? k - 1 : k + 1, sym === '>' ? k - ri(2, 5) : k + ri(2, 5), sym === '>' ? k - 0.5 : k + 0.5]);
      return mc(`Which number satisfies ${v} ${sym} ${D(k)}?`, D(good), bad.map(D), { hint: `${sym === '>' ? 'Greater than' : 'Less than'} ${D(k)}. Is ${D(k)} itself allowed?`, steps: [`${D(good)} is ${sym === '>' ? 'greater' : 'less'} than ${D(k)}.`, `${D(k)} itself is not allowed with ${sym}.`] });
    },
    (L) => {
      if (L < 3) return null;
      const k = ri(-6, 6) + 0.5, big = Math.random() < 0.5;
      return big ? num(`What is the smallest integer that satisfies x > ${D(k)}?`, Math.ceil(k), { hint: 'Find the first whole number to the right of this number on a number line.', steps: [`Integers bigger than ${D(k)}: ${D(Math.ceil(k))}, ${D(Math.ceil(k) + 1)}, …`, `The smallest is ${D(Math.ceil(k))}.`] }) : num(`What is the largest integer that satisfies x < ${D(k)}?`, Math.floor(k), { hint: 'Find the first whole number to the left of this number on a number line.', steps: [`Integers smaller than ${D(k)}: ${D(Math.floor(k))}, ${D(Math.floor(k) - 1)}, …`, `The largest is ${D(Math.floor(k))}.`] });
    },
    () => {
      const k = ri(-5, 20), v = pick(['y', 'm', 'b']), w = pick([['is less than or equal to', '≤'], ['is greater than', '>'], ['is less than', '<'], ['is greater than or equal to', '≥']]);
      return mc(`Write this as an inequality: ${v} ${w[0]} ${D(k)}.`, `${v} ${w[1]} ${D(k)}`, ['>', '<', '≥', '≤'].filter((s) => s !== w[1]).map((s) => `${v} ${s} ${D(k)}`), { hint: '"or equal to" needs the line under the sign.', steps: [`${w[0]} → ${w[1]}`, `${v} ${w[1]} ${D(k)}`] });
    },
  ],

  /* ---------------- 3.1 Multiplying and dividing by powers of 10 ---------------- */
  '3.1': [
    (L) => {
      const k = L === 1 ? ri(1, 3) : ri(1, L === 2 ? 4 : 6), mul = Math.random() < 0.5;
      const n = L === 1 ? (mul ? ri(2, 99) : ri(2, 99) * 10 ** k) : L === 2 ? clean(ri(11, 999) / 10) : clean(ri(11, 9999) / 1000);
      const ans = clean(mul ? n * 10 ** k : n / 10 ** k), p = L === 1 ? String(10 ** k) : pow10(k);
      return num(`Work out ${D(n)} ${mul ? '×' : '÷'} ${p}.`, ans, { hint: `${mul ? 'Multiplying' : 'Dividing'} by ${pow10(k)} moves every digit ${k} place${k > 1 ? 's' : ''} to the ${mul ? 'left' : 'right'}.`, steps: [`${pow10(k)} = ${D(10 ** k)}`, `Move the digits ${k} place${k > 1 ? 's' : ''} ${mul ? 'left (the number gets bigger)' : 'right (the number gets smaller)'}.`, `= ${D(ans)}`] });
    },
    (L) => { const k = ri(2, L === 1 ? 4 : 7); return num(`Write ${pow10(k)} as an ordinary number.`, 10 ** k, { hint: `${pow10(k)} means ${k} tens multiplied together.`, steps: [`${Array(k).fill(10).join(' × ')}`, `= ${D(10 ** k)} (1 followed by ${k} zeros)`] }); },
    (L) => {
      const items = [['kg', 'g', 3, 'mass'], ['g', 'mg', 3, 'mass'], ['km', 'm', 3, 'length'], ['m', 'cm', 2, 'length'], ['m', 'mm', 3, 'length'], ['l', 'ml', 3, 'capacity']];
      const [big, small, k] = pick(items), toSmall = Math.random() < 0.5;
      const n = toSmall ? clean(ri(L === 1 ? 2 : 11, L === 1 ? 9 : 999) / (L === 1 ? 1 : 100)) : ri(2, 99) * (L === 1 ? 10 ** k : 10 ** (k - 1));
      const ans = clean(toSmall ? n * 10 ** k : n / 10 ** k);
      return num(`Convert ${D(n)} ${toSmall ? big : small} to ${toSmall ? small : big}.`, ans, { unit: toSmall ? small : big, hint: `1 ${big} = ${D(10 ** k)} ${small}, which is ${pow10(k)} ${small}.`, steps: [`1 ${big} = ${pow10(k)} ${small}`, `${D(n)} ${toSmall ? '×' : '÷'} ${pow10(k)} = ${D(ans)}`, `${D(n)} ${toSmall ? big : small} = ${D(ans)} ${toSmall ? small : big}`] });
    },
    (L) => {
      const k = ri(2, L === 1 ? 3 : 6), n = ri(2, 99) * 10 ** ri(1, 4), mul = Math.random() < 0.4, ans = clean(mul ? n * 10 ** k : n / 10 ** k);
      return mc(`${D(n)} ${mul ? '×' : '÷'} ${pow10(k)} = ?`, D(ans), [D(clean(ans * 10)), D(clean(ans / 10)), D(clean(ans * 100)), D(clean(ans / 100))], { hint: `Count ${k} places.`, steps: [`Move the digits ${k} places ${mul ? 'left' : 'right'}.`, `= ${D(ans)}`] });
    },
    (L) => {
      if (L < 3) return null;
      const n = clean(ri(11, 99) / 10), k = ri(2, 5), r = clean(n * 10 ** k);
      return num(`Find the missing power: ${D(n)} × 10^□ = ${D(r)}`, k, { hint: `How many places have the digits moved from ${D(n)} to ${D(r)}?`, steps: [`${D(n)} → ${D(r)} moves the digits ${k} places left.`, `So the power is ${k}: ${pow10(k)}`] });
    },
  ],
  /* ---------------- 3.2 Rounding ---------------- */
  '3.2': [
    (L) => {
      const dp = L === 1 ? 1 : pick([1, 2]), extra = L === 3 ? 2 : 1, k = dp + extra, m = ri(10 ** k, 99 * 10 ** k) + (L === 3 && Math.random() < 0.4 ? 0 : 0);
      const x = clean(m / 10 ** k), r = Math.round(m / 10 ** extra) / 10 ** dp;
      return num(`Round ${x.toFixed(k)} to ${dp === 1 ? 'one decimal place' : 'two decimal places'}.`, r, { accept: [r.toFixed(dp)], hint: `Look at the digit in decimal place ${dp + 1}. 5 or more rounds up.`, steps: [`The digit after decimal place ${dp} is ${x.toFixed(k)[x.toFixed(k).indexOf('.') + dp + 1]}.`, `${+x.toFixed(k)[x.toFixed(k).indexOf('.') + dp + 1] >= 5 ? 'It is 5 or more, so round up.' : 'It is less than 5, so round down.'}`, `${x.toFixed(k)} ≈ ${r.toFixed(dp)}`] });
    },
    (L) => {
      const to = pick(L === 1 ? [10, 100] : L === 2 ? [10, 100, 1] : [1000, 100, 1]), n = to === 1 ? clean(ri(1000, 99999) / 100) : ri(100, 99999), r = Math.round(n / to) * to;
      return num(`Round ${D(n)} to the nearest ${to === 1 ? 'whole number' : D(to)}.`, r, { hint: to === 1 ? 'Look at the first decimal place.' : `Look at the digit just to the right of the ${to === 10 ? 'tens' : to === 100 ? 'hundreds' : 'thousands'} digit.`, steps: [`${D(n)} is between ${D(Math.floor(n / to) * to)} and ${D(Math.floor(n / to) * to + to)}.`, `It is nearer to ${D(r)}.`] });
    },
    (L) => {
      const m = ri(1000, 9999), x = m / 1000, r1 = Math.round(m / 100) / 10, trunc = Math.floor(m / 100) / 10;
      return mc(`Which is ${x.toFixed(3)} rounded to one decimal place?`, r1.toFixed(1), [trunc.toFixed(1) === r1.toFixed(1) ? (r1 + 0.1).toFixed(1) : trunc.toFixed(1), (Math.round(m / 10) / 100).toFixed(2), Math.round(x).toFixed(0), (r1 - 0.1).toFixed(1)], { hint: 'Look at the second decimal place.', steps: [`The second decimal digit is ${x.toFixed(3)[3]}.`, `${+x.toFixed(3)[3] >= 5 ? 'Round up' : 'Round down'}: ${r1.toFixed(1)}`] });
    },
    (L) => {
      const items = [() => { const v = ri(1001, 2999) / 100; return [`A pencil is ${v.toFixed(2)} cm long. What is its length to the nearest centimetre?`, Math.round(v), 'cm']; }, () => { const v = ri(1001, 9999) / 100; return [`A bag of rice has a mass of ${v.toFixed(2)} kg. What is its mass to one decimal place?`, Math.round(v * 10) / 10, 'kg']; }, () => { const v = ri(10001, 99999); return [`${D(v)} people watched a football match. Round this to the nearest thousand.`, Math.round(v / 1000) * 1000, 'people']; }];
      const [q, a, unit] = pick(items)();
      return num(q, a, { unit, hint: 'Find the deciding digit, the one just after where you round.', steps: [`Answer: ${D(a)} ${unit}`] });
    },
    (L) => {
      if (L < 3) return null;
      const r = ri(11, 98) / 10, low = clean(r - 0.05);
      return mc(`A number rounded to one decimal place is ${r.toFixed(1)}. What is the smallest the number could be?`, low.toFixed(2), [clean(r - 0.1).toFixed(1), clean(r - 0.04).toFixed(2), r.toFixed(1), clean(r - 0.01).toFixed(2)], { hint: 'Which numbers round up to it?', steps: [`Numbers from ${low.toFixed(2)} up to just below ${clean(r + 0.05).toFixed(2)} round to ${r.toFixed(1)}.`, `The smallest is ${low.toFixed(2)}.`] });
    },
  ],

  /* ---------------- 4.1 Ordering decimals ---------------- */
  '4.1': [
    (L) => {
      const w = L === 1 ? 0 : ri(0, 9), t = ri(2, 7), cands = shuffle([t * 100, t * 100 + 50, t * 100 - 20, t * 100 + 5, t * 100 + 90, t * 100 + 9, t * 100 - 1].map((x) => w + x / 1000)).slice(0, 4);
      const big = Math.random() < 0.5, ans = big ? Math.max(...cands) : Math.min(...cands);
      const f = (x) => String(clean(x));
      return mc(`Which number is the ${big ? 'largest' : 'smallest'}?`, f(ans), cands.filter((c) => c !== ans).map(f), { hint: 'Compare the tenths first, then the hundredths, then the thousandths. Adding zeros to the end can help.', steps: [`Write them with the same number of decimal places: ${cands.map((c) => c.toFixed(3)).join(', ')}`, `The ${big ? 'largest' : 'smallest'} is ${f(ans)}.`] });
    },
    (L) => {
      const a = ri(10, 999) / 100, kind = pick(['lt', 'gt', 'eq']); let b;
      if (kind === 'eq') b = a.toFixed(2) + '0'; else { b = clean(a + (kind === 'lt' ? 1 : -1) * pick([0.01, 0.1, 0.05, 0.009])); }
      const A = +a, B = +b, sym = A < B ? '<' : A > B ? '>' : '=';
      return mc(`Which symbol goes in the box?\n${String(clean(a))} □ ${String(b)}`, sym, ['<', '>', '='].filter((s) => s !== sym), { order: ['<', '>', '='], hint: 'Line up the decimal points and compare digit by digit.', steps: [`${(+a).toFixed(3)} and ${(+b).toFixed(3)}`, `So ${String(clean(a))} ${sym} ${String(b)}`] });
    },
    (L) => {
      const w = ri(1, 9), nums = shuffle([w + 0.4, w + 0.35, w + 0.408, w + 0.04].map(clean)), sorted = nums.slice().sort((x, y) => x - y), f = (a) => a.map((x) => String(x)).join(', ');
      const byLen = nums.slice().sort((x, y) => String(x).length - String(y).length || x - y), rev = sorted.slice().reverse(), swap = sorted.slice(); [swap[1], swap[2]] = [swap[2], swap[1]];
      return mc('Which list is in order, smallest first?', f(sorted), [f(byLen), f(rev), f(swap)], { hint: 'Write each number with three decimal places first.', steps: [nums.map((x) => x.toFixed(3)).join(', '), `Smallest first: ${f(sorted)}`] });
    },
    (L) => {
      if (L === 1) return null;
      if (Math.random() < 0.5) { const mm = ri(60, 99), opts = [[`${mm} mm`, mm], [`${clean(mm / 10 + 0.05)} cm`, mm + 0.5], [`${clean((mm - 2) / 1000)} m`, mm - 2], [`${clean((mm + 1) / 10)} cm`, mm + 1]]; const best = opts.reduce((a, b) => (b[1] > a[1] ? b : a)); return mc('Which length is the longest?', best[0], opts.filter((o) => o !== best).map((o) => o[0]), { hint: 'Change them all to mm. 1 cm = 10 mm, 1 m = 1000 mm.', steps: [opts.map((o) => `${o[0]} = ${clean(o[1])} mm`).join(', '), `Longest: ${best[0]}`] }); }
      const g = ri(600, 990), opts = [[`${g} g`, g], [`${clean((g + 20) / 1000)} kg`, g + 20], [`${clean((g - 15) / 1000)} kg`, g - 15], [`${g + 5} g`, g + 5]]; const best = opts.reduce((a, b) => (b[1] > a[1] ? b : a));
      return mc('Which mass is the heaviest?', best[0], opts.filter((o) => o !== best).map((o) => o[0]), { hint: 'Change them all to grams. 1 kg = 1000 g.', steps: [opts.map((o) => `${o[0]} = ${o[1]} g`).join(', '), `Heaviest: ${best[0]}`] });
    },
    () => { const a = ri(11, 98) / 10, mid = clean(a + 0.05); return mc(`Which number is between ${a.toFixed(1)} and ${clean(a + 0.1).toFixed(1)}?`, String(mid), [String(clean(a + 0.14)), String(clean(a - 0.05)), String(clean(a + 0.5))], { hint: 'Write both numbers with two decimal places.', steps: [`${a.toFixed(2)} < ${mid} < ${clean(a + 0.1).toFixed(2)}`] }); },
  ],
  /* ---------------- 4.2 Adding and subtracting decimals ---------------- */
  '4.2': [
    (L) => {
      const dpA = L === 1 ? 1 : pick([1, 2]), dpB = L === 1 ? 1 : 2, a = ri(11, 999) / 10 ** dpA, b = ri(11, 999) / 10 ** dpB;
      if (L === 3) { const c = ri(11, 99) / 10; return num(`Work out ${D(a)} + ${D(b)} + ${D(c)}.`, clean(a + b + c), { hint: 'Line up the decimal points.', steps: [`${D(a)} + ${D(b)} = ${D(clean(a + b))}`, `${D(clean(a + b))} + ${D(c)} = ${D(clean(a + b + c))}`] }); }
      return num(`Work out ${D(a)} + ${D(b)}.`, clean(a + b), { hint: 'Line up the decimal points. Fill gaps with zeros.', steps: [`${a.toFixed(2)} + ${b.toFixed(2)}`, `= ${D(clean(a + b))}`] });
    },
    (L) => {
      let a, b; if (L === 3) { a = ri(5, 30); b = ri(101, a * 100 - 1) / 100; } else if (L === 1) { a = ri(30, 999) / 10; b = ri(11, Math.floor(a * 10) - 1) / 10; } else { a = ri(300, 9999) / 100; b = ri(11, Math.floor(a * 10) - 1) / 10; }
      return num(`Work out ${D(a)} − ${D(b)}.`, clean(a - b), { hint: 'Line up the decimal points. You might need to exchange (borrow).', steps: [`${(+a).toFixed(2)} − ${(+b).toFixed(2)}`, `= ${D(clean(a - b))}`] });
    },
    (L) => {
      const items = shuffle([['a ticket', ri(150, 900)], ['popcorn', ri(120, 450)], ['a drink', ri(85, 300)], ['a comic', ri(199, 650)]]).slice(0, L === 1 ? 2 : 3), tot = items.reduce((s, i) => s + i[1], 0), pay = tot < 1000 ? 1000 : 2000, ask = L === 1 ? 'total' : pick(['total', 'change']);
      const list = items.map((i) => `${i[0]} for ${$(i[1] / 100)}`).join(', ').replace(/, ([^,]*)$/, ' and $1');
      if (ask === 'total') return num(`Leo buys ${list}. How much does he spend altogether, in dollars?`, tot / 100, { unit: '$', accept: [(tot / 100).toFixed(2)], hint: 'Add the prices. Line up the decimal points.', steps: [items.map((i) => $(i[1] / 100)).join(' + '), `= ${$(tot / 100)}`] });
      return num(`Leo buys ${list}. He pays with a $${pay / 100} note. How much change does he get, in dollars?`, (pay - tot) / 100, { unit: '$', accept: [((pay - tot) / 100).toFixed(2)], hint: 'Find the total, then subtract it from the note.', steps: [`Total: ${items.map((i) => $(i[1] / 100)).join(' + ')} = ${$(tot / 100)}`, `Change: $${pay / 100}.00 − ${$(tot / 100)} = ${$((pay - tot) / 100)}`] });
    },
    () => { const b = ri(11, 99) / 100, whole = pick([1, 1, 10]); return num(`Work out ${whole} − ${b.toFixed(2)}.`, clean(whole - b), { hint: `Write ${whole} as ${whole}.00.`, steps: [`${whole}.00 − ${b.toFixed(2)} = ${D(clean(whole - b))}`] }); },
  ],
  /* ---------------- 4.3 Multiplying decimals ---------------- */
  '4.3': [
    (L) => { const a = ri(1, 9), k = ri(2, 9); return num(`Work out 0.${a} × ${k}.`, clean((a * k) / 10), { hint: `Work out ${a} × ${k} first, then divide by 10.`, steps: [`${a} × ${k} = ${a * k}`, `0.${a} × ${k} = ${D(clean((a * k) / 10))}`] }); },
    (L) => {
      const dp = L === 3 ? 2 : 1, m = ri(11, L === 1 ? 49 : 999), k = ri(2, 9), a = m / 10 ** dp;
      return num(`Work out ${D(a)} × ${k}.`, clean((m * k) / 10 ** dp), { hint: `Ignore the decimal point, multiply, then put it back with ${dp} decimal place${dp > 1 ? 's' : ''}.`, steps: [`${m} × ${k} = ${m * k}`, `${D(a)} has ${dp} decimal place${dp > 1 ? 's' : ''}, so the answer is ${D(clean((m * k) / 10 ** dp))}.`] });
    },
    (L) => {
      if (L === 1) return null;
      const p = L === 2 ? 1 : pick([1, 2]), m1 = L === 2 ? ri(1, 9) : ri(11, 99), m2 = ri(1, 9), q = 1, a = m1 / 10 ** p, b = m2 / 10, ans = clean((m1 * m2) / 10 ** (p + q));
      return num(`Work out ${D(a)} × ${D(b)}.`, ans, { hint: 'Multiply the whole numbers, then count the total decimal places.', steps: [`${m1} × ${m2} = ${m1 * m2}`, `Total decimal places: ${p} + ${q} = ${p + q}`, `= ${D(ans)}`] });
    },
    (L) => {
      if (L === 1) return null;
      const len = ri(11, 49) / 10, price = ri(15, 90) / 10, tot = Math.round(len * 10 * price * 10) / 100;
      return num(`Fabric costs ${$(price)} per metre. How much do ${D(len)} m of fabric cost, in dollars?`, tot, { unit: '$', accept: [tot.toFixed(2)], hint: 'Multiply the length by the price per metre.', steps: [`${D(len)} × ${price.toFixed(2)}`, `= ${$(tot)}`] });
    },
    () => { const a = ri(2, 9), b = ri(2, 9), x = clean(a - 0.1 * ri(1, 2)), y = clean(b + 0.1 * ri(1, 2)); return mc(`Which is the best estimate for ${D(x)} × ${D(y)}?`, a * b, [(a - 1) * b, a * (b + 1), a * b * 10, a + b], { hint: 'Round each number to the nearest whole number first.', steps: [`${D(x)} ≈ ${a} and ${D(y)} ≈ ${b}`, `${a} × ${b} = ${a * b}`] }); },
  ],
  /* ---------------- 4.4 Dividing decimals ---------------- */
  '4.4': [
    (L) => { const d = ri(2, 9), ans = ri(11, L === 1 ? 30 : 99) / 10, n = clean(ans * d); return num(`Work out ${D(n)} ÷ ${d}.`, ans, { hint: 'Use short division. Keep the decimal point in line.', steps: [`${D(n)} ÷ ${d} = ${D(ans)}`, `Check: ${D(ans)} × ${d} = ${D(n)} ✓`] }); },
    (L) => { const d = ri(2, L === 1 ? 4 : 8), each = ri(150, 1500) / 100, tot = clean(each * d); return num(`${d} friends share ${$(tot)} equally. How much does each friend get, in dollars?`, each, { unit: '$', accept: [each.toFixed(2)], hint: `Divide by ${d}.`, steps: [`${tot.toFixed(2)} ÷ ${d} = ${each.toFixed(2)}`, `Each friend gets ${$(each)}.`] }); },
    (L) => {
      if (L === 1) return null;
      const d = pick([0.2, 0.4, 0.5, 0.3, 0.6, 0.8]), ans = ri(2, 30), n = clean(ans * d);
      return num(`Work out ${D(n)} ÷ ${D(d)}.`, ans, { hint: 'Multiply both numbers by 10 so you divide by a whole number.', steps: [`${D(n)} ÷ ${D(d)} = ${D(clean(n * 10))} ÷ ${clean(d * 10)}`, `= ${ans}`] });
    },
    () => { const d = ri(3, 9), ans = ri(11, 99) / 10, n = clean(ans * d); return mc(`Which calculation checks that ${D(n)} ÷ ${d} = ${D(ans)}?`, `${D(ans)} × ${d} = ${D(n)}`, [`${D(n)} × ${d} = ${D(clean(n * d))}`, `${D(ans)} + ${d} = ${D(clean(ans + d))}`, `${d} ÷ ${D(ans)} = ${D(n)}`], { hint: 'The inverse of dividing is multiplying.', steps: [`Multiply the answer by the number you divided by.`, `${D(ans)} × ${d} = ${D(n)} ✓`] }); },
    (L) => { const n = ri(3, 8), m = ri(15, 60) / 10, tot = clean(m * n); return num(`${n} parcels have a total mass of ${D(tot)} kg. What is the mean mass of a parcel, in kg?`, m, { unit: 'kg', hint: 'Mean = total ÷ number of items.', steps: [`${D(tot)} ÷ ${n} = ${D(m)}`] }); },
  ],
  /* ---------------- 4.5 Making decimal calculations easier ---------------- */
  '4.5': [
    (L) => {
      const k = pick(L === 1 ? [0.5, 0.1] : [0.5, 0.25, 0.1]), n = k === 0.25 ? 4 * ri(3, 40) : ri(10, 99) * (k === 0.5 ? 2 : 1), ans = clean(n * k), eq = { 0.5: 'dividing by 2', 0.25: 'dividing by 4', 0.1: 'dividing by 10' }[k];
      return num(`Work out ${n} × ${k}.`, ans, { hint: `Multiplying by ${k} is the same as ${eq}.`, steps: [`× ${k} is the same as ${eq}.`, `${n} ÷ ${{ 0.5: 2, 0.25: 4, 0.1: 10 }[k]} = ${D(ans)}`] });
    },
    (L) => {
      const a = ri(11, 99) / 10, m = pick([9, 11, 99]), ans = clean(a * m), base = m === 99 ? 100 : 10;
      return num(`Work out ${D(a)} × ${m}.`, ans, { hint: `${m} = ${base} ${m < base ? '−' : '+'} 1. Work out ${D(a)} × ${base} first.`, steps: [`${D(a)} × ${base} = ${D(clean(a * base))}`, `${D(clean(a * base))} ${m < base ? '−' : '+'} ${D(a)} = ${D(ans)}`] });
    },
    (L) => {
      const a = ri(12, 89), b = ri(12, 49), p = a * b, v = pick([[`${D(a / 10)} × ${b}`, p / 10], [`${a} × ${D(b / 10)}`, p / 10], [`${D(a / 1000)} × ${b}`, p / 1000], [`${D(a / 10)} × ${D(b / 100)}`, p / 1000]]);
      return num(`Use the fact that ${D(a / 100)} × ${b} = ${D(clean(p / 100))} to work out ${v[0]}.`, clean(v[1]), { hint: 'Compare the numbers with the fact. Has each number got bigger or smaller by 10, 100 …?', steps: [`${a} × ${b} = ${p}`, `Count the decimal places in ${v[0]}.`, `${v[0]} = ${D(clean(v[1]))}`] });
    },
    () => { const n = ri(2, 12) * 100, d = pick([3, 4, 5, 6]); return mc(`What is an easy way to work out ${n} × 0.0${d}?`, `${n} × ${d} ÷ 100`, [`${n} ÷ ${d} × 100`, `${n} × ${d} ÷ 10`, `${n} + ${d} ÷ 100`], { hint: `0.0${d} = ${d} ÷ 100`, steps: [`0.0${d} = ${d} ÷ 100`, `${n} × ${d} ÷ 100 = ${D(clean((n * d) / 100))}`] }); },
  ],

  /* ---------------- 5.1 A sum of 360° ---------------- */
  '5.1': [
    () => {
      let a, b, c, d; do { a = ri(50, 140); b = ri(50, 140); c = ri(50, 140); d = 360 - a - b - c; } while (d < 30 || d > 170);
      return num(`Three of the angles of a quadrilateral are ${a}°, ${b}° and ${c}°. Work out the fourth angle.`, d, { unit: '°', hint: 'The angles in a quadrilateral add up to 360°.', steps: [`${a} + ${b} + ${c} = ${a + b + c}`, `360 − ${a + b + c} = ${d}`, `The fourth angle is ${d}°.`] });
    },
    (L) => {
      const n = L === 1 ? 3 : 4; let as; do { as = Array.from({ length: n - 1 }, () => ri(40, 140)); } while (360 - as.reduce((s, x) => s + x, 0) < 40 || 360 - as.reduce((s, x) => s + x, 0) > 180);
      const x = 360 - as.reduce((s, v) => s + v, 0);
      return num('Work out the size of angle x.', x, { unit: '°', svg: S.anglesAround([...as, x], [...as.map((v) => v + '°'), 'x']), hint: 'Angles around a point add up to 360°.', steps: [`${as.join(' + ')} = ${360 - x}`, `x = 360 − ${360 - x} = ${x}°`] });
    },
    (L) => {
      if (L === 1) return null;
      let a, e; do { a = ri(60, 170); e = (360 - a) / 3; } while (!Number.isInteger(e));
      return num(`One angle of a quadrilateral is ${a}°. The other three angles are all the same size. Work out the size of each of the other angles.`, e, { unit: '°', hint: 'Find what is left from 360°, then share it equally.', steps: [`360 − ${a} = ${360 - a}`, `${360 - a} ÷ 3 = ${e}°`] });
    },
    (L) => {
      if (L < 3) return null;
      const co = pick([[1, 2, 3, 4], [1, 1, 2, 2], [2, 3, 3, 4], [1, 2, 2, 3], [1, 3, 4, 4]]), s = co.reduce((a, b) => a + b, 0), x = 360 / s, labs = co.map((c) => (c === 1 ? 'x' : `${c}x`));
      return num(`The angles of a quadrilateral are ${labs.slice(0, 3).join(', ')} and ${labs[3]}. Work out the value of x.`, x, { unit: '°', hint: 'Add the angles together and set the total equal to 360°.', steps: [`${labs.join(' + ')} = ${s}x`, `${s}x = 360`, `x = 360 ÷ ${s} = ${x}`] });
    },
    () => {
      const ok = Math.random() < 0.5; let a, b, c, d; do { a = ri(60, 130); b = ri(60, 130); c = ri(60, 130); d = 360 - a - b - c + (ok ? 0 : pick([-10, 10, 20, -20])); } while (d < 40 || d > 170);
      const s = a + b + c + d;
      return mc(`Could a quadrilateral have angles of ${a}°, ${b}°, ${c}° and ${d}°?`, ok ? 'Yes, they add up to 360°' : `No, they add up to ${s}°`, [ok ? `No, they add up to ${s + 10}°` : 'Yes, they add up to 360°', 'Yes, all the angles are less than 180°', 'No, a quadrilateral cannot have an angle over 90°'], { hint: 'Add the four angles.', steps: [`${a} + ${b} + ${c} + ${d} = ${s}`, ok ? 'That is 360°, so yes.' : 'That is not 360°, so no.'] });
    },
  ],
  /* ---------------- 5.2 Intersecting lines ---------------- */
  '5.2': [
    () => { const a = ri(25, 155); return num('AB is a straight line. Work out the size of angle x.', 180 - a, { unit: '°', svg: S.straightLine(a, 'x', a + '°'), hint: 'Angles on a straight line add up to 180°.', steps: [`x = 180 − ${a}`, `x = ${180 - a}°`] }); },
    () => {
      const a = ri(35, 80), opp = Math.random() < 0.5, labels = opp ? [a + '°', '', 'x', ''] : [a + '°', 'x', '', ''];
      return num('Two straight lines cross. Work out the size of angle x.', opp ? a : 180 - a, { unit: '°', svg: S.crossing(a, labels), hint: opp ? 'Vertically opposite angles are equal.' : 'Angles on a straight line add up to 180°.', steps: opp ? ['x is vertically opposite the angle given.', `x = ${a}°`] : ['x and the angle given are on a straight line.', `x = 180 − ${a} = ${180 - a}°`] });
    },
    (L) => {
      const a = ri(45, 72), val = (i) => (i === 1 || i === 3 ? a : 180 - a);
      const altPair = { 3: 1, 2: 0 }; let i = ri(0, 3), j;
      if (L === 1) j = i; else if (L === 2) { j = Math.random() < 0.5 ? i : (i === 3 ? 1 : i === 2 ? 0 : i); if (i < 2 && j === i && Math.random() < 0.5) j = i; } else j = ri(0, 3);
      const top = ['', '', '', ''], bottom = ['', '', '', '']; top[i] = val(i) + '°'; bottom[j] = 'x';
      const rel = i === j ? 'corresponding angles (in matching positions), so they are equal' : altPair[i] === j ? 'alternate angles (a Z shape), so they are equal' : null;
      const ans = val(j);
      return num('The two horizontal lines are parallel. Work out the size of angle x.', ans, { unit: '°', svg: S.parallel(a, top, bottom), hint: 'Look for matching (corresponding) or Z-shaped (alternate) angles. Angles on a straight line add to 180°.', steps: rel ? [`x and ${val(i)}° are ${rel}.`, `x = ${ans}°`] : [`The angle in the matching position at the bottom crossing is also ${val(i)}°.`, val(i) === ans ? `x = ${ans}°` : `x is on a straight line with it, so x = 180 − ${val(i)} = ${ans}°`] });
    },
    () => {
      const v = pick([['in matching positions at each crossing of a line that cuts two parallel lines', 'corresponding angles'], ['between two parallel lines, on opposite sides of the line that crosses them (a Z shape)', 'alternate angles'], ['opposite each other where two straight lines cross', 'vertically opposite angles']]);
      return mc(`What do we call angles that are ${v[0]}?`, v[1], ['corresponding angles', 'alternate angles', 'vertically opposite angles', 'angles on a straight line'], { hint: 'Think F shape, Z shape and X shape.', steps: [`These are ${v[1]}.`, 'All three kinds of pair are equal.'] });
    },
    (L) => {
      if (L < 3) return null;
      if (Math.random() < 0.5) { let c, k, x; do { c = ri(2, 4); k = ri(-20, 40); x = (180 - k) / (1 + c); } while (!Number.isInteger(x) || x < 10 || c * x + k < 10); return num(`Two angles on a straight line are x and ${c}x ${k < 0 ? '−' : '+'} ${Math.abs(k)}. Work out the value of x.`, x, { unit: '°', hint: 'Angles on a straight line add up to 180°.', steps: [`x + ${c}x ${k < 0 ? '−' : '+'} ${Math.abs(k)} = 180`, `${1 + c}x = ${180 - k}`, `x = ${x}`] }); }
      let p, q, k, x; do { p = ri(2, 5); q = ri(1, p - 1); x = ri(8, 40); k = (p - q) * x; } while (p * x >= 180);
      return num(`Two straight lines cross. Two vertically opposite angles are ${p}x and ${q === 1 ? '' : q}x + ${k}. Work out the value of x.`, x, { unit: '°', hint: 'Vertically opposite angles are equal, so make an equation.', steps: [`${p}x = ${q === 1 ? '' : q}x + ${k}`, `${p - q === 1 ? '' : p - q}x = ${k}`, `x = ${x}`] });
    },
  ],
  /* ---------------- 5.3 Drawing lines and quadrilaterals ---------------- */
  '5.3': [
    () => {
      const v = pick([
        ['Which quadrilateral has exactly one pair of parallel sides?', 'trapezium', ['parallelogram', 'rectangle', 'kite']],
        ['Which quadrilateral has four equal sides but its angles are not all 90°?', 'rhombus', ['square', 'rectangle', 'kite']],
        ['Which quadrilateral has two pairs of equal adjacent sides and no parallel sides?', 'kite', ['rhombus', 'trapezium', 'parallelogram']],
        ['Which quadrilateral has four right angles and four equal sides?', 'square', ['rectangle', 'rhombus', 'kite']],
        ['Which quadrilateral has two pairs of parallel sides, but no right angles and not all sides equal?', 'parallelogram', ['rectangle', 'rhombus', 'trapezium']],
        ['In which quadrilateral do the diagonals always cross at right angles?', 'rhombus', ['rectangle', 'parallelogram', 'trapezium']],
      ]);
      return mc(v[0], v[1], v[2], { hint: 'Picture each shape and check its sides and angles.', steps: [`The answer is the ${v[1]}.`] });
    },
    (L) => {
      const A = ri(55, 125), adj = Math.random() < 0.5;
      return num(`ABCD is a parallelogram. Angle A is ${A}°. What is the size of angle ${adj ? 'B' : 'C'}?`, adj ? 180 - A : A, { unit: '°', hint: 'In a parallelogram, opposite angles are equal and angles next to each other add up to 180°.', steps: adj ? ['Angles A and B are next to each other, so they add up to 180°.', `B = 180 − ${A} = ${180 - A}°`] : ['Angles A and C are opposite, so they are equal.', `C = ${A}°`] });
    },
    () => num('Two lines are perpendicular. What is the angle between them, in degrees?', 90, { unit: '°', hint: 'Perpendicular lines meet at a right angle.', steps: ['Perpendicular means at right angles.', 'A right angle is 90°.'] }),
    (L) => {
      let a, b, e; do { a = ri(60, 140); b = ri(40, 120); e = (360 - a - b) / 2; } while (!Number.isInteger(e) || e < 40 || e > 150 || a === b);
      return num(`A kite has two different angles of ${a}° and ${b}°. Its other two angles are equal. Work out the size of each of the equal angles.`, e, { unit: '°', hint: 'All four angles add up to 360°.', steps: [`360 − ${a} − ${b} = ${360 - a - b}`, `${360 - a - b} ÷ 2 = ${e}°`] });
    },
    () => { const k = pick(['rectangle', 'parallelogram', 'rhombus', 'kite', 'isosceles trapezium']); return mc('What is the name of this quadrilateral?', k, ['rectangle', 'parallelogram', 'rhombus', 'kite', 'isosceles trapezium', 'square'], { svg: S.shapePath(k), hint: 'Check which sides are parallel and which are equal.', steps: [`This is a ${k}.`] }); },
  ],
};
