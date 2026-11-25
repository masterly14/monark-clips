/**
 * Video 2 (Zapata Hospitality → Monark) editado con la skill Monark Motion, en modo presentador.
 * Tiempos en segundos, tomados de public/clips/video2.captions.json (startMs de cada palabra).
 *
 * Beat map
 *  A1  0.00–3.20  presentador  Gancho: "Rentas cortas en el Eje *Cafetero*" + chip "Caso real · Zapata"
 *  A2  3.20–11.08 violeta      Caso: chatbot IA → diagrama de integraciones (OTAs, Airbnb, Booking, WhatsApp)
 *  A3  11.08–18.0 coral        Prueba: chat de WhatsApp que responde → KPI "+17 %" satisfacción
 *  A4  18.0–23.28 presentador  Giro: "¿Por *qué*?" → "Más *interesante*"
 *  A5  23.28–25.2 tinta        Resolución: "Esto es *hospitalidad.*" (personaje grande)
 *  A6a 25.2–28.89 presentador  "Profesional y *humano*"
 *  A6b 28.89–35.08 crema       Demostración: el huésped recibe un WhatsApp → "Se tomó el *tiempo*"
 *  A6c 35.08–39.72 amarillo    "Algo *psicológico*" → "Más *personal*" → "Más *cercano*"
 *  A7  39.72–49.64 violeta     Producto: tarjeta del asistente IA de Monark (checklist + escritura)
 *  A8  49.64–54.8  crema       CTA: tarjeta Monark, clic en "Link en mi perfil", chips PMS / IA / más
 *  A9  54.8–59.78  coral       Oferta: contador 30 % + sello "*Gratis.*"
 *  A10 59.78–61.55 presentador "Link en el *perfil*"
 *  A11 61.55–64.5  amarillo    Tarjeta final
 */
import React from "react";
import {AbsoluteFill, Easing, Img, staticFile} from "remotion";
import {
  ActBackground,
  AppIcon,
  Character,
  Check,
  Counter,
  Cursor,
  fonts,
  Headline,
  MonoLabel,
  Pill,
  Presenter,
  type PresenterSeg,
  rampAt,
  shake,
  springAt,
  SPRING,
  Stamp,
  Typewriter,
  UI,
  UICard,
  useTime,
  type BgName,
} from "../kit";

export const FPS = 30;
export const DURATION_S = 64.5;
const VOICE_END = 61.55;

// ---------- actos (fondo) ----------
const ACTS: {from: number; to: number; bg: BgName | null}[] = [
  {from: 0, to: 3.2, bg: null},
  {from: 3.2, to: 11.08, bg: "violeta"},
  {from: 11.08, to: 18.0, bg: "coral"},
  {from: 18.0, to: 23.28, bg: null},
  {from: 23.28, to: 25.2, bg: "tinta"},
  {from: 25.2, to: 28.89, bg: null},
  {from: 28.89, to: 35.08, bg: "crema"},
  {from: 35.08, to: 39.72, bg: "amarillo"},
  {from: 39.72, to: 49.64, bg: "violeta"},
  {from: 49.64, to: 54.8, bg: "crema"},
  {from: 54.8, to: 59.78, bg: "coral"},
  {from: 59.78, to: VOICE_END, bg: null},
  {from: VOICE_END, to: DURATION_S, bg: "amarillo"},
];

const PRESENTER: PresenterSeg[] = [
  {from: 0, to: 3.2, mode: "full"},
  {from: 3.2, to: 18.0, mode: "split"},
  {from: 18.0, to: 23.28, mode: "full"},
  {from: 23.28, to: 25.2, mode: "split"},
  {from: 25.2, to: 28.89, mode: "full"},
  {from: 28.89, to: 59.78, mode: "split"},
  {from: 59.78, to: VOICE_END, mode: "full"},
];

