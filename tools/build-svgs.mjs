// Builds the animated SVGs for the GitHub profile README (comic sticker style, fonts embedded).
// Text is measured with the real fonts in Chrome so pills and marquees fit exactly.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const OUT = fileURLToPath(new URL('../assets', import.meta.url));
const FONTS = fs.readFileSync(new URL('./fonts.css', import.meta.url), 'utf8');
fs.mkdirSync(OUT, { recursive: true });

const INK = '#1d1426', CREAM = '#fff6e5', PURPLE = '#4c32ff', PINK = '#ff5ca8', YELLOW = '#ffd23f',
  AQUA = '#3ad1ff', ORANGE = '#ff8a3d', GREEN = '#35d07f', NIGHT = '#17121f';
const DELA = "'Dela Gothic One'", GRO = "'Space Grotesk'", MONO = "'JetBrains Mono'";
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// one @font-face per family (variable fonts come back once for every weight)
function fontCss(families) {
  const seen = new Set();
  return FONTS.split('\n').filter((l) => {
    const fam = l.match(/font-family:'([^']+)'/)[1];
    if (!families.includes(fam) || seen.has(fam)) return false;
    seen.add(fam);
    return true;
  }).map((l) => l.replace(/font-weight:\d+/, 'font-weight:100 900')).join('');
}

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage();
await page.setContent(`<style>${FONTS}</style><p style="font-family:'Dela Gothic One'">a</p><p style="font-family:'Space Grotesk';font-weight:700">a</p><p style="font-family:'JetBrains Mono'">a</p>`);
await page.evaluate(async () => {
  await Promise.all([document.fonts.load("400 40px 'Dela Gothic One'"), document.fonts.load("700 40px 'Space Grotesk'"), document.fonts.load("500 40px 'Space Grotesk'"), document.fonts.load("400 40px 'JetBrains Mono'")]);
});
const W = (text, family, size, weight = 400) => page.evaluate((t, f, s, w) => {
  const c = document.createElement('canvas').getContext('2d');
  c.font = `${w} ${s}px ${f}`;
  return c.measureText(t).width;
}, text, family, size, weight);

// ---------- shared pieces ----------
const sparkle = (x, y, r, { fill = CREAM, cls = 'tw', delay = 0 } = {}) => {
  const k = r * 0.2;
  return `<g transform="translate(${x} ${y})"><path class="${cls}" style="animation-delay:${delay}s" d="M0 ${-r} Q${k} ${-k} ${r} 0 Q${k} ${k} 0 ${r} Q${-k} ${k} ${-r} 0 Q${-k} ${-k} 0 ${-r}Z" fill="${fill}" stroke="${INK}" stroke-width="${Math.max(3, r * 0.16)}" stroke-linejoin="round"/></g>`;
};
// comic sticker lettering: hard ink shadow, then a fill over a thick ink outline
const sticker = (x, y, text, size, { fill = CREAM, family = DELA, anchor = 'start', shadow = size * 0.06, stroke = size * 0.1 } = {}) =>
  `<g font-family="${family}" font-size="${size}" text-anchor="${anchor}" stroke-linejoin="round">
    <text x="${x + shadow}" y="${y + shadow}" fill="${INK}" stroke="${INK}" stroke-width="${stroke * 2}">${esc(text)}</text>
    <text x="${x}" y="${y}" fill="${fill}" stroke="${INK}" stroke-width="${stroke * 2}" paint-order="stroke">${esc(text)}</text>
  </g>`;
const pill = (x, y, w, h, fill, { border = 4, shadow = 5, r = h / 2 } = {}) =>
  `<rect x="${x + shadow}" y="${y + shadow}" width="${w}" height="${h}" rx="${r}" fill="${INK}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${INK}" stroke-width="${border}"/>`;
const ANIM = `
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
  @keyframes twinkle{0%,100%{transform:scale(.55) rotate(0deg)}50%{transform:scale(1.12) rotate(25deg)}}
  @keyframes pop{0%{transform:scale(.3);opacity:0}65%{transform:scale(1.07);opacity:1}100%{transform:scale(1)}}
  .tw{transform-box:fill-box;transform-origin:center;animation:twinkle 2.6s ease-in-out infinite}
  .bob{animation:bob 3.4s ease-in-out infinite}
  .pop{transform-box:fill-box;transform-origin:center;animation:pop .9s cubic-bezier(.2,.9,.3,1.2) both}`;
