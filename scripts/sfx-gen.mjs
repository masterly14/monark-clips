// Biblioteca de SFX de Monark Motion: genera con ElevenLabs, procesa con ffmpeg y lleva el inventario.
//
// Uso (desde la raíz de monark-clips):
//   node scripts/sfx-gen.mjs                       genera las variantes que falten de toda la biblioteca
//   node scripts/sfx-gen.mjs pop swipe             solo esos sonidos
//   node scripts/sfx-gen.mjs --pedido sfx/pedidos/<pieza>.json
//                                                  agrega al manifiesto los sonidos nuevos del pedido y los genera
//   node scripts/sfx-gen.mjs --dry [nombres]       muestra qué generaría, sin gastar créditos
//   node scripts/sfx-gen.mjs --descartar pop-v2    marca una variante como descartada (la próxima corrida la reemplaza)
//   node scripts/sfx-gen.mjs --aprobar pop-v1|pop|todo
//   node scripts/sfx-gen.mjs --nota pop-v1 "texto"  guarda una nota de escucha en la variante
//   node scripts/sfx-gen.mjs --preview [nombres]   arma public/sfx/_preview.wav + _preview.txt para escuchar
//   node scripts/sfx-gen.mjs --reprocesar          vuelve a procesar todo desde _raw (sin gastar créditos)
//   node scripts/sfx-gen.mjs --lib                 solo regenera src/motion/kit/sfx-library.gen.ts
//
// La key vive en monark-clips/.env (ELEVENLABS_API_KEY). Nunca en la skill ni en el manifiesto.
import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const SFX_DIR = path.join(PUBLIC, "sfx");
const MANIFEST = path.join(SFX_DIR, "sfx.manifest.json");
const LIB_TS = path.join(ROOT, "src", "motion", "kit", "sfx-library.gen.ts");
const API = "https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_192";
const SR = 48000;

try { process.loadEnvFile(path.join(ROOT, ".env")); } catch {}

const rel = (p) => path.relative(PUBLIC, p).replaceAll("\\", "/");
const today = () => new Date().toISOString().slice(0, 10);
const db = (x) => (x > 0 ? 20 * Math.log10(x) : -120);
const round = (x, d = 1) => Math.round(x * 10 ** d) / 10 ** d;

const loadManifest = () => JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const saveManifest = (m) => fs.writeFileSync(MANIFEST, JSON.stringify(m, null, 2) + "\n");

// ---------- argumentos ----------
const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(name);
  if (i === -1) return null;
  argv.splice(i, 1);
  return true;
};
const option = (name) => {
  const i = argv.indexOf(name);
  if (i === -1) return null;
  const v = argv[i + 1];
  argv.splice(i, 2);
  return v;
};

// ---------- análisis de audio ----------
function decode(file) {
  const buf = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"], {maxBuffer: 1 << 28});
  return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
}

/** Envolvente RMS en ventanas de 5 ms → inicio, fin y pico (en muestras). */
function analyze(x) {
  const win = Math.round(SR * 0.005);
  const env = [];
  let peak = 0, peakIdx = 0;
  for (let i = 0; i < x.length; i += win) {
    let s = 0;
    for (let j = i; j < Math.min(i + win, x.length); j++) {
      s += x[j] * x[j];
      const a = Math.abs(x[j]);
      if (a > peak) { peak = a; peakIdx = j; }
    }
    env.push(Math.sqrt(s / win));
  }
  const envPeak = Math.max(...env, 1e-9);
  const onTh = Math.max(envPeak * 10 ** (-36 / 20), 10 ** (-60 / 20));
  const offTh = Math.max(envPeak * 10 ** (-48 / 20), 10 ** (-66 / 20));
  let a = env.findIndex((v) => v > onTh);
  if (a < 0) a = 0;
  let b = env.length - 1;
  while (b > a && env[b] < offTh) b--;
  const start = Math.max(0, a * win - Math.round(SR * 0.004));
  const end = Math.min(x.length, (b + 1) * win + Math.round(SR * 0.02));
  let sum = 0;
  for (let i = start; i < end; i++) sum += x[i] * x[i];
  // ataque percibido: primera ventana que llega a −12 dB del pico de la envolvente
  const atk = env.findIndex((v) => v >= envPeak * 10 ** (-12 / 20));
  return {start, end, peak, peakIdx, attackIdx: Math.max(start, atk * win), rms: Math.sqrt(sum / Math.max(1, end - start))};
}

