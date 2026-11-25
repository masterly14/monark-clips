import React from "react";
import {Img, staticFile} from "remotion";
import {Check, Cursor, MonoLabel, Stamp, Typewriter, UICard, UI, fonts, rampAt, useTime} from "../kit";
import {cue, type Act} from "./edit";

const title: React.CSSProperties = {fontFamily: fonts.sans, fontWeight: 700, fontSize: 41, lineHeight: 1.13, letterSpacing: "-0.035em"};
const row: React.CSSProperties = {display: "flex", alignItems: "center", gap: 20};
const rule: React.CSSProperties = {border: "1px solid #E7E0D6", borderRadius: 18, padding: "23px 24px"};
const panel: React.CSSProperties = {...rule, background: "#F8F5EF"};

const Enter: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const {t} = useTime();
  const open = rampAt(t, at, at + 0.24);
  return <div style={{opacity: open, transform: `translateY(${24 * (1 - open)}px)`}}>{children}</div>;
};

const State: React.FC<{tone: "neutral" | "red" | "green" | "blue"; children: React.ReactNode}> = ({tone, children}) => {
  const colors = {
    neutral: ["#EEE8DE", "#514736"],
    red: ["#FFE0D8", "#972D23"],
    green: ["#DDF5E5", "#126436"],
    blue: ["#E5E9FF", "#2D438C"],
  };
  return <span style={{display: "inline-block", padding: "11px 17px", borderRadius: 99, font: `500 23px ${fonts.mono}`,
    background: colors[tone][0], color: colors[tone][1]}}>{children}</span>;
};

const Icon: React.FC<{name: "doc" | "paper" | "clock" | "message" | "door" | "case" | "person"; color?: string; size?: number}> = ({
  name, color = "#292522", size = 49,
}) => {
  const path = {
    doc: "M14 3H6v18h12V7l-4-4Zm0 0v5h4M9 12h6m-6 4h6",
    paper: "M3 5h18v14H3zM3 6l9 7 9-7",
    clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-15v6l4 2",
    message: "M4 5h16v12H9l-5 3V5Zm4 4h8m-8 4h6",
    door: "M3 21h18M6 21V4h12v17m-4-8v1",
    case: "M3 8h18v12H3zM8 8V4h8v4m-4 2v4m-9-2h18",
    person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 21v-1a7 7 0 0 1 14 0v1",
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.65}
    strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={path[name]} /></svg>;
};

const Tile: React.FC<{
  icon: React.ComponentProps<typeof Icon>["name"]; label: string; value?: string; color?: string; children?: React.ReactNode;
}> = ({icon, label, value, color = "#F2ECE1", children}) => (
  <div style={{...row, ...panel}}>
    <div style={{background: color, display: "grid", placeItems: "center", width: 78, height: 76, borderRadius: 18, flexShrink: 0}}>
      <Icon name={icon} />
    </div>
    <div style={{flex: 1}}>
      <div style={{...title, fontSize: 31}}>{label}</div>
      {value && <MonoLabel size={21} color="#615747">{value}</MonoLabel>}
    </div>
    {children}
  </div>
);

const DemoCard: React.FC<{act: Act; label: string; children: React.ReactNode; top?: number; width?: number}> = ({
  act, label, children, top = 650, width = 890,
}) => <UICard at={act.at} top={top} width={width} title={<span>{label}</span>}>{children}</UICard>;

function Progress({value, color, labels}: {value: number; color: string; labels: [string, string]}) {
  return <div>
    <div style={{height: 16, borderRadius: 12, background: "#E9E3D8", overflow: "hidden"}}>
      <div style={{height: "100%", width: `${value * 100}%`, background: color, borderRadius: 12}} />
    </div>
    <div style={{...row, justifyContent: "space-between", marginTop: 15}}>
      <MonoLabel size={21}>{labels[0]}</MonoLabel><MonoLabel size={21}>{labels[1]}</MonoLabel>
    </div>
  </div>;
}

