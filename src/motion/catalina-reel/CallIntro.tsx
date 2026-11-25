// Intro de catalina-reel: el momento de la llamada en que Catalina reacciona a los reportes automáticos de fin de mes.
// Clip: public/clips/llamada-catalina-corte.mp4 (3 tramos, ver llamada-catalina.segs.txt; solo el recuadro de Catalina, sin rótulo de nombre)
// + llamada-catalina-corte-voz.wav. La ventana de la llamada es el objeto puente: el presentador nace en ella.
// Sin «REC», sin rótulos de llamada, sin stickers: fondo blanco liso.
import React from "react";
import {AbsoluteFill, Easing, interpolate, staticFile} from "remotion";
import {Audio, Video} from "@remotion/media";
import {BG, BrandDrop, fonts, rampAt, SfxTrack, springAt, SPRING, UI, useTime, type SfxEvent} from "../kit";
import ENV from "./call-envelope.json";
import {CheckBox, clamp, Emanata, enterY, GREEN, H, MonarkMark, White} from "./ui";

export const INTRO_S = 9.0;
/** Ventana de la llamada (el presentador nace aquí). Proporción del clip 1440×848. */
export const CALL_RECT = {x: 60, y: 600, w: 960, h: 566};

// jump cuts del clip (inicio de cada tramo después del primero)
const CUTS = [0.77, 2.6];
const MARK_AT = 8.42; // «…del PMS»: la marca cae sobre el reporte

export const INTRO_SFX: SfxEvent[] = [
  {type: "pop", at: 0.08},
  {type: "pop", at: 1.5},
  {type: "tick", at: 2.37},
  {type: "sobre-enviado", at: 2.55, v: 1},
  {type: "destello", at: 3.31, gain: 0.7},
  {type: "pop", at: 4.05},
  {type: "destello", at: 6.93, gain: 0.7},
  {type: "golpe", at: MARK_AT},
];

const CallWindow: React.FC = () => {
  const {t, fps} = useTime();
  const e = springAt(t, 0.0, fps, SPRING.card);
  const punch = CUTS.filter((c) => t >= c).length % 2 === 1 ? 1.07 : 1;
  const hit = rampAt(t, 3.31, 3.42) - rampAt(t, 3.42, 3.7); // pequeño golpe en «buenísimo»
  const {x, y, w, h} = CALL_RECT;
  const float = 4 * Math.sin(t * 1.8) * (1 - rampAt(t, 8.4, 8.9)); // se asienta antes del relevo
  return (
    <div style={{position: "absolute", left: x, top: y + (1 - e) * 260 + float, width: w, height: h, borderRadius: 36, overflow: "hidden", background: "#000", border: "6px solid #fff", boxShadow: "0 50px 90px -40px rgba(0,0,0,0.45)", transform: `scale(${(0.9 + 0.1 * e) * (1 + 0.025 * hit)}) rotate(${(1 - e) * -4}deg)`, opacity: Math.min(1, e * 1.6)}}>
      <div style={{position: "absolute", inset: 0, transform: `scale(${punch})`, transformOrigin: "62% 45%"}}>
        <Video src={staticFile("clips/llamada-catalina-corte.mp4")} muted style={{width: "100%", height: "100%"}} objectFit="cover" />
      </div>
    </div>
  );
};

/** Barras de voz que reaccionan al audio de la llamada. */
const VoiceBars: React.FC = () => {
  const {t, frame} = useTime();
  const o = rampAt(t, 0.2, 0.5) * (1 - rampAt(t, 8.5, 8.9));
  const n = 28;
  return (
    <div style={{position: "absolute", left: 240, top: 1196, width: 600, height: 70, display: "flex", alignItems: "center", gap: 8, opacity: o}}>
      {Array.from({length: n}, (_, i) => {
        const v = (ENV as number[])[Math.max(0, Math.min(ENV.length - 1, frame - Math.abs(i - n / 2)))] ?? 0;
        const hgt = 8 + v * 62 * (0.6 + 0.4 * Math.sin(i * 1.7 + frame * 0.35) ** 2);
        return <span key={i} style={{flex: 1, height: hgt, borderRadius: 8, background: i % 5 === 0 ? BG.violeta : UI.ink}} />;
      })}
    </div>
  );
};