const svg = (w, h, families, css, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title><style>${fontCss(families)}${ANIM}${css}</style>${body}</svg>`;
const save = (name, content) => { fs.writeFileSync(path.join(OUT, name), content); console.log(name, Math.round(content.length / 1024), 'KB'); };

// ---------- hero ----------
{
  const CW = 1264, CH = 548, cx = 960, cy = 250;
  let rays = '';
  for (let i = 0; i < 24; i += 2) {
    const a0 = (i * 15 * Math.PI) / 180, a1 = ((i + 1) * 15 * Math.PI) / 180, R = 1500;
    rays += `<path d="M${cx} ${cy} L${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} L${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)}Z"/>`;
  }
  // the name, sized to sit in the left 62%
  let nameSize = 176;
  const widest = Math.max(await W('IRFAN', DELA, nameSize), await W('AFIFI', DELA, nameSize));
  if (widest > 640) nameSize = Math.floor(nameSize * 640 / widest);
  // stack bottom-up from the ticker band: role pills, AFIFI, IRFAN
  const pillY = CH - 72 - 14 - 52, y2 = pillY - 14 - nameSize * 0.16, y1 = y2 - nameSize * 0.96;
  console.log('hero name', nameSize, 'top of IRFAN', Math.round(y1 - nameSize * 0.82));
  const hey = "HEY, I'M", hw = (await W(hey, DELA, 24)) + 40;
  const role = 'SOFTWARE ENGINEER II', at = '@ EVOLVE TECHNOLOGY';
  const rw = (await W(role, GRO, 26, 700)) + 44, aw = (await W(at, GRO, 26, 700)) + 44;
  const stickers = [
    ['NestJS', PINK, 790, 64, -7, 0], ['React Native', AQUA, 960, 128, 5, 0.6], ['three.js', CREAM, 800, 214, 4, 1.2],
    ['ESP32 + RFID', GREEN, 980, 292, -5, 0.3], ['AWS', ORANGE, 850, 360, -3, 0.9],
  ];
  let chips = '';
  for (const [label, color, x, y, rot, delay] of stickers) {
    const w = (await W(label, GRO, 30, 700)) + 48;
    chips += `<g class="bob" style="animation-delay:${delay}s"><g transform="rotate(${rot} ${x + w / 2} ${y + 31})">${pill(x, y, w, 62, color, { border: 5, shadow: 6 })}<text x="${x + w / 2}" y="${y + 42}" text-anchor="middle" font-family="${GRO}" font-weight="700" font-size="30" fill="${INK}">${esc(label)}</text></g></g>`;
  }
  const tick = 'FULL-STACK  ·  MOBILE  ·  IoT  ·  CLOUD  ·  3D WEB  ·  BASED IN JOHOR BAHRU, MALAYSIA  ·  ';
  const tw = await W(tick, DELA, 30);
  const ticks = Array.from({ length: Math.ceil(CW / tw) + 2 }, (_, i) => `<text x="${i * tw}" y="${CH - 24}">${esc(tick)}</text>`).join('');
  const body = `
    <defs>
      <clipPath id="card"><rect width="${CW}" height="${CH}" rx="34"/></clipPath>
      <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="9" cy="9" r="3" fill="#2f17d6"/></pattern>
      <linearGradient id="fade" x1="0" y1="1" x2="0.7" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="0.7" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <mask id="halftone"><rect width="${CW}" height="${CH}" fill="url(#fade)"/></mask>
    </defs>
    <rect x="14" y="14" width="${CW}" height="${CH}" rx="34" fill="${INK}"/>
    <g clip-path="url(#card)">
      <rect width="${CW}" height="${CH}" fill="${PURPLE}"/>
      <g class="rays" fill="#5f48ff">${rays}</g>
      <rect width="${CW}" height="${CH}" fill="url(#dots)" mask="url(#halftone)" opacity=".55"/>
      ${chips}
      ${sparkle(720, 66, 22, { delay: 0 })}${sparkle(1210, 70, 16, { delay: 0.8, fill: YELLOW })}${sparkle(1195, 410, 26, { delay: 1.4 })}${sparkle(735, 300, 15, { delay: 0.4, fill: PINK })}${sparkle(1225, 230, 12, { delay: 1.9, fill: YELLOW })}
      <g class="pop"><g transform="rotate(-6 ${64 + hw / 2} 52)">${pill(64, 30, hw, 44, PINK, { border: 4, shadow: 5 })}<text x="${64 + hw / 2}" y="61" text-anchor="middle" font-family="${DELA}" font-size="24" fill="${INK}">${esc(hey)}</text></g></g>
      <g class="pop" style="animation-delay:.1s">${sticker(58, y1, 'IRFAN', nameSize, { fill: CREAM })}</g>
      <g class="pop" style="animation-delay:.3s">${sticker(58, y2, 'AFIFI', nameSize, { fill: YELLOW })}</g>
      <g class="pop" style="animation-delay:.55s">
        ${pill(64, pillY, rw, 52, CREAM, { border: 4, shadow: 5 })}<text x="${64 + rw / 2}" y="${pillY + 35}" text-anchor="middle" font-family="${GRO}" font-weight="700" font-size="26" fill="${INK}">${role}</text>
        ${pill(64 + rw + 14, pillY, aw, 52, AQUA, { border: 4, shadow: 5 })}<text x="${64 + rw + 14 + aw / 2}" y="${pillY + 35}" text-anchor="middle" font-family="${GRO}" font-weight="700" font-size="26" fill="${INK}">${esc(at)}</text>
      </g>
      <rect y="${CH - 72}" width="${CW}" height="72" fill="${INK}"/>
      <g class="tick" font-family="${DELA}" font-size="30" fill="${CREAM}">${ticks}</g>
    </g>
    <rect width="${CW}" height="${CH}" rx="34" fill="none" stroke="${INK}" stroke-width="7"/>`;
  save('hero.svg', svg(1280, 564, ['Dela Gothic One', 'Space Grotesk'],
    `.rays{transform-origin:${cx}px ${cy}px;animation:spin 70s linear infinite}
     @keyframes tick{to{transform:translateX(-${tw}px)}} .tick{animation:tick ${Math.round(tw / 70)}s linear infinite}`,
    body, 'Irfan Afifi, Software Engineer II at Evolve Technology Platform'));
}

// ---------- link buttons ----------
for (const [name, label, color, textColor] of [['btn-portfolio', 'PORTFOLIO', YELLOW, INK], ['btn-linkedin', 'LINKEDIN', AQUA, INK], ['btn-email', 'EMAIL ME', PINK, INK]]) {
  const tw = await W(label, DELA, 28);
  const w = 34 + tw + 18 + 44 + 14, h = 72;
  const ax = 34 + tw + 18 + 22, ay = h / 2;
  const body = `${pill(4, 4, w, h, color, { border: 5, shadow: 7 })}
    <text x="${4 + 34}" y="${4 + 47}" font-family="${DELA}" font-size="28" fill="${textColor}">${label}</text>
    <circle cx="${4 + ax}" cy="${4 + ay}" r="22" fill="${INK}"/>
    <path d="M${4 + ax - 7} ${4 + ay + 7} L${4 + ax + 7} ${4 + ay - 7} M${4 + ax - 4} ${4 + ay - 7} L${4 + ax + 7} ${4 + ay - 7} L${4 + ax + 7} ${4 + ay + 4}" stroke="${CREAM}" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  save(`${name}.svg`, svg(w + 16, h + 16, ['Dela Gothic One'], '', body, label));
}

