// zapata-reel: video2 reeditado con Monark Motion (concepto, beat map y SFX en ./beats.ts).
import React from "react";
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from "remotion";
import {Audio} from "@remotion/media";
import {
  BG, BlobReveal, BrandDrop, Character, CircleReveal, Confetti, Cursor, fonts, Headline, HeroBurst, MotifSticker, Phone,
  PresenterStage, rampAt, Shatter, SfxTrack, SlotNumber, Splash, springAt, SPRING, Stamp, UI, useTime, Viewfinder, WorldCamera,
  type BgName, type CamKey, type HWord, type StageKey,
} from "../kit";
import {SFX_EVENTS, FPS} from "./beats";
import {CALL_RECT, CallIntro, INTRO_S, MOTIF_PLANT} from "./CallIntro";
import {Sequence} from "remotion";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const GREEN = "#128C4A";
const WA_BLUE = "#34B7F1";

// jump cuts de la versión ajustada (pausas recortadas): ver public/clips/video2-tight.cuts.txt
const JUMP_CUTS = [2.96, 7.59, 9.46, 10.12, 10.44, 11.71, 15.42, 16.24, 16.53, 18.04, 21.54, 22.42, 25.68, 26.71, 28.8, 29.71, 34.25, 41.85, 45.22, 47.51, 49.35, 54.66, 56.24];

// ---------- helpers ----------
const inW = (t: number, a: number, b: number) => t >= a && t < b;
/** Titular con los tamaños de la skill: sans 84 (104 en gancho y cierre), acento 1,25×. */
const H: React.FC<{w: [string, number, boolean?][]; from: number; to: number; on: BgName | "presentador"; size?: number; top?: number; width?: number; exit?: boolean}> = ({
  w, from, to, on, size = 84, top = 300, width = 760, exit = true,
}) => {
  const words: HWord[] = w.map(([t, at, accent]) => ({t, at, accent}));
  return <Headline words={words} from={from} to={to} on={on} size={size} accentSize={Math.round(size * 1.25)} top={top} width={width} exit={exit} />;
};
const Dots: React.FC = () => <AbsoluteFill style={{backgroundImage: "radial-gradient(rgba(0,0,0,0.07) 2px, transparent 2px)", backgroundSize: "28px 28px"}} />;

const enterY = (t: number, at: number, fps: number, dist = 120) => {
  const e = springAt(t, at, fps, SPRING.card);
  return {opacity: Math.min(1, e * 1.6), transform: `translateY(${(1 - e) * dist}px) scale(${0.94 + 0.06 * e})`};
};

const Chip: React.FC<{at: number; x: number; y: number; children: React.ReactNode; bg?: string; color?: string; rotate?: number; size?: number; until?: number}> = ({
  at, x, y, children, bg = "#fff", color = UI.ink, rotate = 0, size = 30, until,
}) => {
  const {t, fps} = useTime();
  if (t < at || (until != null && t >= until)) return null;
  const e = springAt(t, at, fps, SPRING.accent);
  const drift = 6 * Math.sin((2 * Math.PI * (t - at)) / 2.2);
  return (
    <div style={{position: "absolute", left: x, top: y + drift, transform: `scale(${e}) rotate(${rotate}deg)`, transformOrigin: "0 50%", background: bg, color, fontFamily: fonts.mono, fontWeight: 500, fontSize: size, padding: `${size * 0.4}px ${size * 0.7}px`, borderRadius: 999, boxShadow: "0 18px 34px -16px rgba(0,0,0,0.5)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 12}}>
      {children}
    </div>
  );
};

const LogoPlate: React.FC<{width: number; style?: React.CSSProperties}> = ({width, style}) => (
  <div style={{position: "absolute", background: "#fff", borderRadius: 36, padding: "26px 40px", boxShadow: UI.cardShadow, ...style}}>
    <Img src={staticFile("brand/monark-logo.png")} style={{width, display: "block"}} />
  </div>
);

const Avatar: React.FC<{size?: number}> = ({size = 64}) => (
  <div style={{width: size, height: size, borderRadius: size, background: "#fff", border: `3px solid ${UI.ink}`, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "flex-end", flexShrink: 0}}>
    <Img src={staticFile("props/ht/huesped.png")} style={{height: "88%", imageRendering: "pixelated"}} />
  </div>
);

const Bubble: React.FC<{side: "in" | "out"; at: number; children: React.ReactNode; tag?: string; color?: string}> = ({side, at, children, tag, color}) => {
  const {t, fps} = useTime();
  if (t < at) return null;
  const e = springAt(t, at, fps, SPRING.accent);
  return (
    <div style={{display: "flex", justifyContent: side === "in" ? "flex-start" : "flex-end", marginBottom: 18}}>
      <div style={{maxWidth: "82%", background: color ?? (side === "in" ? "#fff" : "#DCF8C6"), borderRadius: 26, borderBottomLeftRadius: side === "in" ? 6 : 26, borderBottomRightRadius: side === "out" ? 6 : 26, padding: "18px 22px", fontFamily: fonts.sans, fontWeight: 500, fontSize: 28, lineHeight: 1.3, color: UI.ink, boxShadow: "0 6px 14px -8px rgba(0,0,0,0.3)", transform: `scale(${0.6 + 0.4 * e})`, transformOrigin: side === "in" ? "0 100%" : "100% 100%", opacity: Math.min(1, e * 1.8)}}>
        {tag ? <div style={{fontFamily: fonts.mono, fontSize: 20, color: GREEN, marginBottom: 6}}>{tag}</div> : null}
        {children}
      </div>
    </div>
  );
};

const TypingDots: React.FC<{from: number; to: number; side?: "in" | "out"}> = ({from, to, side = "out"}) => {
  const {t} = useTime();
  if (!inW(t, from, to)) return null;
  return (
    <div style={{display: "flex", justifyContent: side === "out" ? "flex-end" : "flex-start", marginBottom: 18}}>
      <div style={{background: side === "out" ? "#DCF8C6" : "#fff", borderRadius: 26, padding: "20px 24px", display: "flex", gap: 10}}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{width: 14, height: 14, borderRadius: 14, background: "#6B8F6B", opacity: 0.35 + 0.65 * Math.max(0, Math.sin((t - from) * 9 - i * 0.9))}} />
        ))}
      </div>
    </div>
  );
};

