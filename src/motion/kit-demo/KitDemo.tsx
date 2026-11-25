// Demo de los tres recursos nuevos del kit: cámara del escenario, ruptura y presentador integrado.
// No es una pieza para publicar: sirve para ver y ajustar los componentes.
import React from "react";
import {AbsoluteFill, Img, Sequence, interpolate, random, staticFile} from "remotion";
import {
  ActBackground, BG, BlobReveal, BrandDrop, Character, CircleReveal, fonts, Headline, PresenterStage, Shatter, Splash,
  springAt, SPRING, UI, useTime, Viewfinder, WorldCamera, type CamKey, type StageKey,
} from "../kit";

export const FPS = 30;
export const DURATION_S = 15;

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// ---------- acto Problema: el mundo ----------
const CAM: CamKey[] = [
  {at: 0, zoom: 2.4, focus: {x: 380, y: 760}}, // primer plano del personaje
  {at: 0.9, zoom: 1, focus: {x: 540, y: 960}, dur: 0.4, ease: "out"}, // revelación de mundo
  {at: 1.25, light: 0.78, dur: 0.1}, // time-lapse: noche
  {at: 1.5, light: 1, dur: 0.1},
  {at: 1.75, light: 0.78, dur: 0.1},
  {at: 2.0, light: 1, dur: 0.1},
  {at: 2.35, zoom: 2.2, focus: {x: 860, y: 935}, dur: 0.35}, // dolly-in al teléfono
  {at: 3.65, zoom: 1, focus: {x: 540, y: 960}, dur: 0.3}, // vuelve al plano general
  {at: 4.05, zoom: 0.55, focus: {x: 540, y: 900}, dur: 0.3}, // pull-back: la escala del problema
];

const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN"];

const Calendar: React.FC = () => {
  const {t} = useTime();
  const k = Math.max(0, Math.min(MONTHS.length - 1, Math.floor((t - 1.0) / 0.25)));
  return (
    <div style={{position: "absolute", left: 770, top: 300, width: 210, height: 230, background: "#fff", borderRadius: 18, border: `4px solid ${UI.ink}`, overflow: "hidden", transform: "rotate(3deg)"}}>
      <div style={{height: 64, background: UI.ink, color: "#fff", fontFamily: fonts.mono, fontWeight: 500, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center"}}>{MONTHS[k]}</div>
      <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, padding: 16}}>
        {Array.from({length: 15}, (_, i) => (
          <div key={i} style={{height: 22, borderRadius: 4, background: i < (k + 1) * 2.5 ? BG.coral : "#E4DED5"}} />
        ))}
      </div>
    </div>
  );
};

const MESSAGES = ["¿A qué hora es el check-in?", "¿Hay toallas extra?", "No encuentro la llave", "¿Me pasas el Wi-Fi?", "¿Puedo llegar antes?", "Hola??"];

