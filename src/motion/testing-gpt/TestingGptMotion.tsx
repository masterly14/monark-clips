import React from "react";
import {AbsoluteFill, Easing, Img, staticFile} from "remotion";
import {Audio} from "@remotion/media";
import {
  ActBackground, Check, Counter, Cursor, Headline, LAYOUT, MonoLabel, Presenter,
  Stamp, Typewriter, UICard, UI, fonts, rampAt, springAt, useTime,
} from "../kit";
import {acts, cue, presenterSegments, VOICE_END} from "./edit";

const CUT = "clips/testing-gpt-cut.mp4";
const rowStyle: React.CSSProperties = {display: "flex", alignItems: "center", gap: 22};
const heading: React.CSSProperties = {fontFamily: fonts.sans, fontWeight: 700, fontSize: 36, lineHeight: 1.12};

const Reveal: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const {t} = useTime();
  const progress = rampAt(t, at, at + 0.21);
  return <div style={{opacity: progress, transform: `translateY(${(1 - progress) * 14}px)`}}>{children}</div>;
};

const State: React.FC<{children: React.ReactNode; positive?: boolean}> = ({children, positive}) => (
  <span style={{fontFamily: fonts.mono, fontSize: 21, fontWeight: 500, borderRadius: 99, whiteSpace: "nowrap",
    padding: "10px 16px", background: positive ? "#DCF4E4" : "#EEEAE3", color: positive ? "#126638" : "#534A3A"}}>
    {children}
  </span>
);

const Workflow: React.FC<{steps: {label: string; at: number; done: number}[]}> = ({steps}) => {
  const {t} = useTime();
  return <div style={{display: "grid", gap: 18}}>{steps.map(({label, at, done}) => (
    <Reveal key={label} at={at}>
      <div style={{...rowStyle, background: "#F7F5F0", border: "1px solid #E7E2D8", borderRadius: 18, padding: "15px 20px"}}>
        <div style={{position: "relative", width: 39, height: 39, borderRadius: 12, background: "#E6DFD2"}}>
          <div style={{position: "absolute", inset: 0}}><Check at={done} size={39} /></div>
        </div>
        <span style={{flex: 1, ...heading, fontSize: 31}}>{label}</span>
        <State positive={t >= done}>{t >= done ? "Hecho" : "En curso"}</State>
      </div>
    </Reveal>
  ))}</div>;
};