const typed = (text: string, t: number, a: number, b: number) => text.slice(0, Math.floor(interpolate(t, [a, b], [0, text.length], clamp)));

// =====================================================================
// 1. Gancho — chat del huésped con el asistente (3,56–7,9)
// =====================================================================
const GuestChat: React.FC = () => {
  const {t, fps} = useTime();
  if (!inW(t, 3.56, 8.0)) return null;
  const out = rampAt(t, 7.2, 7.75, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: BG.crema}} />
      <Dots />
      <div style={{position: "absolute", inset: 0, ...enterY(t, 3.8, fps, 300), transformOrigin: "60% 60%"}}>
        <div style={{position: "absolute", inset: 0, transform: `translate(${-260 * out}px, ${-380 * out}px) scale(${1 - 0.75 * out}) rotate(${-8 * out}deg)`, transformOrigin: "590px 1100px", opacity: 1 - out}}>
          <Phone x={330} y={560} w={520} h={1040} rotate={3}>
            <div style={{background: "#fff", padding: "70px 26px 22px", display: "flex", alignItems: "center", gap: 16, borderBottom: `2px solid ${UI.line}`}}>
              <Avatar />
              <div>
                <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 30}}>Laura · huésped</div>
                <div style={{fontFamily: fonts.mono, fontSize: 20, color: GREEN}}>● asistente IA activo</div>
              </div>
            </div>
            <div style={{padding: 26}}>
              <TypingDots side="in" from={4.3} to={5.39} />
              <Bubble side="in" at={5.39}>¡Hola! ¿A qué hora es el check-in?</Bubble>
              <TypingDots from={5.62} to={6.25} />
              <Bubble side="out" at={6.25} tag="// asistente IA">¡Hola, Laura! Desde las 3:00 p. m. Te dejamos la llave lista.</Bubble>
            </div>
          </Phone>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 2. La prueba: +17 % (13,36–16,14, mitad superior de la dividida)
// =====================================================================
const Proof: React.FC = () => {
  const {t, fps} = useTime();
  if (!inW(t, 13.36, 16.3)) return null;
  const b1 = springAt(t, 14.0, fps, SPRING.soft);
  const b2 = springAt(t, 14.35, fps, SPRING.soft);
  const lab = rampAt(t, 14.51, 14.7);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: BG.menta}} />
      <Dots />
      <div style={{position: "absolute", left: 80, top: 250, fontFamily: fonts.mono, fontSize: 30, color: GREEN, opacity: lab}}>// satisfacción de huéspedes</div>
      <div style={{position: "absolute", left: 70, top: 300}}>
        <SlotNumber text="+17%" at={13.93} size={230} color={UI.ink} />
      </div>
      {/* barras antes / después */}
      {[{label: "antes", h: 300, e: b1, c: "#9DB8A8"}, {label: "con WhatsApp", h: 351, e: b2, c: GREEN}].map((b, i) => (
        <div key={i} style={{position: "absolute", left: 120 + i * 300, top: 880 - b.h * b.e - 8, width: 220, height: b.h * b.e, background: b.c, borderRadius: "18px 18px 0 0"}} />
      ))}
      {[{label: "antes"}, {label: "con WhatsApp"}].map((b, i) => (
        <div key={b.label} style={{position: "absolute", left: 120 + i * 300, top: 892, width: 220, textAlign: "center", fontFamily: fonts.mono, fontSize: 24, color: UI.ink, opacity: i === 0 ? b1 : b2}}>{b.label}</div>
      ))}
      <div style={{position: "absolute", left: 640, top: 560, opacity: rampAt(t, 14.5, 14.7), transform: `rotate(-6deg) scale(${springAt(t, 14.5, fps, SPRING.stamp)})`, background: UI.ink, color: "#fff", fontFamily: fonts.serif, fontStyle: "italic", fontSize: 64, padding: "8px 26px 14px", borderRadius: 14}}>
        más felices
      </div>
      <Confetti at={14.6} origin={{x: 360, y: 420}} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. El mundo gris de "lo que creemos" (16,14–21,9) y su ruptura
// =====================================================================
const CAM: CamKey[] = [
  {at: 16.14, zoom: 2.1, focus: {x: 360, y: 760}},
  {at: 16.75, zoom: 1, focus: {x: 540, y: 800}, dur: 0.45, ease: "out"},
  {at: 18.2, zoom: 1.12, focus: {x: 560, y: 900}, dur: 2.6, ease: "inOut"},
];
const IMPACT = 21.9;
// teléfono del escritorio en el mundo (≈ 750, 1040) visto con zoom 1,12 y foco (560, 900)
const ORIGIN = {x: 540 + (750 - 560) * 1.12, y: 960 + (1040 - 900) * 1.12};

