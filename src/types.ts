import type {Caption} from "@remotion/captions";

export type Crop = {x: number; y: number; w: number; h: number};

/**
 * Todo lo que cambia entre un clip y otro. El diseño (marco) es fijo en Testimonial.tsx.
 * Cada clip vive en clips/<id>.json y se registra en src/clips.ts.
 */
export type ClipConfig = {
  id: string;

  // --- Contexto editorial (lo que "entiende" la IA del clip) ---
  kicker: string; // etiqueta arriba a la derecha, ej. "TESTIMONIO"
  headlineLead: string; // parte en sans bold, ej. "La satisfacción del"
  headlineAccent: string; // parte en serif itálica con subrayado, ej. "huésped"
  speakerRole: string; // serif itálica, ej. "Zapata Hospitality"
  speakerName: string; // sans bold, ej. "Santiago Zapata"
  footerLabel: string; // mono abajo a la derecha, ej. "ALIADO MONARK"

  // --- Marca del cliente ---
  clientLogo?: string; // ruta dentro de public/, ej. "brand/zapata-logo.png"
  clientLogoWidth: number; // ancho en px sobre el lienzo de 1080

  // --- Video ---
  video: string; // ruta dentro de public/
  sourceSize: {w: number; h: number}; // tamaño del video original
  crop: Crop; // región del video original que se muestra en la tarjeta
  trimStartSec: number;
  trimEndSec: number;
  muted?: boolean;

  // --- Subtítulos (Whisper) ---
  captionsFile?: string; // ruta dentro de public/ del JSON de captions
  showCaptions: boolean;
  captionFixes?: Record<string, string>; // correcciones a Whisper: {"WESPED.": "huésped."}

  // --- Tiempos ---
  nameInSec: number; // cuándo aparece el cargo/nombre
  outroSec: number; // duración del cierre con logo Monark
};

export type TestimonialProps = ClipConfig & {
  captions: Caption[];
};