function perfil(durMs, hitMs, atkMs) {
  const ataque = atkMs < 25 ? "ataque seco" : atkMs < 120 ? `ataque suave (${atkMs} ms)` : `entra creciendo (${atkMs} ms)`;
  const pico = Math.abs(hitMs - atkMs) > 60 ? `, pico a ${hitMs} ms` : "";
  const largo = durMs < 250 ? "muy corto" : durMs < 600 ? "corto" : durMs < 1200 ? "medio" : "largo";
  const cola = durMs - hitMs < 120 ? "corta" : durMs - hitMs < 500 ? "media" : "larga";
  return `${largo} (${durMs} ms), ${ataque}${pico}, cola ${cola}`;
}

/** raw (mp3) → wav 48 kHz recortado, normalizado a pico −1 dBFS, con fades. Devuelve las medidas. */
function processFile(rawPath, outPath) {
  const x = decode(rawPath);
  const {start, end, peak, peakIdx, attackIdx, rms} = analyze(x);
  const s = start / SR, e = end / SR, dur = e - s;
  const gain = 10 ** (-1 / 20) / Math.max(peak, 1e-6);
  const fo = Math.min(0.04, dur * 0.15);
  fs.mkdirSync(path.dirname(outPath), {recursive: true});
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", rawPath, "-af",
    `atrim=start=${s.toFixed(4)}:end=${e.toFixed(4)},asetpts=PTS-STARTPTS,volume=${gain.toFixed(4)},afade=t=in:d=0.003,afade=t=out:st=${(dur - fo).toFixed(4)}:d=${fo.toFixed(4)}`,
    "-ar", String(SR), "-c:a", "pcm_s16le", outPath]);
  const durMs = Math.round(dur * 1000);
  const hitMs = Math.max(0, Math.round(((peakIdx - start) / SR) * 1000));
  const atkMs = Math.max(0, Math.round(((attackIdx - start) / SR) * 1000));
  return {
    duracionMs: durMs,
    ataqueMs: atkMs,
    picoMs: hitMs,
    picoOriginalDb: round(db(peak)),
    rmsDb: round(db(rms * gain)),
    perfil: perfil(durMs, hitMs, atkMs),
  };
}

// ---------- ElevenLabs ----------
async function generate(def, estilo, modelo) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("Falta ELEVENLABS_API_KEY en monark-clips/.env");
  const body = {
    text: `${def.prompt}. ${estilo}`,
    model_id: modelo,
    prompt_influence: def.influencia ?? 0.5,
    ...(def.duracion ? {duration_seconds: def.duracion} : {}),
    ...(def.loop ? {loop: true} : {}),
  };
  const res = await fetch(API, {method: "POST", headers: {"xi-api-key": key, "Content-Type": "application/json"}, body: JSON.stringify(body)});
  if (!res.ok) {
    const txt = await res.text();
    const err = new Error(`ElevenLabs ${res.status}: ${txt.slice(0, 300)}`);
    err.fatal = [401, 402, 403].includes(res.status);
    throw err;
  }
  const cost = res.headers.get("character-cost") ?? res.headers.get("x-character-count");
  return {audio: Buffer.from(await res.arrayBuffer()), creditos: cost ? Number(cost) : null};
}