const GrayPhone: React.FC = () => {
  const {t, fps} = useTime();
  const g = inW(t, 20.2, 20.45);
  const e = springAt(t, 17.2, fps, SPRING.accent);
  return (
    <div style={{position: "absolute", left: 600, top: 760, width: 300, height: 560, borderRadius: 48, background: UI.ink, padding: 12, transform: "rotate(-4deg)", boxShadow: "0 30px 60px -25px rgba(0,0,0,0.5)"}}>
      <div style={{width: "100%", height: "100%", borderRadius: 38, background: "#E9E6E1", overflow: "hidden", padding: "60px 16px 16px", fontFamily: fonts.mono}}>
        <div style={{fontSize: 16, color: "#8A8580", marginBottom: 14}}>bot · respuesta automática</div>
        {t >= 17.2 ? (
          <div style={{background: "#D2CEC7", borderRadius: 14, padding: 14, fontSize: 18, lineHeight: 1.35, color: "#55514C", transform: `scale(${0.7 + 0.3 * e}) ${g ? "translateX(6px)" : ""}`, opacity: e, textShadow: g ? "3px 0 #E5484D, -3px 0 #2F5BEA" : undefined}}>
            Su solicitud fue recibida. Ticket #4821. Un agente lo contactará.
          </div>
        ) : null}
      </div>
    </div>
  );
};

const HYPOS = [
  {text: "¿La IA?", at: 18.7, x: 200, y: 1150, r: -7},
  {text: "¿Que responde rápido?", at: 19.45, x: 230, y: 1300, r: 5},
  {text: "¿Que está 24/7?", at: 19.95, x: 180, y: 1440, r: -3},
];

const GrayWorld: React.FC = () => {
  const {t, fps} = useTime();
  return (
    <AbsoluteFill style={{filter: "grayscale(1)"}}>
      <WorldCamera keys={CAM}>
        <div style={{position: "absolute", left: -1200, top: -1600, width: 3480, height: 5200, background: BG.crema, backgroundImage: "radial-gradient(#DDD5C8 2px, transparent 2px)", backgroundSize: "28px 28px"}} />
        <div style={{position: "absolute", left: 120, top: 330, fontFamily: fonts.serif, fontStyle: "italic", fontSize: 220, color: "#CFC8BC"}}>?</div>
        <Character schedule={[{at: 0, name: "mira-titular"}, {at: 17.64, name: "sorpresa"}, {at: 18.2, name: "mira-titular"}, {at: 20.2, name: "preocupado"}]} from={0} to={99} enter={false} height={880} top={480} centerX={370} />
        <div style={{position: "absolute", left: -1200, top: 1290, width: 3480, height: 1600, background: BG.piedra, borderTop: `6px solid ${UI.ink}`}} />
        <GrayPhone />
        {HYPOS.map((h) => {
          if (t < h.at) return null;
          const e = springAt(t, h.at, fps, {damping: 13, stiffness: 220, mass: 0.8});
          return (
            <div key={h.text} style={{position: "absolute", left: h.x, top: h.y - (1 - e) * 900, transform: `rotate(${h.r}deg)`, background: "#fff", border: `3px solid ${UI.ink}`, borderRadius: 18, padding: "18px 26px", fontFamily: fonts.sans, fontWeight: 700, fontSize: 38, color: "#55514C", boxShadow: "0 18px 30px -18px rgba(0,0,0,0.5)"}}>
              {h.text}
            </div>
          );
        })}
      </WorldCamera>
    </AbsoluteFill>
  );
};

const HeartIcon: React.FC<{size?: number; color?: string}> = ({size = 90, color = GREEN}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.6 4.5c2.1 0 3.6 1.2 4.4 2.6.8-1.4 2.3-2.6 4.4-2.6 3.6 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z" fill={color} />
  </svg>
);

// =====================================================================
// 4. Hospitalidad: menta (21,9–31,65)
// =====================================================================
const Toggle: React.FC<{label: string; at: number}> = ({label, at}) => {
  const {t, fps} = useTime();
  const on = springAt(t, at, fps, SPRING.accent);
  return (
    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 0", borderBottom: `2px solid ${UI.line}`}}>
      <span style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 40}}>{label}</span>
      <div style={{width: 112, height: 62, borderRadius: 62, background: interpolate(on, [0, 1], [0, 1]) > 0.5 ? GREEN : "#D9D4CC", position: "relative"}}>
        <div style={{position: "absolute", top: 6, left: 6 + 50 * on, width: 50, height: 50, borderRadius: 50, background: "#fff", boxShadow: "0 3px 8px rgba(0,0,0,0.25)"}} />
      </div>
    </div>
  );
};

