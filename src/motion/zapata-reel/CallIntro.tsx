// Intro de zapata-reel: el momento de la llamada en que Santiago (Zapata Hospitality) cuenta el resultado.
// Clip: public/clips/llamada-corte.mp4 (6 tramos de la grabación, ver llamada-corte.segs.txt) + llamada-corte-voz.wav.
// La ventana de la llamada es el objeto puente: al terminar, el presentador aparece en esa misma ventana y se abre a pantalla completa.
import React from "react";
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from "remotion";
import {Audio, Video} from "@remotion/media";
import {BG, fonts, Headline, MotifSticker, rampAt, SfxTrack, SlotNumber, springAt, SPRING, UI, useTime, type HWord, type SfxEvent} from "../kit";
import ENV from "./call-envelope.json";

export const INTRO_S = 11.2;
/** Rectángulo de la ventana de la llamada al final de la intro (el presentador nace aquí). */
export const CALL_RECT = {x: 60, y: 600, w: 960, h: 760};
/** Momento de la intro en que se planta el motivo (el huésped) — «la gente». */
export const MOTIF_PLANT = 9.25;

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
// jump cuts del clip (inicio de cada tramo después del primero)
const CUTS = [0.37, 5.69, 6.67, 8.86, 9.6];

export const INTRO_SFX: SfxEvent[] = [
  {type: "pop", at: 0.12},
  {type: "conteo", at: 2.32, until: 2.85},
  {type: "golpe", at: 2.9},
  {type: "destello", at: 3.05},
  {type: "pop", at: 4.35},
  {type: "pop", at: 4.6},
  {type: "pop", at: 4.85},
  {type: "pop", at: 7.25},
  {type: "pop", at: 8.1},
  {type: "pop", at: 9.25},
  {type: "destello", at: 9.65},
];

const H: React.FC<{w: [string, number, boolean?][]; from: number; to: number; size?: number; top?: number}> = ({w, from, to, size = 84, top = 300}) => {
  const words: HWord[] = w.map(([t, at, accent]) => ({t, at, accent}));
  return <Headline words={words} from={from} to={to} on="crema" size={size} accentSize={Math.round(size * 1.25)} top={top} width={760} />;
};

const Stars: React.FC = () => <span style={{color: "#F5A623", letterSpacing: 2}}>★★★★★</span>;

const ReviewCard: React.FC<{at: number; x: number; y: number; r: number; out: number}> = ({at, x, y, r, out}) => {
  const {t, fps} = useTime();
  if (t < at || t >= out + 0.25) return null;
  const e = springAt(t, at, fps, SPRING.accent);
  const o = rampAt(t, out, out + 0.25, Easing.in(Easing.cubic));
  const drift = 5 * Math.sin((t - at) * 2.4);
  return (
    <div style={{position: "absolute", left: x, top: y + drift + o * 80, transform: `scale(${e * (1 - 0.3 * o)}) rotate(${r}deg)`, opacity: 1 - o, background: "#fff", borderRadius: 22, padding: "16px 22px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 24px 40px -18px rgba(0,0,0,0.45)", border: "1.5px solid rgba(0,0,0,0.08)", fontFamily: fonts.sans, fontWeight: 800, fontSize: 30}}>
      <Img src={staticFile("brand/airbnb.png")} style={{width: 44, height: 44, borderRadius: 12}} />
      <div>
        <Stars />
        <div style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, color: UI.mute}}>reseña · Airbnb</div>
      </div>
    </div>
  );
};

const Chip: React.FC<{at: number; x: number; y: number; r: number; out: number; children: React.ReactNode}> = ({at, x, y, r, out, children}) => {
  const {t, fps} = useTime();
  if (t < at || t >= out + 0.25) return null;
  const e = springAt(t, at, fps, SPRING.accent);
  const o = rampAt(t, out, out + 0.25, Easing.in(Easing.cubic));
  return (
    <div style={{position: "absolute", left: x, top: y + 5 * Math.sin((t - at) * 2.2), transform: `scale(${e * (1 - o)}) rotate(${r}deg)`, background: BG.amarillo, color: UI.ink, borderRadius: 999, padding: "12px 26px", fontFamily: fonts.serif, fontStyle: "italic", fontSize: 50, boxShadow: "0 18px 30px -14px rgba(0,0,0,0.6)"}}>
      {children}
    </div>
  );
};

/** Líneas de énfasis (emanata) alrededor de un punto. */
const Emanata: React.FC<{at: number; x: number; y: number; color?: string}> = ({at, x, y, color = BG.violeta}) => {
  const {t} = useTime();
  const p = rampAt(t, at, at + 0.18);
  const o = interpolate(t, [at + 0.5, at + 0.8], [1, 0], clamp);
  if (t < at || o <= 0) return null;
  return (
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
      {[-150, -120, -90, -60, -30].map((a, i) => {
        const r1 = 60 + 30 * p;
        const r2 = r1 + 50 * p;
        const rad = (a * Math.PI) / 180;
        return <line key={i} x1={x + Math.cos(rad) * r1} y1={y + Math.sin(rad) * r1} x2={x + Math.cos(rad) * r2} y2={y + Math.sin(rad) * r2} stroke={color} strokeWidth={8} strokeLinecap="round" opacity={o} />;
      })}
    </svg>
  );
};

