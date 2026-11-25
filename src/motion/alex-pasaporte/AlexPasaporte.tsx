import React from "react";
import {Audio} from "@remotion/media";
import {AbsoluteFill, Easing, Img, staticFile} from "remotion";
import {
  ActBackground, Character, Counter, Cursor, Headline, MonoLabel, SPRING, Typewriter,
  fonts, rampAt, springAt, useTime, type Expression,
} from "../kit";
import {acts, cue, END_CARD_AT, VOICE, type Act} from "./edit";
import {Scenes} from "./Scenes";

const Guide: React.FC<{act: Act; expression: Expression}> = ({act, expression}) => {
  const {t} = useTime();

  if (act.guide === "large") {
    const first = act.at === 0 && t < cue(4);
    const pose = act.at === 0 && t >= cue(4) && t < cue(7) ? "habla" : expression;
    return <Character
      from={act.at}
      to={END_CARD_AT}
      schedule={[{at: act.at, name: pose}]}
      top={first ? 1170 : 1115}
      height={first ? 875 : 930}
      centerX={first ? 632 : 560}
      enter={act.at === 0 || act.device === "goodbye"}
    />;
  }

  const iris = act.device === "scan"
    ? rampAt(t, act.at, act.at + 22 / 60, Easing.inOut(Easing.cubic))
    : 1;
  const size = 176 + 356 * (1 - iris);
  const x = 885 - 323 * (1 - iris);
  const y = 268 + 1075 * (1 - iris);
  const idle = Math.sin(t * 2.2) * 1.5;

  return <div style={{
    position: "absolute", width: size, height: size,
    left: x - size / 2, top: y - size / 2,
    transform: `rotate(${idle}deg)`,
  }}>
    <div style={{
      width: "100%", height: "100%", background: "#FDF9F1", boxSizing: "border-box",
      borderRadius: "50%", border: "5px solid #161311", overflow: "hidden", boxShadow: "0 14px 30px #15100833",
    }}>
      <Img src={staticFile(`character/ht/${expression}.png`)} style={{
        width: "120%", height: "128%", marginLeft: "-10%", objectFit: "contain",
        objectPosition: "center top", imageRendering: "pixelated",
      }} />
    </div>
    <div style={{
      opacity: iris, position: "absolute", width: 24, height: 24, borderRadius: 24,
      right: 9, top: 15, background: "#28B36A", border: "4px solid #FFF9F0",
    }} />
  </div>;
};