const Hospitality: React.FC = () => {
  const {t, fps} = useTime();
  if (!inW(t, 21.85, 31.8)) return null;
  // el huésped se va (27,3 → 28,9)
  const walk = interpolate(t, [26.95, 28.75], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const bob = Math.abs(Math.sin(walk * Math.PI * 7)) * 18;
  const phoneE = springAt(t, 28.5, fps, SPRING.card);
  const read = t >= 31.08;
  const msg = "¡Gracias por quedarte, Laura! Fue un gusto tenerte. Te esperamos de vuelta.";
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: BG.menta}} />
      <Dots />
      {/* tarjeta de interruptores junto a la ventana del presentador */}
      {inW(t, 22.9, 26.95) ? (
        <div style={{position: "absolute", left: 640, top: 960, width: 380, background: "#fff", borderRadius: 32, padding: "18px 30px", boxShadow: UI.cardShadow, ...enterY(t, 22.95, fps), opacity: 1 - rampAt(t, 26.6, 26.9)}}>
          <div style={{fontFamily: fonts.mono, fontSize: 22, color: UI.mute, marginTop: 8}}>// asistente</div>
          <Toggle label="Profesional" at={24.36} />
          <Toggle label="Humano" at={24.99} />
        </div>
      ) : null}
      {/* el huésped cruza con su maleta */}
      {inW(t, 26.9, 29.0) ? (
        <Img src={staticFile("props/ht/huesped.png")} style={{position: "absolute", left: interpolate(walk, [0, 1], [860, -560]), top: 820 - bob, height: 760, imageRendering: "pixelated", transform: `rotate(${Math.sin(walk * Math.PI * 7) * 2}deg)`}} />
      ) : null}
      {/* el mensaje personal por WhatsApp */}
      {t >= 28.5 ? (
        <div style={{position: "absolute", inset: 0, opacity: Math.min(1, phoneE * 1.6), transform: `translateX(${(1 - phoneE) * 500}px) translateY(${16 * Math.sin((t - 28.5) * 2.4)}px) rotate(${(1 - phoneE) * 8 + 1.6 * Math.sin((t - 28.5) * 1.7)}deg) scale(${1 + 0.06 * rampAt(t, 29.3, 31.6, Easing.inOut(Easing.cubic))})`}}>
          <Phone x={300} y={560} w={540} h={1060} screen="#ECE5DD">
            <div style={{background: "#075E54", padding: "72px 26px 22px", display: "flex", alignItems: "center", gap: 16, color: "#fff"}}>
              <div style={{width: 64, height: 64, borderRadius: 64, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center"}}><HeartIcon size={40} /></div>
              <div>
                <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 30}}>Zapata Hospitality</div>
                <div style={{fontFamily: fonts.mono, fontSize: 20, opacity: 0.8}}>{t < 30.9 && t >= 29.4 ? "escribiendo…" : "en línea"}</div>
              </div>
            </div>
            <div style={{padding: 26}}>
              <Bubble side="in" at={28.75}>Ya hice el check-out. ¡Gracias por todo!</Bubble>
              {t >= 29.4 ? (
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                  <div style={{maxWidth: "86%", background: "#DCF8C6", borderRadius: 26, borderBottomRightRadius: 6, padding: "20px 24px", fontFamily: fonts.sans, fontWeight: 500, fontSize: 30, lineHeight: 1.32, color: UI.ink, boxShadow: "0 6px 14px -8px rgba(0,0,0,0.3)"}}>
                    {typed(msg, t, 29.4, 30.9)}
                    {t >= 30.9 ? (
                      <div style={{textAlign: "right", fontFamily: fonts.mono, fontSize: 22, color: read ? WA_BLUE : "#8A8580", marginTop: 6, fontWeight: 500}}>
                        {read ? "leído ✓✓" : "✓✓"}
                      </div>
                    ) : null}
                    {t >= 31.3 ? (
                      <div style={{position: "absolute", marginTop: 6, background: "#fff", borderRadius: 30, padding: "4px 12px", boxShadow: "0 4px 10px -4px rgba(0,0,0,0.3)", transform: `scale(${springAt(t, 31.3, fps, SPRING.stamp)})`}}>
                        <HeartIcon size={34} color={BG.coral} />
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </Phone>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// =====================================================================
// 5. Demostración: la misma tarjeta del asistente evoluciona (38,27–46,95)
// =====================================================================
const Row: React.FC<{at: number; children: React.ReactNode; check?: number}> = ({at, children, check}) => {
  const {t, fps} = useTime();
  if (t < at) return null;
  const e = springAt(t, at, fps, SPRING.card);
  const c = check != null ? rampAt(t, check, check + 10 / 30) : 0;
  return (
    <div style={{display: "flex", alignItems: "center", gap: 20, padding: "22px 0", borderBottom: `2px solid ${UI.line}`, opacity: Math.min(1, e * 1.6), transform: `translateX(${(1 - e) * 60}px)`}}>
      {check != null ? (
        <div style={{width: 46, height: 46, borderRadius: 12, background: c > 0 ? UI.ok : "transparent", border: `3px solid ${c > 0 ? UI.ok : "#D5D0C8"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0}}>
          <svg width={28} height={28} viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" strokeDashoffset={30 * (1 - c)} /></svg>
        </div>
      ) : (
        <div style={{width: 18, height: 18, borderRadius: 18, background: BG.violeta, flexShrink: 0}} />
      )}
      <span style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 42, color: UI.ink}}>{children}</span>
    </div>
  );
};

const Section: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const {t} = useTime();
  if (!inW(t, from, to + 0.2)) return null;
  const i = rampAt(t, from, from + 0.25);
  const o = rampAt(t, to, to + 0.2, Easing.in(Easing.cubic));
  return <div style={{position: "absolute", left: 40, right: 40, top: 150, opacity: i * (1 - o), transform: `translateY(${(1 - i) * 50 - o * 60}px)`}}>{children}</div>;
};

const AssistantCard: React.FC = () => {
  const {t, fps} = useTime();
  if (!inW(t, 38.27, 47.4)) return null;
  const bg = t < 41.82 ? BG.violeta : t < 43.9 ? BG.cobalto : BG.coral;
  const slider = interpolate(t, [44.0, 44.3], [0.2, 0.92], {...clamp, easing: Easing.out(Easing.back(1.4))});
  const sinkOut = rampAt(t, 46.95, 47.3, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: bg}} />
      <div style={{position: "absolute", left: 60, top: 600, width: 960, height: 700, background: "#fff", borderRadius: 40, boxShadow: UI.cardShadow, overflow: "hidden", ...enterY(t, 38.55, fps, 200), opacity: 1 - sinkOut}}>
        <div style={{height: 120, display: "flex", alignItems: "center", gap: 20, padding: "0 40px", borderBottom: `2px solid ${UI.line}`}}>
          <Img src={staticFile("brand/monark-mark.png")} style={{width: 64, height: 64, objectFit: "contain"}} />
          <span style={{fontFamily: fonts.sans, fontWeight: 800, fontSize: 40}}>Asistente IA</span>
          <span style={{marginLeft: "auto", fontFamily: fonts.mono, fontSize: 24, color: GREEN, background: `${GREEN}1F`, padding: "8px 18px", borderRadius: 999}}>● aprendiendo</span>
        </div>
        <Section from={38.6} to={41.82}>
          <div style={{fontFamily: fonts.mono, fontSize: 26, color: UI.mute, marginBottom: 8}}>// contexto de tu propiedad</div>
          <div style={{height: 10, borderRadius: 10, background: "#ECE7DF", margin: "10px 0 6px", overflow: "hidden"}}>
            <div style={{height: "100%", width: `${interpolate(t, [38.6, 40.9], [0, 100], clamp)}%`, background: BG.violeta, borderRadius: 10}} />
          </div>
          <Row at={40.0}>Check-in desde las 3:00 p. m.</Row>
          <Row at={40.4}>Wi-Fi: Cafetero2026</Row>
          <Row at={40.8}>Parqueadero incluido</Row>
        </Section>
        <Section from={41.82} to={43.9}>
          <div style={{fontFamily: fonts.mono, fontSize: 26, color: UI.mute, marginBottom: 8}}>// preguntas frecuentes</div>
          <Row at={41.9} check={42.3}>¿A qué hora es el check-in?</Row>
          <Row at={42.0} check={42.7}>¿Cuál es la clave del Wi-Fi?</Row>
          <Row at={42.1} check={43.1}>¿Aceptan mascotas?</Row>
        </Section>
        <Section from={43.9} to={47.2}>
          <div style={{fontFamily: fonts.mono, fontSize: 26, color: UI.mute, marginBottom: 24}}>// tono de las respuestas</div>
          <div style={{position: "relative", height: 90, margin: "0 10px"}}>
            <div style={{position: "absolute", top: 36, left: 0, right: 0, height: 14, borderRadius: 14, background: "#ECE7DF"}} />
            <div style={{position: "absolute", top: 36, left: 0, width: `${slider * 100}%`, height: 14, borderRadius: 14, background: BG.coral}} />
            <div style={{position: "absolute", top: 13, left: `calc(${slider * 100}% - 30px)`, width: 60, height: 60, borderRadius: 60, background: "#fff", border: `5px solid ${BG.coral}`, boxShadow: "0 6px 14px rgba(0,0,0,0.25)"}} />
          </div>
          <div style={{display: "flex", justifyContent: "space-between", fontFamily: fonts.mono, fontSize: 24, color: UI.mute, margin: "6px 10px 30px"}}>
            <span>formal</span>
            <span style={{color: t >= 44.3 ? BG.coral : UI.mute, fontWeight: 500}}>como tú</span>
          </div>
          {t >= 44.6 ? (
            <div style={{background: "#DCF8C6", borderRadius: 26, borderBottomRightRadius: 6, padding: "22px 26px", fontFamily: fonts.sans, fontWeight: 500, fontSize: 34, lineHeight: 1.3, marginLeft: 120}}>
              {typed("¡Hola, Laura! Te dejo la llave lista y el Wi-Fi anotado.", t, 44.6, 45.2)}
            </div>
          ) : null}
        </Section>
      </div>
      <Cursor path={[{x: 760, y: 1400, at: 43.95}, {x: 895, y: 855, at: 44.25}, {x: 900, y: 1500, at: 44.9}]} clicks={[44.3]} hideAt={45.0} />
      <Chip at={45.42} x={380} y={1470} bg={UI.ink} color="#fff" size={34} until={47.0}>link en el perfil →</Chip>
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. Oferta (46,95–54,75), mitad superior de la dividida desde 47,35
// =====================================================================
const Offer: React.FC = () => {
  const {t, fps} = useTime();
  if (!inW(t, 46.9, 55.2)) return null;
  const bg = t < 50.69 ? BG.amarillo : t < 53.14 ? BG.violeta : BG.coral;
  const logoE = springAt(t, 47.0, fps, SPRING.accent);
  const toTop = interpolate(t, [47.35, 47.75], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const chips = [["Asistente IA", 49.48], ["WhatsApp", 49.62], ["Airbnb", 49.76], ["Booking", 49.9]] as const;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: bg}} />
      {t < 50.69 ? (
        <>
          <LogoPlate width={440} style={{left: 540 - 260, top: interpolate(toTop, [0, 1], [820, 250]), transform: `scale(${0.6 + 0.4 * logoE})`, opacity: Math.min(1, logoE * 1.5)}} />
          <div style={{position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: fonts.mono, fontSize: 32, color: UI.ink, opacity: rampAt(t, 47.98, 48.2)}}>// el PMS para rentas cortas</div>
          <div style={{position: "absolute", left: 60, right: 60, top: 640, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center"}}>
            {chips.map(([label, at]) => {
              if (t < at) return null;
              const e = springAt(t, at, fps, SPRING.accent);
              return <span key={label} style={{background: "#fff", borderRadius: 999, padding: "14px 26px", fontFamily: fonts.sans, fontWeight: 700, fontSize: 32, transform: `scale(${e})`, boxShadow: "0 12px 22px -14px rgba(0,0,0,0.5)"}}>{label}</span>;
            })}
            {t >= 49.95 ? <span style={{fontFamily: fonts.serif, fontStyle: "italic", fontSize: 54, transform: `scale(${springAt(t, 49.95, fps, SPRING.accent)})`}}>y mucho más</span> : null}
          </div>
        </>
      ) : t < 53.14 ? (
        <>
          <div style={{position: "absolute", left: 80, top: 250, fontFamily: fonts.mono, fontSize: 32, color: "#fff", opacity: rampAt(t, 51.33, 51.5)}}>// de descuento</div>
          <div style={{position: "absolute", left: 66, top: 300}}><SlotNumber text="30%" at={50.85} size={300} color="#fff" /></div>
          <Chip at={52.3} x={90} y={700} bg="#FFD34D" size={38}>tus 3 primeros meses</Chip>
        </>
      ) : (
        <>
          <div style={{position: "absolute", left: 80, top: 360, width: 920, background: "#fff", borderRadius: 36, padding: 44, boxShadow: UI.cardShadow, ...enterY(t, 53.2, fps)}}>
            <div style={{fontFamily: fonts.mono, fontSize: 28, color: UI.mute}}>// implementación</div>
            <div style={{fontFamily: fonts.sans, fontWeight: 800, fontSize: 64, marginTop: 10}}>Configuramos todo contigo</div>
          </div>
          <Stamp text="Gratis." at={54.4} x={700} y={720} size={120} />
          <Confetti at={54.5} origin={{x: 700, y: 720}} seed="gratis" />
        </>
      )}
    </AbsoluteFill>
  );
};

// =====================================================================
// 7. Tarjeta final + pago del motivo (54,75–58,6)
// =====================================================================
const EndCard: React.FC = () => {
  const {t, fps} = useTime();
  if (t < 54.75) return null;
  const sweep = rampAt(t, 54.9, 55.3, Easing.out(Easing.cubic));
  const walk = interpolate(t, [55.1, 55.8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const bob = Math.abs(Math.sin(walk * Math.PI * 4)) * 14 * (1 - walk);
  const rev = springAt(t, 55.9, fps, SPRING.accent);
  const pulse = 1 + 0.03 * Math.max(0, Math.sin((t - 55.3) * 5));
  return (
    <CircleReveal at={54.75} origin={{x: 700, y: 720}} dur={0.3}>
      <AbsoluteFill style={{background: BG.amarillo}} />
      <div style={{position: "absolute", left: 540 - 300, top: 470, width: 600, height: 240, clipPath: `inset(0 ${100 - sweep * 100}% 0 0)`}}>
        <LogoPlate width={520} style={{left: 0, top: 0}} />
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontFamily: fonts.sans, fontWeight: 700, fontSize: 52, color: UI.ink, opacity: rampAt(t, 55.2, 55.5)}}>
        Un asistente que habla <span style={{fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 400, fontSize: 70}}>como tú</span>
      </div>
      {/* el huésped vuelve con su maleta */}
      <Img src={staticFile("props/ht/huesped.png")} style={{position: "absolute", left: interpolate(walk, [0, 1], [1100, 640]), top: 860 - bob, height: 520, imageRendering: "pixelated", mixBlendMode: "multiply"}} />
      {t >= 55.9 ? (
        <div style={{position: "absolute", left: 480, top: 830, transform: `scale(${rev}) rotate(-5deg)`, background: "#fff", borderRadius: 22, padding: "14px 22px", boxShadow: "0 18px 30px -14px rgba(0,0,0,0.45)", fontFamily: fonts.sans, fontWeight: 800, fontSize: 34}}>
          <span style={{color: "#F5A623"}}>★★★★★</span> ¡Volvería!
        </div>
      ) : null}
      <div style={{position: "absolute", left: 540 - 300, top: 1430, width: 600, height: 120, borderRadius: 120, background: UI.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: fonts.sans, fontWeight: 800, fontSize: 46, transform: `scale(${(t >= 55.7 && t < 55.85 ? 0.96 : 1) * pulse})`, opacity: rampAt(t, 55.3, 55.5)}}>
        Link en el perfil <span style={{fontSize: 52}}>→</span>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 1580, textAlign: "center", fontFamily: fonts.mono, fontSize: 26, color: UI.ink, opacity: 0.7 * rampAt(t, 55.6, 55.9)}}>
        30 % dcto. 3 primeros meses · implementación gratis
      </div>
      <Cursor path={[{x: 920, y: 1720, at: 55.3}, {x: 700, y: 1500, at: 55.68}]} clicks={[55.7]} />
      <Confetti at={55.95} origin={{x: 640, y: 860}} seed="final" count={30} />
    </CircleReveal>
  );
};

// =====================================================================
// Presentador: un solo video que cambia de forma
// =====================================================================
// Sin burbuja: cuando la gráfica necesita el cuadro, el presentador sale (se desliza hacia abajo) y su voz sigue.
// Cara grande: 0–3,6 (full) · 10,3–13,4 (full) · 13,4–16,1 (split) · 22,7–26,9 (window) · 31,7–38,3 (full) · 47,4–54,8 (split).
const STAGE: StageKey[] = [
  {at: 0, shot: {mode: "full"}},
  {at: 3.56, shot: {mode: "hidden"}, dur: 0.45},
  {at: 10.3, shot: {mode: "full"}},
  {at: 13.36, shot: {mode: "split", ratio: 0.5}},
  {at: 16.14, shot: {mode: "hidden"}, dur: 0.45},
  {at: 22.7, shot: {mode: "window", x: 70, y: 860, w: 560, h: 800, rotate: -3}},
  {at: 26.86, shot: {mode: "hidden"}, dur: 0.45},
  {at: 31.65, shot: {mode: "full"}},
  {at: 38.27, shot: {mode: "hidden"}, dur: 0.45},
  {at: 47.35, shot: {mode: "split", ratio: 0.5}},
  {at: 54.75, shot: {mode: "hidden"}, dur: 0.45},
];

// capas que flotan junto a la cabeza en cámara completa (D1)
const AirLayer: React.FC = () => {
  const {t} = useTime();
  return (
    <>
      <Chip at={1.52} x={70} y={720} rotate={-3} until={3.56}>// rentas cortas</Chip>
      {t < 3.56 ? <Chip at={2.3} x={110} y={820} bg={UI.ink} color="#fff" rotate={2}>● Eje Cafetero</Chip> : null}
      {inW(t, 12.6, 13.4) ? (
        <Chip at={12.6} x={60} y={760} bg="#DCF8C6" size={30} rotate={-3}>
          <Img src={staticFile("brand/whatsapp.png")} style={{width: 40, height: 40, borderRadius: 10}} /> ¡Todo perfecto, gracias!
        </Chip>
      ) : null}
      {inW(t, 33.9, 38.27) ? (
        <>
          <Chip at={33.92} x={60} y={760} size={30} rotate={-4}><HeartIcon size={36} color={BG.coral} /> personal</Chip>
          <Chip at={34.66} x={110} y={860} size={30} rotate={3}><HeartIcon size={36} color={GREEN} /> cercano</Chip>
        </>
      ) : null}
    </>
  );
};

// =====================================================================
export const ZapataReel: React.FC<{intro?: boolean}> = ({intro = false}) => {
  const {t} = useTime();
  // con intro: el presentador nace en la ventana de la llamada y se abre a pantalla completa
  const stage: StageKey[] = intro
    ? [{at: 0, shot: {mode: "window", x: CALL_RECT.x, y: CALL_RECT.y, w: CALL_RECT.w, h: CALL_RECT.h}}, {at: 0.06, shot: {mode: "full"}, dur: 0.55}, ...STAGE.slice(1)]
    : STAGE;
  const motifAt = intro ? -(INTRO_S - MOTIF_PLANT) : 5.62;
  return (
    <AbsoluteFill style={{background: intro ? "#FFFFFF" : "#000"}}>
      {/* ---------- capa de gráfica (debajo del presentador) ---------- */}
      <GuestChat />
      {inW(t, 7.9, 10.6) ? (
        <HeroBurst
          out={10.6}
          items={[
            {icon: "brand/airbnb.png", name: "Airbnb", color: BG.coral, textColor: UI.ink, at: 8.0},
            {icon: "brand/booking.png", name: "Booking", color: BG.cobalto, at: 8.5},
            {icon: "brand/whatsapp.png", name: "WhatsApp", color: BG.menta, textColor: UI.ink, at: 9.62},
          ]}
          centerY={940}
        />
      ) : null}
      <Chip at={9.02} x={330} y={1330} bg="#fff" size={34} until={9.62}>+ más OTAs</Chip>
      <Proof />
      {inW(t, 16.14, IMPACT + 1.6) ? (
        <>
          {t >= IMPACT - 0.05 ? (
            <BlobReveal at={IMPACT + 0.03} origin={ORIGIN} outline={GREEN}>
              <Hospitality />
            </BlobReveal>
          ) : null}
          <Shatter at={IMPACT} origin={ORIGIN} crackColor={GREEN}>
            <GrayWorld />
            <H w={[["¿Por", 17.48], ["qué?", 17.64, true]]} from={17.4} to={18.2} on="crema" />
            <H w={[["Más", 19.45], ["interesante", 19.69], ["de", 20.24], ["lo", 20.39], ["que", 20.44], ["creemos…", 20.76, true]]} from={19.4} to={IMPACT} on="crema" exit={false} />
          </Shatter>
        </>
      ) : null}
      {inW(t, IMPACT + 1.6, 31.8) ? <Hospitality /> : null}
      <AssistantCard />
      {t >= 46.95 ? (
        <CircleReveal at={46.95} origin={{x: 540, y: 620}} dur={0.3}>
          <Offer />
        </CircleReveal>
      ) : null}
      <EndCard />

      {/* ---------- presentador ---------- */}
      <PresenterStage src="clips/video2-tight.mp4" keys={stage} face={{x: 600, y: 910}} faceSize={360} sourceHeight={1916} muted jumpCuts={JUMP_CUTS} />

      {/* ---------- encima del presentador ---------- */}
      <AirLayer />
      {/* titulares */}
      <H w={[["Zapata", 0.08], ["Hospitality", 0.26, true]]} from={0} to={3.5} on="presentador" size={104} top={210} />
      <H w={[["Un", 3.24], ["chatbot", 3.56, true], ["de", 3.92], ["IA", 4.01]]} from={3.56} to={6.5} on="crema" />
      <H w={[["En", 6.55], ["todas", 6.64], ["las", 7.0], ["OTAs", 7.2, true]]} from={6.5} to={8.0} on="crema" exit={false} />
      <H w={[["En", 6.55], ["todas", 6.64], ["las", 7.0], ["OTAs", 7.2, true]]} from={8.0} to={8.5} on="coral" exit={false} />
      <H w={[["En", 6.55], ["todas", 6.64], ["las", 7.0], ["OTAs", 7.2, true]]} from={8.5} to={9.55} on="cobalto" />
      <H w={[["y", 9.54], ["WhatsApp", 9.62, true]]} from={9.55} to={10.3} on="menta" />
      <H w={[["Funciona", 11.93], ["en", 12.52], ["WhatsApp", 12.56, true]]} from={11.8} to={13.36} on="presentador" top={210} />
      <H w={[["Esto", 21.6], ["es", 21.81], ["hospitalidad.", 21.91, true]]} from={IMPACT} to={22.95} on="menta" size={104} />
      <H w={[["El", 23.08], ["asistente", 23.18, true], ["debe", 23.7], ["ser…", 23.86]]} from={23.0} to={24.3} on="menta" />
      <H w={[["Profesional", 24.34], ["y", 24.92], ["humano", 24.97, true]]} from={24.3} to={26.8} on="menta" />
      <H w={[["El", 26.86], ["huésped", 26.9], ["se", 27.27], ["va…", 27.43, true]]} from={26.82} to={29.2} on="menta" />
      <H w={[["Se", 29.27], ["tomó", 29.38], ["el", 29.66], ["tiempo", 29.82, true]]} from={29.2} to={31.65} on="menta" />
      <H w={[["Más", 33.7], ["personal.", 33.91, true]]} from={33.6} to={36.2} on="presentador" top={210} />
      <H w={[["Más", 34.6], ["cercano.", 34.64, true]]} from={34.5} to={36.2} on="presentador" top={330} />
      <H w={[["¿Quieres", 37.33], ["implementarlo?", 37.58, true]]} from={37.2} to={38.27} on="presentador" top={210} />
      <H w={[["Un", 38.27], ["asistente", 38.3, true], ["de", 38.71], ["IA", 38.76]]} from={38.27} to={39.95} on="violeta" />
      <H w={[["Aprende", 39.97], ["tu", 40.27], ["contexto", 40.34, true]]} from={39.95} to={41.82} on="violeta" />
      <H w={[["Tus", 42.12], ["preguntas", 42.25], ["frecuentes", 42.65, true]]} from={41.82} to={43.9} on="cobalto" />
      <H w={[["Habla", 44.15], ["como", 44.55], ["tú", 44.93, true]]} from={43.9} to={45.35} on="coral" />
      <H w={[["En", 45.35], ["el", 45.38], ["link", 45.4], ["de", 45.6], ["mi", 45.7], ["perfil", 45.8, true]]} from={45.35} to={46.95} on="coral" />
      <H w={[["Esto", 49.08], ["y", 49.32], ["mucho", 49.48], ["más", 49.74, true]]} from={49.0} to={50.69} on="amarillo" top={540} />
      <H w={[["La", 53.05], ["implementación", 53.14]]} from={53.05} to={54.75} on="coral" top={230} />
      {/* objeto motivo: el huésped con su anillo de satisfacción */}
      <MotifSticker
        src="props/ht/huesped.png"
        at={motifAt}
        out={21.6}
        center={{x: 930, y: 330}}
        size={170}
        ringColor={GREEN}
        progress={[{at: motifAt, value: 0.55}, {at: 14.5, value: 0.72}]}
        label={{at: 14.6, text: "+17 %"}}
      />
      {t >= 22.2 ? (
        <MotifSticker
          src="props/ht/huesped.png"
          at={22.2}
          center={{x: 930, y: 330}}
          size={170}
          ringColor={GREEN}
          progress={[{at: 22.2, value: 0.72}, {at: 34.7, value: 0.9}, {at: 55.9, value: 1}]}
          label={{at: 34.7, text: "más cercano"}}
        />
      ) : null}
      {/* la ruptura */}
      <Viewfinder at={21.62} dur={0.28} />
      <Splash at={IMPACT} origin={ORIGIN} colors={[GREEN, "#25D366", BG.amarillo, BG.coral, BG.violeta]} />
      <BrandDrop at={IMPACT} to={ORIGIN} size={170} until={IMPACT + 0.15} trail={GREEN}>
        <div style={{width: "100%", height: "100%", borderRadius: 46, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: UI.cardShadow}}>
          <HeartIcon size={110} />
        </div>
      </BrandDrop>
      {/* la marca cae sobre la tarjeta del asistente */}
      <BrandDrop at={46.75} to={{x: 540, y: 620}} size={150} until={47.0} trail={BG.amarillo}>
        <div style={{width: "100%", height: "100%", borderRadius: 40, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: UI.cardShadow}}>
          <Img src={staticFile("brand/monark-mark.png")} style={{width: "72%"}} />
        </div>
      </BrandDrop>

      {/* ---------- audio ---------- */}
      <Audio src={staticFile("clips/video2-tight-voz.wav")} />
      <SfxTrack events={SFX_EVENTS} />
    </AbsoluteFill>
  );
};

// =====================================================================
// Pieza completa: intro de la llamada + video largo
// =====================================================================
export const ZapataReelFull: React.FC = () => (
  <AbsoluteFill style={{background: "#000"}}>
    <Sequence durationInFrames={Math.round(INTRO_S * FPS)} name="intro llamada">
      <CallIntro />
    </Sequence>
    <Sequence from={Math.round(INTRO_S * FPS)} name="video largo">
      <ZapataReel intro />
    </Sequence>
  </AbsoluteFill>
);
