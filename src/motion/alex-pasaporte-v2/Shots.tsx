import React from "react";
import {AbsoluteFill, Easing, Img, staticFile} from "remotion";
import {Cursor, fonts, Typewriter, useTime} from "../kit";
import {at, cuts, type Shot} from "./timeline";
import {Box, Copy, Glyph, Label, Lines, Mono, motion, palette as c, Paper, Toy} from "./graphics";

const sans: React.CSSProperties = {fontFamily: fonts.sans, fontWeight: 800, letterSpacing: "-0.05em"};

const Slip: React.FC<{name?: React.ReactNode; alert?: boolean; compact?: boolean; ghost?: boolean}> = ({
  name = "Alex Pasaporte", alert, compact, ghost,
}) => <Paper style={{padding: compact ? "27px 31px" : "39px 43px", background: ghost ? "#F2E9D9" : "#FFFCF4"}}>
  <div style={{display: "flex", gap: 24, alignItems: "center", marginBottom: compact ? 14 : 25}}>
    <div style={{display: "grid", placeItems: "center", background: alert ? "#FFDED5" : "#E7E0F7", width: compact ? 78 : 126,
      height: compact ? 69 : 95, borderRadius: 19}}><Glyph icon="id" size={compact ? 48 : 62} color={alert ? "#972D22" : "#492CAA"} /></div>
    <div><Mono size={22}>CHECK-IN</Mono><div style={{...sans, fontSize: compact ? 32 : 43}}>Ficha del huésped</div></div>
  </div>
  <Mono size={22} color="#695E50">Nombre</Mono>
  <div style={{...sans, minHeight: compact ? 63 : 81, marginTop: 9, padding: "16px 18px", fontSize: compact ? 46 : 56,
    border: alert ? "3px solid #D45543" : "2px solid #DDD3C3", borderRadius: 17, background: alert ? "#FFF0E9" : "#FBF6EA"}}>
    {name}
  </div>
</Paper>;

const TitleStamp: React.FC<{text: string; word: number; x: number; y: number; w: number; color?: string; bg?: string}> = ({
  text, word, x, y, w, color = "#fff", bg = c.ink,
}) => {
  const {t} = useTime();
  const p = motion(t, at(word), 0.27, Easing.out(Easing.back(1.4)));
  return <Box x={x} y={y} w={w} style={{opacity: Math.min(1, p * 2.3), transform: `scale(${1.6 - 0.6 * p}) rotate(-7deg)`,
    background: bg, color, borderRadius: 20, fontFamily: fonts.serif, fontStyle: "italic", fontSize: 106, lineHeight: 1.02, textAlign: "center", padding: "9px 0 22px"}}>
    {text}
  </Box>;
};

const Doc: React.FC<{kind: string; row: string; right?: boolean; dim?: boolean}> = ({kind, row, right, dim}) => (
  <Paper style={{padding: "31px 28px", background: right ? "#E9DFFF" : "#FFFCF4", opacity: dim ? 0.83 : 1}}>
    <Glyph icon={right ? "id" : "page"} color="#4F2DB5" size={77} />
    <div style={{...sans, fontSize: 40, margin: "16px 0 28px"}}>{kind}</div>
    <Mono size={21} color="#574C66">NOMBRE</Mono>
    <div style={{...sans, borderTop: "2px solid #40314B2B", paddingTop: 14, marginTop: 9, fontSize: 45}}>{row}</div>
  </Paper>
);

