import type {BgName, HWord, PresenterSeg} from "../kit";

export const FPS = 30;
const RATE = 1.04;
const sourceSpans = [
  {startFrame: 96, endFrame: 331},
  {startFrame: 459, endFrame: 1527},
];
const [first, second] = sourceSpans;
const firstLength = first.endFrame - first.startFrame;
const cutFrameCount = firstLength + second.endFrame - second.startFrame;
export const VOICE_FRAMES = Math.round(cutFrameCount / RATE);
export const VOICE_END = VOICE_FRAMES / FPS;
export const DURATION_FRAMES = VOICE_FRAMES + 90;

/** Anchor timestamps are source startMs values checked against the Spanish Whisper transcript. */
export const cue = (sourceMs: number) => {
  const sourceFrame = sourceMs * FPS / 1000;
  const cutFrame = sourceFrame < second.startFrame
    ? sourceFrame - first.startFrame
    : firstLength + sourceFrame - second.startFrame;
  return Math.max(0, Math.ceil(cutFrame / RATE - 1e-7)) / FPS;
};

type Beat = {from: number; words: HWord[]};
type Demo = "channels" | "operation" | "growth" | "offer" | "installation" | "message" | "report" | "tasks";
type Act = {
  from: number;
  mode: PresenterSeg['mode'];
  bg?: BgName;
  demo?: Demo;
  beats: Beat[];
};

type CaptionWord = [text: string, sourceMs: number, accent?: true];
const beat = (sourceMs: number, ...words: CaptionWord[]): Beat => ({
  from: cue(sourceMs),
  words: words.map(([t, ms, accent]) => ({t, at: cue(ms), accent})),
});

export const acts: Act[] = [
  {from: 0, mode: "full", beats: [beat(3200, ["Operador", 3560], ["de", 3880], ["rentas", 4030], ["cortas", 4490, true])]},
  {from: cue(5810), mode: "split", bg: "piedra", demo: "channels", beats: [
    beat(5810, ["Los", 6050], ["PMS", 6310], ["necesitan", 6560], ["más", 7490, true]),
    beat(8030, ["Sincronización", 8030, true], ["de", 9190], ["canales", 9520]),
  ]},
  {from: cue(10520), mode: "full", beats: [beat(10520, ["Monark", 10520, true])]},
  {from: cue(15300), mode: "split", bg: "violeta", demo: "operation", beats: [
    beat(15300, ["Automatiza", 15300, true], ["toda", 15940], ["la", 16180], ["operación", 16440]),
    beat(20110, ["Aumentar", 20110], ["capacidad", 20770, true], ["operativa", 21300]),
  ]},
  {from: cue(22150), mode: "graphics", bg: "amarillo", demo: "growth", beats: [
    beat(22150, ["Crecer", 22150, true], ["en", 22200], ["propiedades", 23260]),
  ]},
  {from: cue(24030), mode: "full", beats: [
    beat(24030, ["No", 24290], ["cuesta", 24620], ["un", 25010], ["ojo", 25140, true]),
    beat(27220, ["Pruébenlo", 27220, true]),
    beat(27980, ["Link", 28180], ["del", 28380], ["perfil", 28530, true]),
  ]},
  {from: cue(29610), mode: "split", bg: "coral", demo: "offer", beats: [
    beat(29610, ["Oferta", 29880], ["de", 30200], ["tres", 30400, true], ["meses", 30530]),
    beat(31090, ["30 %", 31090, true], ["de", 31490], ["descuento", 31590]),
  ]},
  {from: cue(33590), mode: "split", bg: "amarillo", demo: "installation", beats: [
    beat(33590, ["Implementación", 34150], ["gratis", 35660, true]),
  ]},
  {from: cue(36040), mode: "full", beats: [beat(36040, ["Únete", 36510, true], ["a", 36900], ["operadores", 37790])]},
  {from: cue(39550), mode: "split", bg: "violeta", demo: "tasks", beats: [
    beat(39550, ["Automatizaron", 39550, true], ["su", 40730], ["operación", 40850]),
  ]},
  {from: cue(41900), mode: "graphics", bg: "crema", demo: "message", beats: [
    beat(41900, ["Contestar", 41900], ["un", 42630], ["mensaje", 42750, true]),
  ]},
  {from: cue(44240), mode: "split", bg: "cobalto", demo: "report", beats: [
    beat(44240, ["Enviar", 44240], ["reportes", 44600, true], ["a", 45820], ["final", 45880], ["de", 46210], ["mes", 46470]),
  ]},
  {from: cue(46550), mode: "split", bg: "crema", demo: "tasks", beats: [beat(46550, ["Y muchas", 46740], ["tareas", 47350, true], ["más", 47750])]},
  {from: cue(48020), mode: "full", beats: [
    beat(48020, ["Quisiera", 48220], ["que", 48760], ["lo", 48960], ["vean", 49090, true]),
    beat(49640, ["Link", 49680], ["está", 49900], ["en", 50230], ["el", 50250], ["perfil", 50350, true]),
  ]},
];

export const presenterSegments: PresenterSeg[] = [];
for (const [index, act] of acts.entries()) {
  const {mode} = act;
  const to = acts[index + 1]?.from ?? VOICE_END;
  const last = presenterSegments.at(-1);
  if (last?.mode === mode) last.to = to;
  else presenterSegments.push({from: act.from, to, mode});
}
