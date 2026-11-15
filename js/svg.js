// Small diagram generators. Every diagram is drawn from the question's own numbers.
const INK = '#1b2a41', SOFT = '#5b6b85', FILL = '#ffffff', A1 = '#3d8bd9', A2 = '#f2a541', SHADE = '#7cc47f';
const font = 'font-family="Nunito, Arial, sans-serif"';
const wrap = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img"><rect width="${w}" height="${h}" fill="${FILL}"/>${body}</svg>`;
const txt = (x, y, s, o = {}) => `<text x="${x}" y="${y}" ${font} font-size="${o.size || 16}" font-weight="${o.w || 700}" fill="${o.fill || INK}" text-anchor="${o.anchor || 'middle'}" dominant-baseline="middle">${s}</text>`;
const rad = (d) => (d * Math.PI) / 180;
const mm = (s) => String(s).replace(/-/g, '−');

export function numberLine({ lo, hi, at, closed, dir }) {
  const W = 420, H = 90, pad = 30, n = hi - lo, step = (W - 2 * pad) / n, X = (v) => pad + (v - lo) * step;
  let b = `<line x1="${pad - 14}" y1="50" x2="${W - pad + 14}" y2="50" stroke="${INK}" stroke-width="3"/>`;
  for (let v = lo; v <= hi; v++) b += `<line x1="${X(v)}" y1="42" x2="${X(v)}" y2="58" stroke="${INK}" stroke-width="2"/>` + txt(X(v), 76, mm(v), { size: 14 });
  const x = X(at), end = dir > 0 ? W - pad + 10 : pad - 10;
  b += `<line x1="${x}" y1="26" x2="${end}" y2="26" stroke="${A1}" stroke-width="5"/>`;
  b += dir > 0 ? `<path d="M${end + 8} 26 L${end - 4} 18 L${end - 4} 34 Z" fill="${A1}"/>` : `<path d="M${end - 8} 26 L${end + 4} 18 L${end + 4} 34 Z" fill="${A1}"/>`;
  b += `<circle cx="${x}" cy="26" r="8" fill="${closed ? A1 : FILL}" stroke="${A1}" stroke-width="4"/>`;
  return wrap(W, H, b);
}

/** Angles around a point. angles: degrees (sum 360); labels: strings. */
export function anglesAround(angles, labels) {
  const W = 300, H = 240, cx = 150, cy = 120, R = 100; let b = '', start = 20 + Math.random() * 40;
  angles.forEach((a, i) => {
    const t = rad(start);
    b += `<line x1="${cx}" y1="${cy}" x2="${cx + R * Math.cos(t)}" y2="${cy - R * Math.sin(t)}" stroke="${INK}" stroke-width="3"/>`;
    const mid = rad(start + a / 2), r = a < 40 ? 70 : 52;
    b += txt(cx + r * Math.cos(mid), cy - r * Math.sin(mid), labels[i], { size: 15, fill: i === angles.length - 1 ? A1 : INK });
    start += a;
  });
  b += `<circle cx="${cx}" cy="${cy}" r="4" fill="${INK}"/>`;
  return wrap(W, H, b);
}

/** A straight line with one ray: angle a on the right, label for both. */
export function straightLine(a, leftLabel, rightLabel) {
  const W = 320, H = 170, cx = 160, cy = 130, R = 120, t = rad(a);
  let b = `<line x1="${cx - 140}" y1="${cy}" x2="${cx + 140}" y2="${cy}" stroke="${INK}" stroke-width="3"/>`;
  b += `<line x1="${cx}" y1="${cy}" x2="${cx + R * Math.cos(t)}" y2="${cy - R * Math.sin(t)}" stroke="${INK}" stroke-width="3"/>`;
  b += txt(cx + 50 * Math.cos(rad(a / 2)), cy - 50 * Math.sin(rad(a / 2)), rightLabel, { size: 15 });
  b += txt(cx + 50 * Math.cos(rad((a + 180) / 2)), cy - 50 * Math.sin(rad((a + 180) / 2)), leftLabel, { size: 15, fill: A1 });
  return wrap(W, H, b);
}