const Phone: React.FC = () => {
  const {t, fps} = useTime();
  const unread = Math.min(14, Math.max(0, Math.floor((t - 0.6) * 4)));
  return (
    <div style={{position: "absolute", left: 640, top: 760, width: 300, height: 560, borderRadius: 48, background: UI.ink, padding: 12, transform: "rotate(-4deg)", boxShadow: "0 30px 60px -25px rgba(0,0,0,0.5)"}}>
      <div style={{width: "100%", height: "100%", borderRadius: 38, background: "#F4F1EC", overflow: "hidden", padding: "56px 14px 14px", position: "relative"}}>
        <div style={{position: "absolute", top: 16, left: 14, right: 14, display: "flex", justifyContent: "space-between", fontFamily: fonts.sans, fontWeight: 700, fontSize: 20}}>
          <span>Chats</span>
          <span style={{background: UI.err, color: "#fff", borderRadius: 20, padding: "0 10px", fontVariantNumeric: "tabular-nums"}}>{unread}</span>
        </div>
        {MESSAGES.map((m, i) => {
          const at = 0.8 + i * 0.42;
          const e = springAt(t, at, fps, SPRING.accent);
          return (
            <div key={i} style={{marginBottom: 10, background: "#fff", borderRadius: 16, padding: "10px 12px", fontFamily: fonts.sans, fontWeight: 500, fontSize: 17, lineHeight: 1.25, opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - e) * 24}px)`, boxShadow: "0 4px 10px -6px rgba(0,0,0,0.3)"}}>
              {m}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// cartas que llueven para formar la montaña (A20): filas en forma de triángulo que tapan al personaje
const LABELS = ["SIN RESPUESTA", "RESERVA CRUZADA", "LIMPIEZA ?", "COBRO PENDIENTE", "RESEÑA 2★", "CHECK-IN ?"];
const PILE = (() => {
  const out: {x: number; y: number; rot: number; at: number; label: string}[] = [];
  let n = 0;
  for (let r = 0; r < 7; r++) {
    const count = 2 + Math.round(r * 1.6);
    const width = 260 + r * 420;
    for (let c = 0; c < count; c++) {
      const x = 540 - width / 2 + (count === 1 ? width / 2 : (c * width) / (count - 1)) - 150 + (random(`px${n}`) - 0.5) * 90;
      out.push({x, y: 780 + r * 210 + (random(`py${n}`) - 0.5) * 60, rot: (random(`pr${n}`) - 0.5) * 26, at: 3.95 + (6 - r) * 0.05 + c * 0.012, label: LABELS[n % 6]});
      n++;
    }
  }
  return out;
})();

const PileCards: React.FC = () => {
  const {t, fps} = useTime();
  return (
    <>
      {PILE.map((c, i) => {
        if (t < c.at) return null;
        const e = springAt(t, c.at, fps, {damping: 13, stiffness: 220, mass: 0.8});
        return (
          <div key={i} style={{position: "absolute", left: c.x, top: c.y - (1 - e) * 900, width: 300, height: 190, background: "#fff", borderRadius: 18, border: `3px solid ${UI.ink}`, transform: `rotate(${c.rot}deg)`, padding: 18, boxShadow: "0 18px 30px -18px rgba(0,0,0,0.5)"}}>
            <div style={{height: 14, width: "70%", background: "#E4DED5", borderRadius: 6, marginBottom: 10}} />
            <div style={{height: 14, width: "45%", background: "#E4DED5", borderRadius: 6, marginBottom: 22}} />
            <span style={{fontFamily: fonts.mono, fontSize: 20, fontWeight: 500, color: UI.err, background: `${UI.err}1F`, padding: "4px 10px", borderRadius: 999}}>{c.label}</span>
          </div>
        );
      })}
    </>
  );
};

const World: React.FC = () => (
  <AbsoluteFill>
    <WorldCamera keys={CAM}>
      {/* pared con retícula, más grande que el lienzo para el pull-back */}
      <div style={{position: "absolute", left: -1200, top: -1600, width: 3480, height: 5200, background: BG.crema, backgroundImage: "radial-gradient(#DDD5C8 2px, transparent 2px)", backgroundSize: "28px 28px"}} />
      <Img src={staticFile("props/ht/llave.png")} style={{position: "absolute", left: 130, top: 380, width: 130, imageRendering: "pixelated", transform: "rotate(-12deg)"}} />
      <Calendar />
      <Character schedule={[{at: 0, name: "neutral"}, {at: 1.2, name: "preocupado"}, {at: 4.1, name: "sorpresa"}]} from={0} to={99} enter={false} height={900} top={520} centerX={380} />
      {/* mostrador */}
      <div style={{position: "absolute", left: -1200, top: 1290, width: 3480, height: 1600, background: BG.piedra, borderTop: `6px solid ${UI.ink}`}} />
      <Img src={staticFile("props/ht/cabana.png")} style={{position: "absolute", left: 470, top: 1060, width: 160, imageRendering: "pixelated"}} />
      <Phone />
      <PileCards />
      {/* la cabaña en la cima de la montaña */}
      <PileTop />
    </WorldCamera>
  </AbsoluteFill>
);

const PileTop: React.FC = () => {
  const {t, fps} = useTime();
  const e = springAt(t, 4.3, fps, SPRING.accent);
  if (t < 4.3) return null;
  return (
    <div style={{position: "absolute", left: 430, top: 250, width: 420, textAlign: "center", transform: `scale(${e})`, transformOrigin: "50% 100%"}}>
      <Img src={staticFile("props/ht/cabana.png")} style={{width: 380, imageRendering: "pixelated"}} />
      <div style={{fontFamily: fonts.mono, fontSize: 52, fontWeight: 500, color: UI.ink}}>// 1 cabaña</div>
    </div>
  );
};

// ---------- después de la ruptura ----------
const IMPACT = 5.55;
// la cabaña de la cima (mundo ≈ 640, 430) vista con la cámara del pull-back (zoom 0,55, foco 540, 900)
const ORIGIN = {x: 540 + (640 - 540) * 0.55, y: 960 + (430 - 900) * 0.55};

const BrandScene: React.FC = () => {
  const {t, fps} = useTime();
  const e = springAt(t, IMPACT + 0.1, fps, SPRING.stamp);
  return (
    <AbsoluteFill>
      <ActBackground bg="amarillo" />
      <Headline words={[{t: "Monark.", at: IMPACT + 0.12, accent: true}]} from={IMPACT} to={7.0} on="amarillo" size={110} accentSize={170} top={300} />
      <div style={{position: "absolute", left: 540 - 150, top: 900, width: 300, height: 300, borderRadius: 78, background: "#fff", boxShadow: UI.cardShadow, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.5 + 0.5 * e})`}}>
        <Img src={staticFile("brand/monark-mark.png")} style={{width: 210}} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- acto Demo con presentador ----------
const P0 = 6.9; // el presentador entra aquí
const STAGE: StageKey[] = [
  {at: 0, shot: {mode: "full"}},
  {at: 1.3, shot: {mode: "window", x: 150, y: 780, w: 780, h: 1000, rotate: -3}},
  {at: 2.7, shot: {mode: "hidden"}, dur: 0.45},
  {at: 4.9, shot: {mode: "split", ratio: 0.52}},
  {at: 6.3, shot: {mode: "full"}},
];

const Inbox: React.FC<{top: number; scale?: number}> = ({top, scale = 1}) => {
  const {t, fps} = useTime();
  const rows = [
    {app: "brand/airbnb.png", name: "Laura · Airbnb", msg: "¿A qué hora es el check-in?", at: 2.85},
    {app: "brand/booking.png", name: "Marco · Booking", msg: "¿Hay parqueadero?", at: 3.1},
    {app: "brand/whatsapp.png", name: "Ana · WhatsApp", msg: "¿Me pasas el Wi-Fi?", at: 3.35},
  ];
  return (
    <div style={{position: "absolute", left: 60, top, width: 960, transformOrigin: "50% 0", transform: `scale(${scale})`, background: "#fff", borderRadius: 32, padding: 36, boxShadow: UI.cardShadow}}>
      <div style={{fontFamily: fonts.mono, fontSize: 26, color: UI.mute, marginBottom: 20}}>// bandeja unificada</div>
      {rows.map((r, i) => {
        const e = springAt(t, r.at, fps, SPRING.card);
        const done = t >= 4.0 + i * 0.12;
        return (
          <div key={i} style={{display: "flex", alignItems: "center", gap: 22, padding: "20px 0", borderTop: i ? `2px solid ${UI.line}` : undefined, opacity: Math.min(1, e * 1.5), transform: `translateX(${(1 - e) * 80}px)`}}>
            <Img src={staticFile(r.app)} style={{width: 76, height: 76, borderRadius: 20}} />
            <div style={{flex: 1}}>
              <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 34}}>{r.name}</div>
              <div style={{fontFamily: fonts.sans, fontWeight: 500, fontSize: 28, color: UI.mute}}>{r.msg}</div>
            </div>
            <span style={{fontFamily: fonts.mono, fontSize: 24, padding: "8px 16px", borderRadius: 999, background: done ? `${UI.ok}1F` : `${UI.err}1F`, color: done ? UI.ok : UI.err}}>{done ? "respondido ✓" : "pendiente"}</span>
          </div>
        );
      })}
    </div>
  );
};

const DemoBackdrop: React.FC = () => {
  const {t} = useTime();
  const rel = t;
  const bg = rel < 3.9 ? "violeta" : "cobalto";
  const inboxTop = rel < 4.9 ? 620 : interpolate(rel, [4.9, 5.3], [620, 330], {...clamp});
  const inboxScale = rel < 4.9 ? 1 : interpolate(rel, [4.9, 5.3], [1, 0.92], clamp);
  return (
    <AbsoluteFill>
      <ActBackground bg={bg} />
      <Headline words={[{t: "Una", at: 1.35}, {t: "sola", at: 1.5}, {t: "bandeja", at: 1.7, accent: true}]} from={1.3} to={3.9} on="violeta" size={84} top={300} />
      <Headline words={[{t: "Responde", at: 3.92}, {t: "solo.", at: 4.15, accent: true}]} from={3.9} to={4.9} on="cobalto" size={84} top={300} />
      {rel >= 2.7 && rel < 6.3 ? <Inbox top={rel < 2.7 ? 620 : inboxTop} scale={inboxScale} /> : null}
    </AbsoluteFill>
  );
};

export const KitDemo: React.FC = () => {
  const {t} = useTime();
  return (
    <AbsoluteFill style={{background: "#000"}}>
      {/* escena nueva debajo de la ruptura */}
      {t >= IMPACT - 0.05 && t < P0 + 0.4 ? (
        <BlobReveal at={IMPACT + 0.03} origin={ORIGIN} outline={BG.violeta}>
          <BrandScene />
        </BlobReveal>
      ) : null}
      {/* mundo del problema, que se rompe en el impacto */}
      {t < IMPACT + 1.6 ? (
        <Shatter at={IMPACT} origin={ORIGIN} crackColor={BG.amarillo}>
          <World />
          <Headline words={[{t: "Cada", at: 0.3}, {t: "noche…", at: 0.6, accent: true}]} from={0.2} to={2.3} on="crema" size={84} top={300} />
          <Headline words={[{t: "14", at: 2.45}, {t: "mensajes", at: 2.6}, {t: "sin", at: 2.9}, {t: "leer", at: 3.05, accent: true}]} from={2.4} to={3.95} on="crema" size={84} top={300} />
          <Headline words={[{t: "…por", at: 4.1}, {t: "una", at: 4.35, accent: true}, {t: "cabaña.", at: 4.55}]} from={4.0} to={5.15} on="crema" size={84} top={300} />
        </Shatter>
      ) : null}
      <Viewfinder at={5.15} dur={0.4} />
      <Splash at={IMPACT} origin={ORIGIN} />
      <BrandDrop at={IMPACT} to={ORIGIN} size={170} until={IMPACT + 0.12}>
        <div style={{width: "100%", height: "100%", borderRadius: 44, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: UI.cardShadow}}>
          <Img src={staticFile("brand/monark-mark.png")} style={{width: "72%"}} />
        </div>
      </BrandDrop>
      {/* demo con presentador: entra con un círculo desde el ícono (tiempos relativos a P0) */}
      <Sequence from={Math.round(P0 * FPS)}>
        <CircleReveal at={0} origin={{x: 540, y: 1050}} dur={0.3}>
          <DemoBackdrop />
          <PresenterStage src="clips/video2-raw.mp4" trimBefore={20 * FPS} keys={STAGE} face={{x: 620, y: 880}} faceSize={420} sourceHeight={1916} muted={false} />
        </CircleReveal>
      </Sequence>
    </AbsoluteFill>
  );
};