// ---------- section titles ----------
for (const [name, num, title, color] of [['title-work', '01', 'SELECTED WORK', YELLOW], ['title-toolbox', '02', 'TOOLBOX', AQUA], ['title-now', '03', 'RIGHT NOW', PINK], ['title-activity', '04', 'ACTIVITY', GREEN]]) {
  const tw = await W(title, DELA, 66);
  const x0 = 104, end = x0 + tw + 34;
  const body = `
    <circle cx="52" cy="72" r="38" fill="${INK}" transform="translate(5 5)"/><circle cx="52" cy="72" r="38" fill="${color}" stroke="${INK}" stroke-width="5"/>
    <text x="52" y="84" text-anchor="middle" font-family="${DELA}" font-size="30" fill="${INK}">${num}</text>
    ${sticker(x0, 96, title, 66, { fill: CREAM })}
    <rect x="${end + 4}" y="66" width="${Math.max(40, 1200 - end)}" height="16" rx="8" fill="${INK}"/><rect x="${end}" y="62" width="${Math.max(40, 1200 - end)}" height="16" rx="8" fill="${color}" stroke="${INK}" stroke-width="4"/>
    ${sparkle(1246, 70, 22, { fill: color })}`;
  save(`${name}.svg`, svg(1280, 140, ['Dela Gothic One'], '', body, title));
}