// ---------- recursos locales ----------
const CaseChip: React.FC = () => {
  const {t, fps} = useTime();
  const e = springAt(t, 0.04, fps, SPRING.card);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top: 96,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "12px 24px 12px 20px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.94)",
        boxShadow: "0 18px 40px -18px rgba(0,0,0,0.5)",
        opacity: Math.min(1, e * 1.5),
        transform: `translateY(${(1 - e) * -24}px)`,
      }}
    >
      <MonoLabel color={UI.ink} size={22}>// caso real</MonoLabel>
      <span style={{width: 2, height: 34, background: UI.line}} />
      <Img src={staticFile("brand/zapata-logo.png")} style={{width: 190}} />
    </div>
  );
};

const NodeGraph: React.FC = () => {
  const {t, fps} = useTime();
  const center = {x: 540, y: 660};
  const kids = [
    {label: "Airbnb", src: "brand/airbnb.png", zoom: 1, x: 250, at: 8.66},
    {label: "Booking", src: "brand/booking.png", zoom: 1.14, x: 540, at: 9.2},
    {label: "WhatsApp", src: "brand/whatsapp.png", zoom: 1.28, x: 830, at: 10.48},
  ];
  const kidY = 920;
  const c = springAt(t, 3.57, fps, SPRING.card);
  const otas = springAt(t, 7.77, fps, SPRING.accent);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {kids.map((k) => {
          const q = rampAt(t, k.at, k.at + 10 / 60);
          if (q <= 0) return null;
          return (
            <line
              key={k.label}
              x1={center.x}
              y1={center.y + 80}
              x2={center.x + (k.x - center.x) * q}
              y2={center.y + 80 + (kidY - 70 - center.y - 80) * q}
              stroke="#FFFFFF"
              strokeWidth={4}
              strokeDasharray="10 12"
              strokeLinecap="round"
              opacity={0.85}
            />
          );
        })}
      </svg>
      {/* nodo central */}
      <div
        style={{
          position: "absolute",
          left: center.x - 80,
          top: center.y - 80,
          width: 160,
          height: 160,
          borderRadius: 40,
          background: UI.dark,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: UI.cardShadow,
          transform: `scale(${0.4 + 0.6 * c})`,
          opacity: Math.min(1, c * 1.5),
        }}
      >
        <svg width="84" height="84" viewBox="0 0 24 24">
          <path d="M12 2l2.2 6.3L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.7z" fill="#FFD34D" />
          <circle cx="19" cy="18" r="2.2" fill="#FFD34D" />
        </svg>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: center.y + 96, textAlign: "center", opacity: c}}>
        <MonoLabel color="#FFFFFF" size={26}>chatbot_ia</MonoLabel>
      </div>
      {/* pastilla OTAs */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 478,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, otas * 1.5),
          transform: `scale(${0.7 + 0.3 * otas})`,
        }}
      >
        <div style={{padding: "10px 26px", borderRadius: 999, background: "#FFFFFF", fontFamily: fonts.mono, fontWeight: 500, fontSize: 26, color: UI.ink}}>
          todas las OTAs ✓
        </div>
      </div>
      {/* nodos hijos */}
      {kids.map((k) => {
        const e = springAt(t, k.at, fps, SPRING.card);
        if (e <= 0) return null;
        return (
          <div
            key={k.label}
            style={{
              position: "absolute",
              left: k.x - 70,
              top: kidY - 60,
              width: 140,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              opacity: Math.min(1, e * 1.5),
              transform: `translateY(${(1 - e) * 40}px) scale(${0.6 + 0.4 * e})`,
            }}
          >
            <AppIcon src={k.src} zoom={k.zoom} size={120} />
            <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 30, color: "#FFFFFF"}}>{k.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

type Msg = {side: "in" | "out"; text: React.ReactNode; at: number; time: string};

const WaCard: React.FC<{
  at: number;
  out?: number;
  top: number;
  name: string;
  avatar: string;
  avatarBg: string;
  status: string;
  msgs: Msg[];
  typing?: {side: "in" | "out"; from: number; to: number};
  readAt?: number;
}> = ({at, out, top, name, avatar, avatarBg, status, msgs, typing, readAt}) => {
  const {t, fps} = useTime();
  return (
    <UICard at={at} out={out} top={top} width={880} style={{background: "#EFE7DD"}}>
      <div style={{margin: -40}}>
        <div style={{display: "flex", alignItems: "center", gap: 18, padding: "22px 30px", background: "#F6F6F6", borderBottom: "1px solid #DDD"}}>
          <div style={{width: 64, height: 64, borderRadius: 64, background: avatarBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.sans, fontWeight: 700, fontSize: 24}}>
            {avatar}
          </div>
          <div>
            <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 30, color: "#111"}}>{name}</div>
            <div style={{fontFamily: fonts.sans, fontSize: 22, color: "#667781"}}>{status}</div>
          </div>
          <div style={{marginLeft: "auto"}}>
            <Img src={staticFile("brand/whatsapp.png")} style={{width: 52, height: 52, objectFit: "cover", transform: "scale(1.28)", borderRadius: 12}} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: 16,
            minHeight: 380,
            padding: "26px 26px 30px",
            backgroundImage: "radial-gradient(rgba(120,100,70,0.12) 1.6px, transparent 1.6px)",
            backgroundSize: "26px 26px",
          }}
        >
          {msgs.map((m, i) => {
            if (t < m.at) return null;
            const e = springAt(t, m.at, fps, SPRING.accent);
            const isOut = m.side === "out";
            return (
              <div
                key={i}
                style={{
                  alignSelf: isOut ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  padding: "16px 22px 10px",
                  borderRadius: 20,
                  borderTopRightRadius: isOut ? 4 : 20,
                  borderTopLeftRadius: isOut ? 20 : 4,
                  background: isOut ? "#D9FDD3" : "#FFFFFF",
                  boxShadow: "0 1px 1px rgba(0,0,0,0.12)",
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: 30,
                  lineHeight: 1.32,
                  color: "#111",
                  transformOrigin: isOut ? "right bottom" : "left bottom",
                  transform: `scale(${0.85 + 0.15 * e})`,
                  opacity: Math.min(1, e * 1.5),
                }}
              >
                {m.text}
                <div style={{textAlign: "right", fontSize: 18, color: "#667781", marginTop: 4}}>
                  {m.time} {isOut ? <span style={{color: readAt != null && t >= readAt ? "#53BDEB" : "#9AA5AB", fontWeight: 700}}>✓✓</span> : null}
                </div>
              </div>
            );
          })}
          {typing && t >= typing.from && t < typing.to ? (
            <div style={{alignSelf: typing.side === "out" ? "flex-end" : "flex-start", background: typing.side === "out" ? "#D9FDD3" : "#fff", borderRadius: 20, padding: "20px 24px", display: "flex", gap: 8}}>
              {[0, 1, 2].map((k) => (
                <span key={k} style={{width: 13, height: 13, borderRadius: 13, background: "#8A8A8A", opacity: 0.35 + 0.65 * Math.max(0, Math.sin(t * 9 - k * 0.9))}} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </UICard>
  );
};

const KpiCard: React.FC = () => {
  const {t, fps} = useTime();
  return (
    <UICard at={14.36} top={470} width={860} title={<span>Reviews de huéspedes</span>}>
      <MonoLabel>// satisfacción</MonoLabel>
      <div style={{display: "flex", alignItems: "flex-end", gap: 22, marginTop: 6}}>
        <Counter
          from={0}
          to={17}
          at={15.36}
          dur={0.9}
          format={(n) => `+${Math.round(n)}%`}
          style={{fontFamily: fonts.sans, fontWeight: 800, fontSize: 168, letterSpacing: "-0.04em", lineHeight: 0.95, color: UI.ink}}
        />
        <div style={{paddingBottom: 26}}>
          <Pill tone="ok" at={16.14} size={26}>
            ▲ en Airbnb
          </Pill>
        </div>
      </div>
      <div style={{display: "flex", gap: 6, marginTop: 26, alignItems: "flex-end", height: 130}}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const at = 16.2 + i * 0.22;
          const e = springAt(t, at, fps, SPRING.accent);
          if (e <= 0) return <span key={i} style={{width: 84}} />;
          return (
            <Img
              key={i}
              src={staticFile("props/ht/huesped.png")}
              style={{height: 130, imageRendering: "pixelated", transformOrigin: "50% 100%", transform: `scale(${e})`}}
            />
          );
        })}
      </div>
    </UICard>
  );
};

const AiCard: React.FC = () => {
  const {t} = useTime();
  const rows = [
    {text: "Aprende tu contexto", at: 43.91},
    {text: "Aprende las FAQs de tu propiedad", at: 46.08},
    {text: "Se comunica como tú", at: 48.13},
  ];
  return (
    <UICard
      at={42.01}
      top={470}
      width={880}
      variant="dark"
      title={
        <span>
          Asistente IA <span style={{color: UI.darkMute, fontWeight: 500}}>· Monark</span>
        </span>
      }
    >
      <div style={{display: "flex", flexDirection: "column", gap: 26}}>
        {rows.map((r) => (
          <div key={r.text} style={{display: "flex", alignItems: "center", gap: 24, opacity: t >= r.at ? 1 : 0.35}}>
            <Check at={r.at} size={50} />
            <span style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 34, color: UI.darkText}}>{r.text}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 34,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "18px 22px",
          borderRadius: 18,
          border: "1.5px solid rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <div style={{flex: 1, fontFamily: fonts.mono, fontSize: 25, color: t >= 44.18 && t < 45.96 ? UI.darkText : UI.darkMute}}>
          {t < 44.18 ? "Enséñale a Monark…" : t < 45.96 ? <Typewriter text="Así le hablamos a nuestros huéspedes…" from={44.18} to={45.7} /> : "Enséñale a Monark…"}
        </div>
        <div style={{width: 48, height: 48, borderRadius: 48, background: t >= 45.96 && t < 46.4 ? "#FFD34D" : "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center"}}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 19V5M5 12l7-7 7 7" stroke={UI.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {t >= 45.96 ? (
        <div style={{marginTop: 18}}>
          <Pill tone="ok" at={45.96}>
            contexto_guardado ✓
          </Pill>
        </div>
      ) : null}
    </UICard>
  );
};