// ---------- librería TS para Remotion ----------
function writeLib(m) {
  const lib = {};
  for (const [name, def] of Object.entries(m.sonidos)) {
    const files = (def.archivos ?? []).filter((f) => f.estado !== "descartado");
    if (!files.length) continue;
    lib[name] = {
      volumen: def.volumen,
      ancla: def.ancla ?? "inicio",
      archivos: files.map((f) => ({src: f.archivo, duracionMs: f.duracionMs, ataqueMs: f.ataqueMs ?? 0, picoMs: f.picoMs})),
    };
  }
  const names = Object.keys(m.sonidos);
  const ts = `// Generado por scripts/sfx-gen.mjs a partir de public/sfx/sfx.manifest.json. No editar a mano.
export type SfxAncla = "inicio" | "pico" | "fin";
export type SfxDef = {volumen: number; ancla: SfxAncla; archivos: {src: string; duracionMs: number; ataqueMs: number; picoMs: number}[]};
export type SfxName = ${names.map((n) => JSON.stringify(n)).join(" | ") || "never"};
export const SFX_LIBRARY: Partial<Record<SfxName, SfxDef>> = ${JSON.stringify(lib, null, 2)};
`;
  fs.writeFileSync(LIB_TS, ts);
  console.log(`lib → ${path.relative(ROOT, LIB_TS)} (${Object.keys(lib).length} sonidos con archivo)`);
}

// ---------- utilidades de variantes ----------
const parseRef = (ref) => {
  const mm = /^(.*)-v(\d+)$/.exec(ref);
  return mm ? {name: mm[1], v: Number(mm[2])} : {name: ref, v: null};
};
const findVariant = (m, ref) => {
  const {name, v} = parseRef(ref);
  const def = m.sonidos[name];
  if (!def) throw new Error(`No existe el sonido "${name}"`);
  const f = (def.archivos ?? []).find((a) => a.v === v);
  if (!f) throw new Error(`No existe la variante ${ref}`);
  return f;
};

