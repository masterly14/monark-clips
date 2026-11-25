import type {BgName, Expression, HWord} from "../kit";
import captions from "./captions.json";

export const FPS = 60;
export const VOICE = "clips/alex-pasaporte-voz.wav";
const FIRST_START_MS = 480;
const FIRST_END_MS = 21310;
const SECOND_START_MS = 23600;
const VOICE_RATE = 1.07;
export const VOICE_END = 68.013;
export const DURATION_FRAMES = Math.ceil((VOICE_END + 2.85) * FPS);

export function cue(wordIndex: number) {
  const {startMs} = captions[wordIndex];
  const gap = startMs >= SECOND_START_MS ? SECOND_START_MS - FIRST_END_MS : 0;
  const seconds = Math.max(0, startMs - FIRST_START_MS - gap) / (1000 * VOICE_RATE);
  return Math.ceil(seconds * FPS) / FPS;
}

type HeadlineWord = [text: string, captionIndex: number, accent?: true];
type Beat = {at: number; words: HWord[]; expression: Expression; size?: number};
type Device = "identity" | "routing" | "minor" | "owner" | "scan" | "report" |
  "deadline" | "reminder" | "team" | "arrival" | "goodbye" | "profile";

export type Act = {
  at: number;
  bg: BgName;
  device: Device;
  beats: Beat[];
  guide: "large" | "badge";
  bridge?: {x: number; y: number};
};

function beat(index: number, expression: Expression, words: HeadlineWord[], size?: number): Beat {
  return {at: cue(index), expression, size, words: words.map(([t, word, accent]) => ({t, at: cue(word), accent}))};
}

export const END_CARD_AT = cue(199);

export const acts: Act[] = [
  {at: 0, bg: "crema", device: "identity", guide: "large", beats: [
    beat(0, "peek-derecha", [["Este", 0], ["huésped", 1], ["se", 2], ["llama", 3], ["Alex", 4], ["Pasaporte.", 5, true]], 89),
    beat(7, "sorpresa", [["No", 8], ["es", 9], ["chiste.", 10, true]], 112),
    beat(11, "preocupado", [["Pasa", 12], ["más", 13, true], ["de", 14], ["lo", 15], ["que", 16], ["crees.", 17]], 99),
  ]},
  {at: cue(18), bg: "piedra", device: "routing", guide: "large", beats: [
    beat(18, "preocupado", [["Llena", 21], ["mal", 22, true], ["su", 23], ["check-in.", 24]], 103),
    beat(25, "sorpresa", [["Reportas", 26], ["datos", 27], ["falsos.", 28, true]], 113),
    beat(29, "preocupado", [["Al", 29], ["TRA", 30], ["y", 31], ["al", 32], ["SIRE.", 33, true]], 110),
  ]},
  {at: cue(34), bg: "coral", device: "minor", guide: "large", beats: [
    beat(34, "preocupado", [["Un", 37], ["menor", 38, true], ["sin", 39], ["permiso.", 41]], 103),
    beat(44, "mira-titular", [["El", 44], ["problema.", 45, true]], 110),
  ]},
  {at: cue(49), bg: "tinta", device: "owner", guide: "large", beats: [
    beat(49, "mira-titular", [["El", 50], ["responsable", 51, true]], 102),
    beat(56, "sorpresa", [["Eres", 56], ["tú.", 57, true]], 132),
  ]},
  {at: cue(58), bg: "violeta", device: "scan", guide: "badge", bridge: {x: 540, y: 901}, beats: [
    beat(58, "sonrisa", [["En", 58], ["Monark", 59, true]], 112),
    beat(60, "mira-titular", [["La", 60], ["IA", 61, true], ["revisa", 62], ["el", 64], ["documento.", 65]], 89),
    beat(68, "feliz-ojos-cerrados", [["Que", 69], ["coincida", 70, true], ["con", 71], ["lo", 72], ["escrito.", 76]], 92),
  ]},
  {at: cue(77), bg: "amarillo", device: "report", guide: "badge", bridge: {x: 548, y: 870}, beats: [
    beat(77, "sorpresa", [["Si", 77], ["viaja", 78], ["un", 79], ["menor.", 80, true]], 103),
    beat(82, "mira-titular", [["Pide", 82], ["el", 83], ["permiso.", 84, true]], 102),
    beat(86, "sonrisa", [["El", 86], ["reporte", 87, true], ["sale", 88], ["solo.", 89]], 100),
    beat(93, "feliz-ojos-cerrados", [["Aviso", 93], ["a", 94], ["portería.", 95, true]], 100),
  ]},
  {at: cue(96), bg: "crema", device: "deadline", guide: "badge", beats: [
    beat(96, "mira-titular", [["También", 97], ["validamos.", 98, true]], 93),
    beat(102, "sonrisa", [["Check-in", 104, true], ["online", 105], ["a", 106], ["tiempo.", 107]], 100),
  ]},
  {at: cue(108), bg: "cobalto", device: "reminder", guide: "badge", beats: [
    beat(108, "sonrisa", [["Recordatorios", 110], ["inteligentes.", 111, true]], 83),
    beat(112, "preocupado", [["No", 113], ["lo", 114], ["ha", 115], ["llenado.", 116, true]], 98),
    beat(118, "sorpresa", [["El", 118], ["día", 119], ["se", 123], ["acerca.", 125, true]], 98),
  ]},
  {at: cue(126), bg: "coral", device: "team", guide: "badge", beats: [
    beat(126, "preocupado", [["Si", 126], ["pasa", 128], ["el", 129], ["límite.", 130, true]], 102),
    beat(133, "sorpresa", [["Te", 133], ["notificamos.", 134, true]], 105),
    beat(142, "sonrisa", [["En", 142], ["tiempo", 143], ["real.", 144, true]], 107),
  ]},
  {at: cue(145), bg: "tinta", device: "arrival", guide: "badge", beats: [
    beat(145, "preocupado", [["El", 146], ["huésped", 147], ["va", 148], ["a", 149], ["entrar.", 150, true]], 88),
    beat(151, "sorpresa", [["Check-in", 156, true], ["pendiente.", 156]], 104),
    beat(157, "mira-titular", [["Evita", 159], ["el", 160], ["problema.", 161, true]], 100),
    beat(165, "preocupado", [["Llega", 166], ["a", 167], ["la", 168], ["propiedad.", 169, true]], 99),
    beat(170, "preocupado", [["Y", 170], ["no", 171], ["lo", 172], ["dejan", 173], ["entrar.", 174, true]], 93),
  ]},
  {at: cue(175), bg: "crema", device: "goodbye", guide: "large", beats: [
    beat(175, "guino", [["Chao,", 177], ["Alex", 178], ["Pasaporte.", 179, true]], 105),
  ]},
  {at: cue(180), bg: "violeta", device: "profile", guide: "badge", beats: [
    beat(180, "sonrisa", [["Cómo", 183], ["funciona", 184], ["en", 185], ["tu", 186], ["operación.", 187, true]], 82),
    beat(188, "mira-titular", [["El", 189], ["enlace", 190, true], ["de", 191], ["mi", 192], ["perfil.", 193]], 88),
    beat(194, "guino", [["Acceso", 196], ["a", 197], ["Monark.", 198, true]], 98),
  ]},
];