const MonarkCard: React.FC = () => {
  const {t, fps} = useTime();
  const click = t >= 50.18 && t < 50.32 ? 0.95 : 1;
  const chips = [
    {label: "PMS", at: 52.39},
    {label: "Asistente IA", at: 53.49},
    {label: "+ mucho más", at: 54.31},
  ];
  return (
    <>
      <UICard at={49.7} top={470} width={860} title={<span style={{color: UI.mute, fontWeight: 600}}>link en el perfil</span>}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 46, padding: "26px 0 10px"}}>
          <Img src={staticFile("brand/monark-logo.png")} style={{width: 540}} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "24px 52px",
              borderRadius: 999,
              background: UI.ink,
              color: "#fff",
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: 38,
              transform: `scale(${click})`,
            }}
          >
            Link en mi perfil
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path d="M5 12h13M13 6l6 6-6 6" stroke="#EFAF1A" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </UICard>
      <div style={{position: "absolute", left: 0, right: 0, top: 968, display: "flex", justifyContent: "center", gap: 18}}>
        {chips.map((c) => {
          const e = springAt(t, c.at, fps, SPRING.accent);
          if (e <= 0) return null;
          return (
            <div
              key={c.label}
              style={{
                padding: "14px 28px",
                borderRadius: 999,
                background: "#fff",
                boxShadow: "0 14px 30px -14px rgba(60,30,0,0.45)",
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: 32,
                color: UI.ink,
                opacity: Math.min(1, e * 1.5),
                transform: `translateY(${(1 - e) * 24}px) scale(${0.8 + 0.2 * e})`,
              }}
            >
              {c.label}
            </div>
          );
        })}
      </div>
      <Cursor path={[{x: 900, y: 1010, at: 49.85}, {x: 600, y: 840, at: 50.15}]} clicks={[50.18]} hideAt={51.2} />
    </>
  );
};

