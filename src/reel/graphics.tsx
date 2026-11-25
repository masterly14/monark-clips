import React from "react";
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import {C, F} from "./style";

// ---------- utilidades ----------
export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {t: frame / fps, fps};
};

/** Spring 0→1 que arranca en el segundo `at` (0 antes de eso). */
export const pop = (t: number, at: number, fps: number, damping = 13) =>
  t < at ? 0 : spring({frame: (t - at) * fps, fps, config: {damping, stiffness: 190, mass: 0.7}});

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const ramp = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

const appear = (p: number, dy = 30): React.CSSProperties => ({
  opacity: Math.min(1, p * 1.4),
  transform: `translateY(${(1 - p) * dy}px) scale(${0.9 + 0.1 * p})`,
});

// ---------- piezas base ----------
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.09}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      opacity,
      mixBlendMode: "multiply",
      pointerEvents: "none",
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
    }}
  />
);

export const YellowBg: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `radial-gradient(ellipse 900px 1100px at 50% 40%, #FFC22E 0%, ${C.yellow} 55%, ${C.yellowDeep} 100%)`,
    }}
  >
    <Grain />
  </div>
);

const Dots = () => (
  <div style={{display: "flex", gap: 10}}>
    {["#ED6A5E", "#F5BF4F", "#61C554"].map((c) => (
      <span key={c} style={{width: 16, height: 16, borderRadius: 16, background: c}} />
    ))}
  </div>
);

/** Ventana tipo app dentro de un marco beige (como la ventana de la referencia). */
export const Window: React.FC<{
  title: React.ReactNode;
  width: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({title, width, children, style}) => (
  <div
    style={{
      width,
      padding: 18,
      borderRadius: 34,
      background: C.frame,
      boxShadow: "0 40px 80px -30px rgba(90,50,0,0.45)",
      ...style,
    }}
  >
    <div style={{background: C.window, borderRadius: 24, border: `1.5px solid ${C.line}`, overflow: "hidden"}}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "20px 26px",
          borderBottom: `1.5px solid ${C.line}`,
          fontFamily: F.ui,
          fontWeight: 700,
          fontSize: 28,
          color: C.ink,
        }}
      >
        <Dots />
        {title}
      </div>
      <div style={{padding: 30}}>{children}</div>
    </div>
  </div>
);

const Chip: React.FC<{children: React.ReactNode; bg?: string; color?: string; style?: React.CSSProperties}> = ({
  children,
  bg = C.window,
  color = C.ink,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 26px",
      borderRadius: 999,
      background: bg,
      color,
      fontFamily: F.ui,
      fontWeight: 700,
      fontSize: 32,
      boxShadow: "0 14px 30px -14px rgba(60,30,0,0.5)",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

const Pin = () => (
  <svg width="26" height="32" viewBox="0 0 24 30">
    <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.4 12 30 12 30s12-9.6 12-18.3C24 5.2 18.6 0 12 0z" fill="#E5484D" />
    <circle cx="12" cy="11.5" r="4.5" fill="#fff" />
  </svg>
);

const Check: React.FC<{p: number}> = ({p}) => (
  <div
    style={{
      width: 52,
      height: 52,
      borderRadius: 14,
      flexShrink: 0,
      border: `3px solid ${p > 0 ? C.ink : C.line}`,
      background: p > 0 ? C.yellow : "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `scale(${p > 0 ? 0.85 + 0.15 * p : 1})`,
    }}
  >
    <svg width="30" height="30" viewBox="0 0 24 24">
      <path
        d="M4 12.5l5 5L20 6.5"
        fill="none"
        stroke={C.ink}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="30"
        strokeDashoffset={30 * (1 - p)}
      />
    </svg>
  </div>
);

const Star: React.FC<{p: number; size?: number}> = ({p, size = 64}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{transform: `scale(${0.6 + 0.4 * p})`}}>
    <path
      d="M12 1.8l3.1 6.4 7 1-5.1 4.9 1.2 7L12 17.8l-6.2 3.3 1.2-7L1.9 9.2l7-1z"
      fill={p > 0.05 ? C.ink : "rgba(26,20,16,0.15)"}
    />
  </svg>
);

const Typing: React.FC<{t: number}> = ({t}) => (
  <div style={{display: "flex", gap: 8, padding: "20px 26px"}}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 14,
          height: 14,
          borderRadius: 14,
          background: C.mute,
          opacity: 0.35 + 0.65 * Math.max(0, Math.sin(t * 9 - i * 0.9)),
        }}
      />
    ))}
  </div>
);