const EndCard: React.FC = () => {
  const {t, fps} = useTime();
  const start = END_CARD_AT;
  const logo = rampAt(t, start + 0.07, start + 0.37, Easing.inOut(Easing.cubic));
  const peek = springAt(t, start + 0.36, fps, SPRING.card);
  const offerAt = cue(202);
  const percentAt = cue(206);
  const freeAt = cue(212);
  const clickAt = percentAt + 0.96;
  const buttonAt = start + 0.55;
  const reveal = rampAt(t, offerAt, offerAt + 0.28);
  const click = t >= clickAt && t < clickAt + 0.13;

  return <AbsoluteFill>
    <ActBackground bg="amarillo" />
    <div style={{position: "absolute", top: 150, left: 0, right: 0, textAlign: "center",
      fontFamily: fonts.serif, fontStyle: "italic", fontSize: 89, color: "#1B1409", opacity: rampAt(t, start + 0.4, start + 0.75)}}>
      Check-in a tiempo.
    </div>
    <div style={{position: "absolute", inset: "0 0 auto", height: 749, overflow: "hidden"}}>
      <Img src={staticFile("character/ht/guino-ink.png")} style={{
        position: "absolute", width: 575, left: 252, top: 433 + (1 - peek) * 350, imageRendering: "pixelated",
      }} />
    </div>
    <div style={{position: "absolute", inset: "725px 0 auto", display: "grid", placeItems: "center",
      clipPath: `inset(0 ${100 - logo * 100}% 0 0)`}}>
      <Img src={staticFile("brand/monark-logo.png")} style={{width: 640, filter: "brightness(0)"}} />
    </div>
    <div style={{
      position: "absolute", left: 125, right: 125, top: 968, minHeight: 265,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 34,
      border: "2px solid #19120830", borderRadius: 31, background: "#FFDA78",
      color: "#1B1409", opacity: reveal, transform: `translateY(${35 * (1 - reveal)}px)`,
    }}>
      <div style={{minWidth: 285, textAlign: "center", opacity: rampAt(t, percentAt, percentAt + 0.14)}}>
        <Counter from={0} to={30} at={percentAt} dur={0.54} format={(value) => `${Math.round(value)} %`}
          style={{fontFamily: fonts.sans, fontSize: 112, fontWeight: 800, letterSpacing: "-0.065em"}} />
        <MonoLabel size={24} color="#4F3919">de descuento</MonoLabel>
      </div>
      <div style={{minWidth: 285}}>
        <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 44, letterSpacing: "-0.045em"}}>Tres meses</div>
        <div style={{marginTop: 12, opacity: rampAt(t, freeAt, freeAt + 0.25)}}>
          <MonoLabel size={23} color="#4F3919">Implementación gratis</MonoLabel>
        </div>
      </div>
    </div>
    <div style={{
      position: "absolute", top: 1362, left: 0, right: 0, display: "flex", justifyContent: "center",
      opacity: rampAt(t, buttonAt, buttonAt + 0.33),
    }}>
      <div style={{padding: "28px 55px", textAlign: "center", minWidth: 399, background: "#FFFFFF", borderRadius: 99,
        color: "#18130C", fontFamily: fonts.sans, fontSize: 40, fontWeight: 700,
        boxShadow: "0 19px 40px #8A541930", transform: `scale(${click ? 0.96 : 1})`}}>
        <Typewriter text="Enlace en el perfil" from={buttonAt} to={buttonAt + 0.68} caret={false} /> <span>↗</span>
      </div>
    </div>
    <Cursor path={[{x: 898, y: 1494, at: clickAt - 0.45}, {x: 747, y: 1432, at: clickAt}]}
      clicks={[clickAt]} hideAt={clickAt + 0.7} />
  </AbsoluteFill>;
};

export const AlexPasaporte: React.FC = () => {
  const {t} = useTime();
  const index = acts.findIndex((_, i) => t < (acts[i + 1]?.at ?? END_CARD_AT));
  const isEnd = index < 0;
  const act = acts[isEnd ? acts.length - 1 : index];
  const previous = acts[index - 1];
  const next = acts[index + 1];
  const beatIndex = act.beats.findIndex((_, i) => t < (act.beats[i + 1]?.at ?? END_CARD_AT));
  const beat = act.beats[Math.max(0, beatIndex)];
  const nextBeatAt = act.beats[beatIndex + 1]?.at ?? next?.at ?? END_CARD_AT;
  const bridge = isEnd ? {x: 820, y: 1006} : act.bridge;
  const start = isEnd ? END_CARD_AT : act.at;
  const radius = rampAt(t, start, start + 14 / 60, Easing.out(Easing.cubic)) * 2150;
  const transitioning = bridge && radius < 2150;

  return <AbsoluteFill>
    <Audio src={staticFile(VOICE)} />
    {transitioning && (() => {
      const outgoing = isEnd ? act : previous;
      if (!outgoing) return null;
      const last = outgoing.beats.at(-1);
      return <AbsoluteFill>
        <ActBackground bg={outgoing.bg} />
        {outgoing.guide === "large" && last && <Guide act={outgoing} expression={last.expression} />}
        <Scenes act={outgoing} />
        {outgoing.guide === "badge" && last && <Guide act={outgoing} expression={last.expression} />}
      </AbsoluteFill>;
    })()}
    <AbsoluteFill style={{
      clipPath: transitioning ? `circle(${radius}px at ${bridge.x}px ${bridge.y}px)` : undefined,
    }}>
      {isEnd ? <EndCard /> : <>
        <ActBackground bg={act.bg} />
        {act.guide === "large" && <Guide key={act.at} act={act} expression={beat.expression} />}
        <Scenes key={act.device} act={act} />
        <Headline
          words={beat.words} from={beat.at} to={nextBeatAt} on={act.bg}
          top={195} width={act.guide === "badge" ? 700 : 920} size={beat.size}
        />
        {act.guide === "badge" && <Guide act={act} expression={beat.expression} />}
      </>}
    </AbsoluteFill>
  </AbsoluteFill>;
};
