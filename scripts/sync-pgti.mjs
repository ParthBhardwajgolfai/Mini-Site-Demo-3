/**
 * One-off sync from the official PGTI API (tournament 459):
 *  1. downloads authentic player profile images -> public/assets/players/{player_id}.jpg
 *  2. embeds real hole-by-hole scorecard data into src/data/tournament-data.json
 */
import fs from 'node:fs';
import path from 'node:path';

const API = 'https://www.pgtofindia.com/vapi';
const KEY = 'd42a0d190464a2be90977c3996382811';
const ROOT = path.resolve(import.meta.dirname, '..');
const dataPath = path.join(ROOT, 'src/data/tournament-data.json');
const imgDir = path.join(ROOT, 'public/assets/players');

const raw = JSON.parse(fs.readFileSync(path.join(ROOT, '.tmp/pgti_459.json'), 'utf8'));
const r = raw.response.result;
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const entryById = new Map(r.entry_list.map((e) => [e.player_id, e]));
const memToId = new Map(r.entry_list.map((e) => [e.mem_code, e.player_id]));

/* ── 1. player images ────────────────────────────────────────── */
const missing = data.players.filter((p) => {
  const f = path.join(imgDir, `${p.id}.jpg`);
  return !(fs.existsSync(f) && fs.statSync(f).size > 4000);
});
console.log(`players: ${data.players.length}, image files already present: ${data.players.length - missing.length}, to download: ${missing.length}`);

async function download(pid, imgPath) {
  const url = `${API}${imgPath}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'api-key': KEY } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1000) throw new Error(`too small (${buf.length}b)`);
      fs.writeFileSync(path.join(imgDir, `${pid}.jpg`), buf);
      return true;
    } catch (e) {
      if (attempt === 3) { console.warn(`  FAIL ${pid}: ${e.message}`); return false; }
      await new Promise((s) => setTimeout(s, 800 * attempt));
    }
  }
  return false;
}

const queue = missing
  .map((p) => {
    const e = entryById.get(p.id);
    return e?.profile_image ? { pid: p.id, img: e.profile_image } : null;
  })
  .filter(Boolean);
const noEntry = missing.filter((p) => !entryById.get(p.id)?.profile_image);
if (noEntry.length) console.log('no PGTI profile image for:', noEntry.map((p) => p.name).join(', '));

let done = 0, ok = 0;
async function worker() {
  while (queue.length) {
    const job = queue.shift();
    if (await download(job.pid, job.img)) ok++;
    done++;
    if (done % 20 === 0) console.log(`  ${done}/${ok} ok...`);
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
console.log(`downloaded ${ok}/${done} images`);

/* wire downloaded images into the player records */
for (const p of data.players) {
  const f = path.join(imgDir, `${p.id}.jpg`);
  if (fs.existsSync(f)) p.image = `/assets/players/${p.id}.jpg`;
}

/* ── 2. hole-by-hole ─────────────────────────────────────────── */
const holeByHole = {};
for (const hb of r.hole_by_hole) {
  const round = {};
  for (const it of hb.items) {
    const pid = memToId.get(it.mem_code);
    if (!pid) continue;
    round[String(pid)] = {
      roundScore: it.round_total_score,
      roundToPar: it.round_to_par,
      out: it.out_total,
      in: it.in_total,
      holes: it.hole_breakdown.map((h) => ({
        hole: h.hole, par: h.par, score: h.score, delta: h.delta, result: h.result_code,
      })),
    };
  }
  holeByHole[String(hb.round)] = round;
}
data.holeByHole = holeByHole;

/* integrity: hole scores must sum to recorded round totals */
let checked = 0, bad = [];
for (const lb of data.leaderboard) {
  for (const item of lb.items) {
    const hh = holeByHole[String(lb.round)]?.[String(item.id)];
    if (!hh) { bad.push(`missing ${item.id} r${lb.round}`); continue; }
    const sum = hh.holes.reduce((a, h) => a + h.score, 0);
    if (sum !== item.rounds[lb.round - 1]) bad.push(`mismatch ${item.id} r${lb.round}: holes ${sum} vs ${item.rounds[lb.round - 1]}`);
    checked++;
  }
}
console.log(`hole integrity: ${checked} checked, ${bad.length} issues`, bad.slice(0, 5));

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');
console.log('tournament-data.json updated with holeByHole');
