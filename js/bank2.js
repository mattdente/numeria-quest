// Units 6–10: Collecting data; Fractions; Shapes and symmetry; Sequences and functions; Percentages.
import { ri, pick, shuffle, nz, gcd, lcm, clean, D, P, F, FU, FM, fr, $ } from './util.js';
import { num, frq, mc } from './bank-common.js';
import * as S from './svg.js';

const DATA = {
  categorical: ['eye colour', 'favourite sport', 'type of pet', 'colour of a car', 'month of birth', 'favourite fruit', 'way of travelling to school', 'favourite school subject'],
  discrete: ['number of pets', 'shoe size', 'number of goals scored in a match', 'number of brothers and sisters', 'number of books read in a month', 'number of eggs in a recipe', 'number of people in a car'],
  continuous: ['height of a student', 'mass of a baby', 'time to run 100 m', 'length of a leaf', 'temperature at noon', 'distance travelled to school', 'mass of rice in a bag'],
};
const TYPE_WHY = { categorical: 'It is described with words or categories, not numbers.', discrete: 'It can only be certain values, usually whole numbers you count.', continuous: 'It is measured, so it can take any value in a range.' };
const toImp = (w, n, d) => [w * d + n, d];
const fracMC = (n, d) => F(n, d);

const SYM = [['square', 4, 4], ['rectangle', 2, 2], ['equilateral triangle', 3, 3], ['regular pentagon', 5, 5], ['regular hexagon', 6, 6], ['regular octagon', 8, 8], ['parallelogram', 0, 2], ['rhombus', 2, 2], ['kite', 1, 1], ['isosceles triangle', 1, 1], ['isosceles trapezium', 1, 1], ['scalene triangle', 0, 1]];
const symSvg = (name) => { const reg = { square: 4, 'equilateral triangle': 3, 'regular pentagon': 5, 'regular hexagon': 6, 'regular octagon': 8 }[name]; return reg ? S.polygon(reg) : S.shapePath(name); };
const SOLIDS = [['cube', 6, 12, 8], ['cuboid', 6, 12, 8], ['triangular prism', 5, 9, 6], ['square-based pyramid', 5, 8, 5], ['tetrahedron (triangle-based pyramid)', 4, 6, 4], ['pentagonal prism', 7, 15, 10], ['hexagonal prism', 8, 18, 12], ['pentagonal pyramid', 6, 10, 6], ['hexagonal pyramid', 7, 12, 7]];
const POLY = [[3, 'triangle'], [4, 'quadrilateral'], [5, 'pentagon'], [6, 'hexagon'], [7, 'heptagon'], [8, 'octagon'], [9, 'nonagon'], [10, 'decagon']];

