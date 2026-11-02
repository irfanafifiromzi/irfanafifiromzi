// Project cards for the GitHub profile README: the portfolio card render in a chunky ink frame with a
// coloured hard shadow, a tech tag and a sticker name label. Transparent corners -> webp.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const SRC = 'C:/Users/irfan/OneDrive/Desktop/Code/react-portfolio-IrfanAfifi/src/assets/projects';
const OUT = fileURLToPath(new URL('../assets/work', import.meta.url));
const FONTS = fs.readFileSync(new URL('./fonts.css', import.meta.url), 'utf8');
fs.mkdirSync(OUT, { recursive: true });

const INK = '#1d1426', CREAM = '#fff6e5', PURPLE = '#4c32ff', PINK = '#ff5ca8', YELLOW = '#ffd23f',
  AQUA = '#3ad1ff', ORANGE = '#ff8a3d', GREEN = '#35d07f';

// tier = how wide the card shows in the README (1 = half row, 2 = third, 3 = quarter): labels grow as cards shrink
const CARDS = [
  ['feelings', 'FEELINGS VENDING CO.', 'three.js · GLSL', 'feelings.jpg', '50% 50%', YELLOW, PINK, 1],
  ['evolve', 'EVOLVE WEBSITE', 'Next.js · NestJS CMS', 'card-evolve.jpg', '50% 32%', YELLOW, AQUA, 1],
  ['happi', 'HAPPI', 'React Native app', 'happi3.png', '50% 20%', CREAM, PURPLE, 2],
  ['zora', 'ZORA PRO ERP', 'NestJS · RFID', 'card-zora.jpg', '50% 50%', PINK, YELLOW, 2],
  ['gvreport', 'GVREPORT', 'Electron · Tauri', 'card-gvreport.jpg', '50% 52%', YELLOW, PURPLE, 2],
  ['geminivillain', 'GEMINIVILLAIN', 'Electron · xterm.js', 'card-geminivillain.jpg', '50% 45%', ORANGE, YELLOW, 3],
  ['pixelpet', 'PIXEL PET', 'VS Code extension', 'card-pixelpet.jpg', '50% 30%', YELLOW, ORANGE, 3],
  ['polesync', 'POLESYNC', 'ESP32 · AWS', 'card-polesync.jpg', '50% 55%', CREAM, GREEN, 3],
  ['frostedge', 'FROSTEDGE', 'ESP32 · Telegram', 'card-frostedge.jpg', '50% 55%', AQUA, PINK, 3],
];
const SIZE = { 1: [70, 40], 2: [84, 46], 3: [100, 54] };
const CW = 1200, CH = 900, OFF = 22;

const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--allow-file-access-from-files'] });
const p = await b.newPage();
await p.setViewport({ width: CW + OFF + 6, height: CH + OFF + 6, deviceScaleFactor: 1 });
for (const [id, name, tag, file, pos, fill, shadow, tier] of CARDS) {
  const [ns, ts] = SIZE[tier];
  const pad = Math.round(ns * 0.5);
  const html = `<!doctype html><html><head><style>${FONTS}
    *{box-sizing:border-box;margin:0}
    html,body{background:transparent;width:${CW + OFF + 6}px;height:${CH + OFF + 6}px;overflow:hidden}
    .shadow{position:absolute;left:${OFF}px;top:${OFF}px;width:${CW}px;height:${CH}px;border-radius:52px;background:${shadow};border:9px solid ${INK}}
    .card{position:absolute;left:0;top:0;width:${CW}px;height:${CH}px;border-radius:52px;border:10px solid ${INK};overflow:hidden;background:${INK}}
    .card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos}}
    .tag{position:absolute;left:${pad}px;top:${pad}px;font:700 ${ts}px 'Space Grotesk';color:${INK};background:${CREAM};border:${Math.round(ts / 7)}px solid ${INK};border-radius:999px;padding:${ts * 0.32}px ${ts * 0.7}px;box-shadow:${ts / 6}px ${ts / 6}px 0 ${INK};transform:rotate(-2deg);transform-origin:left top}
    .name{position:absolute;left:${pad}px;bottom:${pad}px;font:400 ${ns}px/1 'Dela Gothic One';letter-spacing:.01em;color:${INK};background:${fill};border:${Math.round(ns / 9)}px solid ${INK};border-radius:${ns * 0.42}px;padding:${ns * 0.24}px ${ns * 0.4}px ${ns * 0.28}px;box-shadow:${ns / 8}px ${ns / 8}px 0 ${INK};white-space:nowrap}
    .go{position:absolute;right:${pad}px;bottom:${pad}px;width:${ns * 1.25}px;height:${ns * 1.25}px;border-radius:50%;background:${INK};display:grid;place-items:center}
  </style></head><body>
    <div class="shadow"></div>
    <div class="card">
      <img src="${pathToFileURL(path.join(SRC, file)).href}">
      <div class="tag">${tag}</div>
      <div class="name">${name}</div>
      <div class="go"><svg width="${ns * 0.6}" height="${ns * 0.6}" viewBox="0 0 24 24" fill="none" stroke="${CREAM}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6M9 6h9v9"/></svg></div>
    </div></body></html>`;
  const tmp = path.join(os.tmpdir(), `gh-card-${id}.html`);
  fs.writeFileSync(tmp, html);
  await p.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  // long names (GEMINIVILLAIN) shrink until they clear the arrow button
  await p.evaluate((maxW) => {
    const n = document.querySelector('.name');
    let s = parseFloat(getComputedStyle(n).fontSize);
    while (n.offsetWidth > maxW && s > 24) { s -= 2; n.style.fontSize = s + 'px'; }
  }, CW - pad * 2 - ns * 1.25 - 28);
  const out = path.join(OUT, `${id}.webp`);
  await p.screenshot({ path: out, type: 'webp', quality: 86, omitBackground: true });
  console.log(id, Math.round(fs.statSync(out).size / 1024), 'KB');
}
await b.close();
