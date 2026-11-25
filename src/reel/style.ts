import {loadFont as loadInter} from "@remotion/google-fonts/Inter";
import {loadFont as loadChakra} from "@remotion/google-fonts/ChakraPetch";

const inter = loadInter("normal", {weights: ["500", "600", "700", "800", "900"], subsets: ["latin"]});
const chakra = loadChakra("normal", {weights: ["500", "600"], subsets: ["latin"]});

export const F = {ui: inter.fontFamily, cap: chakra.fontFamily};

export const C = {
  yellow: "#F5B20F", // fondo Monark (equivalente al naranja de la referencia)
  yellowDeep: "#E9A100",
  ink: "#1A1410",
  capBox: "#2A2420",
  frame: "#EADFCB", // marco beige de las ventanas
  window: "#FCF9F3",
  line: "#E7DECF",
  mute: "#8A8075",
  green: "#25D366",
  night: "#0B0604",
};