const Bubble: React.FC<{side: "in" | "out"; p: number; children: React.ReactNode; bg?: string}> = ({
  side,
  p,
  children,
  bg,
}) => (
  <div
    style={{
      alignSelf: side === "in" ? "flex-start" : "flex-end",
      maxWidth: "82%",
      padding: "24px 32px",
      borderRadius: 30,
      borderBottomLeftRadius: side === "in" ? 8 : 26,
      borderBottomRightRadius: side === "out" ? 8 : 26,
      background: bg ?? (side === "in" ? "#FFFFFF" : "#F2E7D2"),
      border: `1.5px solid ${C.line}`,
      fontFamily: F.ui,
      fontWeight: 500,
      fontSize: 40,
      lineHeight: 1.3,
      color: C.ink,
      transformOrigin: side === "in" ? "left bottom" : "right bottom",
      ...appear(p, 20),
    }}
  >
    {children}
  </div>
);

// ---------- 1. Intro: Zapata Hospitality (split, arriba) ----------
export const IntroCard: React.FC = () => {
  const {t, fps} = useT();
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 34}}>
      <div style={appear(pop(t, 0.05, fps))}>
        <Chip bg={C.ink} color="#fff" style={{fontFamily: F.cap, letterSpacing: "0.12em", fontSize: 26}}>
          CASO REAL
        </Chip>
      </div>
      <div
        style={{
          ...appear(pop(t, 0.2, fps)),
          background: C.window,
          padding: "44px 56px",
          borderRadius: 34,
          border: `14px solid ${C.frame}`,
          boxShadow: "0 40px 80px -30px rgba(90,50,0,0.45)",
        }}
      >
        <Img src={staticFile("brand/zapata-logo.png")} style={{width: 560}} />
      </div>
      <div style={{display: "flex", gap: 20}}>
        <div style={appear(pop(t, 1.5, fps))}>
          <Chip>Rentas cortas</Chip>
        </div>
        <div style={appear(pop(t, 2.25, fps))}>
          <Chip>
            <Pin /> Eje Cafetero
          </Chip>
        </div>
      </div>
    </div>
  );
};

// ---------- 2. Chatbot en todas las OTAs + WhatsApp (pantalla completa) ----------
export const OtaChat: React.FC<{s: number}> = ({s}) => {
  const {t, fps} = useT();
  const chips = [
    {label: "OTAs", at: 7.6, bg: C.window, color: C.ink},
    {label: "Airbnb", at: 8.6, bg: "#FF385C", color: "#fff"},
    {label: "Booking", at: 9.2, bg: "#003B95", color: "#fff"},
    {label: "WhatsApp", at: 10.4, bg: C.green, color: "#fff"},
  ];
  return (
    <div style={{position: "absolute", inset: 0}}>
      <div
        style={{
          position: "absolute",
          top: 230,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 18,
        }}
      >
        {chips.map((c) => (
          <div key={c.label} style={appear(pop(t, c.at, fps), -30)}>
            <Chip bg={c.bg} color={c.color}>
              {c.label}
            </Chip>
          </div>
        ))}
      </div>
      <div style={{position: "absolute", top: 360, left: 0, right: 0, display: "flex", justifyContent: "center"}}>
        <div style={appear(pop(t, s + 0.05, fps), 60)}>
          <Window
            width={960}
            title={
              <span>
                Asistente IA <span style={{color: C.mute, fontWeight: 500}}>· huéspedes</span>
              </span>
            }
          >
            <div style={{display: "flex", flexDirection: "column", gap: 22, minHeight: 700, justifyContent: "flex-end"}}>
              <Bubble side="out" p={pop(t, 4.4, fps)}>
                Hola, ¿a qué hora es el check-in?
              </Bubble>
              {t >= 5.2 && t < 6.0 ? (
                <div style={{alignSelf: "flex-start", background: "#fff", borderRadius: 26, border: `1.5px solid ${C.line}`}}>
                  <Typing t={t} />
                </div>
              ) : null}
              <Bubble side="in" p={pop(t, 6.0, fps)}>
                ¡Hola! El check-in es desde las 3:00 p. m. ¿Te comparto la ubicación y la clave del Wi-Fi?
              </Bubble>
              <Bubble side="out" p={pop(t, 9.6, fps)}>
                ¡Sí, por favor!
              </Bubble>
            </div>
          </Window>
        </div>
      </div>
    </div>
  );
};