// ---------- toolbox: two rows of skill pills scrolling opposite ways ----------
{
  const rows = [
    ['TypeScript', 'JavaScript', 'Java', 'PHP', 'Rust', 'Dart', 'SQL', 'NestJS', 'Spring Boot', 'Laravel', 'Node.js', 'Prisma', 'MySQL', 'Redis', 'REST APIs', 'JWT + RBAC'],
    ['React', 'Next.js', 'Vue 3', 'React Native', 'Flutter', 'three.js', 'Tailwind CSS', 'Electron', 'Tauri', 'AWS', 'Huawei Cloud', 'Nginx', 'PM2', 'Git', 'ESP32', 'RFID/EPC', 'Playwright'],
  ];
  const colors = [PINK, YELLOW, AQUA, CREAM, ORANGE, GREEN, '#b9a8ff'];
  const H = 70, gap = 18;
  let body = '', css = '';
  for (const [ri, items] of rows.entries()) {
    let x = 0, group = '';
    for (const [i, label] of items.entries()) {
      const w = (await W(label, GRO, 30, 700)) + 50;
      group += `${pill(x, 0, w, H, colors[(i + ri * 3) % colors.length], { border: 5, shadow: 6 })}<text x="${x + w / 2}" y="${H / 2 + 11}" text-anchor="middle" font-family="${GRO}" font-weight="700" font-size="30" fill="${INK}">${esc(label)}</text>`;
      x += w + gap;
    }
    const RW = x, y = 22 + ri * 112;
    const copies = Math.ceil(1280 / RW) + 2;
    const all = Array.from({ length: copies }, (_, k) => `<g transform="translate(${k * RW} 0)">${group}</g>`).join('');
    const dur = Math.round(RW / 45);
    css += `@keyframes row${ri}{from{transform:translateX(${ri ? -RW : 0}px)}to{transform:translateX(${ri ? 0 : -RW}px)}} .row${ri}{animation:row${ri} ${dur}s linear infinite}`;
    body += `<g transform="translate(0 ${y})"><g class="row${ri}">${all}</g></g>`;
  }
  const defs = `<defs><linearGradient id="edge" x1="0" x2="1"><stop offset="0" stop-color="#000"/><stop offset=".07" stop-color="#fff"/><stop offset=".93" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="fadeEdges"><rect width="1280" height="230" fill="url(#edge)"/></mask></defs>`;
  save('toolbox.svg', svg(1280, 230, ['Space Grotesk'], css, `${defs}<g mask="url(#fadeEdges)">${body}</g>`, 'Toolbox: languages, frameworks, cloud and IoT'));
}

