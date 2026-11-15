// Hand-drawn (in code) art for the world of Numeria: region scenes, the hero, chests and gems.
const INK = '#1b2a41';
const sv = (w, h, body, cls = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" class="${cls}" aria-hidden="true">${body}</svg>`;
const sky = (c1, c2) => `<defs><linearGradient id="g${c1.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="200" height="120" fill="url(#g${c1.slice(1)})"/>`;
const stroke = `stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"`;

const SCENES = {
  peaks: () => sky('#9fd3f0', '#d8eefa') + `<polygon points="10,110 60,30 110,110" fill="#7a8fa6" ${stroke}/><polygon points="60,30 48,50 56,46 62,54 70,48" fill="#fff" ${stroke}/><polygon points="80,110 135,20 190,110" fill="#8ea3b8" ${stroke}/><polygon points="135,20 121,42 131,38 138,47 148,40" fill="#fff" ${stroke}/><rect y="104" width="200" height="16" fill="#7a9e7e"/>`,
  forest: () => sky('#a8dcc0', '#e3f5ea') + [20, 55, 95, 135, 170].map((x, i) => `<rect x="${x - 4}" y="${88 - (i % 2) * 8}" width="8" height="22" fill="#7a5233" ${stroke}/><polygon points="${x - 22},${92 - (i % 2) * 8} ${x},${40 - (i % 2) * 14} ${x + 22},${92 - (i % 2) * 8}" fill="${i % 2 ? '#2f6b3f' : '#3f8a52'}" ${stroke}/>`).join('') + `<rect y="108" width="200" height="12" fill="#5c8f4a"/>`,
  plains: () => sky('#bfe6ff', '#f2fbff') + `<path d="M0 80 Q50 55 100 78 T200 70 V120 H0 Z" fill="#b5c46a" ${stroke}/><path d="M0 98 Q60 80 120 96 T200 92 V120 H0 Z" fill="#9db353" ${stroke}/>` + [30, 60, 90, 120].map((x) => `<line x1="${x}" y1="96" x2="${x}" y2="80" ${stroke}/>`).join('') + `<line x1="26" y1="85" x2="124" y2="85" ${stroke}/><circle cx="165" cy="28" r="14" fill="#ffd95a" ${stroke}/>`,
  dunes: () => sky('#ffd9a0', '#fff1d8') + `<circle cx="160" cy="30" r="15" fill="#ffb347" ${stroke}/><path d="M0 85 Q50 60 100 85 T200 80 V120 H0 Z" fill="#e8c27a" ${stroke}/><path d="M0 102 Q70 82 140 100 T200 98 V120 H0 Z" fill="#d9a85c" ${stroke}/><path d="M45 100 V66 Q45 60 51 60 Q57 60 57 66 V100" fill="#5e9e5a" ${stroke}/><path d="M45 80 H38 V70" fill="none" ${stroke}/><path d="M57 76 H64 V66" fill="none" ${stroke}/>`,
  crags: () => sky('#c9d6e2', '#eef2f6') + `<polygon points="0,110 25,50 45,75 70,25 95,70 115,40 145,80 170,35 200,90 200,120 0,120" fill="#9a8f86" ${stroke}/><polyline points="70,25 74,60 95,70" fill="none" ${stroke}/><polyline points="170,35 166,70 200,90" fill="none" ${stroke}/>`,
  marsh: () => sky('#cfe8df', '#eef8f4') + `<rect y="78" width="200" height="42" fill="#6f9c8f" ${stroke}/>` + [20, 40, 140, 165, 185].map((x) => `<line x1="${x}" y1="100" x2="${x + 4}" y2="56" stroke="#3e6b4f" stroke-width="3"/><ellipse cx="${x + 4}" cy="58" rx="3" ry="8" fill="#7a5233"/>`).join('') + `<ellipse cx="95" cy="98" rx="30" ry="6" fill="#9cc7bb"/>`,
  falls: () => sky('#b4e2f5', '#e8f7fd') + `<rect x="0" y="20" width="80" height="100" fill="#8a7d70" ${stroke}/><rect x="120" y="30" width="80" height="90" fill="#8a7d70" ${stroke}/><rect x="72" y="22" width="56" height="86" fill="#4f9fc9" ${stroke}/>` + [82, 96, 110].map((x) => `<line x1="${x}" y1="30" x2="${x}" y2="100" stroke="#e3f4fb" stroke-width="3"/>`).join('') + `<ellipse cx="100" cy="108" rx="60" ry="10" fill="#7fc0e0" ${stroke}/>`,
  lake: () => sky('#bfe0ff', '#eef7ff') + `<path d="M0 70 Q40 50 80 66 T160 60 T200 64 V120 H0 Z" fill="#7caa6a" ${stroke}/><ellipse cx="100" cy="94" rx="80" ry="20" fill="#6fb6d6" ${stroke}/><ellipse cx="100" cy="94" rx="40" ry="8" fill="#a9d9ee"/><polygon points="100,46 112,66 88,66" fill="#e7f0fb" ${stroke}/>`,
  caves: () => sky('#cdbfe6', '#efe9f8') + `<path d="M0 120 V60 Q100 0 200 60 V120 Z" fill="#7d6a9e" ${stroke}/><path d="M70 120 V88 Q100 55 130 88 V120 Z" fill="#2b2140" ${stroke}/>` + [[88, 112], [100, 104], [112, 112]].map(([x, y]) => `<polygon points="${x},${y} ${x - 5},${y + 8} ${x + 5},${y + 8}" fill="#6ef0e0" ${stroke}/>`).join(''),
  port: () => sky('#ffd6c2', '#fff0e8') + `<rect y="74" width="200" height="46" fill="#4f9fc9" ${stroke}/><rect x="0" y="60" width="60" height="16" fill="#c97b5a" ${stroke}/><path d="M110 92 H170 L160 106 H120 Z" fill="#8a5a3c" ${stroke}/><line x1="140" y1="92" x2="140" y2="50" ${stroke}/><polygon points="142,52 142,88 168,88" fill="#fff" ${stroke}/><text x="150" y="80" font-family="Arial" font-size="14" font-weight="900" fill="${INK}">%</text>`,
  ridge: () => sky('#d6efc0', '#f3fbea') + `<path d="M0 110 L50 60 L90 85 L140 35 L200 75 V120 H0 Z" fill="#8aa35c" ${stroke}/><polyline points="20,100 60,80 100,70 140,45 180,30" fill="none" stroke="#d64545" stroke-width="3.5" stroke-dasharray="6 5"/><line x1="140" y1="35" x2="140" y2="15" ${stroke}/><polygon points="140,15 158,20 140,25" fill="#f2c14e" ${stroke}/>`,
  rapids: () => sky('#bde3f5', '#ecf8fd') + `<path d="M0 60 Q100 40 200 60 V120 H0 Z" fill="#3d8bb0" ${stroke}/>` + [[30, 75], [90, 70], [150, 78], [60, 95], [130, 100], [170, 92]].map(([x, y]) => `<path d="M${x} ${y} q8 -6 16 0 q8 6 16 0" fill="none" stroke="#e8f6fc" stroke-width="3"/>`).join('') + `<ellipse cx="100" cy="88" rx="10" ry="6" fill="#8a7d70" ${stroke}/>`,
  canyon: () => sky('#ffd2b8', '#fff1e8') + `<path d="M0 30 H60 L70 120 H0 Z" fill="#c4683f" ${stroke}/><path d="M200 40 H140 L128 120 H200 Z" fill="#c4683f" ${stroke}/><line x1="0" y1="60" x2="64" y2="60" ${stroke}/><line x1="0" y1="90" x2="67" y2="90" ${stroke}/><line x1="136" y1="70" x2="200" y2="70" ${stroke}/><line x1="132" y1="98" x2="200" y2="98" ${stroke}/><rect x="86" y="70" width="24" height="24" rx="4" fill="#fff" ${stroke}/><circle cx="93" cy="77" r="2.5" fill="${INK}"/><circle cx="103" cy="87" r="2.5" fill="${INK}"/><circle cx="98" cy="82" r="2.5" fill="${INK}"/>`,
  keep: () => sky('#d9e4ee', '#f3f7fb') + `<rect x="70" y="40" width="60" height="70" fill="#a89d8c" ${stroke}/><path d="M70 40 v-10 h10 v10 h10 v-10 h10 v10 h10 v-10 h10 v10 h10 v-10 h0" fill="#a89d8c" ${stroke}/><rect x="92" y="80" width="16" height="30" rx="8" fill="#5b4a3a" ${stroke}/><circle cx="100" cy="58" r="10" fill="#fff" ${stroke}/><polygon points="100,50 103,58 100,66 97,58" fill="#d64545"/><rect y="108" width="200" height="12" fill="#7a9e7e"/>`,
  volcano: () => sky('#ffcfb8', '#ffefe6') + `<polygon points="20,115 85,30 115,30 180,115" fill="#7d5a4f" ${stroke}/><path d="M85 30 Q100 22 115 30 L108 50 Q100 45 92 52 Z" fill="#f26b3a" ${stroke}/><path d="M100 20 q-10 -10 0 -18 q10 8 0 18" fill="#ffb347" ${stroke}/>`,
  citadel: () => sky('#d7d9ef', '#f3f4fb') + `<rect x="30" y="60" width="140" height="50" fill="#9fa2c4" ${stroke}/>` + [30, 90, 150].map((x) => `<rect x="${x}" y="35" width="20" height="75" fill="#8487ad" ${stroke}/><polygon points="${x - 3},35 ${x + 10},18 ${x + 23},35" fill="#6c6f94" ${stroke}/><line x1="${x + 10}" y1="18" x2="${x + 10}" y2="6" ${stroke}/><polygon points="${x + 10},6 ${x + 22},10 ${x + 10},14" fill="#f2c14e"/>`).join('') + `<rect x="62" y="80" width="18" height="30" fill="#4a4d6e" ${stroke}/><rect x="120" y="80" width="18" height="30" fill="#4a4d6e" ${stroke}/>`,
};
export const scene = (terrain) => sv(200, 120, (SCENES[terrain] || SCENES.plains)(), 'scene');

/** The hero: Pip, a small explorer with a wide-brimmed hat and red scarf. */
export const hero = (cls = 'hero') => sv(80, 96, `
  <ellipse cx="40" cy="92" rx="22" ry="4" fill="rgba(0,0,0,.18)"/>
  <rect x="24" y="58" width="32" height="30" rx="10" fill="#3d8bb0" stroke="${INK}" stroke-width="3"/>
  <rect x="27" y="84" width="10" height="8" rx="3" fill="#5b4a3a" stroke="${INK}" stroke-width="2.5"/><rect x="43" y="84" width="10" height="8" rx="3" fill="#5b4a3a" stroke="${INK}" stroke-width="2.5"/>
  <path d="M24 60 Q40 70 56 60 L58 66 Q40 76 22 66 Z" fill="#d64545" stroke="${INK}" stroke-width="2.5"/>
  <circle cx="40" cy="40" r="19" fill="#f5c9a0" stroke="${INK}" stroke-width="3"/>
  <circle cx="33" cy="41" r="3.2" fill="${INK}"/><circle cx="47" cy="41" r="3.2" fill="${INK}"/>
  <circle cx="34" cy="40" r="1" fill="#fff"/><circle cx="48" cy="40" r="1" fill="#fff"/>
  <path d="M34 49 Q40 54 46 49" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="40" cy="27" rx="30" ry="7" fill="#a7743f" stroke="${INK}" stroke-width="3"/>
  <path d="M24 26 Q26 8 40 8 Q54 8 56 26 Z" fill="#b8844a" stroke="${INK}" stroke-width="3"/>
  <rect x="25" y="20" width="30" height="5" fill="#f2c14e" stroke="${INK}" stroke-width="2"/>`, cls);

export const gem = (cls = 'gem', fill = '#2ec4b6') => sv(24, 24, `<polygon points="12,2 21,9 12,22 3,9" fill="${fill}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><polygon points="12,2 15,9 12,22 9,9" fill="rgba(255,255,255,.35)"/><line x1="3" y1="9" x2="21" y2="9" stroke="${INK}" stroke-width="1.5"/>`, cls);

export const seal = (color, filled, perfect) => sv(40, 40, `<circle cx="20" cy="20" r="16" fill="${filled ? color : '#f4ecda'}" stroke="${INK}" stroke-width="3" ${filled ? '' : 'stroke-dasharray="4 3"'}/>${filled ? `<polygon points="20,9 23,17 31,17 25,22 27,30 20,25 13,30 15,22 9,17 17,17" fill="${perfect ? '#fff' : 'rgba(255,255,255,.55)'}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>` : ''}`, 'seal');

export const chest = (open) => sv(160, 130, open ? `
  <ellipse cx="80" cy="122" rx="60" ry="6" fill="rgba(0,0,0,.18)"/>
  <g class="glow">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<line x1="80" y1="58" x2="${80 + 60 * Math.cos(Math.PI + (i * Math.PI) / 6)}" y2="${58 + 60 * Math.sin(Math.PI + (i * Math.PI) / 6)}" stroke="#f2c14e" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>
  <rect x="30" y="64" width="100" height="54" rx="6" fill="#a7743f" stroke="${INK}" stroke-width="3.5"/>
  <path d="M30 64 L38 28 H122 L130 64 Z" fill="#8a5a33" stroke="${INK}" stroke-width="3.5"/>
  <rect x="30" y="80" width="100" height="10" fill="#f2c14e" stroke="${INK}" stroke-width="3"/>
  <polygon points="62,62 70,50 78,62 70,70" fill="#2ec4b6" stroke="${INK}" stroke-width="2.5"/><polygon points="84,60 92,46 100,60 92,70" fill="#d64545" stroke="${INK}" stroke-width="2.5"/>`
  : `<ellipse cx="80" cy="122" rx="60" ry="6" fill="rgba(0,0,0,.18)"/><rect x="30" y="64" width="100" height="54" rx="6" fill="#a7743f" stroke="${INK}" stroke-width="3.5"/><path d="M30 64 Q80 30 130 64 Z" fill="#8a5a33" stroke="${INK}" stroke-width="3.5"/><rect x="30" y="80" width="100" height="10" fill="#f2c14e" stroke="${INK}" stroke-width="3"/><rect x="72" y="76" width="16" height="20" rx="3" fill="#f2c14e" stroke="${INK}" stroke-width="3"/>`, 'chest');

export const lock = () => sv(24, 24, `<rect x="5" y="10" width="14" height="11" rx="2" fill="#f2c14e" stroke="${INK}" stroke-width="2"/><path d="M8 10 V7 a4 4 0 0 1 8 0 V10" fill="none" stroke="${INK}" stroke-width="2"/>`, 'icon');