export const UNITS_6_10 = {
  /* ---------------- 6.1 Conducting an investigation ---------------- */
  '6.1': [
    () => { const t = pick(Object.keys(DATA)), item = pick(DATA[t]); return mc(`What type of data is the ${item}?`, t, Object.keys(DATA), { order: ['categorical', 'discrete', 'continuous'], hint: 'Is it words, something you count, or something you measure?', steps: [TYPE_WHY[t], `So the ${item} is ${t} data.`] }); },
    () => { const t = pick(Object.keys(DATA)), others = Object.keys(DATA).filter((k) => k !== t), wrong = shuffle([...DATA[others[0]], ...DATA[others[1]]]).slice(0, 3); return mc(`Which of these is ${t} data?`, pick(DATA[t]), wrong, { hint: TYPE_WHY[t], steps: [TYPE_WHY[t]] }); },
    (L) => {
      if (L === 1) return null;
      const v = pick([
        ['Arun predicts that students who sleep more get higher test scores. What data should he collect?', 'Hours of sleep and test score for each student', ['Only the test scores', 'Only the hours of sleep', 'The favourite subject of each student']],
        ['Zara thinks taller students have bigger hand spans. What data should she collect?', 'The height and hand span of each student', ['Only the heights', 'The shoe size of each student', 'The age of each student']],
        ['What is a prediction in an investigation?', 'What you think the results will show, before you collect the data', ['The data you collect', 'A chart of the results', 'The average of the results']],
        ['Which is the best way to collect data about how long students take to run 100 m?', 'Time each student with a stopwatch, in seconds', ['Ask students to guess their time', 'Count how many students like running', 'Ask which shoes they wear']],
        ['Marcus wants to know if a dice is fair. What should he do?', 'Roll it many times and record each result in a table', ['Roll it once', 'Look at the dice carefully', 'Ask a friend if they think it is fair']],
      ]);
      return mc(v[0], v[1], v[2], { hint: 'Which choice gives you data that tests the idea?', steps: [v[1] + '.'] });
    },
  ],
  /* ---------------- 6.2 Taking a sample ---------------- */
  '6.2': [
    () => {
      const v = pick([
        ['Kimsant wants to find the mean height of 13-year-old boys in his city. Which is the best sample?', '100 boys chosen at random from different schools', ['5 boys from his class', 'The boys in the basketball team', 'All the boys in his family']],
        ['Mia wants to know the favourite lunch of the 800 students in her school. Which sample is best?', '80 students chosen at random from all year groups', ['10 of her friends', 'The first 20 students in the lunch queue', 'Everyone in her class']],
        ['A survey about a new skate park only asks people who are at the skate park. What is the problem?', 'The sample is biased: they probably already like skating', ['The sample is too big', 'There is no problem', 'Skaters cannot answer surveys']],
        ['Why is asking only your friends a biased sample?', 'Your friends may have similar opinions to you', ['Friends always tell the truth', 'It is too many people', 'Friends are too young']],
      ]);
      return mc(v[0], v[1], v[2], { hint: 'A good sample is big enough and chosen at random so it represents everyone.', steps: [v[1] + '.'] });
    },
    () => {
      const v = pick([
        ['Which question is best for a survey about exercise?', 'How many hours do you exercise each week? 0–1, 2–3, 4–5, 6 or more', ['You exercise a lot, don\'t you?', 'Do you exercise?', 'How much exercise do you do?']],
        ['Which survey question is a leading question?', 'Don\'t you agree that school starts too early?', ['What time does school start?', 'How do you travel to school?', 'How many minutes is your journey?']],
        ['On a questionnaire, why are tick boxes like 0–1, 2–3, 4 or more useful?', 'Everyone answers in the same way, so results are easy to compare', ['They make the survey longer', 'They let people write anything', 'They stop people from answering']],
      ]);
      return mc(v[0], v[1], v[2], { hint: 'Good questions are clear, fair and easy to answer.', steps: [v[1] + '.'] });
    },
    () => {
      const v = pick([
        ['What is a sample?', 'A smaller group chosen from the whole population', ['Every person in the population', 'A type of chart', 'The average of the data']],
        ['Which sample size gives the most reliable results?', '200', ['5', '10', '20']],
        ['Five is not a good sample size because…', 'it is too small to represent everyone', ['it is too big', 'five is an odd number', 'it takes too long']],
      ]);
      return mc(v[0], v[1], v[2], { hint: 'Bigger random samples usually represent the population better.', steps: [v[1] + '.'] });
    },
  ],

  /* ---------------- 7.1 Ordering fractions ---------------- */
  '7.1': [
    (L) => { let a, b; do { b = ri(2, 10); a = ri(1, b - 1); } while (gcd(a, b) !== 1); const k = ri(2, L === 1 ? 5 : 9), c = b * k; return num(`Fill in the missing number.\n${F(a, b)} = {□/${c}}`, a * k, { hint: `What do you multiply ${b} by to get ${c}?`, steps: [`${b} × ${k} = ${c}`, `${a} × ${k} = ${a * k}`, `${F(a, b)} = ${FU(a * k, c)}`] }); },
    (L) => { let n, d; do { d = ri(2, L === 1 ? 5 : 12); n = ri(d + 1, d * (L === 1 ? 4 : 9)); } while (n % d === 0 || gcd(n, d) !== 1); const w = Math.floor(n / d); return frq(`Write ${FU(n, d)} as a mixed number.`, n, d, { form: 'mixed', hint: `How many times does ${d} go into ${n}? What is left over?`, steps: [`${n} ÷ ${d} = ${w} remainder ${n % d}`, `${FU(n, d)} = ${FM(n, d)}`] }); },
    (L) => { let w, a, b; do { b = ri(2, L === 1 ? 6 : 12); a = ri(1, b - 1); w = ri(1, L === 1 ? 4 : 9); } while (gcd(a, b) !== 1); const [n] = toImp(w, a, b); return frq(`Write ${FM(n, b)} as an improper fraction.`, n, b, { form: 'improper', hint: `Multiply the whole number by ${b}, then add ${a}.`, steps: [`${w} × ${b} = ${w * b}`, `${w * b} + ${a} = ${n}`, `${FM(n, b)} = ${FU(n, b)}`] }); },
    (L) => {
      let a, b, c, d; do { b = ri(2, 12); d = ri(2, 12); a = ri(1, b - 1); c = ri(1, d - 1); } while (b === d && a === c);
      const sym = a * d < c * b ? '<' : a * d > c * b ? '>' : '=', l = lcm(b, d);
      return mc(`Which symbol goes in the box?\n${FU(a, b)} □ ${FU(c, d)}`, sym, ['<', '>', '='], { order: ['<', '>', '='], hint: 'Change both fractions to the same denominator.', steps: [`Common denominator: ${l}`, `${FU(a, b)} = ${FU((a * l) / b, l)} and ${FU(c, d)} = ${FU((c * l) / d, l)}`, `So ${FU(a, b)} ${sym} ${FU(c, d)}`] });
    },
    (L) => {
      if (L === 1) return null;
      let fs3; do { fs3 = [0, 1, 2].map(() => { const d = pick([3, 4, 5, 6, 8, 10, 12]); return [ri(1, d - 1), d]; }); } while (new Set(fs3.map(([n, d]) => n / d)).size < 3);
      const sorted = fs3.slice().sort((x, y) => x[0] / x[1] - y[0] / y[1]), str = (a) => a.map(([n, d]) => `{${n}/${d}}`).join(', ');
      const byDen = fs3.slice().sort((x, y) => x[1] - y[1]), byNum = fs3.slice().sort((x, y) => x[0] - y[0]);
      const sw = sorted.slice(); [sw[0], sw[1]] = [sw[1], sw[0]]; const sw2 = sorted.slice(); [sw2[1], sw2[2]] = [sw2[2], sw2[1]];
      return mc('Which list is in order, smallest first?', str(sorted), [str(byDen), str(byNum), str(sorted.slice().reverse()), str(sw), str(sw2)], { hint: 'Write them all with the same denominator, or as decimals.', steps: [fs3.map(([n, d]) => `{${n}/${d}} ≈ ${clean(n / d).toFixed(3)}`).join(', '), `Smallest first: ${str(sorted)}`] });
    },
  ],
  /* ---------------- 7.2 Adding mixed numbers ---------------- */
  '7.2': [
    (L) => {
      let b, d, a, c, w1, w2; do { b = ri(2, 10); d = L === 1 ? b : ri(2, 10); a = ri(1, b - 1); c = ri(1, d - 1); w1 = ri(1, 6); w2 = ri(1, 5); } while (gcd(a, b) !== 1 || gcd(c, d) !== 1 || lcm(b, d) > 30);
      const [n1, d1] = toImp(w1, a, b), [n2, d2] = toImp(w2, c, d), N = n1 * d2 + n2 * d1, Dn = d1 * d2, l = lcm(b, d);
      return frq(`Work out ${FM(n1, d1)} + ${FM(n2, d2)}.\nGive your answer as a mixed number in its simplest form.`, N, Dn, { form: 'mixed', hint: 'Add the whole numbers, then add the fractions. Use a common denominator.', steps: [`Whole numbers: ${w1} + ${w2} = ${w1 + w2}`, `Fractions: ${FU((a * l) / b, l)} + ${FU((c * l) / d, l)} = ${FU((a * l) / b + (c * l) / d, l)}`, `Answer: ${FM(N, Dn)}`] });
    },
    (L) => {
      if (L === 1) return null;
      let b, d, a, c, w1, w2, N, Dn; do { b = ri(2, 10); d = ri(2, 10); a = ri(1, b - 1); c = ri(1, d - 1); w1 = ri(3, 9); w2 = ri(1, w1 - 1); const [n1] = toImp(w1, a, b), [n2] = toImp(w2, c, d); N = n1 * d - n2 * b; Dn = b * d; } while (gcd(a, b) !== 1 || gcd(c, d) !== 1 || N <= 0 || lcm(b, d) > 30);
      return frq(`Work out ${FM(w1 * b + a, b)} − ${FM(w2 * d + c, d)}.\nGive your answer as a mixed number in its simplest form.`, N, Dn, { form: 'mixed', hint: 'Change both to improper fractions with the same denominator, then subtract.', steps: [`${FM(w1 * b + a, b)} = ${FU(w1 * b + a, b)} and ${FM(w2 * d + c, d)} = ${FU(w2 * d + c, d)}`, `Common denominator ${lcm(b, d)}, then subtract.`, `Answer: ${FM(N, Dn)}`] });
    },
    (L) => {
      let b, d, a, c, w1, w2; do { b = pick([2, 3, 4, 5, 8]); d = pick([2, 3, 4, 5, 8]); a = ri(1, b - 1); c = ri(1, d - 1); w1 = ri(1, 5); w2 = ri(1, 4); } while (gcd(a, b) !== 1 || gcd(c, d) !== 1);
      const N = (w1 * b + a) * d + (w2 * d + c) * b, Dn = b * d, [what, unit] = pick([['walks', 'km'], ['swims', 'km'], ['cycles', 'km']]);
      return frq(`Kai ${what} ${FM(w1 * b + a, b)} ${unit} in the morning and ${FM(w2 * d + c, d)} ${unit} in the afternoon. How far does he go altogether?\nGive your answer as a mixed number in its simplest form.`, N, Dn, { form: 'mixed', unit, hint: 'Add the whole numbers and the fractions separately.', steps: [`${w1} + ${w2} = ${w1 + w2}`, `${F(a, b)} + ${F(c, d)} = ${F(a * d + c * b, Dn)}`, `Total: ${FM(N, Dn)} ${unit}`] });
    },
    () => {
      let b, d, a, c, w1, w2; do { b = ri(2, 9); d = ri(2, 9); a = ri(1, b - 1); c = ri(1, d - 1); w1 = ri(1, 6); w2 = ri(1, 6); } while (a / b + c / d >= 1 || gcd(a, b) !== 1 || gcd(c, d) !== 1);
      const s = w1 + w2;
      return mc(`Between which two whole numbers is ${FM(w1 * b + a, b)} + ${FM(w2 * d + c, d)}?`, `${s} and ${s + 1}`, [`${s + 1} and ${s + 2}`, `${s - 1} and ${s}`, `${w1} and ${w2}`], { hint: 'Estimate: add the whole numbers, then decide if the fractions add up to more than 1.', steps: [`${w1} + ${w2} = ${s}`, `${F(a, b)} + ${F(c, d)} is less than 1.`, `So the answer is between ${s} and ${s + 1}.`] });
    },
  ],
  /* ---------------- 7.3 Multiplying fractions ---------------- */
  '7.3': [
    (L) => { let a, b, c, d; do { b = ri(2, L === 1 ? 6 : 10); d = ri(2, L === 1 ? 6 : 10); a = L === 1 ? 1 : ri(1, b - 1); c = L === 1 ? 1 : ri(1, d - 1); } while (gcd(a, b) !== 1 || gcd(c, d) !== 1); return frq(`Work out ${F(a, b)} × ${F(c, d)}.\nGive your answer in its simplest form.`, a * c, b * d, { hint: 'Multiply the numerators, multiply the denominators, then simplify.', steps: [`${a} × ${c} = ${a * c} and ${b} × ${d} = ${b * d}`, `${FU(a * c, b * d)}${gcd(a * c, b * d) > 1 ? ` = ${F(a * c, b * d)}` : ''}`] }); },
    (L) => { let a, b; do { b = ri(3, 12); a = ri(1, b - 1); } while (gcd(a, b) !== 1); const k = ri(2, 9); return frq(`Work out ${k} × ${F(a, b)}.\nGive your answer in its simplest form.`, k * a, b, { hint: `${k} × ${F(a, b)} means ${k} lots of ${F(a, b)}.`, steps: [`${k} × ${a} = ${k * a}, so ${FU(k * a, b)}`, `Simplest form: ${F(k * a, b)}${k * a > b && (k * a) % b ? ` = ${FM(k * a, b)}` : ''}`] }); },
    (L) => { let a, b; do { b = pick([2, 3, 4, 5, 6, 8, 10]); a = ri(1, b - 1); } while (gcd(a, b) !== 1); const amt = b * ri(2, L === 1 ? 10 : 25), [unit, thing] = pick([['$', 'of $'], ['kg', 'of'], ['m', 'of']]); return num(`Work out ${F(a, b)} ${thing}${unit === '$' ? '' : ' '}${amt}${unit === '$' ? '' : ' ' + unit}.`, (amt / b) * a, { unit: unit === '$' ? '$' : unit, hint: `Divide by ${b}, then multiply by ${a}.`, steps: [`${amt} ÷ ${b} = ${amt / b}`, `${amt / b} × ${a} = ${(amt / b) * a}`] }); },
    (L) => {
      if (L < 3) return null;
      let w, a, b, c, d; do { b = ri(2, 6); a = ri(1, b - 1); w = ri(1, 4); d = ri(2, 9); c = ri(1, d - 1); } while (gcd(a, b) !== 1 || gcd(c, d) !== 1);
      const n = w * b + a;
      return frq(`Work out ${FM(n, b)} × ${F(c, d)}.\nGive your answer in its simplest form.`, n * c, b * d, { hint: 'Change the mixed number to an improper fraction first.', steps: [`${FM(n, b)} = ${FU(n, b)}`, `${FU(n, b)} × ${F(c, d)} = ${FU(n * c, b * d)}`, `= ${F(n * c, b * d)}${n * c > b * d && (n * c) % (b * d) ? ` = ${FM(n * c, b * d)}` : ''}`] });
    },
    () => { const b = ri(2, 6), d = ri(2, 7); return mc(`${F(1, b)} × ${F(1, d)} = ?`, F(1, b * d), [F(2, b + d), F(1, b + d), F(b, d), F(2, b * d)], { hint: 'Multiply the tops, multiply the bottoms.', steps: [`1 × 1 = 1, ${b} × ${d} = ${b * d}`, `= ${F(1, b * d)}`] }); },
  ],
  /* ---------------- 7.4 Dividing fractions ---------------- */
  '7.4': [
    (L) => { const k = ri(2, 9), d = ri(2, 8); return num(`Work out ${k} ÷ ${F(1, d)}.`, k * d, { hint: `How many ${F(1, d)}s are in ${k}? Dividing by ${F(1, d)} is the same as multiplying by ${d}.`, steps: [`${k} ÷ ${F(1, d)} = ${k} × ${d}`, `= ${k * d}`] }); },
    (L) => { let a, b; do { b = ri(2, 9); a = ri(1, b - 1); } while (gcd(a, b) !== 1); const k = ri(2, 6); return frq(`Work out ${F(a, b)} ÷ ${k}.\nGive your answer in its simplest form.`, a, b * k, { hint: `Dividing by ${k} is the same as multiplying by ${F(1, k)}.`, steps: [`${F(a, b)} × ${F(1, k)} = ${FU(a, b * k)}`, `= ${F(a, b * k)}`] }); },
    (L) => {
      if (L === 1) return null;
      let a, b, c, d; do { b = ri(2, 10); d = ri(2, 10); a = ri(1, b - 1); c = ri(1, d - 1); } while (gcd(a, b) !== 1 || gcd(c, d) !== 1 || (a === c && b === d));
      return frq(`Work out ${F(a, b)} ÷ ${F(c, d)}.\nGive your answer in its simplest form.`, a * d, b * c, { hint: 'Flip the second fraction and multiply.', steps: [`${F(a, b)} ÷ ${F(c, d)} = ${F(a, b)} × ${FU(d, c)}`, `= ${FU(a * d, b * c)}`, `= ${F(a * d, b * c)}${a * d > b * c && (a * d) % (b * c) ? ` = ${FM(a * d, b * c)}` : ''}`] });
    },
    () => { let a, b; do { b = ri(2, 12); a = ri(1, b - 1); } while (gcd(a, b) !== 1 || a === 1); return mc(`What is the reciprocal of ${F(a, b)}?`, FU(b, a), [FU(a, b), `${FU(1, a * b)}`, FU(b - a, b)], { hint: 'The reciprocal is the fraction turned upside down.', steps: [`Turn ${F(a, b)} upside down: ${FU(b, a)}`, `Check: ${F(a, b)} × ${FU(b, a)} = 1`] }); },
    (L) => { const d = pick([2, 3, 4, 5, 8, 10]), k = ri(2, 9), [thing, verb, unit] = pick([['kg bags', 'filled', 'kg of rice'], ['litre glasses', 'filled', 'litres of juice'], ['metre pieces', 'cut', 'metres of ribbon']]); return num(`How many ${F(1, d)} ${thing} can be ${verb} from ${k} ${unit}?`, k * d, { hint: `Work out ${k} ÷ ${F(1, d)}.`, steps: [`${k} ÷ ${F(1, d)} = ${k} × ${d}`, `= ${k * d}`] }); },
    (L) => {
      if (L < 3) return null;
      let w, a, b, c, d; do { b = ri(2, 8); a = ri(1, b - 1); w = ri(1, 4); d = ri(2, 8); c = ri(1, d - 1); } while (gcd(a, b) !== 1 || gcd(c, d) !== 1);
      const n = w * b + a;
      return frq(`Work out ${FM(n, b)} ÷ ${F(c, d)}.\nGive your answer in its simplest form.`, n * d, b * c, { hint: 'Make the mixed number improper, then flip the second fraction and multiply.', steps: [`${FM(n, b)} = ${FU(n, b)}`, `${FU(n, b)} × ${FU(d, c)} = ${FU(n * d, b * c)}`, `= ${F(n * d, b * c)}${n * d > b * c && (n * d) % (b * c) ? ` = ${FM(n * d, b * c)}` : ''}`] });
    },
  ],
  /* ---------------- 7.5 Making fraction calculations easier ---------------- */
  '7.5': [
    (L) => { const a = ri(2, 12), k = L === 1 ? 1 : ri(1, a - 1), m = ri(2, 9), b = a * m; if (gcd(k, a) !== 1) return null; return num(`Work out ${F(k, a)} × ${b}.`, k * m, { hint: `First divide ${b} by ${a}.`, steps: [`${b} ÷ ${a} = ${m}`, `${m} × ${k} = ${k * m}`] }); },
    (L) => { const a = ri(2, 9), k = ri(2, a + 3), m = ri(2, 8), b = k * m; if (gcd(k, a) !== 1) return null; return num(`Work out ${b} ÷ ${F(k, a)}.`, m * a, { hint: `Dividing by ${F(k, a)} is the same as multiplying by ${FU(a, k)}. Divide by ${k} first.`, steps: [`${b} × ${FU(a, k)}`, `${b} ÷ ${k} = ${m}, then × ${a}`, `= ${m * a}`] }); },
    () => { const [p, q] = pick([[3, 5], [2, 7], [3, 4], [2, 9], [4, 5], [3, 7]]), n = p * q; return mc(`Which product is equal to ${F(1, n)}?`, `${F(1, p)} × ${F(1, q)}`, [`${F(1, p)} + ${F(1, q)}`, `${F(1, n - 1)} × ${F(1, 1 + 1)}`, `${F(1, p + q)} × ${F(1, 2)}`], { hint: `Find two numbers that multiply to make ${n}.`, steps: [`${p} × ${q} = ${n}`, `So ${F(1, n)} = ${F(1, p)} × ${F(1, q)}`] }); },
    () => { const d = pick([3, 4, 5, 6]), k = ri(1, d - 1), m = ri(2, 9), n = d * m; if (gcd(k, d) !== 1) return null; return mc(`What is an easy way to work out ${n} × ${F(k, d)}?`, `${n} ÷ ${d} × ${k}`, [`${n} × ${d} ÷ ${k}`, `${n} + ${d} × ${k}`, `${n} ÷ ${k} − ${d}`], { hint: 'Multiplying by a fraction: divide by the bottom, multiply by the top.', steps: [`${n} ÷ ${d} = ${m}`, `${m} × ${k} = ${m * k}`] }); },
  ],

  /* ---------------- 8.1 Identifying the symmetry of 2D shapes ---------------- */
  '8.1': [
    () => { const [n, l] = pick(SYM); return num(`How many lines of symmetry does this ${n} have?`, l, { svg: symSvg(n), hint: 'Imagine folding the shape so the two halves match exactly.', steps: [`A ${n} has ${l} line${l === 1 ? '' : 's'} of symmetry.`] }); },
    () => { const [n, , o] = pick(SYM); return num(`What is the order of rotational symmetry of this ${n}?`, o, { svg: symSvg(n), hint: 'Count how many times it looks the same in one full turn.', steps: [`In one full turn, a ${n} looks the same ${o} time${o === 1 ? '' : 's'}.`, `Order ${o}`] }); },
    () => { const [ch, l] = pick([['H', 2], ['X', 2], ['A', 1], ['M', 1], ['T', 1], ['E', 1], ['S', 0], ['N', 0], ['Z', 0], ['F', 0]]); return num(`How many lines of symmetry does the capital letter ${ch} have?`, l, { hint: 'Could you fold it so the two halves match?', steps: [`${ch} has ${l} line${l === 1 ? '' : 's'} of symmetry.`] }); },
    () => { const v = pick([['Which shape has rotational symmetry of order 2 but no lines of symmetry?', 'parallelogram'], ['Which shape has exactly one line of symmetry and rotational symmetry of order 1?', 'kite'], ['Which shape has 3 lines of symmetry?', 'equilateral triangle'], ['Which shape has 2 lines of symmetry and rotational symmetry of order 2?', 'rectangle']]); return mc(v[0], v[1], ['parallelogram', 'kite', 'equilateral triangle', 'rectangle', 'square'], { hint: 'Picture each shape. Fold it, then turn it.', steps: [`The answer is the ${v[1]}.`] }); },
    (L) => {
      if (L === 1) return null;
      const n = ri(5, 15), lines = Math.random() < 0.5;
      return num(lines ? `A regular polygon has ${n} lines of symmetry. How many sides does it have?` : `What is the order of rotational symmetry of a regular polygon with ${n} sides?`, n, { hint: 'A regular polygon with n sides has n lines of symmetry and rotational symmetry of order n.', steps: [`Regular polygon: lines of symmetry = order = number of sides.`, `Answer: ${n}`] });
    },
  ],
  /* ---------------- 8.2 Circles and polygons ---------------- */
  '8.2': [
    (L) => { const r = L === 3 ? ri(11, 99) / 10 : ri(2, 30), toD = Math.random() < 0.5; return toD ? num(`A circle has a radius of ${D(r)} cm. What is its diameter?`, clean(2 * r), { unit: 'cm', hint: 'The diameter is twice the radius.', steps: [`d = 2 × ${D(r)} = ${D(clean(2 * r))} cm`] }) : num(`A circle has a diameter of ${D(clean(2 * r))} cm. What is its radius?`, r, { unit: 'cm', hint: 'The radius is half the diameter.', steps: [`r = ${D(clean(2 * r))} ÷ 2 = ${D(r)} cm`] }); },
    () => { const v = pick([['a straight line from the centre to the circumference', 'radius'], ['the distance all the way around a circle', 'circumference'], ['a straight line joining two points on the circumference', 'chord'], ['a straight line that touches the circle at one point only', 'tangent'], ['a chord that passes through the centre', 'diameter']]); return mc(`What is the name for ${v[0]}?`, v[1], ['radius', 'diameter', 'chord', 'tangent', 'circumference'], { hint: 'Picture the circle and each line.', steps: [`It is called the ${v[1]}.`] }); },
    () => { const [n, name] = pick(POLY.slice(2)); return Math.random() < 0.5 ? num(`How many sides does a ${name} have?`, n, { hint: 'penta = 5, hexa = 6, hepta = 7, octa = 8, nona = 9, deca = 10', steps: [`A ${name} has ${n} sides.`] }) : mc(`What is the name of a polygon with ${n} sides?`, name, POLY.map((p) => p[1]).filter((x) => x !== 'triangle' && x !== 'quadrilateral'), { hint: 'penta = 5, hexa = 6, hepta = 7, octa = 8, nona = 9, deca = 10', steps: [`A polygon with ${n} sides is a ${name}.`] }); },
    () => mc('What makes a polygon regular?', 'All its sides are equal and all its angles are equal', ['It has straight sides', 'All its angles are right angles', 'It has an even number of sides'], { hint: 'Think of a square compared with a rectangle.', steps: ['A regular polygon has all sides equal and all angles equal.'] }),
    (L) => { if (L === 1) return null; const r = ri(2, 12), n = pick([2, 3, 4]); return num(`${n} circles, each with radius ${r} cm, fit in a row inside a rectangle, touching each other and the ends. How long is the rectangle?`, 2 * r * n, { unit: 'cm', hint: 'Each circle takes up one diameter of length.', steps: [`Diameter = 2 × ${r} = ${2 * r} cm`, `${n} × ${2 * r} = ${2 * r * n} cm`] }); },
  ],
  /* ---------------- 8.3 Recognising congruent shapes ---------------- */
  '8.3': [
    () => mc('What does congruent mean?', 'Exactly the same shape and size', ['The same shape but a different size', 'The same area but a different shape', 'Having the same number of sides'], { hint: 'You could place one exactly on top of the other.', steps: ['Congruent shapes are exactly the same shape and size.', 'They can be turned or flipped.'] }),
    () => {
      let s; do { s = [ri(3, 9), ri(3, 9), ri(3, 9)].sort((a, b) => a - b); } while (s[0] + s[1] <= s[2] || s[0] === s[1] || s[1] === s[2]);
      const str = (a) => a.map((x) => x + ' cm').join(', '), perm = shuffle(s);
      return mc(`Triangle A has sides ${str(s)}. Which triangle is congruent to triangle A?`, str(perm), [str(s.map((x) => 2 * x)), str([s[0], s[1], s[2] + 1]), str([s[0] + 1, s[1], s[2] - 1])], { hint: 'Congruent triangles have exactly the same three side lengths, in any order.', steps: [`The sides ${str(perm)} are the same as ${str(s)}, just in a different order.`] });
    },
    () => { const a = ri(3, 15), b = ri(2, 12); return num(`Rectangles P and Q are congruent. Rectangle P is ${a} cm long and ${b} cm wide. What is the perimeter of rectangle Q?`, 2 * (a + b), { unit: 'cm', hint: 'Congruent means Q has exactly the same sides as P.', steps: [`Q is also ${a} cm by ${b} cm.`, `Perimeter = 2 × ${a} + 2 × ${b} = ${2 * (a + b)} cm`] }); },
    (L) => {
      const A = ri(30, 80), B = ri(30, 80), C = 180 - A - B;
      if (L < 3) return num(`Triangles ABC and DEF are congruent, with A matching D, B matching E and C matching F. Angle B is ${B}°. What is angle E?`, B, { unit: '°', hint: 'Matching angles in congruent shapes are equal.', steps: [`B matches E, so angle E = ${B}°`] });
      return num(`Triangles ABC and DEF are congruent, with A matching D, B matching E and C matching F. Angle A is ${A}° and angle B is ${B}°. What is angle F?`, C, { unit: '°', hint: 'Find angle C first. Angles in a triangle add up to 180°.', steps: [`C = 180 − ${A} − ${B} = ${C}°`, `F matches C, so F = ${C}°`] });
    },
    () => mc('Shape B is shape A flipped over and turned upside down. Are A and B congruent?', 'Yes, flipping and turning do not change shape or size', ['No, because B is upside down', 'No, because B is a reflection', 'Only if they are squares'], { hint: 'Does flipping a shape change its size?', steps: ['Turning and flipping keep the shape and size the same.', 'So A and B are congruent.'] }),
  ],
  /* ---------------- 8.4 3D shapes ---------------- */
  '8.4': [
    (L) => { const [name, f, e, v] = pick(L === 1 ? SOLIDS.slice(0, 5) : SOLIDS), k = pick(['faces', 'edges', 'vertices']), ans = { faces: f, edges: e, vertices: v }[k]; return num(`How many ${k} does a ${name} have?`, ans, { hint: k === 'faces' ? 'Faces are the flat surfaces.' : k === 'edges' ? 'Edges are the lines where two faces meet.' : 'Vertices are the corners.', steps: [`A ${name} has ${f} faces, ${e} edges and ${v} vertices.`] }); },
    () => { const v = pick([['6 squares', 'cube'], ['2 triangles and 3 rectangles', 'triangular prism'], ['1 square and 4 triangles', 'square-based pyramid'], ['4 triangles', 'tetrahedron'], ['2 hexagons and 6 rectangles', 'hexagonal prism'], ['6 rectangles (in 3 matching pairs)', 'cuboid']]); return mc(`A net is made from ${v[0]}. What 3D shape does it fold into?`, v[1], ['cube', 'cuboid', 'triangular prism', 'square-based pyramid', 'tetrahedron', 'hexagonal prism'], { hint: 'Each shape in the net becomes one face.', steps: [`${v[0]} make a ${v[1]}.`] }); },
    () => { const v = pick([['a circle', 'a rectangle', 'cylinder'], ['a circle', 'a triangle', 'cone'], ['a square', 'a triangle', 'square-based pyramid'], ['a circle', 'a circle', 'sphere'], ['a square', 'a square', 'cube']]); return mc(`A 3D shape has ${v[0]} as its top view and ${v[1]} as its front view. What could it be?`, v[2], ['cylinder', 'cone', 'square-based pyramid', 'sphere', 'cube', 'triangular prism'], { hint: 'Imagine looking down from above, then from the front.', steps: [`From above: ${v[0]}. From the front: ${v[1]}.`, `It is a ${v[2]}.`] }); },
    () => { const v = pick([['Edges are…', 'the lines where two faces meet'], ['Vertices are…', 'the corners of a solid shape'], ['Faces are…', 'the flat surfaces of a solid shape']]); return mc(v[0], v[1], ['the lines where two faces meet', 'the corners of a solid shape', 'the flat surfaces of a solid shape', 'the inside of a solid shape'], { hint: 'Think about a cube.', steps: [`${v[0]} ${v[1]}.`] }); },
    (L) => { if (L < 3) return null; const n = ri(5, 12), k = pick(['edges', 'vertices', 'faces']), ans = { edges: 3 * n, vertices: 2 * n, faces: n + 2 }[k]; return num(`A prism has ends that are polygons with ${n} sides. How many ${k} does it have?`, ans, { hint: 'Picture a triangular prism (n = 3) and look for the pattern.', steps: ['A prism with n-sided ends has n + 2 faces, 3n edges and 2n vertices.', `n = ${n}: ${k} = ${ans}`] }); },
  ],

  /* ---------------- 9.1 Generating sequences (1) ---------------- */
  '9.1': [
    (L) => { const a = L === 3 ? ri(-20, 30) : ri(1, 30), d = L === 1 ? ri(2, 9) : L === 2 ? nz(-9, 9) : pick([nz(-12, 12), clean(ri(1, 9) / 2) * pick([1, -1])]), t = [0, 1, 2, 3].map((i) => clean(a + i * d)); return num(`Write the next term in this sequence.\n${t.map(D).join(', ')}, …`, clean(a + 4 * d), { hint: 'Find the difference between each term and the next.', steps: [`The term-to-term rule is ${d > 0 ? 'add ' + D(d) : 'subtract ' + D(-d)}.`, `${D(t[3])} ${d > 0 ? '+' : '−'} ${D(Math.abs(d))} = ${D(clean(a + 4 * d))}`] }); },
    (L) => { const a = ri(1, 40), d = L === 1 ? ri(2, 9) : nz(-9, 9), t = [0, 1, 2, 3].map((i) => a + i * d), rule = d > 0 ? `Add ${d}` : `Subtract ${-d}`; return mc(`What is the term-to-term rule for this sequence?\n${t.map(D).join(', ')}, …`, rule, [d > 0 ? `Subtract ${d}` : `Add ${-d}`, `Add ${Math.abs(d) + 1}`, 'Multiply by 2', `Add ${a}`], { hint: 'What do you do to each term to get the next one?', steps: [`${D(t[0])} → ${D(t[1])}: ${rule.toLowerCase()}`] }); },
    (L) => { const a = ri(1, 30), d = L === 1 ? ri(2, 8) : nz(-8, 8), k = ri(5, L === 1 ? 6 : 10), ans = a + (k - 1) * d; return num(`The first term of a sequence is ${a}. The term-to-term rule is "${d > 0 ? 'add ' + d : 'subtract ' + -d}". What is the ${k}th term?`, ans, { hint: 'Write out the terms one at a time.', steps: [Array.from({ length: k }, (_, i) => D(a + i * d)).join(', '), `The ${k}th term is ${D(ans)}.`] }); },
    (L) => { if (L === 1) return null; const a = ri(-10, 30), d = nz(-9, 12); return num(`Find the missing term.\n${D(a)}, □, ${D(a + 2 * d)}, ${D(a + 3 * d)}, …`, a + d, { hint: 'Work out the difference between the last two terms.', steps: [`${D(a + 3 * d)} − ${P(a + 2 * d)} = ${D(d)}`, `${D(a)} + ${P(d)} = ${D(a + d)}`] }); },
    (L) => { if (L < 3) return null; const a = ri(1, 5), r = pick([2, 3]), k = r === 2 ? ri(5, 7) : 5, ans = a * r ** (k - 1); return num(`The first term of a sequence is ${a}. The term-to-term rule is "multiply by ${r}". What is the ${k}th term?`, ans, { hint: 'Keep multiplying.', steps: [Array.from({ length: k }, (_, i) => a * r ** i).join(', '), `The ${k}th term is ${ans}.`] }); },
  ],
  /* ---------------- 9.2 Generating sequences (2) ---------------- */
  '9.2': [
    (L) => { const a = ri(2, 9), d = ri(2, 6), n = ri(5, L === 1 ? 6 : 12), ans = a + (n - 1) * d, thing = pick(['tiles', 'dots', 'counters', 'blocks']); return num(`Pattern 1 has ${a} ${thing}, pattern 2 has ${a + d} ${thing} and pattern 3 has ${a + 2 * d} ${thing}. The patterns keep growing in the same way. How many ${thing} are in pattern ${n}?`, ans, { hint: 'How many are added each time?', steps: [`Each pattern adds ${d} ${thing}.`, `Pattern ${n}: ${a} + ${n - 1} × ${d} = ${ans}`] }); },
    (L) => { const kind = pick(['square', 'triangle']), [a, d] = kind === 'square' ? [4, 3] : [3, 2], n = ri(4, L === 1 ? 6 : 15), ans = a + (n - 1) * d; return num(`These patterns are made from matchsticks. How many matchsticks are needed for pattern ${n}?`, ans, { svg: S.matchsticks(kind), hint: `Count the matchsticks in patterns 1, 2 and 3. How many are added each time?`, steps: [`Patterns 1, 2, 3 use ${a}, ${a + d}, ${a + 2 * d} matchsticks.`, `Each new pattern adds ${d}.`, `Pattern ${n}: ${a} + ${n - 1} × ${d} = ${ans}`] }); },
    (L) => { if (L === 1) return null; const a = ri(3, 9), d = ri(2, 6), n = ri(6, 20), N = a + (n - 1) * d; return num(`Pattern 1 has ${a} squares and each new pattern has ${d} more squares than the one before. Which pattern number has ${N} squares?`, n, { hint: `How many lots of ${d} do you add to ${a} to get ${N}?`, steps: [`${N} − ${a} = ${N - a}`, `${N - a} ÷ ${d} = ${n - 1}`, `Pattern 1 + ${n - 1} = pattern ${n}`] }); },
    () => { const a = ri(2, 8), d = ri(2, 5); return mc(`Pattern 1 has ${a} shapes, pattern 2 has ${a + d} and pattern 3 has ${a + 2 * d}. What is the term-to-term rule?`, `Add ${d}`, [`Add ${a}`, `Add ${d * 2}`, 'Multiply by 2', `Add ${a + d}`], { hint: 'Look at the change from one pattern to the next.', steps: [`${a} → ${a + d} → ${a + 2 * d}`, `Each time add ${d}.`] }); },
  ],
  /* ---------------- 9.3 Using the nth term ---------------- */
  '9.3': [
    (L) => { const a = ri(2, 9), b = L === 1 ? 0 : ri(-9, 12), k = ri(L === 1 ? 2 : 5, L === 3 ? 100 : 20), e = b === 0 ? `${a}n` : `${a}n ${b < 0 ? '−' : '+'} ${Math.abs(b)}`; return num(`The nth term of a sequence is ${e}. What is the ${k}th term?`, a * k + b, { hint: `Replace n with ${k}.`, steps: [`${a} × ${k}${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}` : ''}`, `= ${D(a * k + b)}`] }); },
    (L) => { const a = ri(2, 9), b = L === 1 ? 0 : nz(-6, 9), t = [1, 2, 3, 4].map((n) => a * n + b), f = (x, y) => (y === 0 ? `${x}n` : `${x}n ${y < 0 ? '−' : '+'} ${Math.abs(y)}`); return mc(`What is the nth term of this sequence?\n${t.map(D).join(', ')}, …`, f(a, b), [f(a, b + a), `n + ${a}`, f(a + b > 0 ? a + b : a + 1, 0), f(b > 0 ? b : 2, a)], { hint: `The terms go up by ${a}, so the rule starts with ${a}n.`, steps: [`Difference = ${a}, so start with ${a}n.`, `${a} × 1 = ${a}. The first term is ${t[0]}, so ${b < 0 ? 'subtract ' + -b : 'add ' + b}.`, `nth term = ${f(a, b)}`] }); },
    (L) => { if (L === 1) return null; const a = ri(2, 9), b = ri(-8, 12), n = ri(5, 40), T = a * n + b; return num(`The nth term of a sequence is ${a}n ${b < 0 ? '−' : '+'} ${Math.abs(b)}. Which term is equal to ${T}?`, n, { hint: 'Make an equation and solve it.', steps: [`${a}n ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${T}`, `${a}n = ${T - b}`, `n = ${n}`] }); },
    (L) => { if (L === 1) return null; const a = ri(3, 9), b = ri(-5, 8), yes = Math.random() < 0.5, n = ri(10, 40), N = a * n + b + (yes ? 0 : ri(1, a - 1)), r = (N - b) / a; return mc(`The nth term of a sequence is ${a}n ${b < 0 ? '−' : '+'} ${Math.abs(b)}. Is ${N} a term in the sequence?`, yes ? `Yes, it is term ${n}` : 'No, n would not be a whole number', [yes ? 'No, n would not be a whole number' : `Yes, it is term ${Math.round(r)}`, `Yes, it is term ${N - b}`, 'No, the sequence never goes above 100'], { hint: `Solve ${a}n ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${N}.`, steps: [`${a}n = ${N - b}`, `n = ${(N - b)} ÷ ${a} = ${clean(r)}`, yes ? `That is a whole number, so yes: term ${n}.` : 'That is not a whole number, so no.'] }); },
  ],
  /* ---------------- 9.4 Representing simple functions ---------------- */
  '9.4': [
    (L) => { const op = pick(['+', '−', '×', '÷']), k = ri(2, 9), x = op === '÷' ? k * ri(1, 12) : ri(1, 20), out = op === '+' ? x + k : op === '−' ? x - k : op === '×' ? x * k : x / k; return num('Find the output of this function machine.', out, { svg: S.machine(String(x), [`${op} ${k}`], '?'), hint: `Do "${op} ${k}" to the input.`, steps: [`${x} ${op} ${k} = ${D(out)}`] }); },
    (L) => { if (L === 1) return null; const a = ri(2, 6), b = ri(1, 12) * pick([1, -1]), x = L === 2 ? ri(1, 10) : nz(-6, 12), out = a * x + b; return num('Find the output of this function machine.', out, { svg: S.machine(String(x), [`× ${a}`, b > 0 ? `+ ${b}` : `− ${-b}`], '?'), hint: 'Do the first step, then the second.', steps: [`${D(x)} × ${a} = ${D(a * x)}`, `${D(a * x)} ${b > 0 ? '+' : '−'} ${Math.abs(b)} = ${D(out)}`] }); },
    (L) => { const a = ri(2, 6), b = ri(1, 12), x = ri(1, 12), out = L === 1 ? x * a : a * x + b, ops = L === 1 ? [`× ${a}`] : [`× ${a}`, `+ ${b}`]; return num('Find the input of this function machine.', x, { svg: S.machine('?', ops, String(out)), hint: 'Work backwards from the output using the inverse operations.', steps: L === 1 ? [`${out} ÷ ${a} = ${x}`] : [`${out} − ${b} = ${a * x}`, `${a * x} ÷ ${a} = ${x}`] }); },
    (L) => {
      const two = L > 1, a = ri(2, 5), b = ri(1, 9), ins = shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 3).sort((x, y) => x - y), f = (x) => (two ? a * x + b : x + b), outs = ins.map(f);
      const right = two ? `× ${a} then + ${b}` : `+ ${b}`, wrong = two ? [`+ ${b} then × ${a}`, `× ${a + 1} then − ${b > 1 ? b - 1 : 1}`, `+ ${outs[0] - ins[0]}`] : [`× ${b}`, `+ ${b + 1}`, `− ${b}`];
      return mc('What is the rule for this function?', right, wrong, { table: { head: ['input', ...ins.map(String)], rows: [['output', ...outs.map(String)]] }, hint: 'Test each rule on every input.', steps: ins.map((x) => `${x} ${two ? `× ${a} = ${a * x}, + ${b}` : `+ ${b}`} = ${f(x)}`) });
    },
  ],

  /* ---------------- 10.1 Fractions, decimals and percentages ---------------- */
  '10.1': [
    (L) => { const p = pick(L === 1 ? [10, 20, 25, 50, 75, 30, 40, 60, 70, 80, 90] : [12, 15, 35, 45, 65, 72, 85, 96, 4, 8, 24]); return frq(`Write ${p}% as a fraction in its simplest form.`, p, 100, { hint: `${p}% means ${p} out of 100.`, steps: [`${p}% = ${FU(p, 100)}`, `= ${F(p, 100)}`] }); },
    (L) => { const d = pick([2, 4, 5, 10, 20, 25, 50]), n = ri(1, d - 1), p = (n * 100) / d; if (gcd(n, d) !== 1) return null; return num(`Write ${F(n, d)} as a percentage.`, p, { unit: '%', hint: `Make the denominator 100: multiply top and bottom by ${100 / d}.`, steps: [`${F(n, d)} = ${FU(n * (100 / d), 100)}`, `= ${p}%`] }); },
    (L) => { const p = L === 1 ? ri(1, 9) * 10 + ri(0, 9) : pick([ri(1, 9), ri(101, 150), ri(10, 99) + 0.5]), toDec = Math.random() < 0.5; return toDec ? num(`Write ${D(p)}% as a decimal.`, clean(p / 100), { hint: 'Divide by 100.', steps: [`${D(p)} ÷ 100 = ${D(clean(p / 100))}`] }) : num(`Write ${D(clean(p / 100))} as a percentage.`, p, { unit: '%', hint: 'Multiply by 100.', steps: [`${D(clean(p / 100))} × 100 = ${D(p)}%`] }); },
    () => { const pool = shuffle([[0.8, '0.8'], [0.75, '{3/4}'], [0.77, '77%'], [0.71, '0.71'], [0.76, '{19/25}'], [0.7, '70%'], [0.68, '{17/25}'], [0.79, '0.79']]).slice(0, 4), big = Math.random() < 0.5, best = pool.reduce((a, b) => ((big ? b[0] > a[0] : b[0] < a[0]) ? b : a)); return mc(`Which is the ${big ? 'largest' : 'smallest'}?`, best[1], pool.filter((p) => p !== best).map((p) => p[1]), { hint: 'Change them all to percentages (or decimals) to compare.', steps: [pool.map((p) => `${p[1].replace(/[{}]/g, '')} = ${clean(p[0] * 100)}%`).join(', '), `The ${big ? 'largest' : 'smallest'} is ${best[1].replace(/[{}]/g, '')}.`] }); },
    () => { const k = ri(5, 95); return num('What percentage of the grid is shaded?', k, { unit: '%', svg: S.waffle(k), hint: 'The grid has 100 squares. Count the shaded ones.', steps: [`${k} out of 100 squares are shaded.`, `= ${k}%`] }); },
  ],
  /* ---------------- 10.2 Percentages large and small ---------------- */
  '10.2': [
    (L) => { const p = pick(L === 1 ? [10, 20, 25, 50, 75, 5, 1] : L === 2 ? [150, 200, 125, 8, 15, 120] : [0.5, 0.1, 2.5, 250, 0.2, 12.5]), amt = pick([40, 60, 80, 120, 200, 240, 360, 400, 480]), ans = clean((p * amt) / 100); return num(`Work out ${D(p)}% of $${amt}.`, ans, { unit: '$', hint: `Find 1% first (÷ 100), or use 10% and 1% to build up.`, steps: [`1% of ${amt} = ${D(clean(amt / 100))}`, `${D(p)}% = ${D(clean(amt / 100))} × ${D(p)} = ${D(ans)}`] }); },
    (L) => { const B = pick([20, 25, 40, 50, 80, 200, 250, 400]), p = pick(L === 1 ? [10, 20, 25, 50, 75] : [5, 15, 35, 60, 120, 150]), A = clean((p * B) / 100); return num(`What percentage of $${B} is $${D(A)}?`, p, { unit: '%', hint: `Write it as a fraction, ${D(A)} out of ${B}, then change to a percentage.`, steps: [`${D(A)} ÷ ${B} = ${D(clean(A / B))}`, `${D(clean(A / B))} × 100 = ${p}%`] }); },
    (L) => { const p = pick(L === 3 ? [0.5, 0.2, 0.4, 2.5, 7.5, 12.5, 0.25] : [0.5, 2.5, 12.5, 0.1]), [n, d] = fr(Math.round(p * 1000), 100000); return frq(`Write ${D(p)}% as a fraction in its simplest form.`, n, d, { hint: `${D(p)}% = ${D(p)} out of 100. Multiply top and bottom by 10 to remove the decimal.`, steps: [`${D(p)}% = {${D(p)}/100} = ${FU(Math.round(p * 10), 1000)}`, `= ${F(n, d)}`] }); },
    () => { const v = pick([['Sam scored 120% in a test marked out of 50.', 'Impossible'], ['A sunflower grew by 150% in a month.', 'Possible'], ['A shop reduced a price by 120%.', 'Impossible'], ['A town\'s population increased by 200%.', 'Possible'], ['0.5% of the students in a school were absent.', 'Possible']]); return mc(`Is this possible or impossible?\n${v[0]}`, v[1], ['Possible', 'Impossible'], { order: ['Possible', 'Impossible'], hint: 'You cannot score more than all the marks or take away more than the whole price. Things can grow by more than 100%.', steps: [v[1] === 'Possible' ? 'Increases can be more than 100%, and small percentages under 1% are fine.' : 'You cannot have more than 100% of a fixed total, or reduce by more than 100%.', `So it is ${v[1].toLowerCase()}.`] }); },
  ],
};
