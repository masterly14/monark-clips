// catalina-reel: video-catalina reeditado con Monark Motion (concepto, beat map y SFX en ./beats.ts).
// Fondo blanco liso en toda la pieza (pedido del usuario): el color lo ponen la UI, los paneles y los acentos.
import React from "react";
import {AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile} from "remotion";
import {Audio} from "@remotion/media";
import {
  BG, BlobReveal, BrandDrop, Confetti, Cursor, fonts, PresenterStage, rampAt, Shatter, SfxTrack, SlotNumber, Splash, springAt, SPRING,
  Stamp, UI, useTime, Viewfinder, WorldCamera, type CamKey, type StageKey,
} from "../kit";
import {FPS, SFX_EVENTS} from "./beats";
import {CALL_RECT, CallIntro, INTRO_S} from "./CallIntro";
import {CheckBox, Chip, clamp, enterY, GREEN, H, inW, MonarkMark, ReportDoc, typed, White} from "./ui";

// jump cuts de la versión ajustada (public/clips/catalina-tight.cuts.txt)
const JUMP_CUTS = [2.387, 5.455, 7.798, 9.244, 13.822, 20.32, 24.117, 24.743, 26.896, 31.413, 33.289, 34.251, 38.426, 42.887, 45.753];

const PROPS = ["cabana", "apartamento", "glamping"] as const;
const propSrc = (i: number) => `props/ht/${PROPS[i % 3]}.png`;

const LogoImg: React.FC<{width: number}> = ({width}) => <Img src={staticFile("brand/monark-logo.png")} style={{width, display: "block"}} />;

