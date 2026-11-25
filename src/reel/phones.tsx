import React from "react";
import {Img, interpolate, staticFile, Easing} from "remotion";
import {C, F} from "./style";
import {pop, ramp, useT} from "./graphics";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const PW = 560; // ancho del teléfono
const PH = 1160;

// ---------- marco de teléfono ----------
const Phone: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      position: "absolute",
      width: PW,
      height: PH,
      padding: 14,
      borderRadius: 86,
      background: "#17120E",
      boxShadow: "0 60px 90px -40px rgba(70,35,0,0.65), inset 0 0 0 3px #3A322B",
      ...style,
    }}
  >
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 72,
        overflow: "hidden",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        fontFamily: F.ui,
        color: "#222",
      }}
    >
      {/* barra de estado */}
      <div
        style={{
          height: 74,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 46px 0",
          fontWeight: 700,
          fontSize: 24,
        }}
      >
        <span>9:41</span>
        <span style={{width: 150, height: 40, borderRadius: 40, background: "#000"}} />
        <span style={{display: "flex", gap: 6, alignItems: "center"}}>
          <span style={{width: 26, height: 14, borderRadius: 4, border: "2px solid #222", position: "relative"}}>
            <span style={{position: "absolute", inset: 2, right: 6, background: "#222", borderRadius: 1}} />
          </span>
        </span>
      </div>
      {children}
    </div>
  </div>
);

const Back = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path d="M15 4l-8 8 8 8" stroke="#222" strokeWidth="2.6" fill="none" strokeLinecap="round" />
  </svg>
);

const Dots3 = ({t}: {t: number}) => (
  <div style={{display: "flex", gap: 7}}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 11,
          height: 11,
          borderRadius: 11,
          background: "#9A9A9A",
          opacity: 0.35 + 0.65 * Math.max(0, Math.sin(t * 9 - i * 0.9)),
        }}
      />
    ))}
  </div>
);

const fadeUp = (p: number): React.CSSProperties => ({
  opacity: Math.min(1, p * 1.5),
  transform: `translateY(${(1 - p) * 18}px)`,
});

// ---------- chat de Airbnb ----------
const Avatar: React.FC<{bg: string; label: string; size?: number}> = ({bg, label, size = 50}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      flexShrink: 0,
      background: bg,
      color: "#fff",
      fontWeight: 700,
      fontSize: size * 0.38,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {label}
  </div>
);

