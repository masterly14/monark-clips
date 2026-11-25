import React, {useMemo} from "react";
import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import {Video} from "@remotion/media";
import {createTikTokStyleCaptions, type Caption} from "@remotion/captions";
import {C, F} from "./style";
import {Checklist, MonarkCta, OutroBadge, Stat17, SunWords, YellowBg, type SunWord} from "./graphics";
import {PhoneChats} from "./phones";

/**
 * Layouts:
 *  face  → cara a pantalla completa + subtítulo
 *  split → gráfica arriba (0–860 px), cara empujada abajo
 *  full  → gráfica a pantalla completa sobre amarillo Monark
 *  sun   → escena oscura con sol y palabras gigantes (sin subtítulo)
 */
type Layout = "face" | "split" | "full" | "sun";
type Scene = {from: number; to: number; layout: Layout; zoom?: [number, number]; render?: (s: number) => React.ReactNode};

const SUN_HOSPITALIDAD: SunWord[] = [
  {text: "y es que", at: 23.28, pos: "top", size: 112},
  {text: "esto es", at: 23.95, pos: "top", size: 112},
  {text: "hospitalidad", at: 24.2, pos: "mid", size: 132},
];
// "y es que" se reemplaza por "esto es" en la misma posición
SUN_HOSPITALIDAD[0].until = 23.95;

const SUN_OFERTA: SunWord[] = [
  {text: "30%", at: 55.5, until: 57.9, pos: "mid", size: 330},
  {text: "de descuento", at: 56.1, until: 57.9, pos: "top"},
  {text: "3 primeros meses", at: 57.05, until: 57.9, pos: "bottom", size: 112},
  {text: "implementación", at: 57.95, pos: "top", size: 120},
  {text: "totalmente", at: 58.85, pos: "bottom", size: 120},
  {text: "gratis", at: 59.35, pos: "mid", size: 230},
];

// Solo los momentos clave llevan gráfica; el resto es cara con cortes de zoom.
export const SCENES: Scene[] = [
  {from: 0, to: 3.2, layout: "face", zoom: [1.0, 1.04]},
  {from: 3.2, to: 14.3, layout: "full", render: (s) => <PhoneChats s={s} />},
  {from: 14.3, to: 18.0, layout: "split", render: () => <Stat17 />},
  {from: 18.0, to: 23.25, layout: "face", zoom: [1.0, 1.07]},
  {from: 23.25, to: 25.15, layout: "sun", render: (s) => <SunWords s={s} words={SUN_HOSPITALIDAD} />},
  {from: 25.15, to: 28.85, layout: "face", zoom: [1.14, 1.17]},
  {from: 28.85, to: 35.05, layout: "face", zoom: [1.0, 1.05]},
  {from: 35.05, to: 39.7, layout: "face", zoom: [1.16, 1.2]},
  {from: 39.7, to: 43.6, layout: "face", zoom: [1.0, 1.04]},
  {from: 43.6, to: 49.6, layout: "split", render: () => <Checklist />},
  {from: 49.6, to: 54.8, layout: "full", render: (s) => <MonarkCta s={s} />},
  {from: 54.8, to: 59.75, layout: "sun", render: (s) => <SunWords s={s} words={SUN_OFERTA} />},
  {from: 59.75, to: 99, layout: "face", zoom: [1.0, 1.04], render: (s) => <OutroBadge s={s} />},
];

const SPLIT_TOP = 860; // donde empieza la cara en el layout split
const FACE_Y = 880; // centro de la cara en el video original
const SPLIT_FACE_Y = 1300; // dónde queda la cara en el split

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

const CaptionBox: React.FC<{captions: Caption[]; layout: Layout}> = ({captions, layout}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pages = useMemo(
    () => createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 650}).pages,
    [captions],
  );
  if (layout === "sun") return null;
  const ms = (frame / fps) * 1000;
  const page = pages.find((p, i) => {
    const end = pages[i + 1]?.startMs ?? p.startMs + p.durationMs + 400;
    return ms >= p.startMs && ms < end;
  });
  if (!page) return null;
  const text = page.text.replace(/[.,!?¡¿]/g, "").trim();
  if (!text) return null;
  const top = layout === "face" ? 1340 : layout === "split" ? 1640 : 1720;
  const local = ms - page.startMs;
  const p = interpolate(local, [0, 90], [0, 1], clamp);
  return (
    <div style={{position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center"}}>
      <div
        style={{
          background: C.capBox,
          color: "#fff",
          fontFamily: F.cap,
          fontWeight: 500,
          fontSize: 48,
          lineHeight: 1,
          padding: "18px 30px 20px",
          transform: `scale(${0.94 + 0.06 * p})`,
          opacity: 0.4 + 0.6 * p,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export type ReelProps = {video: string; captions: Caption[]};

export const Reel: React.FC<ReelProps> = ({video, captions}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const idx = Math.max(0, SCENES.findIndex((s) => t >= s.from && t < s.to));
  const scene = SCENES[idx];
  const prev = SCENES[idx - 1];
  const local = t - scene.from;

  // --- capa de video (una sola, continua: el audio nunca se corta) ---
  const enter = spring({frame: local * fps, fps, config: {damping: 18, stiffness: 140}});
  let panelTop = 0;
  let innerY = 0;
  let scale = 1;
  let videoOpacity = 1;
  if (scene.layout === "split") {
    // La cara "baja": si veníamos de la cara completa, se desliza; si no, entra ya abajo
    const k = prev?.layout === "face" ? enter : 1;
    panelTop = SPLIT_TOP * k;
    innerY = (SPLIT_FACE_Y - FACE_Y) * k;
  } else if (scene.layout === "face") {
    const [z0, z1] = scene.zoom ?? [1, 1];
    scale = interpolate(local, [0, scene.to - scene.from], [z0, z1], {...clamp, easing: Easing.inOut(Easing.quad)});
  } else {
    videoOpacity = 0;
  }

  const graphicIn = interpolate(local, [0, 0.18], [0, 1], clamp);

  return (
    <AbsoluteFill style={{background: C.yellow}}>
      {scene.layout !== "sun" ? <YellowBg /> : null}

      {/* gráfica de la escena */}
      {scene.render && scene.layout !== "face" ? (
        scene.layout === "split" ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: SPLIT_TOP,
              paddingTop: 90,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: graphicIn,
            }}
          >
            {scene.render(scene.from)}
          </div>
        ) : (
          <AbsoluteFill style={{opacity: graphicIn}}>{scene.render(scene.from)}</AbsoluteFill>
        )
      ) : null}

      {/* video */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: panelTop,
          bottom: 0,
          overflow: "hidden",
          opacity: videoOpacity,
          boxShadow: panelTop > 0 ? "0 -18px 40px rgba(80,40,0,0.35)" : undefined,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: innerY - panelTop,
            width: 1080,
            height: 1920,
            transform: `scale(${scale})`,
            transformOrigin: `620px ${FACE_Y}px`,
          }}
        >
          <Video src={staticFile(video)} style={{width: 1080, height: 1920}} objectFit="cover" />
        </div>
      </div>

      {/* gráfica sobre la cara (cierre) */}
      {scene.layout === "face" && scene.render ? scene.render(scene.from) : null}

      <CaptionBox captions={captions} layout={scene.layout} />

      {/* flash corto en cada corte */}
      <AbsoluteFill
        style={{background: "#FFF7DC", opacity: idx > 0 && !(scene.layout === "face" && prev?.layout === "face") ? interpolate(local, [0, 0.12], [0.35, 0], clamp) : 0}}
      />
    </AbsoluteFill>
  );
};