export const Scenes: React.FC<{act: Act}> = ({act}) => {
  const {t} = useTime();

  switch (act.device) {
    case "identity": {
      const error = t >= cue(10);
      return <DemoCard act={act} label="Check-in · datos del huésped" top={675}>
        <div style={row}>
          <div style={{width: 138, height: 178, borderRadius: 23, background: "#E5DCF8", display: "grid", placeItems: "center"}}>
            <Icon name="person" size={82} color="#4E3193" />
          </div>
          <div style={{flex: 1}}>
            <MonoLabel size={22}>Nombre ingresado</MonoLabel>
            <div style={{...rule, marginTop: 9, border: error ? "3px solid #CD5444" : rule.border, ...title, minHeight: 52, fontSize: 45}}>
              <Typewriter text="Alex" from={cue(4)} to={cue(5)} caret={false} />
              {" "}<Typewriter text="Pasaporte" from={cue(5)} to={cue(5) + 0.38} caret={t < cue(6)} />
            </div>
          </div>
        </div>
        <div style={{marginTop: 25, minHeight: 58}}>
          <Enter at={cue(10)}><State tone="red">El tipo de documento quedó como apellido</State></Enter>
        </div>
      </DemoCard>;
    }
    case "routing": {
      const p = rampAt(t, cue(26), cue(33) + 0.2);
      return <DemoCard act={act} label="Datos del check-in">
        <Tile icon="doc" label="Alex Pasaporte" value="Campo de nombre" color="#F5DDD8">
          {t >= cue(22) && <State tone="red">Error</State>}
        </Tile>
        <div style={{height: 72, display: "grid", placeItems: "center"}}>
          <svg width="688" height="72" viewBox="0 0 688 72" aria-hidden>
            <path d="M344 0v25H166v47M344 25h178v47" fill="none" stroke="#CFC5B8" strokeWidth="4" />
            <path d="M344 0v25H166v47M344 25h178v47" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}
              fill="none" stroke="#D85040" strokeWidth="4" />
          </svg>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18}}>
          {[[30, "TRA"], [33, "SIRE"]].map(([index, label]) => <Enter key={label} at={cue(Number(index))}>
            <div style={{...panel, ...title, textAlign: "center", fontSize: 41}}>{label}</div>
          </Enter>)}
        </div>
      </DemoCard>;
    }
    case "minor":
      return <DemoCard act={act} label="Acompañantes">
        <Tile icon="person" label="Huésped menor de edad" color="#F6E0D9" />
        <div style={{marginTop: 15}}>
          <Enter at={cue(41)}><Tile icon="doc" label="Permiso de viaje"><State tone="red">Pendiente</State></Tile></Enter>
        </div>
      </DemoCard>;
    case "owner":
      return <DemoCard act={act} label="Revisión del check-in">
        <div style={{...row, gap: 28, padding: "45px 13px"}}>
          <div style={{display: "grid", placeItems: "center", background: "#FFDDD5", width: 125, height: 125, borderRadius: 30}}>
            <Icon name="case" size={74} color="#942D22" />
          </div>
          <div style={{flex: 1}}>
            <div style={title}>Operador del alojamiento</div>
            <div style={{marginTop: 14}}>
              <Enter at={cue(57)}><State tone="red">Requiere tu revisión</State></Enter>
            </div>
          </div>
        </div>
      </DemoCard>;
    case "scan": {
      const scanned = cue(67);
      const matched = cue(70);
      const scan = rampAt(t, cue(65), scanned);
      return <DemoCard act={act} label="Monark · revisión de documento">
        <div style={{position: "relative", ...rule, background: "#EEE7FF", overflow: "hidden", padding: "40px 30px"}}>
          <div style={row}><Icon name="doc" color="#5134AD" size={80} /><div>
            <div style={title}>Documento del huésped</div><MonoLabel size={23} color="#50399C">Lectura de datos</MonoLabel>
          </div></div>
          {t >= cue(65) && t < scanned && <div style={{position: "absolute", left: 5, right: 5, height: 4,
            top: 7 + 143 * scan, background: "#7958ED", boxShadow: "0 0 20px 3px #A98AFF"}} />}
        </div>
        <div style={{...row, marginTop: 22, justifyContent: "space-between"}}>
          <div style={{...title, fontSize: 30}}>Nombre del formulario</div>
          <State tone={t >= matched ? "green" : "neutral"}>{t >= matched ? "Datos coinciden" : "Comparando"}</State>
        </div>
        <Enter at={matched}>
          <div style={{marginTop: 27, ...row, justifyContent: "center", color: "#205334"}}>
            <Check at={matched} size={55} /><span style={{...title, fontSize: 33}}>Cotejo completado</span>
          </div>
        </Enter>
      </DemoCard>;
    }
    case "report":
      return <DemoCard act={act} label="Flujo del check-in">
        <div style={{display: "grid", gap: 15}}>
          <Tile icon="person" label="Acompañante menor" />
          <Enter at={cue(84)}><Tile icon="doc" label="Permiso de viaje" color="#FFF0C5"><State tone="blue">Solicitado</State></Tile></Enter>
          <Enter at={cue(87)}><Tile icon="doc" label="Reporte de huéspedes" color="#E9F2E9">
            <State tone={t >= cue(89) ? "green" : "neutral"}>{t >= cue(89) ? "Generado" : "Preparando"}</State>
          </Tile></Enter>
          <Enter at={cue(95)}><Tile icon="door" label="Portería" color="#E9F2E9"><State tone="green">Notificada</State></Tile></Enter>
        </div>
      </DemoCard>;
    case "deadline": {
      const progress = rampAt(t, cue(98), cue(107));
      const started = t >= cue(104);
      return <div style={{position: "absolute", left: 98, right: 98, top: 655, textAlign: "center"}}>
        <div style={{width: 480, height: 480, position: "relative", margin: "0 auto", display: "grid", placeItems: "center",
          borderRadius: "50%", background: "#FFFBF3", boxShadow: "0 25px 66px #6A503829"}}>
          <svg viewBox="0 0 480 480" width={480} height={480} style={{position: "absolute", inset: 0}} aria-hidden>
            <circle cx={240} cy={240} r={201} fill="none" stroke="#E9E0D2" strokeWidth={15} />
            <circle cx={240} cy={240} r={201} fill="none" stroke="#7855D9" strokeWidth={15} strokeLinecap="round"
              pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} transform="rotate(-90 240 240)" />
          </svg>
          <div>
            <Icon name="clock" size={116} color="#6042C0" />
            <div style={{...title, fontSize: 45, marginTop: 16}}>Plazo de check-in</div>
            <MonoLabel size={24}>Antes de la llegada</MonoLabel>
          </div>
        </div>
        <div style={{marginTop: 55}}>
          <State tone={started ? "blue" : "neutral"}>{started ? "Formulario en seguimiento" : "Check-in online"}</State>
        </div>
      </div>;
    }
    case "reminder": {
      const sent = cue(111);
      const warning = cue(125);
      const open = rampAt(t, act.at, act.at + 0.32);
      return <div style={{
        position: "absolute", left: 244, top: 575, width: 592, minHeight: 880, border: "12px solid #161625",
        borderRadius: 82, boxSizing: "border-box", background: "#FAF9F5", color: UI.ink,
        boxShadow: "0 28px 78px #0E185E80", opacity: open, transform: `translateY(${84 * (1 - open)}px)`,
      }}>
        <div style={{width: 132, height: 22, borderRadius: 20, background: "#161625", margin: "17px auto 0"}} />
        <div style={{padding: "48px 34px"}}>
          <div style={{...row, gap: 16, marginBottom: 48}}>
            <Img src={staticFile("brand/monark-mark.png")} style={{width: 66, height: 66, objectFit: "contain"}} />
            <div><div style={{...title, fontSize: 37}}>Check-in online</div><MonoLabel size={20}>Aviso al huésped</MonoLabel></div>
          </div>
          <div style={{...panel, background: "#E6EEFC", padding: "26px 24px", minHeight: 164, font: `500 35px ${fonts.sans}`}}>
            <Typewriter text="Hola, completa tu check-in antes de llegar." from={cue(109)} to={sent} caret={t < sent} />
          </div>
          <div style={{marginTop: 22}}><Enter at={sent}><State tone="green">Recordatorio enviado</State></Enter></div>
          <div style={{marginTop: 65}}><Enter at={cue(119)}>
            <Progress value={rampAt(t, cue(119), warning)} color="#E3A11F" labels={["Pendiente", "Llegada próxima"]} />
          </Enter></div>
        </div>
        <div style={{position: "absolute", bottom: 21, left: 180, width: 204, height: 8, background: "#161625", borderRadius: 6}} />
      </div>;
    }
    case "team": {
      const alert = cue(134);
      return <DemoCard act={act} label="Avisos del alojamiento">
        <Tile icon="clock" label="Check-in pendiente" value="Día de llegada" color="#FFE5D7">
          <State tone={t < cue(130) ? "neutral" : "red"}>{t < cue(130) ? "Plazo activo" : "Requiere atención"}</State>
        </Tile>
        <div style={{marginTop: 24}}>
          <Enter at={alert}><Tile icon="message" label="Aviso al equipo" value="Formulario sin completar" color="#E5E9FF">
            <State tone="blue">Enviado</State>
          </Tile></Enter>
        </div>
        <div style={{marginTop: 25}}><Enter at={cue(144)}><MonoLabel size={24} color="#574336">Revisa la llegada desde tu operación.</MonoLabel></Enter></div>
      </DemoCard>;
    }
    case "arrival": {
      const pending = cue(156);
      const gate = cue(169);
      const position = rampAt(t, cue(147), gate);
      return <>
        <div style={{position: "absolute", left: 90, right: 94, top: 603, height: 540,
          borderRadius: 41, background: "#282322", overflow: "hidden", border: "2px solid #54473E"}}>
          <div style={{position: "absolute", color: "#FFF6E7", left: 42, top: 36}}>
            <MonoLabel size={25} color="#E4D0BB">// llegada del huésped</MonoLabel>
          </div>
          <div style={{position: "absolute", left: 78, right: 202, bottom: 120, borderBottom: "7px dotted #796A5B"}} />
          <div style={{position: "absolute", left: 66 + 287 * position, bottom: 140}}>
            <div style={{width: 150, height: 150, position: "relative", display: "grid", placeItems: "center", borderRadius: "50%", background: "#F4DFBC"}}>
              <Icon name="person" size={96} color="#4D3B27" />
              <Img src={staticFile("props/ht/maleta-ink.png")} style={{position: "absolute", width: 88, height: 107,
                objectFit: "contain", right: -68, bottom: -21, filter: "invert(1)", imageRendering: "pixelated"}} />
            </div>
          </div>
          <div style={{position: "absolute", right: 73, bottom: 106}}>
            <Icon name="door" size={294} color={t >= gate ? "#FF937D" : "#F4DFBC"} />
          </div>
          <div style={{position: "absolute", left: 44, bottom: 34}}>
            <Enter at={pending}><State tone="red">{t >= cue(173) ? "Entrada en espera" : "Check-in pendiente"}</State></Enter>
          </div>
        </div>
        <div style={{position: "absolute", left: 92, right: 92, top: 1203}}>
          <Enter at={cue(159)}><Tile icon="message" label="El equipo ya tiene el aviso" value="Seguimiento de esta llegada" /></Enter>
        </div>
      </>;
    }
    case "goodbye":
      return <>
        <DemoCard act={act} label="Check-in · campo de nombre" top={660} width={780}>
          <div style={{...title, textAlign: "center", color: "#534438", padding: "24px 0", textDecoration: t >= cue(179) ? "line-through" : "none"}}>
            Alex Pasaporte
          </div>
        </DemoCard>
        <Stamp text="Chao." at={cue(179)} x={680} y={970} size={100} />
      </>;
    case "profile": {
      const link = cue(190);
      const click = cue(196);
      return <>
        <DemoCard act={act} label="Monark · check-in online">
          <div style={row}>
            <Img src={staticFile("brand/monark-mark.png")} style={{width: 104, height: 104, objectFit: "contain"}} />
            <div><div style={title}>Gestiona tus llegadas</div><MonoLabel size={22}>Documentos · recordatorios · avisos</MonoLabel></div>
          </div>
          <div style={{marginTop: 30}}>
            <Enter at={link}><div style={{...panel, ...row, justifyContent: "space-between"}}>
              <Typewriter text="Enlace en el perfil" from={link} to={cue(193) + 0.3} caret={t < click} style={{...title, fontSize: 34}} />
              <State tone={t >= click ? "green" : "blue"}>{t >= click ? "Monark" : "Abrir ↗"}</State>
            </div></Enter>
          </div>
        </DemoCard>
        <Cursor path={[{x: 927, y: 1190, at: cue(194)}, {x: 829, y: 1006, at: click}]} clicks={[click]} />
      </>;
    }
  }
};