const AirbnbMsg: React.FC<{
  who: string;
  time: string;
  avatar: React.ReactNode;
  p: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({who, time, avatar, p, children, footer}) => (
  <div style={{display: "flex", gap: 16, padding: "0 28px", ...fadeUp(p)}}>
    {avatar}
    <div>
      <div style={{fontSize: 23, fontWeight: 700}}>
        {who} <span style={{fontWeight: 500, fontSize: 17, color: "#717171"}}>{time}</span>
      </div>
      <div style={{fontSize: 23, lineHeight: 1.38, marginTop: 4, color: "#222"}}>{children}</div>
      {footer}
    </div>
  </div>
);

const AirbnbChat: React.FC = () => {
  const {t, fps} = useT();
  return (
    <>
      {/* encabezado */}
      <div style={{padding: "10px 28px 18px", display: "flex", alignItems: "center", gap: 18, borderBottom: "1.5px solid #EBEBEB"}}>
        <Back />
        <div style={{flex: 1}}>
          <div style={{fontWeight: 700, fontSize: 25}}>Zapata Hospitality</div>
          <div style={{fontSize: 17, color: "#717171"}}>Tiempo de respuesta: 1 minuto</div>
        </div>
        <span style={{fontSize: 26, fontWeight: 700}}>···</span>
      </div>
      {/* anuncio */}
      <div style={{padding: "20px 28px", display: "flex", gap: 16, borderBottom: "1.5px solid #EBEBEB"}}>
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 12,
            flexShrink: 0,
            background: "linear-gradient(145deg, #7BA05B 0%, #4E7A3A 55%, #8B5A2B 100%)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <svg width="44" height="40" viewBox="0 0 24 22">
            <path d="M2 11L12 3l10 8v10H2z" fill="#F3E3C8" />
            <path d="M9 21v-6h6v6" fill="#8B5A2B" />
          </svg>
        </div>
        <div style={{minWidth: 0}}>
          <div style={{fontWeight: 700, fontSize: 21, textDecoration: "underline", whiteSpace: "nowrap"}}>
            Cabaña en Salento | Eje Cafetero
          </div>
          <div style={{fontSize: 18, color: "#555", marginTop: 4}}>Reserva confirmada · 12–15 dic</div>
        </div>
      </div>
      {/* mensajes */}
      <div style={{flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 26, paddingBottom: 10}}>
        <div style={{alignSelf: "center", fontSize: 17, fontWeight: 600, color: "#555"}}>Hoy</div>
        <div
          style={{
            margin: "0 28px",
            padding: "16px 20px",
            borderRadius: 18,
            background: "#F7F7F7",
            fontSize: 17,
            fontWeight: 600,
            color: "#555",
          }}
        >
          Tu reserva para 2 huéspedes del 12–15 dic está confirmada.
        </div>
        <AirbnbMsg
          who="Laura"
          time="4:00 p. m."
          p={pop(t, 4.4, fps)}
          avatar={<Avatar bg="#C98A6B" label="L" />}
          footer={
            <div style={{fontSize: 16, color: "#717171", marginTop: 6, opacity: ramp(t, 5.0, 5.3)}}>
              Leído por Zapata
            </div>
          }
        >
          Hola, ¿a qué hora es el check-in?
        </AirbnbMsg>
        {t >= 5.2 && t < 6.0 ? (
          <div style={{display: "flex", gap: 16, padding: "0 28px", alignItems: "center"}}>
            <Avatar bg="#1F3A66" label="ZH" />
            <Dots3 t={t} />
          </div>
        ) : null}
        <AirbnbMsg
          who="Zapata (Coanfitrión IA)"
          time="4:00 p. m."
          p={pop(t, 6.0, fps)}
          avatar={<Avatar bg="#1F3A66" label="ZH" />}
        >
          ¡Hola Laura! El check-in es desde las 3:00 p. m. Te comparto la ubicación y la clave del Wi-Fi.
        </AirbnbMsg>
      </div>
      {/* input */}
      <div style={{padding: "16px 28px 40px"}}>
        <div style={{border: "1.5px solid #B0B0B0", borderRadius: 40, padding: "16px 24px", fontSize: 20, color: "#717171"}}>
          Escribe un mensaje
        </div>
      </div>
    </>
  );
};

// ---------- chat de WhatsApp ----------
const WaBubble: React.FC<{out?: boolean; time: string; p: number; children: React.ReactNode}> = ({out, time, p, children}) => (
  <div
    style={{
      alignSelf: out ? "flex-end" : "flex-start",
      maxWidth: "80%",
      margin: "0 22px",
      padding: "12px 18px 10px",
      borderRadius: 18,
      borderTopRightRadius: out ? 4 : 18,
      borderTopLeftRadius: out ? 18 : 4,
      background: out ? "#D9FDD3" : "#FFFFFF",
      boxShadow: "0 1px 1px rgba(0,0,0,0.12)",
      fontSize: 23,
      lineHeight: 1.35,
      color: "#111",
      transformOrigin: out ? "right top" : "left top",
      opacity: Math.min(1, p * 1.5),
      transform: `scale(${0.85 + 0.15 * p})`,
    }}
  >
    {children}
    <div style={{textAlign: "right", fontSize: 15, color: "#667781", marginTop: 4}}>
      {time} {out ? <span style={{color: "#53BDEB", fontWeight: 700}}>✓✓</span> : null}
    </div>
  </div>
);

const WhatsAppChat: React.FC = () => {
  const {t, fps} = useT();
  return (
    <>
      <div style={{padding: "8px 24px 16px", display: "flex", alignItems: "center", gap: 14, background: "#F6F6F6", borderBottom: "1px solid #DDD"}}>
        <Back />
        <Avatar bg="#1F3A66" label="ZH" size={52} />
        <div style={{flex: 1}}>
          <div style={{fontWeight: 700, fontSize: 24}}>Zapata Hospitality</div>
          <div style={{fontSize: 17, color: "#667781"}}>en línea</div>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 14,
          paddingBottom: 22,
          background: "#EFE7DD",
          backgroundImage: "radial-gradient(rgba(120,100,70,0.12) 1.6px, transparent 1.6px)",
          backgroundSize: "26px 26px",
        }}
      >
        <div
          style={{
            alignSelf: "center",
            background: "#fff",
            borderRadius: 10,
            padding: "6px 16px",
            fontSize: 16,
            color: "#555",
            boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
          }}
        >
          Hoy
        </div>
        <WaBubble time="3:02 p. m." p={pop(t, 10.75, fps)}>
          Hola Laura, ¡bienvenida a Salento! Tu check-in es hoy desde las 3:00 p. m.
        </WaBubble>
        <WaBubble out time="3:05 p. m." p={pop(t, 11.8, fps)}>
          ¿Cuál es la clave del Wi-Fi?
        </WaBubble>
        {t >= 12.3 && t < 13.0 ? (
          <div style={{alignSelf: "flex-start", margin: "0 22px", background: "#fff", borderRadius: 18, padding: "16px 20px"}}>
            <Dots3 t={t} />
          </div>
        ) : null}
        <WaBubble time="3:05 p. m." p={pop(t, 13.0, fps)}>
          Claro: <b>Cafetero2026</b>. ¡Que disfrutes tu estadía!
        </WaBubble>
      </div>
      <div style={{padding: "14px 22px 40px", background: "#F6F6F6", display: "flex", gap: 14, alignItems: "center"}}>
        <span style={{fontSize: 34, color: "#555"}}>+</span>
        <div style={{flex: 1, background: "#fff", borderRadius: 30, border: "1px solid #DDD", height: 50}} />
      </div>
    </>
  );
};

