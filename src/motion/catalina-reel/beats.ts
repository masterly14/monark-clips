// Beat map de "catalina-reel" (video-catalina reeditado con Monark Motion).
// Intro: llamada real con Catalina (public/clips/llamada-catalina-corte.mp4, tramos en llamada-catalina.segs.txt).
// Pieza larga: locución ajustada (public/clips/catalina-tight.mp4: pausas > 0,22 s recortadas, cortes en catalina-tight.cuts.txt).
// Tiempos de palabra: ./captions.json (whisper.cpp medium) verificados contra la envolvente de energía;
// donde whisper se desvía (gratis, reportes, propietarios, huésped) manda la envolvente.
import type {SfxEvent} from "../kit";

export const FPS = 30;
export const VOICE_END = 46.95;
export const DURATION_S = 49.7; // tarjeta final ≈ 4 s (voz hasta 46,95 + 2,75 s de sostén)

export const CONCEPT = {
  metaphor: "«Alguien tiene que estar haciéndolo»: el trabajo invisible del fin de mes, que ahora hace Monark.",
  motif: "El reporte a propietarios de fin de mes. En la llamada se tacha «armarlo a mano»; en el problema cae a la cima de la pila gris; en la demo se dobla en sobre y se envía solo.",
  payoff: "En la tarjeta final el reporte llega como sobre con «✓ Enviado solo · fin de mes» junto al CTA.",
};

export type Shot = "full" | "window" | "hidden" | "split";
export type Beat = {id: string; from: number; to: number; voice: string; headline: string; shot: Shot; evolves: string; bridge: string; sfx: SfxEvent[]};