// ---------- acciones ----------
async function main() {
  const dry = flag("--dry");
  const onlyLib = flag("--lib");
  const reproc = flag("--reprocesar");
  const preview = flag("--preview");
  const pedido = option("--pedido");
  const descartar = option("--descartar");
  const aprobar = option("--aprobar");
  const notaRef = option("--nota");
  const m = loadManifest();

  if (descartar || aprobar || notaRef) {
    if (descartar) { findVariant(m, descartar).estado = "descartado"; console.log(`${descartar} → descartado`); }
    if (aprobar) {
      const refs = aprobar === "todo" ? Object.keys(m.sonidos) : [aprobar];
      for (const r of refs) {
        const {name, v} = parseRef(r);
        for (const f of m.sonidos[name]?.archivos ?? []) if (v === null || f.v === v) if (f.estado !== "descartado") f.estado = "aprobado";
      }
      console.log(`${aprobar} → aprobado`);
    }
    if (notaRef) { findVariant(m, notaRef).nota = argv.shift() ?? ""; console.log(`nota guardada en ${notaRef}`); }
    saveManifest(m); writeLib(m); return;
  }
  if (onlyLib) { writeLib(m); return; }

  if (pedido) {
    const p = JSON.parse(fs.readFileSync(path.join(PUBLIC, pedido), "utf8"));
    for (const [name, def] of Object.entries(p.sonidos ?? {})) {
      if (m.sonidos[name]) { console.log(`= ${name} ya existe en la biblioteca (se reutiliza)`); continue; }
      m.sonidos[name] = {...def, origen: p.pieza ?? pedido, creado: today(), archivos: []};
      console.log(`+ ${name} agregado desde el pedido de ${p.pieza ?? pedido}`);
      argv.push(name);
    }
    for (const name of p.usa ?? []) if (!m.sonidos[name]) console.warn(`! el pedido usa "${name}", que no está en la biblioteca`);
    saveManifest(m);
    if (!argv.length) { writeLib(m); return; }
  }

  const names = argv.length ? argv : Object.keys(m.sonidos);
  for (const n of names) if (!m.sonidos[n]) throw new Error(`No existe el sonido "${n}" en el manifiesto`);

  if (reproc) {
    for (const n of names) for (const f of m.sonidos[n].archivos ?? []) {
      Object.assign(f, processFile(path.join(PUBLIC, f.raw), path.join(PUBLIC, f.archivo)));
      console.log(`reprocesado ${n}-v${f.v}: ${f.perfil}`);
    }
    saveManifest(m); writeLib(m); return;
  }

  if (preview) {
    const list = [];
    for (const n of names) for (const f of m.sonidos[n].archivos ?? []) if (f.estado !== "descartado") list.push({ref: `${n}-v${f.v}`, f, def: m.sonidos[n]});
    if (!list.length) { console.log("No hay variantes para escuchar."); return; }
    const gap = 0.7;
    const inputs = [], filters = [];
    let t = 0;
    const lines = ["Vista previa de SFX (tiempo → variante · estado · perfil · uso)", ""];
    list.forEach(({ref, f, def}, i) => {
      inputs.push("-i", path.join(PUBLIC, f.archivo));
      filters.push(`[${i}:a]aresample=${SR},aformat=channel_layouts=stereo,apad=pad_dur=${gap}[a${i}]`);
      const mm = Math.floor(t / 60), ss = (t % 60).toFixed(1).padStart(4, "0");
      lines.push(`${mm}:${ss}  ${ref.padEnd(18)} ${String(f.estado).padEnd(13)} ${f.perfil} · ${def.uso}`);
      t += f.duracionMs / 1000 + gap;
    });
    const graph = `${filters.join(";")};${list.map((_, i) => `[a${i}]`).join("")}concat=n=${list.length}:v=0:a=1[out]`;
    const out = path.join(SFX_DIR, "_preview.wav");
    execFileSync("ffmpeg", ["-v", "error", "-y", ...inputs, "-filter_complex", graph, "-map", "[out]", "-c:a", "pcm_s16le", out]);
    fs.writeFileSync(path.join(SFX_DIR, "_preview.txt"), lines.join("\n") + "\n");
    console.log(lines.join("\n"));
    console.log(`\n→ ${rel(out)} (${t.toFixed(1)} s)`);
    return;
  }

  // generar lo que falte
  const jobs = [];
  for (const n of names) {
    const def = m.sonidos[n];
    def.archivos ??= [];
    const vivos = def.archivos.filter((f) => f.estado !== "descartado").length;
    const faltan = Math.max(0, (def.variantes ?? 1) - vivos);
    let nextV = Math.max(0, ...def.archivos.map((f) => f.v)) + 1;
    for (let k = 0; k < faltan; k++) jobs.push({name: n, v: nextV++});
  }
  if (!jobs.length) { console.log("Nada que generar: todas las variantes existen."); writeLib(m); return; }
  const segs = jobs.reduce((s, j) => s + (m.sonidos[j.name].duracion ?? 2), 0);
  console.log(`${jobs.length} generaciones (~${segs.toFixed(1)} s de audio): ${jobs.map((j) => `${j.name}-v${j.v}`).join(", ")}`);
  if (dry) return;

  let creditos = 0, fallos = 0;
  const run = async ({name, v}) => {
    const def = m.sonidos[name];
    const cat = def.categoria ?? "otros";
    const rawPath = path.join(SFX_DIR, "_raw", `${name}-v${v}.mp3`);
    const outPath = path.join(SFX_DIR, cat, `${name}-v${v}.wav`);
    try {
      const {audio, creditos: c} = await generate(def, m.estilo, m.modelo);
      fs.mkdirSync(path.dirname(rawPath), {recursive: true});
      fs.writeFileSync(rawPath, audio);
      const medidas = processFile(rawPath, outPath);
      def.archivos.push({v, archivo: rel(outPath), raw: rel(rawPath), generado: today(), creditos: c, estado: "por-escuchar", nota: "", ...medidas});
      if (c) creditos += c;
      console.log(`ok ${name}-v${v}: ${medidas.perfil}${c ? ` · ${c} créditos` : ""}`);
    } catch (e) {
      fallos++;
      console.error(`x ${name}-v${v}: ${e.message}`);
      if (e.fatal) throw e;
    }
  };
  // 3 en paralelo
  const queue = [...jobs];
  try {
    await Promise.all(Array.from({length: Math.min(3, queue.length)}, async () => { while (queue.length) await run(queue.shift()); }));
  } finally {
    for (const def of Object.values(m.sonidos)) def.archivos?.sort((a, b) => a.v - b.v);
    saveManifest(m);
    writeLib(m);
    console.log(`Listo: ${jobs.length - fallos} generadas, ${fallos} fallidas${creditos ? `, ${creditos} créditos` : ""}.`);
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