const Demo: React.FC<{act: (typeof acts)[number]}> = ({act}) => {
  const {t} = useTime();
  const top = act.mode === "graphics" ? 660 : LAYOUT.splitStageTop;
  switch (act.demo) {
    case "channels": {
      const update = cue(9520);
      return <UICard at={act.from} top={top} title="Disponibilidad">
        <div style={{...rowStyle, marginBottom: 28}}>
          <Img src={staticFile("props/ht/calendario-ink.png")} style={{width: 86, height: 83, objectFit: "contain", imageRendering: "pixelated"}} />
          <div style={{flex: 1}}>
            <div style={heading}>Calendario de reservas</div>
            <MonoLabel size={21}>{t >= update ? "Disponibilidad actualizada" : "Esperando una reserva"}</MonoLabel>
          </div>
          <div style={{display: "flex", gap: 9}}>{["airbnb", "booking"].map((brand) =>
            <Img key={brand} src={staticFile(`brand/${brand}.png`)} style={{width: 58, height: 58, objectFit: "contain", borderRadius: 12}} />,
          )}</div>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8}}>
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day, index) => {
            const booked = t >= update + (index - 4) * 0.11 && index >= 4;
            return <div key={day} style={{fontFamily: fonts.mono, fontSize: 20, textAlign: "center", padding: "18px 4px", borderRadius: 10,
              background: booked ? "#DAD1FE" : "#F4F1EB", color: booked ? "#35229D" : "#5D564B"}}>{day}</div>;
          })}
        </div>
        <div style={{marginTop: 20}}><State positive={t >= update}>{t >= update ? "Reserva sincronizada" : "Calendario en línea"}</State></div>
      </UICard>;
    }
    case "operation":
      return <UICard at={act.from} top={top} title="Flujo de una reserva">
        <Workflow steps={[
          {label: "Reserva confirmada", at: cue(16440), done: cue(16990)},
          {label: "Mensaje de llegada programado", at: cue(17500), done: cue(18850)},
          {label: "Tarea de limpieza creada", at: cue(19490), done: cue(21300)},
        ]} />
      </UICard>;
    case "growth": {
      const properties = [
        {asset: "cabana", label: "Cabaña", at: cue(22150)},
        {asset: "apartamento", label: "Apartamento", at: cue(22670)},
        {asset: "glamping", label: "Glamping", at: cue(23260)},
      ];
      return <UICard at={act.from} top={top} width={920} title="Portafolio de propiedades">
        <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 15}}>
          {properties.map(({asset, label, at}) =>
            <Reveal key={asset} at={at}>
              <div style={{background: "#F5F0E5", borderRadius: 15, overflow: "hidden", textAlign: "center", padding: "18px 8px"}}>
                <Img src={staticFile(`props/ht/${asset}-ink.png`)} style={{height: 254, width: "100%", objectFit: "contain", imageRendering: "pixelated"}} />
                <div style={{...heading, fontSize: 27}}>{label}</div>
              </div>
            </Reveal>,
          )}
        </div>
        <div style={{marginTop: 32, paddingTop: 26, borderTop: "1px solid #ECE7DF",
          display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <MonoLabel size={25}>Propiedades en el portafolio</MonoLabel>
          <div style={{...heading, fontSize: 56, fontVariantNumeric: "tabular-nums"}}>
            {properties.filter(({at}) => t >= at).length}
          </div>
        </div>
      </UICard>;
    }
    case "offer":
      return <UICard at={cue(29880)} top={top} title="Suscripción Monark">
        <div style={{...rowStyle, gap: 36}}>
          <div style={{background: "#FFECE6", borderRadius: 18, width: 296, minHeight: 168, display: "grid", placeItems: "center"}}>
            <Reveal at={cue(31090)}><Counter from={0} to={30} at={cue(31090)} dur={0.63}
              format={(value) => `${Math.round(value)} %`} style={{...heading, fontSize: 103, letterSpacing: "-0.075em"}} /></Reveal>
          </div>
          <div style={{flex: 1}}>
            <Reveal at={cue(30400)}><div style={{...heading, fontSize: 40}}>Tres meses</div></Reveal>
            <Reveal at={cue(31590)}><MonoLabel size={23}>Descuento en la suscripción</MonoLabel></Reveal>
          </div>
        </div>
      </UICard>;
    case "installation":
      return <>
        <UICard at={cue(34150)} top={top} title="Implementación Monark">
          <div style={rowStyle}><Img src={staticFile("brand/monark-mark.png")} style={{width: 95, height: 95, objectFit: "contain"}} />
            <div style={heading}>Configuración inicial</div>
          </div>
        </UICard>
        <Stamp at={cue(35660)} x={745} y={825} text="Gratis." size={102} />
      </>;
    case "message": {
      const delivered = cue(43890);
      return <UICard at={cue(41900)} top={top} width={920} title="Bandeja de huéspedes">
        <div style={{...rowStyle, marginBottom: 36, paddingBottom: 27, borderBottom: "1px solid #ECE7DF"}}>
          <div style={{display: "grid", placeItems: "center", borderRadius: 28, width: 86, height: 86,
            background: "#EEE7FB", color: "#4C31A6", fontFamily: fonts.sans, fontWeight: 700, fontSize: 41}}>H</div>
          <div><div style={heading}>Huésped</div><MonoLabel size={22}>Consulta sobre la llegada</MonoLabel></div>
        </div>
        <Reveal at={cue(42750)}><div style={{padding: "24px 26px", borderRadius: 22, background: "#F2EEE5", ...heading, fontSize: 39,
          maxWidth: 575, marginBottom: 27}}>
          ¿A qué hora es el check-in?
        </div></Reveal>
        <Reveal at={cue(43360)}><div style={{marginLeft: "auto", maxWidth: 610, minHeight: 124, padding: "24px 26px",
          borderRadius: 22, background: "#DCF4E4", ...heading, fontSize: 39, boxSizing: "border-box"}}>
          <Typewriter text="¡Hola! A las 3:00 p. m." from={cue(43360)} to={delivered} caret={t < delivered} />
        </div></Reveal>
        <div style={{marginTop: 24, textAlign: "right"}}>
          <Reveal at={delivered}><State positive>Respuesta enviada</State></Reveal>
        </div>
      </UICard>;
    }
    case "report": {
      const send = cue(46210);
      return <UICard at={cue(44600)} top={top} title="Reportes para propietarios">
        <div style={{...rowStyle, marginBottom: 23}}>
          <div style={{display: "grid", placeItems: "center", background: "#E5ECFF", borderRadius: 14, width: 94, height: 96,
            color: "#254BAA", fontFamily: fonts.mono, fontSize: 27}}>PDF</div>
          <div style={{flex: 1}}><div style={heading}>Reporte mensual</div><MonoLabel size={23}>Resumen de la propiedad</MonoLabel></div>
        </div>
        <State positive={t >= send}>{t >= send ? "Enviado al propietario" : "Programado para fin de mes"}</State>
      </UICard>;
    }
    case "tasks": {
      const opening = act.from === cue(39550);
      return <UICard at={act.from} top={top} title="Operación diaria">
        <Workflow steps={opening ? [
          {label: "Llegadas coordinadas", at: cue(39550), done: cue(39900)},
          {label: "Equipo de aseo avisado", at: cue(40730), done: cue(40850)},
        ] : [
          {label: "Check-in listo", at: cue(46740), done: cue(47350)},
          {label: "Limpieza agendada", at: cue(47350), done: cue(47750)},
        ]} />
      </UICard>;
    }
    default:
      return null;
  }
};

