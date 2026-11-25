// Beat map de "zapata-reel" (video2 reeditado con Monark Motion).
// Línea de tiempo = locución ajustada (public/clips/video2-tight.mp4: pausas > 0,22 s recortadas a 0,12 s).
// Tiempos de palabra: src/motion/zapata-reel/captions.json (whisper.cpp medium sobre la versión ajustada).
import type {SfxEvent} from "../kit";

export const FPS = 30;
export const VOICE_END = 56.36;
export const DURATION_S = 58.6; // la tarjeta final se sostiene ≈ 2,9 s

export const CONCEPT = {
  metaphor: "La diferencia entre un bot que contesta y un anfitrión que escribe: la estadía del huésped vista desde su teléfono.",
  motif: "El huésped (props/huesped, con su maleta) en el sticker, con un anillo de satisfacción que sube: 60 % → +17 % → lleno.",
  payoff: "En la tarjeta final el huésped vuelve con su maleta y deja ★★★★★ «¡Volvería!»; el anillo se completa.",
};

export type Shot = "full" | "window" | "hidden" | "split" | "graphics";
export type Beat = {
  id: string;
  from: number;
  to: number;
  voice: string;
  headline: string;
  shot: Shot;
  evolves: string;
  bridge: string;
  sfx: SfxEvent[];
};