const OfferCard: React.FC = () => {
  const {t} = useTime();
  return (
    <div style={{position: "absolute", inset: 0, transform: shake(t, 59.44)}}>
      <UICard at={55.0} top={470} width={860} title={<span>Oferta Monark</span>}>
        <MonoLabel>// descuento</MonoLabel>
        <Counter
          from={0}
          to={30}
          at={55.58}
          dur={0.7}
          format={(n) => `${Math.round(n)}%`}
          style={{display: "block", fontFamily: fonts.sans, fontWeight: 800, fontSize: 190, letterSpacing: "-0.04em", lineHeight: 0.95, color: UI.ink}}
        />
        <div style={{display: "flex", flexDirection: "column", gap: 22, marginTop: 24}}>
          {[
            {text: "En tus 3 primeros meses", at: 57.11},
            {text: "Implementación", at: 58.03, check: 58.91},
          ].map((r) => (
            <div key={r.text} style={{display: "flex", alignItems: "center", gap: 22, opacity: t >= r.at ? 1 : 0}}>
              <Check at={r.check ?? r.at} size={46} />
              <span style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 36, color: UI.ink}}>{r.text}</span>
            </div>
          ))}
        </div>
      </UICard>
      <Stamp text="Gratis." at={59.44} x={720} y={930} size={110} />
    </div>
  );
};