// ---------- ícono de app flotante ----------
const AppTile: React.FC<{src: string; zoom: number; p: number; rot: number; t: number; style: React.CSSProperties}> = ({
  src,
  zoom,
  p,
  rot,
  t,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      width: 170,
      height: 170,
      borderRadius: 44,
      overflow: "hidden",
      boxShadow: "0 30px 50px -18px rgba(70,35,0,0.55)",
      opacity: Math.min(1, p * 1.5),
      transform: `translateY(${Math.sin(t * 2 + rot) * 8}px) rotate(${rot}deg) scale(${0.4 + 0.6 * p})`,
      ...style,
    }}
  >
    <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`}} />
  </div>
);

// ---------- escena: OTAs (Airbnb) → WhatsApp ----------
export const PhoneChats: React.FC<{s: number}> = ({s}) => {
  const {t, fps} = useT();
  const inA = pop(t, s + 0.02, fps, 16);
  const swap = interpolate(t, [10.25, 10.85], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const otas = pop(t, 7.6, fps);
  const top = 330;
  return (
    <div style={{position: "absolute", inset: 0}}>
      {/* etiqueta OTAs */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, otas * 1.5) * (1 - swap),
          transform: `translateY(${(1 - otas) * -20}px)`,
        }}
      >
        <div
          style={{
            padding: "14px 30px",
            borderRadius: 999,
            background: C.ink,
            color: "#fff",
            fontFamily: F.cap,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: "0.12em",
          }}
        >
          TODAS LAS OTAS
        </div>
      </div>

      {/* teléfono Airbnb */}
      <Phone
        style={{
          left: 540 - PW / 2 - 190 * swap,
          top: top + (1 - inA) * 200,
          opacity: Math.min(1, inA * 1.4),
          transform: `scale(${1.22 * (1 - 0.14 * swap)}) rotate(${-5 * swap}deg)`,
          transformOrigin: "50% 40%",
          filter: swap > 0 ? `brightness(${1 - 0.12 * swap})` : undefined,
        }}
      >
        <AirbnbChat />
      </Phone>

      {/* teléfono WhatsApp */}
      {t >= 10.2 ? (
        <Phone
          style={{
            left: 540 - PW / 2 + 150 + (1 - swap) * 800,
            top: top + 40,
            transform: `rotate(${4 * swap}deg) scale(${1.22 * 0.94})`,
            transformOrigin: "50% 40%",
          }}
        >
          <WhatsAppChat />
        </Phone>
      ) : null}

      {/* íconos flotantes */}
      <AppTile src="brand/airbnb.png" zoom={1.0} rot={-12} t={t} p={pop(t, 8.6, fps)} style={{left: 26, top: 300}} />
      <AppTile src="brand/booking.png" zoom={1.14} rot={10} t={t} p={pop(t, 9.15, fps)} style={{right: 26, top: 250}} />
      <AppTile src="brand/whatsapp.png" zoom={1.28} rot={-8} t={t} p={pop(t, 10.4, fps)} style={{left: 40, top: 1330}} />
    </div>
  );
};
