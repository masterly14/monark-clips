// Uso: node scripts/transcribe.mjs <video-o-audio> <salida.json> [modelo] [idioma]
// Convierte a WAV 16 kHz, corre whisper.cpp (vía Remotion) y guarda captions con timestamps por palabra.
import path from "node:path";
import fs from "node:fs";
import {execFileSync} from "node:child_process";
import {
  installWhisperCpp,
  downloadWhisperModel,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";

const [input, output, model = "medium", language = "es"] = process.argv.slice(2);
if (!input || !output) {
  console.error("Uso: node scripts/transcribe.mjs <input> <output.json> [modelo] [idioma]");
  process.exit(1);
}

const whisperPath = path.join(process.cwd(), ".whisper");
const whisperCppVersion = "1.5.5";
const tmpDir = path.join(process.cwd(), ".tmp");
const wav = path.join(tmpDir, "audio-16k.wav");

fs.mkdirSync(tmpDir, {recursive: true});

console.log("[1/4] Instalando whisper.cpp…");
await installWhisperCpp({to: whisperPath, version: whisperCppVersion});

console.log(`[2/4] Descargando modelo ${model}…`);
await downloadWhisperModel({model, folder: whisperPath});

console.log("[3/4] Extrayendo audio 16 kHz…");
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", input, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav]);

console.log("[4/4] Transcribiendo…");
const whisperCppOutput = await transcribe({
  model,
  whisperPath,
  whisperCppVersion,
  inputPath: wav,
  tokenLevelTimestamps: true,
  language,
  splitOnWord: true,
});

const {captions} = toCaptions({whisperCppOutput});
fs.writeFileSync(output, JSON.stringify(captions, null, 2));
console.log(`Listo: ${captions.length} captions -> ${output}`);
console.log("TEXTO:", captions.map((c) => c.text).join("").trim());