/** Two crossing lines. labels: [right, top, left, bottom] around the crossing; a = acute-ish angle between lines. */
export function crossing(a, labels) {
  const W = 320, H = 220, cx = 160, cy = 110, R = 130, t = rad(a / 2);
  let b = `<line x1="${cx - R * Math.cos(t)}" y1="${cy + R * Math.sin(t)}" x2="${cx + R * Math.cos(t)}" y2="${cy - R * Math.sin(t)}" stroke="${INK}" stroke-width="3"/>`;
  b += `<line x1="${cx - R * Math.cos(t)}" y1="${cy - R * Math.sin(t)}" x2="${cx + R * Math.cos(t)}" y2="${cy + R * Math.sin(t)}" stroke="${INK}" stroke-width="3"/>`;
  const pos = [[44, 0], [0, -40], [-44, 0], [0, 40]];
  labels.forEach((l, i) => { if (l) b += txt(cx + pos[i][0], cy + pos[i][1], l, { size: 15, fill: l.includes('°') ? INK : A1 }); });
  return wrap(W, H, b);
}

/** Two parallel lines cut by a transversal. Labels by position: top/bottom intersection, quadrant 0..3 = TR, TL, BL, BR. */
export function parallel(a, top, bottom) {
  const W = 340, H = 230, y1 = 70, y2 = 160, t = rad(a), dx = (y2 - y1) / Math.tan(t), x1 = 190 - dx / 2, x2 = 190 + dx / 2;
  let b = `<line x1="20" y1="${y1}" x2="${W - 20}" y2="${y1}" stroke="${INK}" stroke-width="3"/><line x1="20" y1="${y2}" x2="${W - 20}" y2="${y2}" stroke="${INK}" stroke-width="3"/>`;
  const ex = 60 / Math.tan(t);
  b += `<line x1="${x1 - ex}" y1="${y1 - 60}" x2="${x2 + ex}" y2="${y2 + 60}" stroke="${INK}" stroke-width="3"/>`;
  b += `<path d="M40 ${y1 - 6} l10 6 l-10 6" fill="none" stroke="${INK}" stroke-width="2.5"/><path d="M40 ${y2 - 6} l10 6 l-10 6" fill="none" stroke="${INK}" stroke-width="2.5"/>`;
  const q = [[30, -14], [-30, -14], [-30, 16], [30, 16]];
  const put = (x, y, lab) => lab.forEach((l, i) => { if (l) b += txt(x + q[i][0], y + q[i][1], l, { size: 15, fill: l.includes('°') ? INK : A1 }); });
  put(x1, y1, top); put(x2, y2, bottom);
  return wrap(W, H, b);
}

export function polygon(n, opts = {}) {
  const W = 240, H = 220, cx = 120, cy = 112, R = 88; const pts = [];
  for (let i = 0; i < n; i++) { const t = rad(90 + (360 / n) * i + (n % 2 ? 0 : 180 / n)); pts.push(`${(cx + R * Math.cos(t)).toFixed(1)},${(cy - R * Math.sin(t)).toFixed(1)}`); }
  return wrap(W, H, `<polygon points="${pts.join(' ')}" fill="${opts.fill || '#e7f0fb'}" stroke="${INK}" stroke-width="3"/>`);
}

export function shapePath(kind) {
  const shapes = {
    rectangle: '<rect x="40" y="60" width="160" height="100" fill="#e7f0fb" stroke="#1b2a41" stroke-width="3"/>',
    parallelogram: '<polygon points="70,60 210,60 170,160 30,160" fill="#e7f0fb" stroke="#1b2a41" stroke-width="3"/>',
    rhombus: '<polygon points="120,30 190,110 120,190 50,110" fill="#e7f0fb" stroke="#1b2a41" stroke-width="3"/>',
    kite: '<polygon points="120,30 175,80 120,195 65,80" fill="#e7f0fb" stroke="#1b2a41" stroke-width="3"/>',
    'isosceles trapezium': '<polygon points="80,60 160,60 205,160 35,160" fill="#e7f0fb" stroke="#1b2a41" stroke-width="3"/>',
    'isosceles triangle': '<polygon points="120,30 185,180 55,180" fill="#e7f0fb" stroke="#1b2a41" stroke-width="3"/>',
    'scalene triangle': '<polygon points="60,40 210,170 30,180" fill="#e7f0fb" stroke="#1b2a41" stroke-width="3"/>',
  };
  return wrap(240, 220, shapes[kind]);
}