const EndCard: React.FC = () => {
  const {t, fps} = useTime();
  const s = VOICE_END;
  const reveal = rampAt(t, s + 0.05, s + 0.35, Easing.inOut(Easing.cubic));
  const peek = springAt(t, s + 0.4, fps, SPRING.card);
  const tag1 = rampAt(t, s + 0.6, s + 0.75);
  const tag2 = springAt(t, s + 0.85, fps, SPRING.accent);
  const btn = springAt(t, s + 1.05, fps, SPRING.card);
  const row = rampAt(t, s + 1.4, s + 1.7);
  return (
    <AbsoluteFill>
      {/* personaje asomado detrás del wordmark (duotono: solo tinta sobre amarillo) */}
      <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 1110, overflow: "hidden"}}>
        <Img
          src={staticFile("character/ht/peek-abajo-ink.png")}
          style={{
            position: "absolute",
            left: 540 - 300,
            top: 1110 - 410 + (1 - peek) * 420,
            width: 600,
            imageRendering: "pixelated",
          }}
        />
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 1080, display: "flex", justifyContent: "center", clipPath: `inset(0 ${100 - reveal * 100}% 0 0)`}}>
        <Img src={staticFile("brand/monark-logo.png")} style={{width: 640, filter: "brightness(0)"}} />
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 1300, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 18}}>
        <span style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 50, letterSpacing: "-0.03em", color: UI.ink, opacity: tag1, transform: `translateY(${(1 - tag1) * 20}px)`}}>Esto es</span>
        <span style={{fontFamily: fonts.serif, fontStyle: "italic", fontSize: 76, color: UI.ink, opacity: Math.min(1, tag2 * 1.5), transform: `scale(${1.08 - 0.08 * tag2})`}}>hospitalidad.</span>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 1440, display: "flex", justifyContent: "center"}}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "26px 56px",
            borderRadius: 999,
            background: "#FFFFFF",
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: 40,
            color: UI.ink,
            boxShadow: "0 20px 40px -20px rgba(80,40,0,0.5)",
            opacity: Math.min(1, btn * 1.5),
            transform: `translateY(${(1 - btn) * 40}px) scale(${t >= s + 1.75 && t < s + 1.9 ? 0.96 : 1})`,
          }}
        >
          Link en el perfil
          <svg width="32" height="32" viewBox="0 0 24 24">
            <path d="M5 12h13M13 6l6 6-6 6" stroke={UI.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 1580, textAlign: "center", opacity: row * 0.7}}>
        <MonoLabel color={UI.ink} size={24}>30% dcto. 3 meses · implementación gratis</MonoLabel>
      </div>
      <Cursor path={[{x: 880, y: 1700, at: s + 1.3}, {x: 600, y: 1480, at: s + 1.72}]} clicks={[s + 1.75]} />
    </AbsoluteFill>
  );
};