export const ShotContent: React.FC<{shot: Shot}> = ({shot}) => {
  const {t} = useTime();
  const start = cuts[shot];
  const enter = motion(t, start, 0.42);

  switch (shot) {
    case "hook": {
      const wrong = motion(t, at(5), 0.43, Easing.out(Easing.back(1.6)));
      const peek = motion(t, start + 0.04, 0.75);
      return <AbsoluteFill style={{background: c.paper}}>
        <Lines />
        <Box x={-140} y={1140} w={1400} h={200} style={{borderTop: "5px solid #89735037", background: "#E9DABD", transform: "rotate(-7deg)"}} />
        <Toy x={-40 - 250 * (1 - peek)} y={879 + 240 * (1 - peek)} w={640} pose={t >= at(5) ? "sorpresa" : "peek-derecha"} turn={-7} />
        <Copy x={76} y={166} w={930} size={111} words={[["Este", 0], ["huésped", 1, true]]} />
        <Copy x={100} y={438} w={850} size={77} words={[["se", 2], ["llama…", 3, true]]} />
        <Box x={331} y={691 - 30 * wrong} w={670} style={{transform: `rotate(${7 - 9 * wrong}deg) scale(${0.93 + 0.09 * wrong})`}}>
          <Slip name={<>
            <Typewriter text="Alex" from={at(4)} to={at(5)} caret={false} />
            {" "}<Typewriter text="Pasaporte" from={at(5)} to={at(5) + 0.31} caret={t < at(5) + 0.38} />
          </>} alert={t >= at(5) + 0.18} compact />
        </Box>
        <Box x={423} y={1120} w={600} style={{opacity: wrong, transform: `translateY(${25 * (1 - wrong)}px) rotate(5deg)`}}>
          <Label bg="#FFB19A" size={26}>¿Pasaporte como apellido?</Label>
        </Box>
      </AbsoluteFill>;
    }
    case "form": {
      const hit = motion(t, at(22), 0.24, Easing.out(Easing.back(1.5)));
      return <AbsoluteFill style={{background: "#DDD4C1"}}>
        <Lines color="#493F2B1B" />
        <Box x={99} y={630 - 42 * hit} w={880} style={{transform: `scale(${0.93 + 0.13 * enter}) rotate(${-2 + 2 * enter}deg)`}}>
          <Slip alert={t >= at(22)} />
        </Box>
        <Copy x={124} y={1230} w={790} size={89} axis="x" words={[["Llena", 21], ["mal", 22, true], ["su", 23], ["check-in.", 24]]} accent="#9A3122" />
        <Box x={724} y={370} w={200} style={{opacity: hit, transform: `rotate(${17 - hit * 11}deg)`}}>
          <Label color="#fff" bg="#A43429">✕ revisar</Label>
        </Box>
      </AbsoluteFill>;
    }
    case "traffic": {
      const fly = motion(t, at(28), 0.44);
      const cols = [{id: "TRA", word: 30, x: 98}, {id: "SIRE", word: 33, x: 579}];
      return <AbsoluteFill style={{background: c.orange}}>
        <Copy x={84} y={154} w={930} size={100} words={[["Reportas", 26], ["datos", 27]]} />
        <Box x={220} y={488} w={640} style={{transform: `translateY(${-105 * fly}px) scale(${1 - 0.12 * fly})`, opacity: 1 - 0.22 * fly}}>
          <Slip compact alert />
        </Box>
        <TitleStamp text="Falsos." word={28} x={272} y={802} w={529} />
        <svg width="1080" height="1920" style={{position: "absolute", inset: 0}} aria-hidden>
          <path d="M540 930v75h-240v85m240-85h244v85" fill="none" stroke="#181610" strokeWidth={5}
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - motion(t, at(28) + 0.15, 0.9)} />
        </svg>
        {cols.map(({id, word, x}) => {
          const show = motion(t, at(word), 0.28);
          return <Box key={id} x={x} y={1090 + 61 * (1 - show)} w={399} style={{opacity: show}}>
            <Paper style={{display: "flex", alignItems: "center", gap: 20}}>
              <Glyph icon="page" size={68} /><div style={{...sans, fontSize: 61}}>{id}</div>
            </Paper>
          </Box>;
        })}
      </AbsoluteFill>;
    }
    case "owner": {
      const hit = motion(t, at(57), 0.31, Easing.out(Easing.back(1.6)));
      const emphasis = t >= at(57);
      const passed = motion(t, at(55), 0.26);
      return <AbsoluteFill style={{background: "#1C1817"}}>
        <Box x={202} y={503} w={690} h={690} style={{borderRadius: "50%", background: "#ECC05222", transform: `scale(${0.76 + 0.24 * enter})`}} />
        <Toy x={276 - 73 * passed + 130 * hit} y={790 - 34 * passed - hit * 90} w={632} pose={emphasis ? "sorpresa" : "mira-titular"} turn={-10 + hit * 15} />
        {!emphasis && <Copy x={83} y={186} w={905} color="#FFFAF0" accent="#F6C747" size={103}
          words={[["El", 50], ["responsable", 51, true]]} />}
        <Box x={74} y={325 + (1 - hit) * 115} w={927} style={{textAlign: "center", opacity: Math.min(1, hit * 2),
          fontFamily: fonts.serif, fontStyle: "italic", color: "#F6C747", fontSize: 390, lineHeight: 0.9, transform: `scale(${0.78 + hit * 0.22})`}}>
          Tú.
        </Box>
        <Box x={195} y={1390} w={720} style={{textAlign: "center"}}>
          <Label bg={emphasis ? "#F6C747" : "#F5E8CF"}>
            {emphasis ? "OPERADOR DEL ALOJAMIENTO" : <span style={{textDecoration: t >= at(55) ? "line-through" : "none"}}>¿EL HUÉSPED?</span>}
          </Label>
        </Box>
      </AbsoluteFill>;
    }
    case "scan": {
      const beam = motion(t, at(65), at(67) - at(65), Easing.linear);
      return <AbsoluteFill style={{background: c.purple}}>
        <Lines color="#FFFFFF14" />
        <Copy x={89} y={148} w={950} color="#FFFAF0" accent="#E7ED8B" size={98} words={[["En", 58], ["Monark", 59, true]]} />
        <Box x={186 - 92 * (1 - enter)} y={674 + (1 - enter) * 250} w={706}
          style={{transform: `rotate(${-14 + 10 * enter}deg)`}}>
          <Doc kind="Documento" row="Alex" />
          {t >= at(65) && t < at(67) + 0.12 && <div style={{position: "absolute", inset: `${22 + 268 * beam}px -14px auto`, height: 5,
            background: "#C3FA91", boxShadow: "0 0 26px 7px #B5F9A5"}} />}
        </Box>
        <Copy x={224} y={1195} w={757} align="right" color="#FFFAF0" accent="#E7ED8B" size={82} axis="x"
          words={[["La", 60], ["IA", 61, true], ["revisa", 62], ["el", 64], ["documento.", 65]]} />
      </AbsoluteFill>;
    }
    case "compare": {
      const joined = motion(t, at(70), 0.38);
      const before = motion(t, start, 0.38);
      return <AbsoluteFill style={{background: c.purple}}>
        <Lines color="#FFFFFF15" />
        <Copy x={84} y={202} w={912} align="center" color="#FFFAF0" accent={c.lime} size={110} words={[["Que", 69], ["coincida.", 70, true]]} />
        <Box x={186 - 85 * before} y={674 - 34 * before - 15 * joined} w={706 - 290 * before} style={{transform: `rotate(${-4 + 4 * joined}deg)`}}>
          <Doc kind="Documento" row="Alex" />
        </Box>
        <Box x={575 + 500 * (1 - before)} y={759 - 134 * joined} w={416} style={{transform: `rotate(${8 - 8 * joined}deg)`}}>
          <Doc kind="Formulario" row="Alex" right />
        </Box>
        <Box x={473} y={772} w={134} h={134} style={{display: "grid", placeItems: "center", borderRadius: "50%", background: c.lime,
          transform: `scale(${joined})`, color: c.green}}><Glyph icon="check" size={79} color={c.green} /></Box>
        <Box x={91} y={1181} w={898} style={{textAlign: "center", opacity: joined}}>
          <Label bg="#E7ED8B" color="#25462D" size={33}>Datos coinciden</Label>
        </Box>
      </AbsoluteFill>;
    }
    case "permit": {
      const request = motion(t, at(84), 0.37);
      return <AbsoluteFill style={{background: "#E5E994"}}>
        <Lines color="#2F381311" step={51} />
        <Copy x={78} y={156} w={802} size={95} words={[["Si", 77], ["viaja", 78], ["un", 79], ["menor.", 80, true]]} />
        <Box x={473 - 214 * request} y={611 - 15 * request} w={508} style={{transform: `rotate(${14 - request * 23}deg)`}}>
          <Paper><Glyph icon="page" size={120} /><div style={{...sans, margin: "20px 0", fontSize: 48}}>Permiso de viaje</div>
            <Label bg={t >= at(84) ? "#DBEECB" : "#F5DFB0"}>{t >= at(84) ? "Solicitado" : "Pendiente"}</Label></Paper>
        </Box>
        <Copy x={105} y={1223} w={892} size={101} axis="x" words={[["Pide", 82], ["el", 83], ["permiso.", 84, true]]} />
      </AbsoluteFill>;
    }
    case "dispatch": {
      const trip = motion(t, at(88), at(95) - at(88), Easing.inOut(Easing.cubic));
      const delivered = motion(t, at(95), 0.32, Easing.out(Easing.back(1.5)));
      return <AbsoluteFill style={{background: "#E5E994"}}>
        <Copy x={95} y={199} w={907} size={97} words={[["El", 86], ["reporte", 87, true], ["sale", 88], ["solo.", 89]]} />
        <svg width="1080" height="1920" style={{position: "absolute", inset: 0}} aria-hidden>
          <path d="M225 901C380 550 661 530 860 901" fill="none" stroke="#4F542F" strokeWidth={5} strokeDasharray="12 17" />
        </svg>
        <Box x={133 + 500 * trip} y={711 - 210 * Math.sin(Math.PI * trip)} w={300}
          style={{transform: `rotate(${-13 + trip * 27}deg) scale(${1 - trip * 0.23})`}}>
          <Paper><Glyph icon="page" size={103} /><Mono size={24}>REPORTE</Mono></Paper>
        </Box>
        <Box x={743} y={855} w={240} style={{opacity: 0.55 + delivered * 0.45, transform: `scale(${0.92 + 0.08 * delivered})`}}>
          <Glyph icon="door" color="#303A17" size={214} />
          <div style={{position: "absolute", bottom: -38, right: 12, background: "#263918", borderRadius: "50%", width: 77,
            height: 77, display: "grid", placeItems: "center", transform: `scale(${delivered})`}}>
            <Glyph icon="check" size={52} color="#F1F6D4" />
          </div>
        </Box>
        <Copy x={133} y={1225} w={814} align="right" size={98} words={[["Aviso", 93], ["a", 94], ["portería.", 95, true]]} />
      </AbsoluteFill>;
    }
    case "phone": {
      const sent = motion(t, at(111), 0.24);
      const scale = 0.89 + 0.15 * motion(t, at(110), 0.66);
      const prepare = motion(t, at(116), 0.32);
      return <AbsoluteFill style={{background: c.blue}}>
        <Copy x={76} y={147} w={935} color="#fff" accent="#E7ED8B" size={91} words={[["Recordatorios", 110], ["inteligentes.", 111, true]]} />
        <Box x={156 - 45 * sent} y={520 + 160 * (1 - enter)} w={570} h={877} style={{padding: "71px 31px 38px", border: "13px solid #12121E",
          boxSizing: "border-box", borderRadius: 80, background: "#FFFBF1", color: c.ink, boxShadow: "0 35px 86px #101B6490", transform: `rotate(${-8 + 6 * sent}deg) scale(${scale})`}}>
          <div style={{position: "absolute", width: 111, height: 18, top: 18, left: "39%", background: "#12121E", borderRadius: 99}} />
          <Mono size={24}>CHECK-IN ONLINE</Mono>
          <div style={{...sans, fontSize: 43, marginTop: 32}}>Antes de llegar</div>
          <div style={{background: "#E5E9FF", borderRadius: 24, fontFamily: fonts.sans, fontSize: 32,
            lineHeight: 1.25, fontWeight: 700, padding: 24, minHeight: 136, marginTop: 23}}>
            <Typewriter text="Hola, completa tu check-in antes de llegar." from={at(109)} to={at(111)} caret={t < at(111)} />
          </div>
          <div style={{marginTop: 22, opacity: sent, transform: `translateY(${25 * (1 - sent)}px)`}}><Label bg="#DFF4E3">Enviado ✓</Label></div>
        </Box>
        <Box x={678} y={965 + 130 * (1 - sent)} w={285} style={{opacity: sent, transform: "rotate(8deg)"}}>
          <Paper style={{padding: 24}}>
            <Mono size={23}>FORMULARIO</Mono>
            <div style={{...sans, fontSize: 44}}>Pendiente</div>
          </Paper>
          <div style={{position: "absolute", left: 75, top: 125, background: "#ECF1FF", borderRadius: "50%", width: 118, height: 118,
            boxShadow: "0 12px 27px #14195960", display: "grid", placeItems: "center", transform: `scale(${prepare})`}}>
            <svg viewBox="0 0 80 80" width="78" height="78" fill="none" stroke="#243EBB" strokeWidth="5" strokeLinecap="round" aria-hidden>
              <circle cx="40" cy="40" r="32" /><path d="M40 20v20l16 10" />
            </svg>
          </div>
        </Box>
      </AbsoluteFill>;
    }
    case "clock": {
      const progress = motion(t, at(119), at(125) - at(119), Easing.linear);
      return <AbsoluteFill style={{background: c.blue}}>
        <Box x={164 + 289 * (1 - enter)} y={376 + 288 * (1 - enter)} w={752} h={752} style={{borderRadius: "50%", background: "#ECF1FF",
          transform: `scale(${0.16 + 0.84 * enter})`, boxShadow: "0 30px 80px #10247B60"}}>
          <svg viewBox="0 0 752 752" width="752" height="752" aria-hidden>
            <circle cx="376" cy="376" r="301" fill="none" stroke="#D5DDF9" strokeWidth="23" />
            <circle cx="376" cy="376" r="301" fill="none" stroke="#243EBB" strokeWidth="23" strokeLinecap="round"
              strokeDasharray={1} strokeDashoffset={1 - progress} pathLength={1} transform="rotate(-90 376 376)" />
            <path d="M376 376v-186m0 186h146" fill="none" stroke="#242E65" strokeWidth={17} strokeLinecap="round"
              transform={`rotate(${progress * 152} 376 376)`} />
            <circle cx="376" cy="376" r="19" fill="#242E65" />
          </svg>
        </Box>
        <Copy x={90} y={1205} w={900} align="center" color="#FFF" accent={c.lime} size={103} words={[["El", 118], ["día", 119], ["se", 123], ["acerca.", 125, true]]} />
      </AbsoluteFill>;
    }
    case "alert": {
      const bell = motion(t, at(134), 0.42, Easing.out(Easing.back(1.5)));
      const vibrate = Math.sin((t - at(134)) * 38) * 7 * (1 - motion(t, at(134), 0.7));
      const route = motion(t, at(137), 0.53);
      return <AbsoluteFill style={{background: c.orange}}>
        <Copy x={73} y={171} w={933} size={110} words={[["Pasa", 128], ["el", 129], ["límite.", 130, true]]} />
        <Box x={219 - 113 * route} y={638 - bell * 75 + 72 * route} w={650 - 218 * route} style={{textAlign: "center",
          transform: `rotate(${t >= at(134) ? vibrate : -5}deg) scale(${0.78 + 0.22 * bell})`}}>
          <Paper><Glyph icon="bell" size={159 - 55 * route} /><div style={{...sans, fontSize: 51 - 14 * route, marginTop: 14}}>Check-in pendiente</div>
            <div style={{marginTop: 25}}><Label size={22} bg={t >= at(134) ? "#DFF4E3" : "#FFDECE"}>{t >= at(134) ? "Aviso enviado" : "Requiere atención"}</Label></div></Paper>
        </Box>
                <Box x={606 + 410 * (1 - route)} y={652} w={289} style={{textAlign: "center", opacity: route, transform: "rotate(5deg)"}}>
          <Paper>
            <div style={{position: "relative", width: 110, height: 110, borderRadius: 99, background: "#FFD7B5", overflow: "hidden", margin: "0 auto 18px"}}>
              <Img src={staticFile("character/ht/badge-circle.png")} style={{width: "100%", imageRendering: "pixelated"}} />
            </div>
            <Mono size={23}>TU EQUIPO</Mono>
          </Paper>
        </Box>
        <Copy x={83} y={1245} w={923} align="right" size={93} axis="x" words={[["Te", 133], ["notificamos.", 134, true]]} />
        <Box x={601} y={1512} w={385} style={{opacity: motion(t, at(144), 0.22), textAlign: "right"}}><Label bg="#FFEEDB">En tiempo real</Label></Box>
      </AbsoluteFill>;
    }
    case "lobby": {
      const travel = motion(t, at(147), at(150) - at(147));
      const stop = motion(t, at(156), 0.25, Easing.out(Easing.back(1.7)));
      return <AbsoluteFill style={{background: "#211B21"}}>
        <Lines color="#FFFFFF12" />
        <Box x={-80} y={1066} w={1237} h={432} style={{background: "#483E48", transform: "skewY(-6deg)", borderTop: "3px solid #BAA4AD55"}} />
        <Box x={627} y={631} w={359} style={{opacity: 0.9}}><Glyph icon="door" size={310} color={t >= at(156) ? "#FF917D" : "#F5E2BF"} /></Box>
        <Box x={66 + travel * 309} y={897 - Math.abs(Math.sin(travel * 15)) * 27} w={200} style={{transform: `rotate(${-14 + travel * 20}deg)`}}>
          <Img src={staticFile("props/ht/maleta.png")} style={{width: "100%", imageRendering: "pixelated"}} />
        </Box>
        <Copy x={90} y={164} w={905} size={104} color="#FFFAF0" accent="#F3CA73"
          words={[["El", 146], ["huésped", 147, true], ["va", 148], ["a", 149], ["entrar.", 150]]} />
        <Box x={160} y={1284} w={740} style={{textAlign: "center", opacity: stop, transform: `scale(${0.72 + 0.28 * stop})`}}>
          <Label bg="#FF9C89" size={34}>Check-in pendiente</Label>
        </Box>
      </AbsoluteFill>;
    }
    case "goodbye": {
      const throwAway = motion(t, at(179), 0.68, Easing.in(Easing.cubic));
      return <AbsoluteFill style={{background: c.paper}}>
        <Lines />
        <Toy x={20} y={810 + 220 * (1 - enter)} w={795} pose="guino" turn={-7} />
        <Copy x={82} y={207} w={946} size={135} words={[["Chao,", 177, true], ["Alex.", 178]]} />
        <Box x={374} y={673} w={608} style={{transform: `rotate(${-5 - 16 * throwAway}deg)`}}>
          <Slip compact name={<><span>Alex</span><span style={{display: "inline-block", marginLeft: 16, color: "#922F24",
            textDecoration: t >= at(179) ? "line-through" : "none", opacity: 1 - throwAway,
            transform: `translate(${440 * throwAway}px,${-290 * throwAway}px) rotate(${20 * throwAway}deg)`}}>Pasaporte</span></>} />
        </Box>
      </AbsoluteFill>;
    }
    case "close": {
      const brand = motion(t, at(198), 0.39);
      const months = motion(t, at(202), 0.31);
      const drop = motion(t, at(206), 0.42, Easing.out(Easing.back(1.4)));
      const free = motion(t, at(212), 0.25);
      const click = at(208) + 0.24;
      return <AbsoluteFill style={{background: c.gold}}>
        <Box x={-220} y={270} w={1510} h={1510} style={{background: "#FFCA4A", borderRadius: "50%", transform: `scale(${0.72 + 0.28 * enter})`}} />
        <Copy x={76} y={163} w={928} align="center" size={84} style={{opacity: 1 - motion(t, at(198), 0.45)}} words={[["Enlace", 190, true], ["en", 191], ["el", 192], ["perfil.", 193]]} />
        <Box x={298} y={402 + 104 * (1 - brand)} w={484} h={273} style={{overflow: "hidden", opacity: brand}}>
          <Toy x={0} y={17} w={484} pose="guino" tint />
        </Box>
        <Box x={197} y={657} w={686} style={{opacity: brand, clipPath: `inset(0 ${100 - brand * 100}% 0 0)`}}>
          <Img src={staticFile("brand/monark-logo.png")} style={{width: "100%", filter: "brightness(0)"}} />
        </Box>
        <Box x={75} y={935} w={930} style={{textAlign: "center", fontFamily: fonts.sans}}>
          <div style={{...sans, display: "inline-block", fontSize: 160, lineHeight: 0.91, letterSpacing: "-0.08em",
            opacity: drop, transform: `translateY(${100 * (1 - drop)}px) scale(${0.78 + 0.22 * drop})`}}>30 %</div>
          <div style={{opacity: months, fontSize: 37, fontWeight: 800, marginTop: 20}}>{t >= at(206) ? "de descuento por tres meses" : "Tres meses"}</div>
          <div style={{opacity: free, marginTop: 21}}><Mono size={26}>Implementación gratis</Mono></div>
        </Box>
        <Box x={250} y={1358} w={580} style={{textAlign: "center", background: "#181610", color: "#FFFDF5", padding: "26px 0", borderRadius: 99,
          fontFamily: fonts.sans, fontSize: 40, fontWeight: 800, opacity: motion(t, at(193), 0.28),
          transform: t >= click && t < click + 0.13 ? "scale(0.96)" : undefined}}>Enlace en el perfil ↗</Box>
        <Cursor path={[{x: 938, y: 1515, at: click - 0.55}, {x: 794, y: 1407, at: click}]}
          clicks={[click]} hideAt={click + 0.7} />
      </AbsoluteFill>;
    }
  }
};