/** Triangle with base b and perpendicular height h shown. */
export function triangle(bLab, hLab, shape = 0) {
  const W = 320, H = 220, x0 = 50, x1 = 270, y = 185, apexX = [160, 110, 230][shape], top = 35;
  let b = `<polygon points="${x0},${y} ${x1},${y} ${apexX},${top}" fill="#e7f0fb" stroke="${INK}" stroke-width="3"/>`;
  b += `<line x1="${apexX}" y1="${top}" x2="${apexX}" y2="${y}" stroke="${A1}" stroke-width="2.5" stroke-dasharray="7 5"/><rect x="${apexX}" y="${y - 14}" width="14" height="14" fill="none" stroke="${A1}" stroke-width="2"/>`;
  b += txt((x0 + x1) / 2, y + 22, bLab) + txt(apexX + 12, (top + y) / 2, hLab, { anchor: 'start', fill: A1 });
  return wrap(W, H + 20, b);
}

export function rectangle(wLab, hLab) {
  return wrap(300, 190, `<rect x="30" y="30" width="190" height="110" fill="#e7f0fb" stroke="${INK}" stroke-width="3"/>` + txt(125, 162, wLab) + txt(230, 85, hLab, { anchor: 'start' }));
}

export function cuboid(l, w, h) {
  const W = 330, H = 230, x = 50, y = 80, L = 170, Hh = 100, dx = 60, dy = -40;
  let b = `<polygon points="${x},${y} ${x + L},${y} ${x + L},${y + Hh} ${x},${y + Hh}" fill="#e7f0fb" stroke="${INK}" stroke-width="3"/>`;
  b += `<polygon points="${x},${y} ${x + dx},${y + dy} ${x + L + dx},${y + dy} ${x + L},${y}" fill="#d3e4f7" stroke="${INK}" stroke-width="3"/>`;
  b += `<polygon points="${x + L},${y} ${x + L + dx},${y + dy} ${x + L + dx},${y + Hh + dy} ${x + L},${y + Hh}" fill="#bcd5f1" stroke="${INK}" stroke-width="3"/>`;
  b += txt(x + L / 2, y + Hh + 22, l) + txt(x + L + dx / 2 + 16, y + Hh + dy / 2 + 14, w, { anchor: 'start' }) + txt(x - 10, y + Hh / 2, h, { anchor: 'end' });
  return wrap(W, H, b);
}

/** Dual bar chart. cats: names; s1, s2: values; names: series names; step: grid step. */
export function dualBar(title, cats, s1, s2, names, step) {
  const W = 420, H = 280, l = 50, r = 400, t = 40, bt = 225, max = Math.ceil(Math.max(...s1, ...s2) / step) * step + step, Y = (v) => bt - (v / max) * (bt - t);
  let b = txt(W / 2, 16, title, { size: 15 });
  for (let v = 0; v <= max; v += step) b += `<line x1="${l}" y1="${Y(v)}" x2="${r}" y2="${Y(v)}" stroke="#d6dce6" stroke-width="1.5"/>` + txt(l - 8, Y(v), v, { size: 13, anchor: 'end' });
  const gw = (r - l) / cats.length, bw = gw * 0.3;
  cats.forEach((c, i) => {
    const gx = l + gw * i + gw / 2;
    b += `<rect x="${gx - bw}" y="${Y(s1[i])}" width="${bw}" height="${bt - Y(s1[i])}" fill="${A1}" stroke="${INK}" stroke-width="2"/>`;
    b += `<rect x="${gx}" y="${Y(s2[i])}" width="${bw}" height="${bt - Y(s2[i])}" fill="${A2}" stroke="${INK}" stroke-width="2"/>`;
    b += txt(gx, bt + 16, c, { size: 13 });
  });
  b += `<line x1="${l}" y1="${bt}" x2="${r}" y2="${bt}" stroke="${INK}" stroke-width="2.5"/><line x1="${l}" y1="${t - 6}" x2="${l}" y2="${bt}" stroke="${INK}" stroke-width="2.5"/>`;
  b += `<rect x="${l + 30}" y="${H - 24}" width="16" height="14" fill="${A1}" stroke="${INK}" stroke-width="1.5"/>` + txt(l + 52, H - 17, names[0], { size: 13, anchor: 'start' });
  b += `<rect x="${l + 170}" y="${H - 24}" width="16" height="14" fill="${A2}" stroke="${INK}" stroke-width="1.5"/>` + txt(l + 192, H - 17, names[1], { size: 13, anchor: 'start' });
  return wrap(W, H, b);
}

