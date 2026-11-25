// Genera las versiones "ht" (recorte transparente + halftone 1 bit) de los assets del manifiesto.
// Uso: node scripts/build-assets.mjs [nombre ...]   (sin nombres = todos)
//
// Salida por asset (en public/<categoria>/ht/):
//   <nombre>.png       → halftone: puntos negros sobre "papel" blanco, con alfa = silueta
//   <nombre>-ink.png   → solo la tinta (puntos negros), resto transparente (para duotono sobre color)
// Además, para el sticker: character/ht/badge-circle.png (círculo de 512 px).
import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const PUBLIC = path.join(process.cwd(), "public");
const manifest = JSON.parse(fs.readFileSync(path.join(PUBLIC, "assets.manifest.json"), "utf8"));
const only = new Set(process.argv.slice(2));

const CELL = 3; // tamaño de pixel del halftone (px de la imagen original)
const MARGIN = 24; // margen alrededor del bbox
const CURVE_CHARACTER = "0/0 0.25/0.02 0.45/0.55 0.6/0.9 1/1";
const CURVE_PROPS = "0/0 0.3/0.04 0.55/0.7 0.75/0.97 1/1";
const BG_THRESHOLD = 244; // luminancia >= esto (y conectado al fondo) se considera fondo blanco
const CLOSE = 10; // pasadas de dilatación/erosión para tapar brillos internos (ojos, parche)

// Umbral Bayer 4×4 (0–255) calculado con operaciones de bits, en coordenadas de la celda
const bx = `mod(floor(X/${CELL}),4)`;
const by = `mod(floor(Y/${CELL}),4)`;
const xr = `(bitor(${bx},${by})-bitand(${bx},${by}))`;
const bayer = `((8*bitand(${xr},1)+4*bitand(${by},1)+bitand(${xr},2)+bitand(${by},2)/2+0.5)*16)`;
// Muestra la luminancia en el centro de la celda para que cada celda sea un bloque uniforme
const cellLum = `lum(floor(X/${CELL})*${CELL}+1,floor(Y/${CELL})*${CELL}+1)`;

const ff = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], {stdio: "inherit"});

function build(category, name, entry, curve, bgThreshold = BG_THRESHOLD) {
  const src = path.join(PUBLIC, entry.file);
  const outDir = path.join(PUBLIC, category, "ht");
  fs.mkdirSync(outDir, {recursive: true});
  const [bx0, by0, bw, bh] = entry.bbox;
  // recorte con margen, limitado a la imagen 1344×752
  const x = Math.max(0, bx0 - MARGIN);
  const y = Math.max(0, by0 - MARGIN);
  const w = Math.min(1344 - x, bw + 2 * MARGIN);
  const h = Math.min(752 - y, bh + 2 * MARGIN);
  const crop = `crop=${w}:${h}:${x}:${y}`;
  const dil = Array(CLOSE).fill("dilation").join(",");
  const ero = Array(CLOSE).fill("erosion").join(",");

  const graph = [
    `[0:v]${crop},format=rgb24,split=2[g][m]`,
    // halftone: curva de contraste (en RGB) → gris → umbral Bayer por celda → RGB
    `[g]curves=all='${curve}',format=gray,geq=lum='if(gte(${cellLum},${bayer}),255,0)',format=rgb24[ht]`,
    // máscara de silueta: lo que no es blanco, cerrado para tapar brillos internos
    // (las 6 filas superiores se descartan: el borde de las imágenes originales no es blanco puro)
    `[m]format=gray,geq=lum='if(lt(Y,6),0,if(lt(lum(X,Y),${bgThreshold}),255,0))',${dil},${ero},erosion,gblur=sigma=0.6,format=gray[mask]`,
    `[ht][mask]alphamerge,format=rgba[paper]`,
  ].join(";");

  const paperOut = path.join(outDir, `${name}.png`);
  ff(["-i", src, "-filter_complex", graph, "-map", "[paper]", "-frames:v", "1", paperOut]);

  // versión solo tinta: alfa = puntos negros dentro de la silueta
  const inkGraph = [
    `[0:v]format=rgba,split=3[c][a][l]`,
    `[c]format=rgb24,geq=r=18:g=18:b=18[col]`,
    `[a]alphaextract[al];[l]format=gray,negate[inv];[inv][al]blend=all_mode=multiply[ink]`,
    `[col][ink]alphamerge,format=rgba[out]`,
  ].join(";");
  const inkOut = path.join(outDir, `${name}-ink.png`);
  ff(["-i", paperOut, "-filter_complex", inkGraph, "-map", "[out]", "-frames:v", "1", inkOut]);

  return {x, y, w, h, paper: path.relative(PUBLIC, paperOut).replaceAll("\\", "/"), ink: path.relative(PUBLIC, inkOut).replaceAll("\\", "/")};
}

const results = {};
for (const [group, curve] of [["expressions", CURVE_CHARACTER], ["poses", CURVE_CHARACTER]]) {
  for (const [name, entry] of Object.entries(manifest.character[group])) {
    if (only.size && !only.has(name)) continue;
    results[name] = build("character", name, entry, curve);
    console.log("ok character/" + name);
  }
}
for (const [name, entry] of Object.entries(manifest.props)) {
  if (only.size && !only.has(name)) continue;
  results[name] = build("props", name, entry, CURVE_PROPS, 226); // umbral más estricto: excluye la sombra suave del render
  console.log("ok props/" + name);
}

// Sticker circular: cuadrado centrado en la cara del retrato "badge", con máscara de círculo
if (!only.size || only.has("badge")) {
  const b = results.badge;
  const src = path.join(PUBLIC, b.paper);
  const out = path.join(PUBLIC, "character", "ht", "badge-circle.png");
  // la cara ocupa el centro horizontal del recorte; el cuadrado toma el ancho completo desde arriba
  const side = Math.min(b.w, b.h);
  // el círculo lleva fondo blanco completo (papel) para que el sticker sea opaco
  ff(["-f", "lavfi", "-i", "color=c=white:s=512x512", "-i", src, "-filter_complex",
    `[1:v]crop=${side}:${side}:(iw-${side})/2:0,scale=512:512:flags=neighbor[f];[0:v][f]overlay,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lte(hypot(X-256,Y-256),254),255,0)'[o]`,
    "-map", "[o]", "-frames:v", "1", out]);
  results["badge-circle"] = {paper: "character/ht/badge-circle.png"};
  console.log("ok character/badge-circle");
}

fs.writeFileSync(path.join(PUBLIC, "character", "ht", "_build.json"), JSON.stringify(results, null, 2));
console.log("Listo:", Object.keys(results).length, "assets");