const CallWindow: React.FC = () => {
  const {t, fps} = useTime();
  const e = springAt(t, 0.0, fps, SPRING.card);
  const punch = CUTS.filter((c) => t >= c).length % 2 === 1 ? 1.07 : 1;
  const flip = rampAt(t, 9.62, 9.75) - rampAt(t, 9.75, 10.0); // pequeño golpe en «flipó»
  const {x, y, w, h} = CALL_RECT;
  const float = 4 * Math.sin(t * 1.8) * (1 - rampAt(t, 10.6, 11.1)); // se asienta antes del relevo
  return (
    <div style={{position: "absolute", left: x, top: y + (1 - e) * 260 + float, width: w, height: h, borderRadius: 36, overflow: "hidden", background: "#000", border: "6px solid #fff", boxShadow: "0 50px 90px -40px rgba(0,0,0,0.45)", transform: `scale(${(0.9 + 0.1 * e) * (1 + 0.03 * flip)}) rotate(${(1 - e) * -4}deg)`, opacity: Math.min(1, e * 1.6)}}>
      <div style={{position: "absolute", inset: 0, transform: `scale(${punch})`, transformOrigin: "55% 45%"}}>
        <Video src={staticFile("clips/llamada-corte.mp4")} muted style={{width: "100%", height: "100%"}} objectFit="cover" />
      </div>
    </div>
  );
};

/** Barras de voz que reaccionan al audio de la llamada. */
const VoiceBars: React.FC = () => {
  const {t, frame} = useTime();
  const o = rampAt(t, 0.2, 0.5) * (1 - rampAt(t, 10.6, 11.0));
  const n = 28;
  return (
    <div style={{position: "absolute", left: 240, top: 1390, width: 600, height: 90, display: "flex", alignItems: "center", gap: 8, opacity: o}}>
      {Array.from({length: n}, (_, i) => {
        const v = (ENV as number[])[Math.max(0, Math.min(ENV.length - 1, frame - Math.abs(i - n / 2)))] ?? 0;
        const hgt = 8 + v * 80 * (0.6 + 0.4 * Math.sin(i * 1.7 + frame * 0.35) ** 2);
        return <span key={i} style={{flex: 1, height: hgt, borderRadius: 8, background: i % 5 === 0 ? BG.violeta : UI.ink}} />;
      })}
    </div>
  );
};

export const CallIntro: React.FC = () => {
  const {t} = useTime();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: "#FFFFFF"}} />
      {/* titulares */}
      <H w={[["Un", 0.62], ["aumento", 0.72], ["de", 1.2], ["satisfacción", 1.3, true]]} from={0.6} to={2.3} />
      {t >= 2.3 && t < 5.7 ? (
        <>
          <div style={{position: "absolute", left: 66, top: 270}}>
            <SlotNumber text="+17%" at={2.32} size={230} color={BG.violeta} />
          </div>
          <div style={{position: "absolute", left: 80, top: 520, fontFamily: fonts.mono, fontSize: 30, color: UI.mute, opacity: rampAt(t, 3.88, 4.1) * (1 - rampAt(t, 5.45, 5.7))}}>// medido en reviews de Airbnb</div>
        </>
      ) : null}
      <H w={[["Todo", 5.7], ["el", 5.86], ["mundo", 6.0], ["era", 6.67], ["súper", 6.97], ["amable", 7.2, true]]} from={5.68} to={8.85} />
      <H w={[["Y", 8.86], ["la", 9.25], ["gente", 9.35], ["flipó.", 9.62, true]]} from={8.86} to={10.9} />
      <CallWindow />
      <VoiceBars />
      <ReviewCard at={4.35} x={30} y={1180} r={-6} out={5.6} />
      <ReviewCard at={4.6} x={370} y={1250} r={3} out={5.6} />
      <ReviewCard at={4.85} x={700} y={1170} r={-2} out={5.6} />
      <Chip at={7.25} x={70} y={1230} r={-5} out={8.8}>amable</Chip>
      <Chip at={8.1} x={640} y={1270} r={4} out={8.8}>atento</Chip>
      <Emanata at={9.62} x={530} y={420} />
      <MotifSticker src="props/ht/huesped.png" at={MOTIF_PLANT} center={{x: 930, y: 330}} size={170} ringColor="#128C4A" progress={[{at: MOTIF_PLANT, value: 0.55}]} />
      <Audio src={staticFile("clips/llamada-corte-voz.wav")} />
      <SfxTrack events={INTRO_SFX} />
    </AbsoluteFill>
  );
};
