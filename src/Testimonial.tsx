import React, {useMemo} from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Video} from "@remotion/media";
import {createTikTokStyleCaptions} from "@remotion/captions";
import {fonts, theme} from "./theme";
import type {TestimonialProps} from "./types";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ease = Easing.out(Easing.cubic);

const mmss = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

/** Fondo: blanco con resplandor cálido arriba a la derecha y un velo muy tenue abajo. */
const Backdrop: React.FC = () => (
  <AbsoluteFill
    style={{
      background: [
        "radial-gradient(ellipse 640px 620px at 780px 280px, rgba(250,232,190,1) 0%, rgba(251,240,214,0.65) 42%, rgba(255,255,255,0) 100%)",
        "radial-gradient(ellipse 900px 520px at 140px 1860px, rgba(246,238,232,0.9) 0%, rgba(255,255,255,0) 100%)",
        "#FEFEFE",
      ].join(","),
    }}
  />
);

const Header: React.FC<{kicker: string}> = ({kicker}) => (
  <div
    style={{
      position: "absolute",
      left: theme.marginX,
      right: theme.marginX,
      top: theme.headerY - 30,
      height: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Img src={staticFile("brand/monark-logo.png")} style={{width: 182, height: "auto"}} />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: fonts.mono,
        fontSize: 22,
        letterSpacing: "0.22em",
        color: theme.inkSoft,
        textTransform: "uppercase",
      }}
    >
      <span style={{width: 12, height: 12, borderRadius: 12, background: theme.yellow}} />
      {kicker}
    </div>
  </div>
);

const Headline: React.FC<{lead: string; accent: string}> = ({lead, accent}) => {
  // Ajuste simple por longitud para que quepa en una línea dentro de 960 px
  const units = lead.length * 0.55 + accent.length * 0.5 * 1.18 + 1;
  const size = Math.max(60, Math.min(92, Math.floor(960 / units)));
  return (
    <div
      style={{
        position: "absolute",
        left: theme.marginX,
        right: theme.marginX,
        top: theme.headlineY - 80,
        height: 160,
        display: "flex",
        alignItems: "center",
        gap: size * 0.2,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: size,
          letterSpacing: "-0.03em",
          color: theme.ink,
        }}
      >
        {lead}
      </span>
      <span
        style={{
          position: "relative",
          fontFamily: fonts.serif,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: size * 1.2,
          color: theme.ink,
          lineHeight: 1,
        }}
      >
        {accent}
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -size * 0.2,
            height: 8,
            borderRadius: 4,
            background: theme.yellow,
          }}
        />
      </span>
    </div>
  );
};