// ---------- right now: a terminal that types itself ----------
{
  const lines = [
    ['$', 'whoami'],
    ['>', 'irfan afifi, software engineer II @ evolve technology platform'],
    ['$', 'cat now.txt'],
    ['>', 'NestJS APIs, RFID/EPC + ESP32 IoT systems, AWS deployments'],
    ['$', 'ls ~/side-projects'],
    ['>', 'gvreport  geminivillain  pixel-pet  feelings-vending-co'],
    ['$', 'echo $NEXT'],
    ['>', 'system design, microservices, more three.js'],
  ];
  const size = 27, lh = 46, x0 = 52, y0 = 132;
  const cw = await W('m', MONO, size);
  let t = 0.8, body = '', defs = '';
  for (const [i, [kind, text]] of lines.entries()) {
    const y = y0 + i * lh, isCmd = kind === '$';
    const tx = isCmd ? x0 + cw * 2 : x0;
    const steps = text.length;
    const dur = isCmd ? steps * 0.055 : 0.01;
    const values = isCmd ? Array.from({ length: steps + 1 }, (_, k) => (k * cw).toFixed(1)).join(';') : `0;${(steps * cw + 10).toFixed(1)}`;
    defs += `<clipPath id="l${i}"><rect x="${tx}" y="${y - size}" height="${lh}" width="0"><animate attributeName="width" begin="${t.toFixed(2)}s" dur="${dur.toFixed(2)}s" values="${values}" calcMode="discrete" fill="freeze"/></rect></clipPath>`;
    if (isCmd) body += `<text x="${x0}" y="${y}" fill="${PINK}" opacity="0">$<set attributeName="opacity" to="1" begin="${(t - 0.25).toFixed(2)}s" fill="freeze"/></text>`;
    body += `<text x="${tx}" y="${y}" fill="${isCmd ? CREAM : (i % 4 === 1 ? AQUA : YELLOW)}" clip-path="url(#l${i})">${esc(text).replace(/ /g, ' ')}</text>`;
    t += dur + (isCmd ? 0.3 : 0.55);
  }
  const yc = y0 + lines.length * lh;
  body += `<text x="${x0}" y="${yc}" fill="${PINK}" opacity="0">$<set attributeName="opacity" to="1" begin="${t.toFixed(2)}s" fill="freeze"/></text>
    <rect x="${x0 + cw * 2}" y="${yc - size + 4}" width="${cw}" height="${size + 4}" fill="${CREAM}" opacity="0"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.5;1" dur="1s" begin="${t.toFixed(2)}s" repeatCount="indefinite"/></rect>`;
  const WW = 1258, WH = yc + 44;
  const chrome = `
    <rect x="16" y="16" width="${WW}" height="${WH}" rx="28" fill="${PURPLE}"/>
    <rect width="${WW}" height="${WH}" rx="28" fill="${NIGHT}" stroke="${INK}" stroke-width="6"/>
    <path d="M3 64 V28 A25 25 0 0 1 28 3 H${WW - 28} A25 25 0 0 1 ${WW - 3} 28 V64 Z" fill="${CREAM}"/>
    <line x1="3" y1="64" x2="${WW - 3}" y2="64" stroke="${INK}" stroke-width="5"/>
    <circle cx="40" cy="34" r="11" fill="${PINK}" stroke="${INK}" stroke-width="3.5"/><circle cx="74" cy="34" r="11" fill="${YELLOW}" stroke="${INK}" stroke-width="3.5"/><circle cx="108" cy="34" r="11" fill="${GREEN}" stroke="${INK}" stroke-width="3.5"/>
    <text x="${WW / 2}" y="43" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="22" fill="${INK}">irfan@evolve: ~/now</text>
    <rect width="${WW}" height="${WH}" rx="28" fill="none" stroke="${INK}" stroke-width="6"/>`;
  save('now.svg', svg(1280, WH + 22, ['JetBrains Mono'], '', `<defs>${defs}</defs>${chrome}<g font-family="${MONO}" font-size="${size}">${body}</g>`, 'Right now: software engineer II at Evolve Technology Platform, building NestJS APIs and IoT systems'));
}

// ---------- footer ----------
{
  const line = "LET'S BUILD SOMETHING WEIRD  ·  ";
  const tw = await W(line, DELA, 78);
  const copies = Math.ceil(1280 / tw) + 2;
  const marquee = Array.from({ length: copies }, (_, i) => `<g transform="translate(${i * tw} 0)">${sticker(0, 142, line, 78, { fill: i % 2 ? YELLOW : CREAM })}</g>`).join('');
  const body = `
    <defs><clipPath id="band"><rect width="1264" height="244" rx="34"/></clipPath></defs>
    <rect x="14" y="14" width="1264" height="244" rx="34" fill="${PINK}"/>
    <g clip-path="url(#band)">
      <rect width="1264" height="244" fill="${PURPLE}"/>
      <g class="foot">${marquee}</g>
      <text x="632" y="216" text-anchor="middle" font-family="${GRO}" font-weight="700" font-size="25" fill="${CREAM}">Johor Bahru, Malaysia  ·  say hi: irfanafifiromzi@gmail.com</text>
      ${sparkle(60, 46, 16, { fill: YELLOW })}${sparkle(1206, 52, 20, { delay: 0.7 })}${sparkle(1180, 200, 13, { delay: 1.3, fill: PINK })}${sparkle(84, 198, 12, { delay: 1.8 })}
    </g>
    <rect width="1264" height="244" rx="34" fill="none" stroke="${INK}" stroke-width="7"/>`;
  save('footer.svg', svg(1280, 262, ['Dela Gothic One', 'Space Grotesk'], `@keyframes foot{to{transform:translateX(-${tw}px)}} .foot{animation:foot ${Math.round(tw / 60)}s linear infinite}`, body, "Let's build something weird"));
}

await browser.close();
