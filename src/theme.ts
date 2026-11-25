import {loadFont as loadSans} from "@remotion/google-fonts/PlusJakartaSans";
import {loadFont as loadSerif} from "@remotion/google-fonts/InstrumentSerif";
import {loadFont as loadMono} from "@remotion/google-fonts/JetBrainsMono";

const sans = loadSans("normal", {weights: ["500", "700", "800"], subsets: ["latin"]});
const serif = loadSerif("italic", {weights: ["400"], subsets: ["latin"]});
const mono = loadMono("normal", {weights: ["400", "500"], subsets: ["latin"]});

export const fonts = {
  sans: sans.fontFamily,
  serif: serif.fontFamily,
  mono: mono.fontFamily,
};

// Medidas y colores extraídos del Reel Monark v2 (lienzo 1080×1920)
export const theme = {
  yellow: "#EFAF1A",
  ink: "#121212",
  inkSoft: "#4A4540",
  track: "#E8E0D6",
  W: 1080,
  H: 1920,
  marginX: 60,
  headerY: 150, // centro vertical de la barra superior
  headlineY: 376, // centro vertical del titular
  card: {x: 60, y: 500, w: 960, h: 680, radius: 40},
  progressY: 1240,
  footerY: 1444,
};