// ---------- composición ----------
export const Video2Motion: React.FC = () => {
  const {t} = useTime();
  const act = ACTS.find((a) => t >= a.from && t < a.to) ?? ACTS[ACTS.length - 1];

  return (
    <AbsoluteFill style={{background: "#000"}}>
      {act.bg ? <ActBackground bg={act.bg} /> : null}

      {/* A2: caso → integraciones (mitad superior) */}
      {t >= 3.2 && t < 11.08 ? <NodeGraph /> : null}

      {/* A3: WhatsApp que responde → +17 % */}
      <WaCard
        at={11.1}
        out={14.36}
        top={470}
        name="Laura · huésped"
        avatar="L"
        avatarBg="#C98A6B"
        status="Airbnb · llega hoy"
        msgs={[
          {side: "in", text: "Hola, ¿me compartes la clave del Wi-Fi?", at: 11.6, time: "3:04 p. m."},
          {side: "out", text: <>¡Claro! Es <b>Cafetero2026</b>. Bienvenida a Salento.</>, at: 13.19, time: "3:04 p. m."},
        ]}
        typing={{side: "out", from: 12.2, to: 13.19}}
        readAt={13.92}
      />
      {t >= 14.36 && t < 18.0 ? <KpiCard /> : null}

      {/* A5: hospitalidad — el personaje se para sobre el borde del panel del presentador */}
      <Character from={23.28} to={25.2} top={520} height={760} centerX={540} schedule={[{at: 23.28, name: "neutral"}, {at: 24.24, name: "feliz-ojos-cerrados"}]} />

      {/* A6b: el huésped recibe el WhatsApp */}
      <WaCard
        at={28.95}
        out={35.08}
        top={470}
        name="Zapata Hospitality"
        avatar="ZH"
        avatarBg="#1F3A66"
        status="en línea"
        msgs={[
          {side: "in", text: "Hola Laura, ¡bienvenida a Salento! Cualquier cosa que necesites, aquí estamos.", at: 33.81, time: "3:02 p. m."},
          {side: "out", text: "¡Qué detalle, gracias!", at: 34.55, time: "3:03 p. m."},
        ]}
        typing={{side: "in", from: 30.4, to: 33.81}}
        readAt={34.8}
      />

      {/* A6c: personal y cercano — personaje sobre el borde del panel */}
      <Character from={35.08} to={39.72} top={520} height={760} centerX={540} schedule={[{at: 35.08, name: "mira-titular"}, {at: 37.54, name: "feliz-ojos-cerrados"}, {at: 38.52, name: "sonrisa"}]} />

      {/* A7: asistente IA de Monark */}
      {t >= 42.01 && t < 49.64 ? <AiCard /> : null}

      {/* A8: CTA Monark */}
      {t >= 49.64 && t < 54.8 ? <MonarkCard /> : null}

      {/* A9: oferta */}
      {t >= 54.8 && t < 59.78 ? <OfferCard /> : null}

      {/* presentador: voz continua; pantalla completa ↔ dividida (nunca sticker) */}
      {t < VOICE_END ? <Presenter src="clips/video2-raw.mp4" segments={PRESENTER} /> : null}
      {t < 3.2 ? <CaseChip /> : null}

      {/* titulares (pantalla completa: top 210 sobre velo · dividida: top 170 sobre color) */}
      <Headline on="presentador" from={0} to={3.2} top={210} words={[{t: "Rentas", at: 1.53}, {t: "cortas", at: 1.85}, {t: "en el", at: 2.13}, {t: "Eje", at: 2.28}, {t: "Cafetero", at: 2.47, accent: true}]} />
      <Headline on="violeta" from={3.2} to={7.11} top={170} words={[{t: "Un", at: 3.48}, {t: "chatbot", at: 3.57, accent: true}, {t: "de", at: 3.95}, {t: "IA", at: 3.99}]} />
      <Headline on="violeta" from={7.11} to={11.08} top={170} words={[{t: "En", at: 7.11}, {t: "todas", at: 7.2}, {t: "las", at: 7.56}, {t: "OTAs", at: 7.77, accent: true}]} />
      <Headline on="coral" from={11.08} to={14.36} top={170} words={[{t: "Esto", at: 13.19}, {t: "funciona", at: 13.4}, {t: "en", at: 13.82}, {t: "WhatsApp", at: 13.92, accent: true}]} accentSize={150} />
      <Headline on="coral" from={14.36} to={18.0} top={170} words={[{t: "+17%", at: 15.36}, {t: "en", at: 15.91}, {t: "satisfacción", at: 16.14, accent: true}]} accentSize={150} />
      <Headline on="presentador" from={18.0} to={21.68} top={210} words={[{t: "¿Por", at: 19.54}, {t: "qué?", at: 19.72, accent: true}]} />
      <Headline on="presentador" from={21.68} to={23.28} top={210} words={[{t: "Más", at: 21.68}, {t: "interesante", at: 21.9, accent: true}]} accentSize={160} />
      <Headline on="tinta" from={23.28} to={25.2} top={170} words={[{t: "Esto", at: 24.08}, {t: "es", at: 24.13}, {t: "hospitalidad.", at: 24.24, accent: true}]} accentSize={150} />
      <Headline on="presentador" from={25.2} to={28.89} top={210} words={[{t: "Profesional", at: 26.91}, {t: "y", at: 27.56}, {t: "humano", at: 27.64, accent: true}]} />
      <Headline on="crema" from={28.89} to={32.99} top={170} words={[{t: "El", at: 29.55}, {t: "huésped", at: 29.67, accent: true}]} />
      <Headline on="crema" from={32.99} to={35.08} top={170} words={[{t: "Se", at: 32.99}, {t: "tomó", at: 33.05}, {t: "el", at: 33.35}, {t: "tiempo", at: 33.43, accent: true}]} />
      <Headline on="amarillo" from={35.08} to={37.3} top={170} words={[{t: "Algo", at: 35.08}, {t: "psicológico", at: 35.48, accent: true}]} accentSize={150} />
      <Headline on="amarillo" from={37.3} to={38.25} top={170} words={[{t: "Más", at: 37.33}, {t: "personal", at: 37.54, accent: true}]} />
      <Headline on="amarillo" from={38.25} to={39.72} top={170} words={[{t: "Más", at: 38.28}, {t: "cercano", at: 38.52, accent: true}]} />
      <Headline on="violeta" from={39.72} to={41.9} top={170} words={[{t: "Justamente", at: 39.72, accent: true}]} accentSize={160} />
      <Headline on="violeta" from={41.9} to={49.64} top={170} words={[{t: "Un", at: 41.92}, {t: "asistente", at: 42.01}, {t: "de", at: 42.47}, {t: "IA", at: 42.52, accent: true}]} />
      <Headline on="crema" from={49.64} to={50.7} top={170} words={[{t: "En", at: 49.64}, {t: "mi", at: 50.09}, {t: "perfil", at: 50.18, accent: true}]} />
      <Headline on="crema" from={50.7} to={52.2} top={170} words={[{t: "Acceso", at: 50.72}, {t: "a", at: 50.98}, {t: "Monark", at: 51.04, accent: true}]} />
      <Headline on="crema" from={52.2} to={54.29} top={170} words={[{t: "Es", at: 52.23}, {t: "el", at: 52.26}, {t: "PMS", at: 52.39, accent: true}]} />
      <Headline on="crema" from={54.29} to={54.8} top={170} words={[{t: "y", at: 54.29}, {t: "mucho", at: 54.31}, {t: "más", at: 54.57, accent: true}]} />
      <Headline on="coral" from={54.8} to={58.0} top={170} words={[{t: "30%", at: 55.58, accent: true}, {t: "de", at: 56.03}, {t: "descuento", at: 56.16}]} />
      <Headline on="coral" from={58.0} to={59.78} top={170} words={[{t: "Implementación", at: 58.03}, {t: "gratis", at: 59.44, accent: true}]} size={104} />
      <Headline on="presentador" from={59.78} to={VOICE_END} top={210} words={[{t: "Link", at: 60.8}, {t: "en el", at: 61.05}, {t: "perfil", at: 61.22, accent: true}]} exit={false} />

      {t >= VOICE_END ? <EndCard /> : null}
    </AbsoluteFill>
  );
};