export function waffle(k) {
  const s = 22, W = 10 * s + 20, cells = [];
  for (let i = 0; i < 100; i++) { const r = Math.floor(i / 10), c = i % 10; cells.push(`<rect x="${10 + c * s}" y="${10 + r * s}" width="${s - 2}" height="${s - 2}" fill="${i < k ? SHADE : '#eef1f6'}" stroke="${INK}" stroke-width="1"/>`); }
  return wrap(W, W, cells.join(''));
}

/** Pictogram: rows of [label, halves]; each icon = key people. */
export function pictogram(rows, key) {
  const W = 420, rowH = 44, H = rows.length * rowH + 50; let b = '';
  rows.forEach(([label, halves], i) => {
    const y = 26 + i * rowH; b += txt(90, y, label, { size: 14, anchor: 'end' });
    for (let j = 0; j < Math.floor(halves / 2); j++) b += `<circle cx="${120 + j * 36}" cy="${y}" r="14" fill="${A2}" stroke="${INK}" stroke-width="2"/>`;
    if (halves % 2) { const cx = 120 + Math.floor(halves / 2) * 36; b += `<path d="M${cx} ${y - 14} A14 14 0 0 0 ${cx} ${y + 14} Z" fill="${A2}" stroke="${INK}" stroke-width="2"/>`; }
  });
  b += `<circle cx="140" cy="${H - 18}" r="11" fill="${A2}" stroke="${INK}" stroke-width="2"/>` + txt(160, H - 18, `= ${key} people`, { size: 14, anchor: 'start' });
  return wrap(W, H, b);
}

/** Straight-line graph through the origin. */
export function lineGraph({ xmax, xstep, ymax, ystep, x1, y1, xlab, ylab }) {
  const W = 420, H = 300, l = 60, r = 400, t = 20, bt = 250, X = (v) => l + (v / xmax) * (r - l), Y = (v) => bt - (v / ymax) * (bt - t);
  let b = '';
  for (let v = 0; v <= xmax; v += xstep) b += `<line x1="${X(v)}" y1="${t}" x2="${X(v)}" y2="${bt}" stroke="#d6dce6" stroke-width="1.5"/>` + txt(X(v), bt + 16, v, { size: 13 });
  for (let v = 0; v <= ymax; v += ystep) b += `<line x1="${l}" y1="${Y(v)}" x2="${r}" y2="${Y(v)}" stroke="#d6dce6" stroke-width="1.5"/>` + txt(l - 8, Y(v), v, { size: 13, anchor: 'end' });
  b += `<line x1="${l}" y1="${bt}" x2="${r}" y2="${bt}" stroke="${INK}" stroke-width="2.5"/><line x1="${l}" y1="${t}" x2="${l}" y2="${bt}" stroke="${INK}" stroke-width="2.5"/>`;
  const xe = Math.min(xmax, (ymax * x1) / y1), ye = (y1 / x1) * xe;
  b += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(xe)}" y2="${Y(ye)}" stroke="${A1}" stroke-width="4"/>`;
  b += txt((l + r) / 2, H - 12, xlab, { size: 14 }) + `<text x="18" y="${(t + bt) / 2}" ${font} font-size="14" font-weight="700" fill="${INK}" text-anchor="middle" transform="rotate(-90 18 ${(t + bt) / 2})">${ylab}</text>`;
  return wrap(W, H, b);
}