// =====================================================================
// 1. Gancho en cámara: propiedades junto a la cabeza (3,88–4,83)
// =====================================================================
const PropCard: React.FC<{i: number; at: number; x: number; y: number; r: number; out: number}> = ({i, at, x, y, r, out}) => {
  const {t, fps} = useTime();
  if (t < at || t >= out + 0.25) return null;
  const e = springAt(t, at, fps, SPRING.accent);
  const o = rampAt(t, out, out + 0.25, Easing.in(Easing.cubic));
  return (
    <div style={{position: "absolute", left: x - o * 320, top: y + 6 * Math.sin((t - at) * 2.3), width: 220, height: 200, background: "#fff", borderRadius: 28, boxShadow: "0 24px 40px -18px rgba(0,0,0,0.5)", transform: `scale(${e}) rotate(${r}deg)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 16}}>
      <Img src={staticFile(propSrc(i))} style={{maxWidth: "100%", maxHeight: "100%", imageRendering: "pixelated"}} />
    </div>
  );
};

// =====================================================================
// 2. Problema: el PMS que solo sincroniza, en un mundo gris (4,83–9,27)
// =====================================================================
const CAM: CamKey[] = [
  {at: 4.83, zoom: 1.45, focus: {x: 540, y: 840}},
  {at: 7.25, zoom: 1, focus: {x: 540, y: 1000}, dur: 0.45, ease: "out"},
  {at: 7.75, zoom: 1.08, focus: {x: 540, y: 1060}, dur: 1.25, ease: "inOut"},
];
export const IMPACT = 9.27;
// el reporte en la cima de la pila: mundo (540, 1180) visto con zoom 1,08 y foco (540, 1060)
const ORIGIN = {x: 540, y: 960 + (1180 - 1060) * 1.08};

const SyncCard: React.FC = () => {
  const {t} = useTime();
  const spin = (t - 4.83) * 220;
  return (
    <div style={{position: "absolute", left: 160, top: 640, width: 760, height: 400, background: "#fff", borderRadius: 36, border: `3px solid ${UI.ink}`, boxShadow: "0 30px 60px -30px rgba(0,0,0,0.5)", padding: 34, boxSizing: "border-box"}}>
      <div style={{fontFamily: fonts.mono, fontSize: 26, color: UI.mute}}>// tu PMS</div>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 34}}>
        <Img src={staticFile("brand/airbnb.png")} style={{width: 130, height: 130, borderRadius: 30}} />
        <svg width={90} height={60} viewBox="0 0 90 60"><path d="M6 20h70l-14-12M84 40H14l14 12" fill="none" stroke={UI.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12 10" strokeDashoffset={-(t - 4.83) * 60} /></svg>
        <div style={{width: 170, height: 150, borderRadius: 22, border: `3px solid ${UI.ink}`, overflow: "hidden"}}>
          <div style={{height: 36, background: UI.ink}} />
          <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, padding: 10}}>
            {Array.from({length: 15}, (_, i) => <span key={i} style={{height: 18, borderRadius: 4, background: (i * 7 + Math.floor((t - 4.83) * 3)) % 4 === 0 ? "#9A958E" : "#E2DED8"}} />)}
          </div>
        </div>
        <svg width={90} height={60} viewBox="0 0 90 60"><path d="M6 20h70l-14-12M84 40H14l14 12" fill="none" stroke={UI.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12 10" strokeDashoffset={(t - 4.83) * 60} /></svg>
        <Img src={staticFile("brand/booking.png")} style={{width: 130, height: 130, borderRadius: 30}} />
      </div>
      <div style={{display: "flex", alignItems: "center", gap: 14, marginTop: 30, fontFamily: fonts.mono, fontSize: 26, color: UI.ink}}>
        <svg width={34} height={34} viewBox="0 0 24 24" style={{transform: `rotate(${spin}deg)`}}><path d="M20 12a8 8 0 1 1-3-6.2M20 4v5h-5" fill="none" stroke={UI.ink} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" /></svg>
        sincronizando canales…
      </div>
    </div>
  );
};

const TASKS = [
  {text: "14 mensajes sin responder", at: 7.6, x: 70, y: 1110, r: -6},
  {text: "Limpieza sin confirmar", at: 7.98, x: 470, y: 1215, r: 5},
  {text: "Cobros pendientes", at: 8.3, x: 130, y: 1350, r: 3},
];

const Falling: React.FC<{at: number; x: number; y: number; r: number; children: React.ReactNode}> = ({at, x, y, r, children}) => {
  const {t, fps} = useTime();
  if (t < at) return null;
  const e = springAt(t, at, fps, {damping: 13, stiffness: 220, mass: 0.8});
  return <div style={{position: "absolute", left: x, top: y - (1 - e) * 1000, transform: `rotate(${r * e}deg)`}}>{children}</div>;
};

const GrayWorld: React.FC = () => (
  <AbsoluteFill style={{filter: "grayscale(1)"}}>
    <WorldCamera keys={CAM}>
      <div style={{position: "absolute", left: -1200, top: -1600, width: 3480, height: 5200, background: "#FFFFFF"}} />
      <div style={{position: "absolute", left: -1200, top: 1560, width: 3480, height: 1600, background: "#EFEDE9", borderTop: `6px solid ${UI.ink}`}} />
      <SyncCard />
      {TASKS.map((k) => (
        <Falling key={k.text} at={k.at} x={k.x} y={k.y} r={k.r}>
          <div style={{background: "#fff", border: `3px solid ${UI.ink}`, borderRadius: 20, padding: "22px 30px", fontFamily: fonts.sans, fontWeight: 700, fontSize: 44, color: "#4A4640", boxShadow: "0 18px 30px -18px rgba(0,0,0,0.5)", whiteSpace: "nowrap"}}>
            <span style={{fontFamily: fonts.mono, fontWeight: 500, fontSize: 22, display: "block", color: "#8A8580"}}>// a mano</span>
            {k.text}
          </div>
        </Falling>
      ))}
      {/* el motivo cae a la cima de la pila */}
      <Falling at={8.68} x={540 - 150} y={1000} r={-4}>
        <div style={{position: "relative"}}>
          <ReportDoc w={300} fill={0.25} />
          <div style={{position: "absolute", left: -40, bottom: 34, transform: "rotate(-8deg)", background: UI.ink, color: "#fff", fontFamily: fonts.mono, fontSize: 24, padding: "8px 16px", borderRadius: 10}}>a mano · fin de mes</div>
        </div>
      </Falling>
    </WorldCamera>
  </AbsoluteFill>
);

// =====================================================================
// 3. Giro: Monark (9,27–13,95)
// =====================================================================
const PlaceCard: React.FC<{at: number; y: number; label: string; title: string; done: boolean}> = ({at, y, label, title, done}) => {
  const {t, fps} = useTime();
  if (t < at) return null;
  return (
    <div style={{position: "absolute", left: 60, top: y, width: 410, background: "#fff", borderRadius: 30, padding: "24px 28px", boxShadow: done ? UI.cardShadow : "none", border: done ? "1.5px solid rgba(0,0,0,0.08)" : `4px dashed ${BG.violeta}`, ...enterY(t, at, fps, 140)}}>
      <div style={{fontFamily: fonts.mono, fontSize: 24, color: done ? GREEN : BG.violeta}}>{label}</div>
      <div style={{display: "flex", alignItems: "center", gap: 16, marginTop: 8}}>
        <span style={{fontFamily: done ? fonts.sans : fonts.serif, fontStyle: done ? "normal" : "italic", fontWeight: done ? 800 : 400, fontSize: done ? 50 : 60, color: UI.ink}}>{title}</span>
        {done ? <div style={{marginLeft: "auto"}}><CheckBox at={at + 0.15} size={44} /></div> : null}
      </div>
    </div>
  );
};

const MonarkScene: React.FC = () => {
  const {t, fps} = useTime();
  if (!inW(t, IMPACT, 14.2)) return null;
  const travel = interpolate(t, [9.55, 10.05], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const out = rampAt(t, 13.89, 14.15, Easing.in(Easing.cubic));
  const pop = springAt(t, IMPACT + 0.05, fps, SPRING.accent);
  // la placa del logo nace donde cayó la marca y sube a su sitio
  const lx = interpolate(travel, [0, 1], [ORIGIN.x - 200, 60]);
  const ly = interpolate(travel, [0, 1], [ORIGIN.y - 66, 620]);
  return (
    <AbsoluteFill style={{opacity: 1 - out, transform: `translateY(${-60 * out}px)`}}>
      <White />
      <div style={{position: "absolute", left: lx, top: ly, background: "#fff", borderRadius: 30, padding: "24px 40px", boxShadow: UI.cardShadow, border: "1.5px solid rgba(0,0,0,0.08)", transform: `scale(${0.7 + 0.3 * pop})`, transformOrigin: "0 0"}}>
        <LogoImg width={320} />
      </div>
      <PlaceCard at={11.31} y={860} label="// primer PMS de" title="Colombia" done />
      <PlaceCard at={13.05} y={1110} label="// potencialmente" title="Latinoamérica" done={false} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 4. La tarjeta «Tu operación»: nace en 13,9 y vuelve en 38,4 (mismo objeto, nuevos estados)
// =====================================================================
const Toggle: React.FC<{at: number}> = ({at}) => {
  const {t, fps} = useTime();
  const on = springAt(t, at, fps, SPRING.accent);
  return (
    <div style={{width: 108, height: 60, borderRadius: 60, background: on > 0.5 ? GREEN : "#D9D4CC", position: "relative", flexShrink: 0}}>
      <div style={{position: "absolute", top: 6, left: 6 + 48 * on, width: 48, height: 48, borderRadius: 48, background: "#fff", boxShadow: "0 3px 8px rgba(0,0,0,0.25)"}} />
    </div>
  );
};

const OpsRow: React.FC<{label: string; on: number; enter?: number}> = ({label, on, enter}) => {
  const {t, fps} = useTime();
  const e = enter != null ? springAt(t, enter, fps, SPRING.card) : 1;
  if (enter != null && t < enter) return null;
  return (
    <div style={{display: "flex", alignItems: "center", gap: 22, padding: "26px 0", borderBottom: `2px solid ${UI.line}`, opacity: Math.min(1, e * 1.6), transform: `translateX(${(1 - e) * 60}px)`}}>
      <span style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 42, color: UI.ink}}>{label}</span>
      <span style={{marginLeft: "auto", fontFamily: fonts.mono, fontSize: 24, color: GREEN, opacity: rampAt(t, on + 0.1, on + 0.3)}}>automático</span>
      <Toggle at={on} />
    </div>
  );
};

const Section: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const {t} = useTime();
  if (!inW(t, from, to + 0.2)) return null;
  const i = rampAt(t, from, from + 0.22);
  const o = rampAt(t, to, to + 0.18, Easing.in(Easing.cubic));
  return <div style={{position: "absolute", left: 44, right: 44, top: 150, bottom: 30, opacity: i * (1 - o), transform: `translateY(${(1 - i) * 50 - o * 60}px)`}}>{children}</div>;
};

const Bubble: React.FC<{side: "in" | "out"; at: number; children: React.ReactNode}> = ({side, at, children}) => {
  const {t, fps} = useTime();
  if (t < at) return null;
  const e = springAt(t, at, fps, SPRING.accent);
  return (
    <div style={{display: "flex", justifyContent: side === "in" ? "flex-start" : "flex-end", marginBottom: 18}}>
      <div style={{maxWidth: "84%", background: side === "in" ? "#F1EFEC" : "#DCF8C6", borderRadius: 28, borderBottomLeftRadius: side === "in" ? 6 : 28, borderBottomRightRadius: side === "out" ? 6 : 28, padding: "20px 26px", fontFamily: fonts.sans, fontWeight: 500, fontSize: 36, lineHeight: 1.3, color: UI.ink, transform: `scale(${0.6 + 0.4 * e})`, transformOrigin: side === "in" ? "0 100%" : "100% 100%", opacity: Math.min(1, e * 1.8)}}>
        {children}
      </div>
    </div>
  );
};

const OWNERS = [
  {name: "Cabaña Roble", at: 42.05},
  {name: "Apto 201", at: 42.22},
  {name: "Casa Lago", at: 42.39},
];
const MODULES = [
  {name: "Check-in", at: 43.45},
  {name: "Cobros", at: 43.7},
  {name: "Contabilidad", at: 43.95},
  {name: "Facturación", at: 44.2},
  {name: "Calendario", at: 44.45},
];
const STAMP_AT = 44.7;
const STAMP_POS = {x: 720, y: 1330};

const OpsCard: React.FC = () => {
  const {t, fps} = useTime();
  const a = inW(t, 13.89, 15.9);
  const b = inW(t, 38.38, 45.95);
  if (!a && !b) return null;
  // fase A: entra y sale hacia arriba para dejar la dividida
  const exitA = a ? rampAt(t, 15.52, 15.85, Easing.in(Easing.cubic)) : 0;
  const enter = a ? enterY(t, 13.95, fps, 260) : enterY(t, 38.4, fps, 260);
  const head =
    a ? {bg: BG.violeta, fg: "#fff", label: "operación"} :
    t < 40.74 ? {bg: BG.menta, fg: UI.ink, label: "mensajes"} :
    t < 43.21 ? {bg: BG.amarillo, fg: UI.ink, label: "reportes"} :
    {bg: BG.cobalto, fg: "#fff", label: "todo"};
  // reporte: se llena, se dobla en sobre y sale volando
  const fill = rampAt(t, 40.8, 41.4, Easing.out(Easing.cubic));
  const fold = rampAt(t, 41.44, 41.78, Easing.inOut(Easing.cubic));
  const fly = rampAt(t, 41.8, 42.1, Easing.in(Easing.cubic));
  const day = t < 40.86 ? "28" : t < 40.95 ? "29" : "30";
  return (
    <div style={{position: "absolute", left: 60, top: 560, width: 960, height: 900, ...enter, transform: `${enter.transform} translateY(${-560 * exitA}px) scale(${1 - 0.4 * exitA})`, opacity: enter.opacity * (1 - exitA)}}>
      <div style={{position: "absolute", inset: 0, background: "#fff", borderRadius: 40, boxShadow: UI.cardShadow, border: "1.5px solid rgba(0,0,0,0.08)", overflow: "hidden"}}>
        <div style={{height: 120, display: "flex", alignItems: "center", gap: 20, padding: "0 36px", background: head.bg, color: head.fg}}>
          <MonarkMark size={70} />
          <span style={{fontFamily: fonts.sans, fontWeight: 800, fontSize: 42}}>Tu operación</span>
          <span style={{marginLeft: "auto", fontFamily: fonts.mono, fontSize: 26, background: "rgba(255,255,255,0.85)", color: UI.ink, padding: "8px 18px", borderRadius: 999}}>// {head.label}</span>
        </div>
        {/* A · todo pasa a automático */}
        <Section from={13.95} to={16.0}>
          <OpsRow on={14.07} label="Mensajes a huéspedes" />
          <OpsRow on={14.3} label="Limpiezas" />
          <OpsRow on={14.55} label="Cobros" />
          <OpsRow on={14.76} label="Reportes a propietarios" />
        </Section>
        {/* B · mensaje al huésped */}
        <Section from={38.45} to={40.74}>
          <div style={{display: "flex", alignItems: "center", gap: 16, marginBottom: 26}}>
            <div style={{width: 70, height: 70, borderRadius: 70, border: `3px solid ${UI.ink}`, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "flex-end", background: "#fff"}}>
              <Img src={staticFile("props/ht/huesped.png")} style={{height: "88%", imageRendering: "pixelated"}} />
            </div>
            <div>
              <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 34}}>Laura · huésped</div>
              <div style={{fontFamily: fonts.mono, fontSize: 22, color: GREEN}}>{inW(t, 39.3, 39.9) ? "Monark está escribiendo…" : "WhatsApp"}</div>
            </div>
          </div>
          <Bubble side="in" at={38.6}>¡Hola! ¿A qué hora es el check-in?</Bubble>
          {t >= 39.3 ? (
            <div style={{display: "flex", justifyContent: "flex-end"}}>
              <div style={{maxWidth: "86%", background: "#DCF8C6", borderRadius: 28, borderBottomRightRadius: 6, padding: "20px 26px", fontFamily: fonts.sans, fontWeight: 500, fontSize: 36, lineHeight: 1.3, color: UI.ink}}>
                {typed("¡Hola, Laura! Desde las 3:00 p. m. Te esperamos.", t, 39.3, 39.9)}
                {t >= 39.98 ? <div style={{textAlign: "right", fontFamily: fonts.mono, fontSize: 24, color: "#34B7F1", marginTop: 6, fontWeight: 500}}>respondido ✓✓</div> : null}
              </div>
            </div>
          ) : null}
        </Section>
        {/* C · el reporte de fin de mes (pago del motivo) */}
        <Section from={40.74} to={43.21}>
          <div style={{display: "flex", gap: 40}}>
            <div style={{width: 400}}>
              <div style={{fontFamily: fonts.mono, fontSize: 26, color: UI.mute}}>// cierre de mes</div>
              <div style={{position: "relative", marginTop: 10, height: 290}}>
                <Img src={staticFile("props/ht/calendario.png")} style={{width: 400, imageRendering: "pixelated"}} />
                <div style={{position: "absolute", left: 250, top: 150, background: UI.ink, color: "#fff", borderRadius: 16, padding: "6px 18px", fontFamily: fonts.mono, fontWeight: 500, fontSize: 64, transform: `rotate(-6deg) scale(${1 + 0.08 * Math.max(0, 1 - Math.abs(t - 40.95) * 8)})`}}>{day}</div>
              </div>
              {OWNERS.map((o) => (
                <div key={o.name} style={{display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: `2px solid ${UI.line}`, opacity: rampAt(t, o.at - 0.1, o.at + 0.05), transform: `translateX(${(1 - rampAt(t, o.at - 0.1, o.at + 0.1)) * 40}px)`}}>
                  <CheckBox at={o.at} size={40} />
                  <span style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 34}}>{o.name}</span>
                </div>
              ))}
            </div>
            <div style={{position: "relative", width: 420, height: 560}}>
              <div style={{position: "absolute", left: 40 + 520 * fly, top: 30 - 260 * fly, transform: `rotate(${-3 + 20 * fly}deg) scale(${1 - 0.5 * fly})`, opacity: 1 - rampAt(fly, 0.7, 1)}}>
                <ReportDoc w={340} fill={fill} fold={fold} />
              </div>
              {t >= 42.97 ? (
                <div style={{position: "absolute", left: 0, top: 330, width: 420, background: `${GREEN}1A`, border: `3px solid ${GREEN}`, borderRadius: 26, padding: "22px 26px", transform: `scale(${springAt(t, 42.97, fps, SPRING.accent)})`}}>
                  <div style={{fontFamily: fonts.sans, fontWeight: 800, fontSize: 40, color: GREEN}}>✓ Enviado solo</div>
                  <div style={{fontFamily: fonts.mono, fontSize: 24, color: UI.ink, marginTop: 6}}>3 propietarios · fin de mes</div>
                </div>
              ) : null}
            </div>
          </div>
        </Section>
        {/* D · y un montón más */}
        <Section from={43.21} to={46.2}>
          {MODULES.map((m) => (
            <div key={m.name} style={{display: "flex", alignItems: "center", gap: 22, padding: "22px 0", borderBottom: `2px solid ${UI.line}`, opacity: rampAt(t, m.at - 0.15, m.at)}}>
              <CheckBox at={m.at} />
              <span style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 42, color: UI.ink}}>{m.name}</span>
              <span style={{marginLeft: "auto", fontFamily: fonts.mono, fontSize: 24, color: GREEN, opacity: rampAt(t, m.at + 0.1, m.at + 0.3)}}>automático</span>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
};

// =====================================================================
// 5. Crecer (dividida, 15,52–22,29)
// =====================================================================
const AUTO_CHIPS = [
  {text: "mensajes", at: 16.4, x: 610, y: 560, r: -3},
  {text: "limpiezas", at: 16.9, x: 640, y: 680, r: 2},
  {text: "reportes", at: 17.4, x: 615, y: 800, r: -2},
];
const TILE_AT = [15.95, 20.54, 20.7, 20.86, 21.02, 21.18, 21.34, 21.51];
const Growth: React.FC = () => {
  const {t, fps} = useTime();
  if (!inW(t, 15.52, 22.6)) return null;
  const i = rampAt(t, 15.6, 15.9);
  const o = rampAt(t, 22.29, 22.6, Easing.in(Easing.cubic));
  const cap = interpolate(springAt(t, 19.04, fps, SPRING.soft), [0, 1], [0.32, 0.92]);
  return (
    <AbsoluteFill style={{opacity: i * (1 - o)}}>
      <White />
      <div style={{position: "absolute", left: 80, top: 330, fontFamily: fonts.mono, fontSize: 28, color: UI.mute}}>// capacidad operativa</div>
      <div style={{position: "absolute", left: 80, top: 378, width: 920, height: 40, borderRadius: 40, background: "#ECE7DF", overflow: "hidden"}}>
        <div style={{height: "100%", width: `${cap * 100}%`, background: BG.violeta, borderRadius: 40}} />
      </div>
      {t >= 19.72 ? (
        <div style={{position: "absolute", left: 80 + 920 * cap - 70, top: 432, fontFamily: fonts.sans, fontWeight: 800, fontSize: 44, color: BG.violeta, transform: `scale(${springAt(t, 19.72, fps, SPRING.accent)})`}}>↑</div>
      ) : null}
      {AUTO_CHIPS.map((c) => (
        <Chip key={c.text} at={c.at} x={c.x} y={c.y} rotate={c.r} size={32} until={20.3}>
          <span style={{color: GREEN}}>✓</span> {c.text}
        </Chip>
      ))}
      {TILE_AT.map((at, k) => {
        if (t < at) return null;
        const e = springAt(t, at, fps, SPRING.accent);
        const col = k % 4;
        const row = Math.floor(k / 4);
        // la primera propiedad empieza grande (tú te enfocas) y se encoge a su sitio cuando empiezan a sumarse
        const big = k === 0 ? 1 - interpolate(t, [20.25, 20.6], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}) : 0;
        const size = 215 + 205 * big;
        return (
          <div key={k} style={{position: "absolute", left: 80 + col * 235 + 90 * big, top: 500 + row * 235 - 10 * big, width: size, height: size, background: "#fff", borderRadius: 28, border: "1.5px solid rgba(0,0,0,0.1)", boxShadow: "0 18px 30px -20px rgba(0,0,0,0.5)", transform: `scale(${e}) rotate(${(k % 2 ? 2 : -2) * (1 - e)}deg)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6}}>
            <Img src={staticFile(propSrc(k))} style={{width: size * 0.79, imageRendering: "pixelated"}} />
            <span style={{fontFamily: fonts.mono, fontSize: 20, color: UI.mute}}>propiedad {k + 1}</span>
            <span style={{position: "absolute", right: 14, top: 14, width: 16, height: 16, borderRadius: 16, background: UI.ok}} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. Oferta (dividida, 26,93–33,5)
// =====================================================================
const Offer: React.FC = () => {
  const {t, fps} = useTime();
  if (!inW(t, 26.93, 33.85)) return null;
  const i = rampAt(t, 26.95, 27.25);
  const o = rampAt(t, 33.5, 33.8, Easing.in(Easing.cubic));
  const panel = interpolate(t, [28.62, 28.92], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const gratis = t >= 31.46;
  const panelBg = gratis ? BG.amarillo : BG.violeta;
  return (
    <AbsoluteFill style={{opacity: i * (1 - o)}}>
      <White />
      <Chip at={28.1} x={80} y={430} bg={BG.amarillo} size={38} until={28.62}>3 meses</Chip>
      {t >= 28.62 ? (
        <div style={{position: "absolute", left: 40, top: 110, width: 1000, height: 900, borderRadius: 44, background: panelBg, clipPath: `circle(${panel * 1500}px at 200px 340px)`, overflow: "hidden"}}>
          {!gratis ? (
            <>
              <div style={{position: "absolute", left: 60, top: 70, fontFamily: fonts.mono, fontSize: 32, color: "#fff", opacity: rampAt(t, 29.3, 29.5)}}>// de descuento en tu suscripción</div>
              <div style={{position: "absolute", left: 40, top: 120}}><SlotNumber text="30%" at={28.8} size={320} color="#fff" /></div>
              <Chip at={29.45} x={60} y={560} bg="#FFD34D" size={40}>tus 3 primeros meses</Chip>
              <Chip at={30.2} x={60} y={690} bg="#fff" size={34}>en tu suscripción de Monark</Chip>
            </>
          ) : (
            <>
              <div style={{position: "absolute", left: 60, top: 70, fontFamily: fonts.mono, fontSize: 32, color: UI.ink}}>// implementación</div>
              <div style={{position: "absolute", left: 60, top: 130, width: 880, background: "#fff", borderRadius: 34, padding: "40px 44px", boxShadow: UI.cardShadow, ...enterY(t, 31.5, fps, 140)}}>
                <div style={{fontFamily: fonts.sans, fontWeight: 800, fontSize: 76, letterSpacing: "-0.03em", lineHeight: 1}}>Implementación</div>
                <div style={{display: "flex", alignItems: "center", gap: 18, marginTop: 26}}>
                  <span style={{fontFamily: fonts.mono, fontSize: 30, color: UI.mute}}>costo</span>
                  <span style={{position: "relative", fontFamily: fonts.mono, fontSize: 40, color: UI.ink}}>
                    $ ——
                    <span style={{position: "absolute", left: -6, top: "52%", height: 6, borderRadius: 6, width: `calc(${rampAt(t, 32.84, 33.1) * 100}% + 12px)`, background: BG.coral}} />
                  </span>
                </div>
              </div>
              <Stamp text="Gratis." at={32.84} x={600} y={620} size={150} />
              <Confetti at={32.9} origin={{x: 600, y: 620}} seed="gratis" />
            </>
          )}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// =====================================================================
// 7. Únete a los operadores (33,5–38,38)
// =====================================================================
const Operators: React.FC = () => {
  const {t, fps} = useTime();
  if (!inW(t, 33.5, 38.7)) return null;
  const shrink = interpolate(t, [36.35, 36.75], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const o = rampAt(t, 38.38, 38.65, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill>
      <White />
      <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${1 - 0.4 * shrink - 0.2 * o})`, transformOrigin: "540px 580px", opacity: 1 - o}}>
        {Array.from({length: 20}, (_, k) => {
          const at = 34.0 + k * 0.065;
          if (t < at) return null;
          const e = springAt(t, at, fps, SPRING.accent);
          const ck = 36.61 + k * 0.05;
          return (
            <div key={k} style={{position: "absolute", left: 79 + (k % 5) * 188, top: 580 + Math.floor(k / 5) * 188, width: 170, height: 170, background: "#fff", borderRadius: 26, border: `${t >= ck ? 4 : 1.5}px solid ${t >= ck ? GREEN : "rgba(0,0,0,0.1)"}`, boxShadow: "0 14px 26px -18px rgba(0,0,0,0.5)", transform: `scale(${e})`, display: "flex", alignItems: "center", justifyContent: "center"}}>
              <Img src={staticFile(propSrc(k + 1))} style={{width: 130, imageRendering: "pixelated"}} />
              {t >= ck ? <div style={{position: "absolute", right: -12, top: -12}}><CheckBox at={ck} size={44} /></div> : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 8. Tarjeta final + pago del motivo (45,72–49,7)
// =====================================================================
const EndCard: React.FC = () => {
  const {t, fps} = useTime();
  if (t < 45.72) return null;
  const sweep = rampAt(t, 45.85, 46.2, Easing.out(Easing.cubic));
  const center = interpolate(t, [47.1, 47.6], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const envE = springAt(t, 46.0, fps, SPRING.card);
  const pulse = 1 + 0.03 * Math.max(0, Math.sin((t - 46.2) * 5));
  return (
    <BlobReveal at={45.72} origin={STAMP_POS} outline={BG.violeta}>
      <White />
      <div style={{position: "absolute", left: 540 - 300, top: 190, width: 600, clipPath: `inset(0 ${100 - sweep * 100}% 0 0)`}}>
        <LogoImg width={600} />
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: fonts.sans, fontWeight: 700, fontSize: 52, letterSpacing: "-0.02em", color: UI.ink, opacity: rampAt(t, 46.05, 46.35)}}>
        Toda tu operación, <span style={{fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 400, fontSize: 70, color: BG.violeta}}>automatizada</span>
      </div>
      {/* el reporte llega como sobre enviado (pago del motivo) */}
      <div style={{position: "absolute", left: interpolate(center, [0, 1], [700, 540 - 230]), top: interpolate(center, [0, 1], [1040, 600]) + (1 - envE) * 300, transform: `rotate(${interpolate(center, [0, 1], [7, -3])}deg) scale(${interpolate(center, [0, 1], [0.62, 1])})`, transformOrigin: "50% 50%", opacity: Math.min(1, envE * 1.5)}}>
        <ReportDoc w={460} fold={1} sent sentAt={47.55} />
      </div>
      {t >= 47.7 ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 1215, textAlign: "center", fontFamily: fonts.mono, fontSize: 28, color: GREEN, opacity: rampAt(t, 47.7, 47.95)}}>
          // reportes a propietarios · fin de mes
        </div>
      ) : null}
      <div style={{position: "absolute", left: 540 - 300, top: 1400, width: 600, height: 120, borderRadius: 120, background: UI.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: fonts.sans, fontWeight: 800, fontSize: 46, transform: `scale(${(t >= 46.55 && t < 46.7 ? 0.96 : 1) * pulse})`, opacity: rampAt(t, 46.2, 46.4)}}>
        Link en el perfil <span style={{fontSize: 52}}>→</span>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 1560, textAlign: "center", fontFamily: fonts.mono, fontSize: 26, color: UI.ink, opacity: 0.7 * rampAt(t, 46.7, 47.0)}}>
        30 % dcto. 3 primeros meses · implementación gratis
      </div>
      <Cursor path={[{x: 960, y: 1760, at: 46.2}, {x: 700, y: 1470, at: 46.52}]} clicks={[46.55]} />
    </BlobReveal>
  );
};

// =====================================================================
// Presentador: un solo video que cambia de forma (sin burbuja)
// =====================================================================
// Cara grande: 0–4,8 (full) · 10,3–13,9 (ventana) · 15,5–22,3 (dividida) · 22,3–26,9 (full) · 26,9–33,5 (dividida) · 36,4–38,4 (ventana) · 45,7–47 (ventana)
const STAGE: StageKey[] = [
  {at: 0, shot: {mode: "window", x: CALL_RECT.x, y: CALL_RECT.y, w: CALL_RECT.w, h: CALL_RECT.h}},
  {at: 0.06, shot: {mode: "full"}, dur: 0.55},
  {at: 4.83, shot: {mode: "hidden"}, dur: 0.45},
  {at: 10.3, shot: {mode: "window", x: 500, y: 840, w: 520, h: 760, rotate: 3}},
  {at: 13.89, shot: {mode: "hidden"}, dur: 0.45},
  {at: 15.52, shot: {mode: "split", ratio: 0.52}},
  {at: 22.29, shot: {mode: "full"}},
  {at: 26.93, shot: {mode: "split", ratio: 0.55}},
  {at: 33.5, shot: {mode: "hidden"}, dur: 0.45},
  {at: 36.4, shot: {mode: "window", x: 270, y: 1090, w: 540, h: 760, rotate: -3}},
  {at: 38.38, shot: {mode: "hidden"}, dur: 0.45},
  {at: 45.72, shot: {mode: "window", x: 300, y: 500, w: 480, h: 680, rotate: -2}},
  {at: 46.98, shot: {mode: "hidden"}, dur: 0.45},
];

// =====================================================================
export const CatalinaReel: React.FC = () => {
  const {t} = useTime();
  return (
    <AbsoluteFill style={{background: "#FFFFFF"}}>
      {/* ---------- capa de gráfica (debajo del presentador) ---------- */}
      {inW(t, 4.6, IMPACT + 1.6) ? (
        <>
          {t >= IMPACT - 0.05 ? (
            <BlobReveal at={IMPACT + 0.03} origin={ORIGIN} outline={BG.violeta}>
              <MonarkScene />
            </BlobReveal>
          ) : null}
          <Shatter at={IMPACT} origin={ORIGIN} crackColor={BG.amarillo}>
            <GrayWorld />
            <H w={[["Un", 5.76], ["PMS", 5.93], ["necesita…", 6.28, true]]} from={5.7} to={7.19} on="piedra" />
            <H w={[["Más", 7.28], ["que", 7.6], ["sincronizar", 7.98, true], ["canales", 8.68]]} from={7.19} to={IMPACT} on="piedra" exit={false} />
          </Shatter>
        </>
      ) : null}
      {inW(t, IMPACT + 1.6, 14.2) ? <MonarkScene /> : null}
      <OpsCard />
      <Growth />
      <Offer />
      <Operators />
      <EndCard />

      {/* ---------- presentador ---------- */}
      <PresenterStage src="clips/catalina-tight.mp4" keys={STAGE} face={{x: 600, y: 840}} faceSize={360} sourceHeight={1920} muted jumpCuts={JUMP_CUTS} />

      {/* ---------- encima del presentador ---------- */}
      <PropCard i={0} at={3.88} x={50} y={650} r={-4} out={4.83} />
      <PropCard i={1} at={4.06} x={70} y={880} r={3} out={4.83} />
      <PropCard i={2} at={4.24} x={50} y={1110} r={-2} out={4.83} />
      <Chip at={26.05} x={70} y={760} bg={UI.ink} color="#fff" size={34} rotate={-3} until={26.93}>link en el perfil →</Chip>

      {/* titulares */}
      <H w={[["Nada", 0.23], ["me", 0.61], ["llena", 0.65], ["más", 0.88], ["de", 1.07], ["emoción", 1.16, true]]} from={0.2} to={2.42} on="presentador" top={210} width={920} />
      <H w={[["¿Operas", 3.28], ["rentas", 3.88], ["cortas?", 4.24, true]]} from={2.42} to={4.83} on="presentador" top={210} width={920} />
      <H w={[["Monark", 9.32, true], ["es…", 9.86]]} from={IMPACT} to={10.1} size={104} />
      <H w={[["El", 10.11], ["primer", 10.32], ["PMS", 10.71], ["de", 11.09], ["Colombia", 11.31, true]]} from={10.1} to={12.1} />
      <H w={[["Potencialmente,", 12.12], ["Latinoamérica", 13.05, true]]} from={12.1} to={13.89} />
      <H w={[["Automatiza", 14.07], ["toda", 14.76, true], ["la", 14.84], ["operación", 14.95]]} from={13.89} to={15.52} />
      <H w={[["Tú", 15.58], ["te", 17.79], ["enfocas…", 17.97, true]]} from={15.55} to={18.6} top={150} />
      <H w={[["Más", 18.67], ["capacidad", 19.04, true]]} from={18.6} to={20.38} top={150} />
      <H w={[["Más", 20.38], ["propiedades", 21.51, true]]} from={20.38} to={22.29} top={150} />
      <H w={[["No", 22.54], ["te", 22.66], ["cuesta", 22.97], ["un", 23.23], ["ojo", 23.34, true], ["de", 23.64], ["la", 23.74], ["cara", 23.92]]} from={22.3} to={24.29} on="presentador" top={210} width={920} />
      <H w={[["Quiero", 24.54], ["que", 24.84], ["lo", 24.99], ["pruebes", 25.13, true]]} from={24.29} to={26.93} on="presentador" top={210} width={920} />
      <H w={[["Encuentra", 27.12], ["una", 27.65], ["oferta", 27.83, true]]} from={26.95} to={28.62} top={150} />
      <H w={[["Únete", 33.9], ["a", 34.26], ["los", 34.44], ["operadores", 35.03, true]]} from={33.5} to={36.43} />
      <H w={[["que", 36.43], ["automatizaron", 36.61, true], ["todo", 37.31]]} from={36.43} to={38.38} />
      <H w={[["Contesta", 38.67], ["al", 39.7], ["huésped", 39.8, true]]} from={38.38} to={40.74} />
      <H w={[["Envía", 40.74], ["los", 41.3], ["reportes", 41.44, true]]} from={40.74} to={43.21} />
      <H w={[["Y", 43.21], ["un", 43.28], ["montón", 43.4, true], ["más", 44.45]]} from={43.21} to={45.72} />
      {t < 45.95 ? <Stamp text="Resuelto." at={STAMP_AT} x={STAMP_POS.x} y={STAMP_POS.y} size={110} /> : null}
      {t >= STAMP_AT && t < 45.9 ? <Confetti at={STAMP_AT + 0.05} origin={STAMP_POS} seed="resuelto" count={28} /> : null}

      {/* la ruptura */}
      <Viewfinder at={9.03} dur={0.24} />
      <Splash at={IMPACT} origin={ORIGIN} colors={[BG.amarillo, BG.violeta, BG.coral, BG.cobalto, GREEN]} />
      <BrandDrop at={IMPACT} to={ORIGIN} size={170} until={IMPACT + 0.15} trail={BG.amarillo}>
        <MonarkMark size={170} />
      </BrandDrop>

      {/* ---------- audio ---------- */}
      <Audio src={staticFile("clips/catalina-tight-voz.wav")} />
      <SfxTrack events={SFX_EVENTS} />
    </AbsoluteFill>
  );
};

// =====================================================================
// Pieza completa: intro de la llamada + video largo
// =====================================================================
export const CatalinaReelFull: React.FC = () => (
  <AbsoluteFill style={{background: "#FFFFFF"}}>
    <Sequence durationInFrames={Math.round(INTRO_S * FPS)} name="intro llamada">
      <CallIntro />
    </Sequence>
    <Sequence from={Math.round(INTRO_S * FPS)} name="video largo">
      <CatalinaReel />
    </Sequence>
  </AbsoluteFill>
);