const EndCard: React.FC = () => {
  const {t, fps} = useTime();
  const start = VOICE_END;
  const logo = rampAt(t, start + 0.05, start + 0.35, Easing.inOut(Easing.cubic));
  const peek = springAt(t, start + 0.33, fps);
  const clickAt = start + 1.75;
  const click = t >= clickAt && t < clickAt + 0.13;
  return <AbsoluteFill>
    <ActBackground bg="amarillo" />
    <div style={{position: "absolute", inset: "0 0 auto", height: 895, overflow: "hidden"}}>
      <Img src={staticFile("character/ht/peek-abajo-ink.png")} style={{position: "absolute", left: 245, top: 565 + 350 * (1 - peek),
        width: 590, imageRendering: "pixelated"}} />
    </div>
    <div style={{position: "absolute", inset: "870px 0 auto", display: "grid", placeItems: "center", clipPath: `inset(0 ${100 - 100 * logo}% 0 0)`}}>
      <Img src={staticFile("brand/monark-logo.png")} style={{width: 612, filter: "brightness(0)"}} />
    </div>
    <div style={{position: "absolute", inset: "1070px 0 auto", textAlign: "center", color: UI.ink, fontFamily: fonts.sans}}>
      <Reveal at={start + 0.57}><div style={{fontSize: 54, fontWeight: 700}}>Automatiza tu <span style={{fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 400, fontSize: 83}}>operación.</span></div></Reveal>
      <Reveal at={start + 0.97}><div style={{margin: "52px auto 28px", width: 496, padding: "24px 18px", borderRadius: 99,
        background: "#FFF", boxShadow: "0 18px 48px -24px #7C4C14", transform: `scale(${click ? 0.96 : 1})`, fontSize: 39, fontWeight: 700}}>Link en el perfil <span style={{marginLeft: 13}}>→</span></div></Reveal>
      <Reveal at={start + 1.85}><MonoLabel size={26} color={UI.ink}>30 % de descuento por tres meses</MonoLabel></Reveal>
    </div>
    <Cursor path={[{x: 880, y: 1450, at: start + 1.23}, {x: 669, y: 1267, at: clickAt}]} clicks={[clickAt]} hideAt={start + 2.31} />
  </AbsoluteFill>;
};

export const TestingGptMotion: React.FC = () => {
  const {t} = useTime();
  if (t >= VOICE_END) return <EndCard />;

  const index = acts.findIndex((_, i) => t < (acts[i + 1]?.from ?? VOICE_END));
  const act = acts[index];
  const prev = acts[index - 1];
  const stage = act.mode === "full" && prev?.mode === "split" && t < act.from + 0.4 ? prev : act;
  const beatIndex = act.beats.findIndex((_, i) => t < (act.beats[i + 1]?.from ?? VOICE_END));
  const current = act.beats[beatIndex];
  const to = act.beats[beatIndex + 1]?.from ?? acts[index + 1]?.from ?? VOICE_END;
  const headline = <Headline words={current.words} from={current.from} to={to} on={act.bg ?? "presentador"}
    width={920} top={act.mode === "split" ? LAYOUT.splitHeadlineTop : 195} size={act.mode === "graphics" ? 112 : act.bg ? 91 : 99} />;

  return <AbsoluteFill style={{background: UI.ink, color: UI.ink}}>
    {stage.bg && <ActBackground bg={stage.bg} />}
    {stage.bg && <Demo key={stage.from} act={stage} />}
    {act.bg && headline}
    <Audio src={staticFile(CUT)} />
    <Presenter muted src={CUT} segments={presenterSegments} face={{x: 545, y: 795}} sourceHeight={1920} splitZoom={1.18} />
    {!act.bg && headline}
  </AbsoluteFill>;
};