// ---------- 3. +17% satisfacción (split, arriba) ----------
export const Stat17: React.FC = () => {
  const {t, fps} = useT();
  const phase2 = 1; // solo el número (la reseña previa se quitó para no saturar)
  const count = Math.round(interpolate(t, [15.2, 16.0], [0, 17], {...clamp, easing: Easing.out(Easing.cubic)}));
  return (
    <div style={{position: "relative", width: 1080, height: 860}}>
      {/* Fase 1: review real del cliente */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          opacity: 1 - phase2,
          transform: `scale(${1 - 0.08 * phase2})`,
        }}
      >
        <div style={appear(pop(t, 11.15, fps))}>
          <Chip bg={C.green} color="#fff">
            Funciona en WhatsApp
          </Chip>
        </div>
        <div style={appear(pop(t, 11.6, fps))}>
          <Window width={820} title={<span>Reseña de huésped</span>}>
            <div style={{display: "flex", gap: 6, marginBottom: 18}}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={44} p={pop(t, 12.0 + i * 0.12, fps)} />
              ))}
            </div>
            <div style={{fontFamily: F.ui, fontWeight: 600, fontSize: 38, lineHeight: 1.3, color: C.ink}}>
              “Súper amables, muy atentos.”
            </div>
          </Window>
        </div>
      </div>

      {/* Fase 2: el número */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: 70,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: phase2,
          transform: `scale(${0.92 + 0.08 * phase2})`,
        }}
      >
        <div
          style={{
            fontFamily: F.ui,
            fontWeight: 900,
            fontSize: 300,
            lineHeight: 0.9,
            letterSpacing: "-0.06em",
            color: C.ink,
          }}
        >
          +{count}%
        </div>
        <div style={{display: "flex", gap: 10, marginTop: 30}}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} p={pop(t, 16.1 + i * 0.1, fps)} />
          ))}
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: F.cap,
            fontWeight: 600,
            fontSize: 38,
            letterSpacing: "0.1em",
            color: C.ink,
            opacity: ramp(t, 16.1, 16.5),
          }}
        >
          SATISFACCIÓN DE HUÉSPEDES
        </div>
      </div>
    </div>
  );
};

// ---------- 4. Escena "sol" con palabras gigantes ----------
export type SunWord = {
  text: string;
  at: number;
  until?: number;
  pos: "top" | "mid" | "bottom";
  size?: number;
};

export const SunWords: React.FC<{s: number; words: SunWord[]}> = ({s, words}) => {
  const {t, fps} = useT();
  const enter = ramp(t, s, s + 0.35);
  const breathe = 1 + 0.015 * Math.sin((t - s) * 2.2);
  const y = {top: 330, mid: 1000, bottom: 1640};
  return (
    <div style={{position: "absolute", inset: 0, background: C.night}}>
      {/* halo */}
      <div
        style={{
          position: "absolute",
          left: 540 - 700,
          top: 1000 - 700,
          width: 1400,
          height: 1400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,120,0,0.55) 0%, rgba(200,40,0,0.25) 38%, rgba(0,0,0,0) 62%)",
          opacity: enter,
        }}
      />
      {/* disco solar */}
      <div
        style={{
          position: "absolute",
          left: 540 - 450,
          top: 1000 - 450,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, #FFF59A 0%, #FFE04A 35%, #F9C300 62%, #F29A00 86%, #D9560B 100%)",
          boxShadow: "0 0 90px 30px rgba(255,140,0,0.55), 0 0 220px 90px rgba(220,70,0,0.35)",
          transform: `scale(${(0.85 + 0.15 * enter) * breathe})`,
          opacity: enter,
        }}
      />
      <Grain opacity={0.16} />
      {words.map((w, i) => {
        if (t < w.at || (w.until != null && t >= w.until)) return null;
        const p = pop(t, w.at, fps, 16);
        const onSun = w.pos === "mid";
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: y[w.pos],
              transform: `translateY(-50%) scale(${1.18 - 0.18 * p})`,
              opacity: Math.min(1, p * 2),
              textAlign: "center",
              fontFamily: F.ui,
              fontWeight: 800,
              fontSize: w.size ?? 128,
              lineHeight: 0.95,
              letterSpacing: "-0.05em",
              color: onSun ? C.ink : "#FFFFFF",
            }}
          >
            {w.text}
          </div>
        );
      })}
    </div>
  );
};