const Captions: React.FC<{props: TestimonialProps}> = ({props}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pages = useMemo(() => {
    const startMs = props.trimStartSec * 1000;
    const endMs = props.trimEndSec * 1000;
    const inWindow = props.captions
      .filter((c) => c.endMs > startMs && c.startMs < endMs)
      .map((c) => ({
        ...c,
        startMs: Math.max(0, c.startMs - startMs),
        endMs: c.endMs - startMs,
        timestampMs: c.timestampMs == null ? null : c.timestampMs - startMs,
      }));
    return createTikTokStyleCaptions({captions: inWindow, combineTokensWithinMilliseconds: 1400}).pages;
  }, [props.captions, props.trimStartSec, props.trimEndSec]);

  const tMs = (frame / fps) * 1000;
  const idx = pages.findIndex((p, i) => {
    const next = pages[i + 1];
    const end = next ? next.startMs : p.startMs + p.durationMs + 500;
    return tMs >= p.startMs && tMs < end;
  });
  if (idx < 0) return null;
  const page = pages[idx];

  return (
    <div
      style={{
        position: "absolute",
        left: theme.marginX,
        right: theme.marginX,
        top: 1560,
        height: 170,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: fonts.sans,
        fontWeight: 700,
        fontSize: 54,
        lineHeight: 1.22,
        letterSpacing: "-0.02em",
        color: theme.ink,
      }}
    >
      <div>
        {page.tokens.map((tok, i) => {
          const active = tMs >= tok.fromMs && tMs < tok.toMs;
          const spoken = tMs >= tok.fromMs;
          return (
            <span
              key={i}
              style={{
                whiteSpace: "pre",
                opacity: spoken ? 1 : 0.28,
                background: active
                  ? `linear-gradient(transparent 62%, ${theme.yellow}AA 62%, ${theme.yellow}AA 92%, transparent 92%)`
                  : "none",
              }}
            >
              {tok.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Testimonial: React.FC<TestimonialProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const clipDur = props.trimEndSec - props.trimStartSec;
  const clipFrames = Math.round(clipDur * fps);
  const {card} = theme;

  // Entrada escalonada
  const enter = (delay: number) => interpolate(t, [delay, delay + 0.5], [0, 1], {...clamp, easing: ease});
  // Cierre: el marco se desvanece y entra el logo
  const mainOpacity = interpolate(t, [clipDur - 0.4, clipDur + 0.2], [1, 0], clamp);
  const outroOpacity = interpolate(t, [clipDur - 0.1, clipDur + 0.5], [0, 1], {...clamp, easing: ease});
  const outroScale = interpolate(t, [clipDur - 0.1, clipDur + 1.5], [0.97, 1], {...clamp, easing: ease});

  // Recorte: la región `crop` del video fuente llena la tarjeta (cover, centrada)
  const {crop, sourceSize} = props;
  const scale = Math.max(card.w / crop.w, card.h / crop.h);
  const vw = sourceSize.w * scale;
  const vh = sourceSize.h * scale;
  const vLeft = (card.w - crop.w * scale) / 2 - crop.x * scale;
  const vTop = (card.h - crop.h * scale) / 2 - crop.y * scale;

  const nameIn = interpolate(t, [props.nameInSec, props.nameInSec + 0.5], [0, 1], {...clamp, easing: ease});
  const progress = Math.min(1, t / clipDur);
  const barW = 740;

  return (
    <AbsoluteFill style={{background: "#FEFEFE"}}>
      <Backdrop />

      <AbsoluteFill style={{opacity: mainOpacity}}>
        <div style={{opacity: enter(0), transform: `translateY(${(1 - enter(0)) * -10}px)`}}>
          <Header kicker={props.kicker} />
        </div>

        <div style={{opacity: enter(0.1), transform: `translateY(${(1 - enter(0.1)) * 16}px)`}}>
          <Headline lead={props.headlineLead} accent={props.headlineAccent} />
        </div>

        {/* Tarjeta de video */}
        <div
          style={{
            position: "absolute",
            left: card.x,
            top: card.y,
            width: card.w,
            height: card.h,
            borderRadius: card.radius,
            overflow: "hidden",
            background: "#111",
            boxShadow: "0 30px 60px -30px rgba(120,80,0,0.35)",
            opacity: enter(0.2),
            transform: `scale(${0.97 + 0.03 * enter(0.2)})`,
          }}
        >
          <Sequence durationInFrames={clipFrames} layout="none">
            <Video
              src={staticFile(props.video)}
              trimBefore={Math.round(props.trimStartSec * fps)}
              trimAfter={Math.round(props.trimEndSec * fps)}
              muted={props.muted}
              volume={(f) => interpolate(f / fps, [clipDur - 0.4, clipDur], [1, 0], clamp)}
              style={{
                position: "absolute",
                left: vLeft,
                top: vTop,
                width: vw,
                height: vh,
              }}
              objectFit="fill"
            />
          </Sequence>

          {/* Degradado inferior + cargo / nombre */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(8,8,10,0.82) 0%, rgba(8,8,10,0.55) 22%, rgba(8,8,10,0) 52%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 58,
              bottom: 52,
              opacity: nameIn,
              transform: `translateY(${(1 - nameIn) * 14}px)`,
              color: "#fff",
            }}
          >
            <div
              style={{
                fontFamily: fonts.serif,
                fontStyle: "italic",
                fontSize: 42,
                lineHeight: 1.1,
                opacity: 0.92,
              }}
            >
              {props.speakerRole}
            </div>
            <div
              style={{
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: 64,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                marginTop: 6,
              }}
            >
              {props.speakerName}
            </div>
          </div>
        </div>

        {/* Barra de progreso + timer */}
        <div
          style={{
            position: "absolute",
            left: theme.marginX,
            right: theme.marginX,
            top: theme.progressY - 20,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: enter(0.35),
          }}
        >
          <div style={{width: barW, height: 6, borderRadius: 3, background: theme.track, overflow: "hidden"}}>
            <div style={{width: barW * progress, height: "100%", background: theme.yellow}} />
          </div>
          <div style={{fontFamily: fonts.mono, fontSize: 23, letterSpacing: "0.08em", color: theme.inkSoft}}>
            {mmss(Math.min(t, clipDur))} / {mmss(clipDur)}
          </div>
        </div>

        {/* Pie: logo del cliente + etiqueta */}
        <div
          style={{
            position: "absolute",
            left: theme.marginX - 4,
            right: theme.marginX,
            top: theme.footerY - 60,
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: enter(0.45),
          }}
        >
          {props.clientLogo ? (
            <Img src={staticFile(props.clientLogo)} style={{width: props.clientLogoWidth, height: "auto"}} />
          ) : (
            <span />
          )}
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 20,
              letterSpacing: "0.22em",
              color: theme.inkSoft,
              textTransform: "uppercase",
            }}
          >
            {props.footerLabel}
          </div>
        </div>

        {props.showCaptions ? (
          <Sequence durationInFrames={clipFrames} layout="none">
            <Captions props={props} />
          </Sequence>
        ) : null}
      </AbsoluteFill>

      {/* Cierre con logo Monark */}
      <AbsoluteFill
        style={{
          opacity: outroOpacity,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 0,
        }}
      >
        <Img
          src={staticFile("brand/monark-logo.png")}
          style={{width: 500, height: "auto", transform: `scale(${outroScale})`, marginTop: -2}}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