// Cada SFX lleva como `at` el frame del evento visual que marca (no la palabra).
export const BEATS: Beat[] = [
  // ---------- 1. Gancho (la emoción del presentador) ----------
  {id: "b1-emocion", from: 0, to: 2.4, voice: "No hay nada que me llene más de emoción que escuchar esto,",
    headline: "Nada me llena más de *emoción*", shot: "full", evolves: "el presentador nace en la ventana de la llamada y se abre a cámara completa",
    bridge: "morph ventana → full", sfx: [{type: "whoosh", at: 0.06}]},
  {id: "b2-rentas", from: 2.4, to: 4.83, voice: "y es que si usted es operador de rentas cortas,",
    headline: "¿Operas *rentas cortas*?", shot: "full", evolves: "cabaña, apartamento y glamping flotan junto a la cabeza",
    bridge: "sale de cuadro en «usted sabe»", sfx: [{type: "pop", at: 3.88}, {type: "pop", at: 4.06}, {type: "pop", at: 4.24}]},
  // ---------- 2. Problema: el PMS que solo sincroniza (mundo gris) ----------
  {id: "b3-sync", from: 4.83, to: 7.2, voice: "usted sabe que los PMS necesitan ser…",
    headline: "Un PMS *necesita*…", shot: "hidden", evolves: "tarjeta gris de sincronización Airbnb ⇄ calendario ⇄ Booking, flechas girando",
    bridge: "pull-back del mundo", sfx: [{type: "whoosh", at: 4.85}, {type: "pop", at: 5.3}]},
  {id: "b4-pila", from: 7.2, to: 9.27, voice: "…más que sincronización de canales.",
    headline: "Más que *sincronizar* canales", shot: "hidden", evolves: "caen las tareas manuales; el reporte a propietarios cae a la cima",
    bridge: "pausa con visor y ruptura desde el reporte", sfx: [{type: "whoosh", at: 7.25}, {type: "alerta", at: 7.6}, {type: "alerta", at: 8.3}, {type: "glitch", at: 8.68, gain: 0.8}, {type: "riser", at: 9.03}]},
  // ---------- 3. Giro ----------
  {id: "b5-monark", from: 9.27, to: 13.89, voice: "Monark es el primer PMS de Colombia y potencialmente de Latinoamérica",
    headline: "El primer PMS de *Colombia* / Potencialmente, *Latinoamérica*", shot: "window",
    evolves: "la marca rompe la pila; el logo viaja arriba; tarjetas Colombia ✓ y Latinoamérica (punteada)",
    bridge: "ruptura (Shatter + Splash + BlobReveal)", sfx: [{type: "impacto", at: 9.27}, {type: "destello", at: 9.42}, {type: "whoosh", at: 10.3}, {type: "pop", at: 11.31}, {type: "pop", at: 13.05}]},
  // ---------- 4. Demostración ----------
  {id: "b6-automatiza", from: 13.89, to: 15.52, voice: "que automatiza toda la operación",
    headline: "Automatiza *toda* la operación", shot: "hidden", evolves: "tarjeta «Tu operación»: 4 interruptores pasan a automático (el último, reportes)",
    bridge: "la tarjeta sube y deja lugar a la dividida", sfx: [{type: "whoosh", at: 13.89}, {type: "clic", at: 14.07}, {type: "tick", at: 14.3}, {type: "tick", at: 14.55}, {type: "tick", at: 14.76}, {type: "confirmacion", at: 14.98}]},
  {id: "b7-crecer", from: 15.52, to: 22.29, voice: "y permite que los operadores se enfoquen en aumentar la capacidad operativa, en crecer el número de propiedades",
    headline: "Tú te *enfocas* / Más *capacidad* / Más *propiedades*", shot: "split", evolves: "una propiedad grande con mensajes, limpiezas y reportes en automático; barra de capacidad sube; la propiedad se encoge y se multiplican 1 → 8",
    bridge: "el presentador vuelve a cámara completa", sfx: [{type: "whoosh", at: 15.52}, {type: "pop", at: 15.95}, {type: "pop", at: 16.4}, {type: "pop", at: 16.9}, {type: "pop", at: 17.4}, {type: "conteo", at: 19.04, until: 19.6}, {type: "tick", at: 19.72}, {type: "pop", at: 20.54}, {type: "pop", at: 20.86}, {type: "pop", at: 21.18}, {type: "pop", at: 21.51}]},
  {id: "b8-ojo", from: 22.29, to: 26.93, voice: "y esto no les cueste un ojo de la cara. Así que quiero que lo prueben ustedes, en el link del perfil",
    headline: "No te cuesta un *ojo* de la cara / Quiero que lo *pruebes*", shot: "full", evolves: "pastilla «link en el perfil» junto a la cabeza",
    bridge: "morph a dividida en «pueden encontrar»", sfx: [{type: "whoosh", at: 22.29}, {type: "pop", at: 26.05}]},
  // ---------- 5. Oferta ----------
  {id: "b9-30", from: 26.93, to: 31.46, voice: "pueden encontrar una oferta de tres meses con el 30% de descuento en su suscripción de Monark",
    headline: "Una *oferta* → 30 % (cifra)", shot: "split", evolves: "panel violeta: tragamonedas 30 %, 3 primeros meses, en tu suscripción",
    bridge: "corte de color del panel", sfx: [{type: "whoosh", at: 26.93}, {type: "pop", at: 28.1}, {type: "swipe", at: 28.62}, {type: "conteo", at: 28.8, until: 29.25}, {type: "golpe", at: 29.3}, {type: "pop", at: 30.2}]},
  {id: "b10-gratis", from: 31.46, to: 33.5, voice: "tienen la implementación totalmente gratis",
    headline: "La implementación", shot: "split", evolves: "panel amarillo; sello «Gratis.» con confeti",
    bridge: "sale de cuadro", sfx: [{type: "swipe", at: 31.46}, {type: "golpe", at: 32.84}, {type: "destello", at: 32.98}]},
  // ---------- 6. Prueba social ----------
  {id: "b11-unete", from: 33.5, to: 38.38, voice: "y pueden unirse a la cantidad de operadores de rentas cortas que automatizaron toda su operación",
    headline: "Únete a los *operadores* / que *automatizaron* todo", shot: "window", evolves: "cuadrícula de 20 propiedades; en «automatizaron» todas pasan a ✓",
    bridge: "la cuadrícula se encoge y entra la ventana", sfx: [{type: "whoosh", at: 33.5}, {type: "pop", at: 34.0}, {type: "pop", at: 34.26}, {type: "pop", at: 34.52}, {type: "pop", at: 34.78}, {type: "pop", at: 35.24}, {type: "whoosh", at: 36.35}, {type: "tick", at: 36.61}, {type: "tick", at: 36.8}, {type: "tick", at: 37.0}, {type: "tick", at: 37.2}, {type: "confirmacion", at: 37.6}]},
  // ---------- 7. La misma tarjeta de operación evoluciona ----------
  {id: "b12-huesped", from: 38.38, to: 40.74, voice: "desde contestarle un mensaje a un huésped",
    headline: "Contesta al *huésped*", shot: "hidden", evolves: "tarjeta «Tu operación» (menta): pregunta del huésped → respuesta escrita → ✓✓",
    bridge: "corte de color del encabezado", sfx: [{type: "whoosh", at: 38.38}, {type: "notificacion", at: 38.6}, {type: "tecleo", at: 39.3, until: 39.9}, {type: "confirmacion", at: 39.98}]},
  {id: "b13-reportes", from: 40.74, to: 43.21, voice: "hasta enviarle reportes a propietarios al final de mes",
    headline: "Envía los *reportes*", shot: "hidden", evolves: "PAGO DEL MOTIVO: el calendario llega al 30, el reporte se llena, se dobla en sobre y sale a 3 propietarios ✓",
    bridge: "corte de color del encabezado", sfx: [{type: "swipe", at: 40.74}, {type: "tick", at: 40.95}, {type: "sobre-enviado", at: 41.44}, {type: "tick", at: 42.05}, {type: "tick", at: 42.22}, {type: "tick", at: 42.39}, {type: "confirmacion", at: 42.97}]},
  {id: "b14-monton", from: 43.21, to: 45.72, voice: "y un montón de tareas más que quisiera que lo vean.",
    headline: "Y un *montón* más", shot: "hidden", evolves: "lista de módulos con checks en cascada; sello «Resuelto.»",
    bridge: "mancha desde el sello a la tarjeta final", sfx: [{type: "swipe", at: 43.21}, {type: "tick", at: 43.45}, {type: "tick", at: 43.7}, {type: "tick", at: 43.95}, {type: "tick", at: 44.2}, {type: "golpe", at: 44.7}, {type: "destello", at: 44.85}]},
  // ---------- 8. Tarjeta final ----------
  {id: "b15-final", from: 45.72, to: DURATION_S, voice: "El link está en el perfil.",
    headline: "Toda tu operación, *automatizada*", shot: "window", evolves: "wordmark, presentador en ventana, el sobre del reporte llega con ✓, CTA con clic",
    bridge: "—", sfx: [{type: "logo", at: 45.85}, {type: "clic", at: 46.55}]},
];

export const SFX_EVENTS: SfxEvent[] = BEATS.flatMap((b) => b.sfx);