// ---------- 5. Profesional y humano (split, arriba) ----------
export const Sliders: React.FC = () => {
  const {t, fps} = useT();
  const rows = [
    {label: "Profesional", at: 26.85},
    {label: "Humano", at: 27.6},
  ];
  return (
    <div style={appear(pop(t, 25.2, fps), 50)}>
      <Window width={880} title={<span>Personalidad del asistente</span>}>
        <div style={{display: "flex", flexDirection: "column", gap: 40, padding: "10px 4px"}}>
          {rows.map((r) => {
            const v = interpolate(t, [r.at, r.at + 0.7], [0.12, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
            return (
              <div key={r.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: F.ui,
                    fontWeight: 700,
                    fontSize: 38,
                    color: C.ink,
                    marginBottom: 16,
                  }}
                >
                  <span>{r.label}</span>
                  <span style={{fontFamily: F.cap, color: C.mute}}>{Math.round(v * 100)}%</span>
                </div>
                <div style={{height: 26, borderRadius: 26, background: "#EFE6D6", position: "relative"}}>
                  <div style={{width: `${v * 100}%`, height: "100%", borderRadius: 26, background: C.yellow}} />
                  <div
                    style={{
                      position: "absolute",
                      top: -9,
                      left: `calc(${v * 100}% - 22px)`,
                      width: 44,
                      height: 44,
                      borderRadius: 44,
                      background: "#fff",
                      border: `4px solid ${C.ink}`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Window>
    </div>
  );
};

// ---------- 6. La empresa se tomó el tiempo de escribirle (pantalla completa) ----------
export const WaChat: React.FC<{s: number}> = ({s}) => {
  const {t, fps} = useT();
  return (
    <div style={{position: "absolute", top: 260, left: 0, right: 0, display: "flex", justifyContent: "center"}}>
      <div style={appear(pop(t, s + 0.05, fps), 60)}>
        <Window
          width={960}
          title={
            <div style={{display: "flex", alignItems: "center", gap: 16}}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 54,
                  background: "#1F3A66",
                  color: "#fff",
                  fontSize: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ZH
              </div>
              <div style={{lineHeight: 1.15}}>
                Zapata Hospitality
                <div style={{fontSize: 22, fontWeight: 500, color: C.green}}>en línea</div>
              </div>
            </div>
          }
        >
          <div style={{display: "flex", flexDirection: "column", gap: 22, minHeight: 820}}>
            <div
              style={{
                alignSelf: "center",
                fontFamily: F.cap,
                fontSize: 24,
                letterSpacing: "0.1em",
                color: C.mute,
                background: "#F2EBDD",
                padding: "8px 20px",
                borderRadius: 12,
              }}
            >
              HOY
            </div>
            {t >= 30.6 && t < 32.3 ? (
              <div style={{alignSelf: "flex-start", background: "#fff", borderRadius: 26, border: `1.5px solid ${C.line}`}}>
                <Typing t={t} />
              </div>
            ) : null}
            <Bubble side="in" p={pop(t, 32.3, fps)}>
              Hola Laura, bienvenida. Te escribimos para que tu estadía sea perfecta: cualquier cosa que necesites, aquí
              estamos.
            </Bubble>
            <Bubble side="out" p={pop(t, 33.9, fps)} bg="#DDF6CF">
              ¡Qué detalle! Muchas gracias
            </Bubble>
            <div
              style={{
                alignSelf: "flex-end",
                fontFamily: F.ui,
                fontWeight: 600,
                fontSize: 22,
                color: "#34A3E0",
                opacity: ramp(t, 34.3, 34.6),
              }}
            >
              ✓✓ Leído
            </div>
          </div>
        </Window>
      </div>
    </div>
  );
};

// ---------- 7. Checklist del asistente (split, arriba) ----------
export const Checklist: React.FC = () => {
  const {t, fps} = useT();
  const items = [
    {text: "Aprende tu contexto", at: 43.9},
    {text: "Aprende las FAQs de tu propiedad", at: 46.1},
    {text: "Se comunica como tú", at: 48.1},
  ];
  return (
    <div style={appear(pop(t, 43.6, fps), 50)}>
      <Window
        width={900}
        title={
          <span>
            Tu asistente IA <span style={{color: C.mute, fontWeight: 500}}>· Monark</span>
          </span>
        }
      >
        <div style={{display: "flex", flexDirection: "column", gap: 30, padding: "6px 0"}}>
          {items.map((it) => {
            const p = pop(t, it.at, fps, 15);
            return (
              <div
                key={it.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  fontFamily: F.ui,
                  fontWeight: 700,
                  fontSize: 38,
                  color: C.ink,
                  opacity: 0.3 + 0.7 * Math.min(1, p),
                }}
              >
                <Check p={Math.min(1, p)} />
                {it.text}
              </div>
            );
          })}
        </div>
      </Window>
    </div>
  );
};

// ---------- 8. CTA Monark (pantalla completa) ----------
export const MonarkCta: React.FC<{s: number}> = ({s}) => {
  const {t, fps} = useT();
  const click = ramp(t, 50.6, 50.75) - ramp(t, 50.75, 50.95);
  const cursorX = interpolate(t, [49.9, 50.6], [820, 560], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const cursorY = interpolate(t, [49.9, 50.6], [1250, 1040], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const chips = [
    {label: "PMS", at: 52.4},
    {label: "Asistente IA", at: 53.5},
    {label: "y mucho más", at: 54.3},
  ];
  return (
    <div style={{position: "absolute", inset: 0}}>
      <div style={{position: "absolute", top: 380, left: 0, right: 0, display: "flex", justifyContent: "center"}}>
        <div style={appear(pop(t, s + 0.05, fps), 60)}>
          <Window width={960} title={<span style={{color: C.mute, fontWeight: 600}}>monark · link en el perfil</span>}>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 60, padding: "90px 0 80px"}}>
              <Img src={staticFile("brand/monark-logo.png")} style={{width: 640}} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "26px 54px",
                  borderRadius: 999,
                  background: C.ink,
                  color: "#fff",
                  fontFamily: F.ui,
                  fontWeight: 700,
                  fontSize: 40,
                  transform: `scale(${1 - 0.06 * click})`,
                }}
              >
                Link en mi perfil
                <svg width="34" height="34" viewBox="0 0 24 24">
                  <path d="M5 12h13M13 6l6 6-6 6" stroke={C.yellow} strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </Window>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1290,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 18,
        }}
      >
        {chips.map((c) => (
          <div key={c.label} style={appear(pop(t, c.at, fps), 30)}>
            <Chip>{c.label}</Chip>
          </div>
        ))}
      </div>
      {/* cursor */}
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          opacity: ramp(t, 49.8, 50.0) * (1 - ramp(t, 51.4, 51.7)),
          transform: `scale(${1 - 0.15 * click})`,
          filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))",
        }}
      >
        <path d="M4 2l16 9.5-7 1.6-3.6 6.6z" fill="#fff" stroke={C.ink} strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// ---------- 9. Cierre sobre la cara ----------
export const OutroBadge: React.FC<{s: number}> = ({s}) => {
  const {t, fps} = useT();
  return (
    <div style={{position: "absolute", top: 170, left: 0, right: 0, display: "flex", justifyContent: "center"}}>
      <div style={appear(pop(t, s + 0.1, fps), -30)}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "18px 34px",
            borderRadius: 999,
            background: "rgba(252,249,243,0.94)",
            boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)",
          }}
        >
          <Img src={staticFile("brand/monark-logo.png")} style={{width: 210}} />
          <span style={{width: 2, height: 40, background: C.line}} />
          <span style={{fontFamily: F.ui, fontWeight: 700, fontSize: 32, color: C.ink}}>link en el perfil</span>
        </div>
      </div>
    </div>
  );
};