// Cada SFX lleva como `at` el frame del evento visual que marca (no la palabra).
export const BEATS: Beat[] = [
  // ---------- 1. Gancho: el caso ----------
  {id: "b1-caso", from: 0, to: 3.0, voice: "Zapata Hospitality, una operación de rentas cortas en el Eje Cafetero,",
    headline: "Zapata *Hospitality*", shot: "full", evolves: "chip // rentas cortas y pin «Eje Cafetero» flotan junto a la cabeza",
    bridge: "el presentador sale de cuadro en «chatbot»", sfx: [{type: "whoosh", at: 0.12}, {type: "pop", at: 1.52}, {type: "pop", at: 2.3}]},
  {id: "b2-chatbot", from: 3.0, to: 5.9, voice: "tiene un chatbot de inteligencia artificial para huéspedes",
    headline: "Un *chatbot* de IA", shot: "hidden", evolves: "teléfono: llega la pregunta del huésped → escribe → responde el asistente",
    bridge: "el teléfono se encoge al decir «OTAs»", sfx: [{type: "whoosh", at: 3.56}, {type: "pop", at: 3.8}, {type: "notificacion", at: 5.39}, {type: "pop", at: 5.62}, {type: "pop", at: 6.25}]},
  {id: "b3-otas", from: 5.9, to: 9.6, voice: "que funciona tanto en todas las OTAs, incluido Airbnb, Booking y demás,",
    headline: "En todas las *OTAs*", shot: "hidden", evolves: "ráfaga de héroes: Airbnb (coral) → Booking (cobalto), rastro en la esquina",
    bridge: "círculo de color desde el ícono", sfx: [{type: "whoosh", at: 7.2}, {type: "swipe", at: 8.0}, {type: "swipe", at: 8.5}, {type: "pop", at: 9.02}]},
  {id: "b4-whatsapp", from: 9.6, to: 10.25, voice: "en WhatsApp,", headline: "—", shot: "hidden",
    evolves: "héroe WhatsApp (menta)", bridge: "el presentador vuelve a cámara completa", sfx: [{type: "swipe", at: 9.62}]},
  // ---------- 2. La prueba ----------
  {id: "b5-dice", from: 10.25, to: 13.3, voice: "y él nos está diciendo que esto funciona en WhatsApp,",
    headline: "Funciona en *WhatsApp*", shot: "full", evolves: "burbuja de WhatsApp flota junto a la cabeza",
    bridge: "morph a dividida en «aumentado»", sfx: [{type: "whoosh", at: 10.3}, {type: "pop", at: 12.6}]},
  {id: "b6-17", from: 13.3, to: 16.1, voice: "le ha aumentado un 17% en la satisfacción de sus huéspedes,",
    headline: "+17 % (cifra que reemplaza al titular)", shot: "split", evolves: "tragamonedas +17 %, barras antes/después, anillo del motivo sube",
    bridge: "corte al mundo gris", sfx: [{type: "whoosh", at: 13.36}, {type: "conteo", at: 13.95, until: 14.45}, {type: "golpe", at: 14.5}, {type: "destello", at: 14.65}]},
  // ---------- 3. La pregunta: el mundo gris de lo que creemos ----------
  {id: "b7-porque", from: 16.1, to: 18.15, voice: "y nos empezamos a preguntar por qué fue,",
    headline: "¿Por *qué*?", shot: "hidden", evolves: "primer plano del personaje → revelación del escritorio en halftone",
    bridge: "cámara", sfx: [{type: "whoosh", at: 16.14}, {type: "notificacion", at: 17.2, gain: 0.7}]},
  {id: "b8-creemos", from: 18.15, to: 21.3, voice: "y al final la respuesta es mucho más interesante de lo que creemos,",
    headline: "…más interesante de lo que *creemos*", shot: "hidden", evolves: "caen hipótesis grises (¿la IA? ¿rapidez? ¿24/7?), empuje lento de cámara",
    bridge: "pausa con visor", sfx: [{type: "alerta", at: 18.7, gain: 0.7}, {type: "alerta", at: 19.45, gain: 0.7}, {type: "glitch", at: 20.2}, {type: "riser", at: 21.55}]},
  // ---------- giro ----------
  {id: "b9-hospitalidad", from: 21.3, to: 22.65, voice: "y es que esto es hospitalidad,",
    headline: "Esto es *hospitalidad.*", shot: "hidden", evolves: "un mensaje con corazón cae sobre el teléfono y rompe el mundo; entra el menta",
    bridge: "ruptura (Shatter + Splash + BlobReveal)", sfx: [{type: "impacto", at: 21.9}, {type: "destello", at: 22.05}]},
  // ---------- 4. La explicación ----------
  {id: "b10-humano", from: 22.65, to: 26.2, voice: "tanto que el asistente debe ser lo más profesional y humano posible,",
    headline: "*Profesional* y humano", shot: "window", evolves: "dos interruptores se encienden: Profesional ✓ · Humano ✓",
    bridge: "la ventana sale de cuadro en «huésped»", sfx: [{type: "whoosh", at: 22.7}, {type: "clic", at: 24.36}, {type: "clic", at: 24.99}]},
  {id: "b11-seva", from: 26.2, to: 31.6, voice: "también el huésped se va con una percepción de que la empresa se tomó el tiempo de escribirle por WhatsApp,",
    headline: "Se tomó el *tiempo*", shot: "hidden", evolves: "el huésped cruza con su maleta; el teléfono de WhatsApp escribe un mensaje personal y pasa a ✓✓ azul",
    bridge: "el presentador vuelve a cámara completa", sfx: [{type: "whoosh", at: 26.86}, {type: "maleta-ruedas", at: 27.0}, {type: "pop", at: 28.5}, {type: "tecleo", at: 29.4, until: 30.9}, {type: "confirmacion", at: 31.1}]},
  {id: "b12-cercano", from: 31.6, to: 36.2, voice: "algo que psicológicamente lo percibimos como más personal, como más cercano a nosotros.",
    headline: "Más *personal.* / Más *cercano.*", shot: "full", evolves: "corazones junto a la cabeza; anillo del motivo sube",
    bridge: "sale de cuadro en «asistente»", sfx: [{type: "whoosh", at: 31.65}, {type: "pop", at: 33.92}, {type: "pop", at: 34.66}, {type: "destello", at: 34.8}]},
  // ---------- 5. Demostración: la misma tarjeta evoluciona ----------
  {id: "b13-quieres", from: 36.2, to: 38.25, voice: "Justamente, si ustedes quieren implementar un asistente de inteligencia artificial",
    headline: "¿Quieres el *tuyo*?", shot: "full", evolves: "titular en cámara", bridge: "sale de cuadro", sfx: []},
  {id: "b14-contexto", from: 38.25, to: 41.7, voice: "…que aprende el contexto del que ustedes le hablan,",
    headline: "Aprende tu *contexto*", shot: "hidden", evolves: "tarjeta del asistente: se cargan 3 datos de la propiedad",
    bridge: "corte de fondo por verbo", sfx: [{type: "whoosh", at: 38.27}, {type: "pop", at: 38.55}, {type: "tick", at: 40.0}, {type: "tick", at: 40.4}, {type: "tick", at: 40.8}]},
  {id: "b15-faq", from: 41.7, to: 43.85, voice: "que aprende las preguntas frecuentes de su propiedad",
    headline: "Tus preguntas *frecuentes*", shot: "hidden", evolves: "la misma tarjeta: lista de preguntas con check",
    bridge: "corte de fondo", sfx: [{type: "swipe", at: 41.82}, {type: "tick", at: 42.3}, {type: "tick", at: 42.7}, {type: "tick", at: 43.1}]},
  {id: "b16-comoti", from: 43.85, to: 45.3, voice: "y que se comunica como ustedes,",
    headline: "Habla *como tú*", shot: "hidden", evolves: "la misma tarjeta: deslizador de tono hasta «como tú» y respuesta de ejemplo",
    bridge: "pastilla «link en el perfil»", sfx: [{type: "swipe", at: 43.9}, {type: "clic", at: 44.3}, {type: "tecleo", at: 44.6, until: 45.2}]},
  {id: "b17-monark", from: 45.3, to: 47.3, voice: "en el link de mi perfil tienen acceso a Monark,",
    headline: "Monark", shot: "hidden", evolves: "pastilla del link; la marca cae sobre la tarjeta y abre el amarillo",
    bridge: "círculo desde la marca", sfx: [{type: "pop", at: 45.42}, {type: "golpe", at: 46.75}, {type: "whoosh", at: 46.95}]},
  // ---------- 6. Oferta ----------
  {id: "b18-pms", from: 47.3, to: 50.0, voice: "Monark es el PMS que permite hacer esto y mucho más,",
    headline: "Esto y *mucho más*", shot: "split", evolves: "logo + PMS; chips de funciones en cascada",
    bridge: "corte de fondo", sfx: [{type: "whoosh", at: 47.35}, {type: "pop", at: 49.48}, {type: "pop", at: 49.62}, {type: "pop", at: 49.76}, {type: "pop", at: 49.9}]},
  {id: "b19-30", from: 50.0, to: 53.05, voice: "y aparte les da 30% de descuento en sus tres primeros meses",
    headline: "30 % (cifra)", shot: "split", evolves: "tragamonedas 30 % + «3 primeros meses»",
    bridge: "corte de fondo", sfx: [{type: "swipe", at: 50.69}, {type: "conteo", at: 50.85, until: 51.3}, {type: "golpe", at: 51.35}, {type: "pop", at: 52.3}]},
  {id: "b20-gratis", from: 53.05, to: 54.75, voice: "y la implementación es totalmente gratis,",
    headline: "Implementación *gratis*", shot: "split", evolves: "sello «Gratis.» sobre la tarjeta de implementación",
    bridge: "círculo a la tarjeta final", sfx: [{type: "swipe", at: 53.14}, {type: "golpe", at: 54.4}, {type: "destello", at: 54.55}]},
  // ---------- 7. Tarjeta final + pago del motivo ----------
  {id: "b21-final", from: 54.75, to: DURATION_S, voice: "así que los veo en el link del perfil.",
    headline: "Link en el *perfil*", shot: "hidden", evolves: "wordmark, el huésped vuelve con ★★★★★, CTA con clic",
    bridge: "—", sfx: [{type: "logo", at: 54.9}, {type: "clic", at: 55.7}]},
];

export const SFX_EVENTS: SfxEvent[] = BEATS.flatMap((b) => b.sfx);