/** El objeto motivo plantado: el reporte a propietarios. «No hay que hacer ese proceso» → se tacha el trabajo manual. */
const ReportCard: React.FC = () => {
  const {t, fps} = useTime();
  if (t < 1.5) return null;
  const strike = rampAt(t, 2.37, 2.37 + 12 / 30, Easing.out(Easing.cubic));
  const autoE = springAt(t, 2.55, fps, SPRING.accent);
  const heart = springAt(t, 4.05, fps, SPRING.stamp);
  const markIn = t >= MARK_AT;
  const settle = rampAt(t, 8.4, 8.9);
  const drift = 5 * Math.sin((t - 1.5) * 2.1) * (1 - settle);
  return (
    <div style={{position: "absolute", left: 100, top: 1300 + drift, width: 880, background: "#fff", borderRadius: 32, padding: "26px 34px 30px", boxShadow: UI.cardShadow, border: "1.5px solid rgba(0,0,0,0.08)", ...enterY(t, 1.5, fps, 160)}}>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", height: 56}}>
        <span style={{fontFamily: fonts.mono, fontSize: 26, color: UI.mute}}>// reporte a propietarios · fin de mes</span>
        <div style={{width: 56, height: 56, transform: `scale(${markIn ? springAt(t, MARK_AT, fps, SPRING.stamp) : 0})`}}>
          <MonarkMark size={56} />
        </div>
      </div>
      <div style={{display: "flex", alignItems: "center", gap: 20, padding: "18px 0", borderBottom: `2px solid ${UI.line}`}}>
        <div style={{width: 46, height: 46, borderRadius: 12, border: `3px solid ${strike > 0 ? BG.coral : "#D5D0C8"}`, flexShrink: 0}} />
        <span style={{position: "relative", fontFamily: fonts.sans, fontWeight: 600, fontSize: 40, color: strike > 0.5 ? UI.mute : UI.ink}}>
          Armarlo a mano
          <span style={{position: "absolute", left: -6, top: "54%", height: 6, borderRadius: 6, width: `calc(${strike * 100}% + 12px)`, background: BG.coral}} />
        </span>
      </div>
      {t >= 2.55 ? (
        <div style={{display: "flex", alignItems: "center", gap: 20, paddingTop: 18, opacity: Math.min(1, autoE * 1.6), transform: `translateX(${(1 - autoE) * 60}px)`}}>
          <CheckBox at={2.6} />
          <span style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 40, color: UI.ink}}>Se envía solo</span>
          <span style={{marginLeft: "auto", fontFamily: fonts.mono, fontSize: 24, color: GREEN, background: `${GREEN}1F`, padding: "8px 18px", borderRadius: 999}}>automático</span>
        </div>
      ) : null}
      {t >= 4.05 ? (
        <div style={{position: "absolute", left: -26, top: -30, transform: `scale(${heart}) rotate(-10deg)`}}>
          <svg width={84} height={84} viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.6 4.5c2.1 0 3.6 1.2 4.4 2.6.8-1.4 2.3-2.6 4.4-2.6 3.6 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z" fill={BG.coral} stroke="#fff" strokeWidth={1.2} /></svg>
        </div>
      ) : null}
    </div>
  );
};

export const CallIntro: React.FC = () => {
  return (
    <AbsoluteFill>
      <White />
      {/* titulares: condensan lo que dice Catalina */}
      <H w={[["Maravilloso.", 0.08, true]]} from={0.05} to={1.45} size={104} />
      <H w={[["No", 1.5], ["hay", 1.62], ["que", 1.72], ["hacer", 1.97], ["ese", 2.09], ["proceso.", 2.37, true]]} from={1.45} to={2.74} />
      <H w={[["Eso", 2.85], ["está", 3.05], ["buenísimo", 3.31, true]]} from={2.74} to={4.38} />
      <H w={[["Yo", 4.4], ["sabía…", 4.55, true]]} from={4.38} to={5.33} size={104} />
      <H w={[["Una", 5.45], ["intuición…", 5.62, true]]} from={5.33} to={6.23} size={104} />
      <H w={[["Ustedes", 6.25], ["la", 6.6], ["estaban", 6.7], ["rompiendo", 6.93, true]]} from={6.23} to={INTRO_S} exit={false} />
      <CallWindow />
      <VoiceBars />
      <ReportCard />
      <Emanata at={3.31} x={CALL_RECT.x + CALL_RECT.w - 70} y={CALL_RECT.y + 20} angles={[-120, -90, -60, -30, 0]} />
      <Emanata at={6.93} x={540} y={478} angles={[-50, -20, 10, 40]} />
      {/* «…con el tema del PMS»: la marca cae sobre el reporte */}
      <BrandDrop at={MARK_AT} to={{x: 100 + 880 - 34 - 28, y: 1300 + 26 + 28}} size={56} until={MARK_AT + 0.05} trail={BG.amarillo}>
        <MonarkMark size={56} />
      </BrandDrop>
      {/* fade-in mínimo del audio de la llamada para que el primer frame no "clickee" */}
      <Audio src={staticFile("clips/llamada-catalina-corte-voz.wav")} volume={(f) => interpolate(f, [0, 3], [0, 1], clamp)} />
      <SfxTrack events={INTRO_SFX} />
    </AbsoluteFill>
  );
};
