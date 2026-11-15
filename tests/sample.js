import { BANK } from '../js/bank.js';
const L = +process.argv[2] || 2, only = process.argv[3];
for (const code of Object.keys(BANK)) { if (only && !code.startsWith(only)) continue; BANK[code].forEach((t, ti) => { let q = null; for (let i = 0; i < 20 && !q; i++) q = t(L); if (!q) return; console.log(`${code} t${ti} [${q.kind}] ${q.q.replace(/\n/g, ' / ')}  => ${q.ans}${q.choices ? '  {' + q.choices.join(' | ') + '}' : ''}${q.unit ? ' ' + q.unit : ''}`); }); }