/** Coordinate grid with labelled points. */
export function grid(points, range = 6) {
  const W = 320, c = W / 2, s = (W - 40) / (2 * range); let b = '';
  for (let v = -range; v <= range; v++) {
    b += `<line x1="${c + v * s}" y1="20" x2="${c + v * s}" y2="${W - 20}" stroke="#e1e6ee" stroke-width="1"/><line x1="20" y1="${c - v * s}" x2="${W - 20}" y2="${c - v * s}" stroke="#e1e6ee" stroke-width="1"/>`;
    if (v && v % 2 === 0) b += txt(c + v * s, c + 12, mm(v), { size: 11, w: 600, fill: SOFT }) + txt(c - 10, c - v * s, mm(v), { size: 11, w: 600, fill: SOFT, anchor: 'end' });
  }
  b += `<line x1="20" y1="${c}" x2="${W - 20}" y2="${c}" stroke="${INK}" stroke-width="2"/><line x1="${c}" y1="20" x2="${c}" y2="${W - 20}" stroke="${INK}" stroke-width="2"/>`;
  b += txt(W - 12, c - 10, 'x', { size: 13 }) + txt(c + 12, 14, 'y', { size: 13 });
  points.forEach(([x, y, lab]) => { b += `<circle cx="${c + x * s}" cy="${c - y * s}" r="5" fill="${A1}" stroke="${INK}" stroke-width="1.5"/><text x="${c + x * s + 12}" y="${c - y * s - 12}" ${font} font-size="15" font-weight="900" fill="${INK}" stroke="#fff" stroke-width="4" paint-order="stroke" text-anchor="middle" dominant-baseline="middle">${lab}</text>`; });
  return wrap(W, W, b);
}

/** Function machine: input → ops → output. Unknown values shown as "?". */
export function machine(input, ops, output) {
  const bw = 78, gap = 34, W = 90 + ops.length * (bw + gap) + 90, H = 110, y = 55; let x = 10, b = '';
  const val = (v) => `<rect x="${x}" y="${y - 20}" width="70" height="40" rx="20" fill="${v === '?' ? '#fff4d6' : '#eef4fb'}" stroke="${INK}" stroke-width="2.5"/>` + txt(x + 35, y, mm(v), { size: 17 });
  const arrow = (x0) => `<line x1="${x0}" y1="${y}" x2="${x0 + gap - 8}" y2="${y}" stroke="${INK}" stroke-width="2.5"/><path d="M${x0 + gap - 2} ${y} l-9 -6 v12 z" fill="${INK}"/>`;
  b += txt(x + 35, 18, 'input', { size: 12, fill: SOFT }) + val(input); x += 70;
  for (const op of ops) { b += arrow(x + 2); x += gap; b += `<rect x="${x}" y="${y - 24}" width="${bw}" height="48" fill="${A2}" stroke="${INK}" stroke-width="2.5"/>` + txt(x + bw / 2, y, mm(op), { size: 17 }); x += bw; }
  b += arrow(x + 2); x += gap; b += txt(x + 35, 18, 'output', { size: 12, fill: SOFT }) + val(output);
  return wrap(x + 80, H, b);
}

/** Matchstick patterns. kind: 'square' | 'triangle'. Draws patterns 1..3. */
export function matchsticks(kind) {
  const s = 26, W = 440, H = 120; let b = '', x0 = 14;
  const stick = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${A2}" stroke-width="5" stroke-linecap="round"/>`;
  for (let p = 1; p <= 3; p++) {
    const y = 40;
    for (let i = 0; i < p; i++) {
      const x = x0 + i * s;
      if (kind === 'square') { b += stick(x, y, x + s, y) + stick(x, y + s, x + s, y + s) + stick(x + s, y, x + s, y + s); if (i === 0) b += stick(x, y, x, y + s); }
      else { b += stick(x, y + s, x + s, y + s) + stick(x + s / 2, y, x + s, y + s); if (i === 0) b += stick(x, y + s, x + s / 2, y); if (i < p - 1) b += stick(x + s / 2, y, x + s * 1.5, y); }
    }
    b += txt(x0 + (p * s) / 2, y + s + 28, `Pattern ${p}`, { size: 13 });
    x0 += p * s + 70;
  }
  return wrap(W, H, b);
}
