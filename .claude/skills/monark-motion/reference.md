# Monark Motion — tokens y especificaciones

Lienzo: **1080×1920**. Las medidas están en px de ese lienzo. Los tiempos están en frames a **60 fps**; a 30 fps, divide entre 2 y redondea hacia arriba.

## 1. Color

### Fondos de acto
El problema vive en un mundo en halftone sobre fondo claro; desde la ruptura, cada verbo de la demo trae su fondo plano y saturado. El corte seco cambia el fondo **detrás** de una UI que se queda; el círculo desde un objeto cambia de escena. La paleta parte del amarillo Monark y su complementario violeta para tener energía sin salirse de la marca.

| Token | Hex | Uso típico | Texto del titular | Acento (serif itálica) |
|---|---|---|---|---|
| `crema` | `#F1ECE3` (+ retícula de puntos `#DDD5C8`, 2 px cada 28 px) | Gancho, tagline | `#121212` | `#6C4CF5` (violeta) |
| `piedra` | `#D9D6D0` | Problema (tono apagado) | `#121212` | `#121212` con subrayado `#EFAF1A` |
| `amarillo` | `#EFAF1A` | Giro, momentos de marca | `#121212` | `#121212` (serif) o `#FFFFFF` si el tamaño ≥ 150 px |
| `violeta` | `#6C4CF5` | Demostración (IA, automatización) | `#FFFFFF` | `#FFD34D` |
| `coral` | `#FF5B3A` | Demostración (dinero, pagos, urgencia) | `#121212` | `#FFFFFF` |
| `cobalto` | `#2F5BEA` | Demostración (integraciones), tarjeta final | `#FFFFFF` | `#FFD34D` |
| `tinta` | `#141210` | Gancho de secreto (con foco), momento dramático | `#FFFFFF` | `#EFAF1A` |
| `menta` | `#C8F1DD` | Resultado, «listo», tinte de WhatsApp | `#121212` | `#128C4A` |
| `rosa` | `#FF3D7F` | Lanzamiento, «en vivo», celebración | `#FFFFFF` | `#121212` (serif) |

- **Acto Problema:** mundo en halftone sobre `crema` o `piedra` (con luz que baja y sube si hay time-lapse). Sin colores saturados hasta la ruptura.
- **Demostración:** corte de fondo **en cada verbo o beneficio** (≈ 1–1,8 s), rotando 4–6 colores de la tabla. Se pueden repetir; no pongas dos veces seguidas el mismo. La UI se queda y evoluciona mientras el fondo cambia detrás.
- **Tinte contextual:** cuando se muestra una app, la escena toma su color: WhatsApp → `menta` con acento `#128C4A`, Airbnb → `coral`, Booking → `cobalto`. El anillo del sticker también.
- La tarjeta final usa `amarillo` o `cobalto`.

### UI
- Tarjeta clara: fondo `#FFFFFF`, borde `1.5px rgba(0,0,0,0.08)`, sombra `0 40px 80px -30px rgba(0,0,0,0.35)`.
- Tarjeta oscura (código o IA): fondo `#1C1B1F`, texto `#EDEDED`, texto secundario `#8B8B93`.
- Estados: éxito `#22B35E`, error `#E5484D`, info `#2F5BEA`, aviso `#EFAF1A`.
- Pastillas de estado: fondo al 12 % del color y texto al 100 %, en mono.

## 2. Tipografía

| Rol | Fuente | Tamaño | Peso | Tracking | Interlineado |
|---|---|---|---|---|---|
| Titular sans | Plus Jakarta Sans | **84** en demo y problema · **104–118** en gancho y tarjeta final | 700 | −0.03em | 1.0 |
| Acento serif | Instrument Serif *itálica* | **1.25 × sans** (≈105; ≈140 en gancho) | 400 | −0.01em | 0.9 |
| Cifra que reemplaza al titular | Plus Jakarta Sans o JetBrains Mono, `tabular-nums` | 150–170 | 800 | −0.04em | 0.9 |
| Rótulo mono | JetBrains Mono | 24–26 | 500 | 0 | 1.2 |
| UI título | Plus Jakarta Sans | 34–40 | 700 | −0.02em | 1.15 |
| UI cuerpo | Plus Jakarta Sans | 26–30 | 500 | 0 | 1.35 |
| Cifra KPI | Plus Jakarta Sans, `tabular-nums` | 120–160 | 800 | −0.04em | 0.9 |
| Wordmark final | logo Monark (imagen) | ancho 640 | — | — | — |

- Los rótulos mono van en minúsculas con prefijo de comentario: `// reservas`, `// asistente ia`, `// pagos`.
- El acento serif se apoya en la misma línea base que la sans, o va en una línea propia si es la palabra final.

## 3. Layout (lienzo 1080×1920)

| Zona | Caja | Notas |
|---|---|---|
| Titular | x 80 → 760, y 300 → 560 | Alineado a la izquierda, máx. 3 líneas. Ancho limitado para no chocar con el sticker. Con presentador en `full`: x 80 → 1000 y top 210. En `split`: top 150. |
| Pantalla dividida (modo presentador) | proporción animada; base: gráfica y 0 → 1060 · panel y 1060 → 1920 | El panel lleva esquinas superiores de radio 44 y margen lateral de 24. La proporción se mueve entre 62/38 y 45/55 en 12 f según el beat. Las tarjetas pueden cruzar la costura hasta 120 px. Presentador a 1.18×, rostro centrado en su panel. |
| Gráfica completa (`graphics`) | x 80 → 1000 para texto y controles. Área de acción y 530 → 1530. | Titular en y 170–210. Amplía y redistribuye la UI según la acción. Conserva y 1660 → 1920 libre de texto importante. |
| Sticker del motivo | círculo de 180 Ø, centro (900, 380) | Relleno blanco, anillo de 5 px `#121212` y punto de estado de 22 px a las 2 en punto (verde `#22B35E`). |
| Escenario | x 60 → 1020, y 600 → 1660 | Tarjeta principal de 900–960 de ancho y radio 28. Teléfono de 480–540 de ancho y ≈ 1000 de alto. Un objeto aislado mide ≥ 420 px. |
| Chip de prueba (A27) | junto a la UI, a la altura del dato | Borde 4 px `#121212`, sombra dura `6px 6px 0 #121212`, mono 40. |
| Ventana del presentador | 760×1000 en (160, 760) · o 520×700 a un lado | Radio 44, borde blanco 6 px, sombra profunda. |
| Personaje grande | alto 1100, base anclada en y = 2020 (sobresale), centro x 640 | Va **detrás** de la tarjeta (la tarjeta tapa la coronilla). |
| Franja segura inferior | y 1660 → 1920 | Sin texto importante. |
| Rótulo de acto (opcional) | x 80, y 120, mono 22 `#8A8A8A` | `// 02 — problema`. Úsalo solo en piezas sin sticker. |

## 4. Personaje en halftone

- **Técnica:** dither ordenado Bayer 4×4 sobre una rejilla de píxel de **3 px**. Reduce la imagen ×3, aplica el dither y escala de vuelta con nearest-neighbor. El resultado son puntos negros puros sobre transparente.
- **Curva previa (obligatoria):** los renders del personaje salen en gris medio parejo y sin curva el dither queda plano. Aplica sobre la luminancia la curva `0→0, 0.25→0.02, 0.45→0.55, 0.60→0.90, 1→1`: el pelo y el suéter quedan casi sólidos y la cara clara con puntos finos. Probado en ffmpeg con `curves=all='0/0 0.25/0.02 0.45/0.55 0.6/0.9 1/1'`.
- **Asset base aprobado:** `public/character/raw/_referencia-aprobada.webp`. Las demás expresiones deben coincidir con él en encuadre y escala.
- **Duotono en la tarjeta final:** los puntos toman `#121212` y el blanco toma el color de fondo con `mix-blend-mode: multiply`.
- **En reposo:** escala `1 + 0.015·sin(2π·t/2.4s)` y rotación `1.5°·sin(2π·t/3.1s)`, con el origen en la base.
- **Expresiones:** se cambian con corte seco en el frame de la palabra clave.
- **Gota de sudor:** forma de lágrima de 26 px `#4DA3FF` en la sien, que cae 30 px en 24 frames y se desvanece. Va en cada dolor del acto Problema.
- **Confeti:** 40 partículas (rectángulos de 6×16 y círculos de 8) en los colores de fondo de la paleta. Salen en radial desde detrás de la tarjeta, con gravedad 1800 px/s² y vida de 70 frames.

## 5. Movimiento (60 fps)

| Elemento | Duración | Curva / spring | Detalle |
|---|---|---|---|
| Palabra del titular (entrada) | 7–9 f | out-cubic | `translateY(0.5em → 0)`, `blur(8px → 0)`, `opacity 0 → 1`, máscara `overflow: hidden` por línea |
| Palabra acento | 12 f | spring `{damping 12, stiffness 200, mass 0.7}` | `scale 1.08 → 1` además de la entrada normal |
| Titular (salida) | 4 f | in-cubic | `translateY(0 → −20)`, `blur(0 → 10px)`, `opacity → 0` |
| Tarjeta (entrada) | ~24 f | spring `{damping 15, stiffness 170, mass 0.9}` | desde `y +80`, `scale 0.94`, `rotate −2°` |
| Tarjeta (salida) | 10 f | in-cubic | `scale 0.96`, `opacity 0` |
| Cascada entre ítems | 4 f | — | Ítems de una misma lista |
| Fondo de acto o de verbo | 0 f | corte | En la primera sílaba del verbo o al confirmarse un estado. La UI no se mueve en ese frame. |
| Círculo desde objeto | 10–14 f | out-cubic | Radio de 0 a la diagonal del lienzo desde el centro del objeto origen. El objeto queda encima del círculo hasta que termina. |
| Paso a gráfica completa | 0 f · o 6–14 f para máscara | corte · out-cubic | La máscara nace en un objeto que conecta dos escenas. Comprueba el foco durante su expansión y al terminar. |
| Lectura de resultado | Sostén orientativo de 0.35–0.8 s | inmóvil | Desde que se puede leer el total, confirmación o estado. Dale más tiempo a resultados largos y a la oferta. |
| Cursor (viaje) | 18–30 f | in-out-cubic | La trayectoria hace una curva leve; nunca línea recta |
| Clic | 4 f + 12 f | — | Cursor a escala 0.85, botón a 0.96 y anillo de onda de 0 a 60 px que se desvanece |
| Escritura (typewriter) | según voz | lineal | Reparte los caracteres en la ventana de las palabras habladas (~35 car/s). Cursor de texto que parpadea cada 530 ms. |
| Contador | 40–55 f | out-expo | Siempre `tabular-nums` |
| Casilla | 10 f | out-cubic | Trazo del check (`strokeDashoffset`) y tachado del texto en 12 f |
| Sello | 14 f | spring `{damping 9, stiffness 260}` | `scale 2.4 → 1` y `rotate −4°`; sacudida de pantalla ±6 px durante 3 f |
| Iris (personaje → sticker) | 22 f | in-out-cubic | Máscara circular de r=560 en el centro del personaje a r=90 en el centro del sticker (900, 380). El contenido se escala igual. |
| Zoom látigo | 8 f | in-expo | `scale 1 → 6` sobre una palabra de la UI, con motion blur, y corte al acto nuevo |
| Letras del wordmark | 3 f por letra | spring `{damping 10}` | Caen desde y −120 con `rotate ±12°` alterno |
| Revelación de mundo | 10 f | out-cubic | El plano cerrado escala de 1 a la escala del diorama, anclado en la posición del personaje y del objeto |
| Dolly-in / pull-back | 10–14 f · 7–10 f | out-cubic · out-quart | Contenedor del mundo: `scale 1 → 2–2,5` hacia el detalle; `1 → 0,5` para la escala. Asienta con un 2 % de sobrepaso |
| Time-lapse | 15 f por paso | corte por paso | Hoja de calendario, sol ↔ luna, brillo de escena 1 → 0,82 → 1 en cada noche |
| Tarjeta que cae a la pila | 14 f | spring `{damping 13, stiffness 220}` | Desde y −300, `rotate ±6°` aleatorio, se queda. El personaje baja 20 px por tarjeta |
| Pausa antes del impacto | 15 f | quieto | Todo congelado; esquinas de visor que se dibujan en 8 f |
| Caída de la marca | 8 f | in-quad | Desde y −200 con estela vertical del color de marca, al 40 % de opacidad |
| Grietas + estallido | 3 f + 6–10 f | out-expo | 10–14 grietas radiales desde el impacto; esquirlas con velocidad 1400–2200 px/s, rotación ±540°/s y gravedad 2400 px/s² |
| Mancha orgánica | 10–12 f | out-cubic | Polígono de 14–18 vértices con ruido de radio ±12 %, contorno de 6 px |
| Condensar a fila | 12 f | in-out-cubic | La tarjeta escala y se desplaza hasta la caja de su fila resumen; el contenido interno se desvanece en los primeros 6 f |
| Objeto viajero | 18 f | in-out-cubic | Trayectoria curva (control 120 px por encima), `scale` ajustada a su destino |
| Dígitos tragamonedas | 18–24 f por dígito, cascada 3 f | spring `{damping 14, stiffness 180}` | Cada dígito cae desde −0,8 em pasando por 2–4 valores con blur vertical |
| Split-flap | 4 f por ficha | corte | 3–6 valores intermedios antes del final |
| Aplastar a línea | 6 f | in-cubic | `scaleY 1 → 0,02`, luego `scaleX 1 → 0` en 6 f y círculo desde el centro |
| Paneles opuestos | 6 f | out-cubic | Banda superior desde x −1080, inferior desde x +1080 |
| Morph entre planos del presentador | 14 f | spring `{damping 16, stiffness 160}` | `border-radius`, tamaño, posición y giro a la vez; el encuadre interno sigue la cara |
| Salida de cuadro del presentador | ≈ 0,45 s | mismo spring | El marco conserva su tamaño, radio → 44, giro → 5°, y baja hasta y = 2040. Regreso inverso |
| Micro-movimiento de fondo | continuo | seno | Vapor, dial (6° por beat), caret 530 ms, respiración 2,4 s. Nunca más de 1,2 s sin cambio visible en la región gráfica |

**Regla de sincronía:** `frame_entrada = round(startMs/1000·fps)`. Se permite 0 a +2 f de retraso; nunca adelantarse.

## 6. Audio

| Capa | Nivel | Notas |
|---|---|---|
| Locución | protagonista | Seca y limpia, sin reverb. |
| Cama musical | `volume ≈ 0.14` bajo la voz; sube a 0.35 en la tarjeta final | Continua, positiva y minimal (electrónica o lo-fi, 100–120 BPM). Sin silencios en toda la pieza. Cierra con un remate musical en la tarjeta final. |
| SFX | `volume 0.2–0.4` (el de cada sonido está en su manifiesto) | Biblioteca de 16 sonidos tech premium generados con ElevenLabs (pop, tick, clic, tecleo, confirmación, alerta, notificación, conteo, swipe, whoosh, riser, glitch, golpe, impacto, destello, logo). Un SFX por evento, ≥ 120 ms entre dos. Reglas de ritmo, biblioteca y generación en [audio.md](audio.md). |

Masterización final: `ffmpeg -i in.mp4 -af loudnorm=I=-14:TP=-1:LRA=11 -c:v copy out.mp4` (estándar de redes sociales).
Los SFX viven en `public/sfx/` (inventario en `public/sfx/sfx.manifest.json`) y la música en `public/music/` (pendiente). Revisa la mezcla de los cambios de plano con la pista de voz aislada. Si falta la música, registra su ausencia en la entrega.

## 7. Kit de componentes

Créalos en `src/motion/kit/` y reutilízalos en todas las piezas:

| Componente | Props clave |
|---|---|
| `ActBackground` | `color`, `dots?` |
| `Headline` | `words: {text, startMs, accent?}[]`, `lines`, `exitAt?` |
| `HalftoneCharacter` | `expression`, `pose: "full" \| "peek" \| "badge"`, `idle` |
| `Presenter` (antiguo) | `src`, `segments`: `full` / `split` / `graphics`. Solo para las piezas ya hechas; en piezas nuevas usa `PresenterStage`. |
| **`PresenterStage`** ✅ | `src`, `keys: {at, shot, dur?}[]`, `face`, `faceSize?`, `sourceWidth?`, `sourceHeight?`, `muted?`, `trimBefore?`, `veil?`, `jumpCuts?`. `shot`: `full` · `window {x,y,w,h,rotate?}` · `split {ratio?}` · `hidden` (sale de cuadro). Sin burbuja: no existe a propósito. Ver §10. (`cutout` queda pendiente: necesita video con alfa.) |
| **`Phone`** ✅ | `x`, `y`, `w?`, `h?`, `rotate?`, `screen?`, `children` — marco de teléfono (radio 16,5 %, isla dinámica) |
| **`MotifSticker`** ✅ | `src`, `at`, `out?`, `center?`, `size?`, `progress: {at, value 0–1}[]`, `ringColor?`, `label?: {at, text}` — sticker del objeto motivo con anillo de estado (A22) |
| **`SlotNumber`** ✅ | `text` (p. ej. "+17%"), `at`, `size?`, `color?` — dígitos tragamonedas en cascada de 3 f (A26) |
| **`HeroBurst`** ✅ | `items: {icon, name, color, textColor?, at}[]`, `out`, `trail?`, `centerY?` — un héroe por nombre con rastro (A29) |
| **`HandUnderline`** ✅ · **`Confetti`** ✅ | `at`, posición, `color?` · `at`, `origin`, `count?`, `seed?` |
| `IrisToBadge` | `from: {x,y,r}`, `to: {x,y,r}`, `at` |
| `UICard` | `variant: "light" \| "dark"`, `title`, `appIcon`, `children` |
| `Cursor` | `path: {x,y,at}[]`, `clicks: at[]` |
| `Typewriter` | `text`, `fromMs`, `toMs` |
| `Counter` | `from`, `to`, `at`, `format` |
| `Checklist` | `items: {text, at}[]` |
| `StatusPill` | `tone`, `label`, `at` |
| `Stamp` | `text`, `at` |
| `Confetti` | `at`, `origin` |
| `SweatDrop` | `at` |
| `Annotation` | `type: "circle" \| "arrow" \| "scribble"`, `text?`, `at` |
| `NodeGraph` | `nodes`, `edges`, `at` |
| `EndCard` | `tagline`, `cta`, `url`, `features[]` |
| **`WorldCamera`** ✅ | `keys: {at, zoom?, focus?: {x,y}, rotate?, light?, dur?, ease?}[]`, `motionBlur?`, `children` — cámara del escenario (A18, A19). Ver §10. |
| **`cameraAt(keys, t)`** ✅ | Estado de la cámara en un instante, para sincronizar capas que viven fuera del mundo. |
| `TimeLapse` | `steps: {at, month?, night?}[]` — calendario, ventana y brillo (A19) |
| `PileUp` | `items: {node, at}[]`, `burySubject?` (A20) |
| **`Shatter`** ✅ | `at`, `origin`, `children` (lo que se rompe), `crackColor?`, `sectors?`, `gravity?`, `crack?`, `seed?` (A21) |
| **`Splash`** ✅ | `at`, `origin`, `colors?`, `spread?`, `length?` — pintura que salta desde un objeto (A21) |
| **`BrandDrop`** ✅ | `at` (= impacto), `to`, `size?`, `fall?`, `until?`, `trail?`, `children` — la marca cae con estela (A21) |
| **`BlobReveal`** ✅ | `at`, `origin`, `dur?`, `outline?`, `children` (escena nueva) — mancha orgánica con contorno (A21, B) |
| **`Viewfinder`** ✅ | `at`, `dur?`, `color?`, `inset?`, `len?` — esquinas de visor de la pausa (A21) |
| **`CircleReveal`** ✅ | `at`, `origin`, `dur?`, `children` (escena nueva) — círculo desde un objeto (B) |
| `Condense` | `at`, `from: rect`, `to: rect` — tarjeta a fila resumen (A24) |
| `Traveler` | `at`, `from`, `to`, `node` — objeto viajero (A25) |
| `SplitFlap` | `values[]`, `at` (A28) |
| `ProofChip` | `kind: "timer" \| "lens" \| "alert"`, `label`, `at` (A27) |
| `ParallelBands` | `top`, `bottom`, `at` (A30) |
| `StrikeThrough` / `HandUnderline` | `at`, `dur`, `color` — decoraciones del acento |
| `Emanata` | `at`, `origin` — líneas de énfasis sobre una palabra o UI |
| `RecapHub` | `center`, `results: {node, at}[]` (A32) |
| `SpotlightTerminal` | `label`, `text`, `from`, `to` (A33) |
| **`SfxTrack`** ✅ | `events: {type, at, v?, gain?, until?}[]`, `gain?` — pista de SFX alineada por ancla, en `kit/sfx.tsx` (ver [audio.md](audio.md)) |

✅ = ya existe en el kit. Además existen `ActBackground`, `Headline`, `Character`, `UICard`, `Pill`, `Check`, `Typewriter`, `Counter`, `Cursor`, `Stamp`, `shake` y `AppIcon` (con sus props reales en `src/motion/kit/index.tsx`). Los demás se crean la primera vez que una pieza los necesite, en un archivo propio de `src/motion/kit/`, exportado desde `index.tsx`.

**Ejemplo vivo:** la composición `kit-demo` (`src/motion/kit-demo/KitDemo.tsx`, render en `out/kit-demo.mp4`) usa la cámara, la ruptura y el presentador integrado en 15 s. Cópiala como punto de partida.

## 8. Esquema del beat map

```json
{
  "fps": 60,
  "concept": {"metaphor": "la llegada del huésped como cuenta regresiva", "motif": "props/llave", "payoff": "la llave abre la puerta en la tarjeta final"},
  "voice": "clips/<pieza>.mp4",
  "captions": "clips/<pieza>.captions.json",
  "acts": [
    {
      "id": "gancho",
      "bg": "crema",
      "beats": [
        {
          "from": 0.1, "to": 3.0,
          "headline": [{"text": "¿Tienes", "at": 0.1}, {"text": "rentas", "at": 0.7}, {"text": "cortas?", "at": 1.2, "accent": true}],
          "mode": "graphics",
          "device": "checklist-logro",
          "camera": [{"at": 0.1, "scale": 1}, {"at": 2.0, "scale": 2.2, "x": -180, "y": 260}],
          "evolves": [{"at": 1.2, "state": "precio 29"}, {"at": 2.3, "state": "publicada"}],
          "bridge": {"type": "circle-from", "origin": "check", "at": 2.9},
          "motif": {"asset": "props/llave", "state": "dial", "progress": 0.2},
          "result": {"state": "listo", "at": 2.3},
          "transition": {"type": "cut", "word": "¿Tienes", "at": 0.1},
          "character": {"expression": "sonrisa", "at": 1.2, "fx": "confeti"},
          "sfx": [{"type": "pop", "at": 0.4}]
        }
      ]
    }
  ]
}
```

## 9. Auditoría de movimiento

Mide cuánto tiempo está quieta la imagen. En piezas con presentador, recorta la región donde vive la gráfica: el movimiento de la cara puede esconder una gráfica muerta.

```bash
# Pieza completa. Para la región gráfica cambia el crop, p. ej. crop=iw:ih*0.55:0:0
ffmpeg -hide_banner -i out/<pieza>.mp4 -vf "fps=30,crop=iw:ih:0:0,scale=270:-2,select='gte(scene,0)',metadata=print:file=-" -an -f null - 2>/dev/null | grep scene_score | cut -d= -f2 | awk '{c++; if($1<0.0015){s++;r++; if(r>m)m=r} else r=0} END{printf "quietos=%.0f%%  racha_max=%.1fs\n",100*s/c,m/30}'
```

| Medida | Referencias | Objetivo Monark |
|---|---|---|
| Frames quietos | 30–52 % | ≤ 45 % en la región gráfica |
| Racha quieta más larga | 0,7–1,1 s (sin contar la tarjeta final) | ≤ 1,2 s fuera de la tarjeta final |

**Tira de frames de una transición** (cada frame con su tiempo):

```bash
ffmpeg -v error -ss <inicio_s> -i out/<pieza>.mp4 -t 0.6 -vf "fps=30,scale=240:-2,drawtext=fontfile=/Windows/Fonts/arial.ttf:text='%{pts\:hms}':x=3:y=3:fontsize=14:fontcolor=yellow:box=1:boxcolor=black@0.7,tile=9x2" -frames:v 1 tira.jpg
```

**Hoja general** a 4 fps: el mismo filtro con `fps=4,scale=270:-2,…,tile=8x4` sobre la pieza entera (sale una hoja por cada 8 s), con `%02d` en el nombre de salida.

## 10. Cómo usar la cámara, la ruptura y el presentador integrado

Todo se importa desde `../kit`. El ejemplo completo está en `src/motion/kit-demo/KitDemo.tsx`.

### Cámara del escenario (`WorldCamera`)

```tsx
const CAM: CamKey[] = [
  {at: 0,    zoom: 2.4, focus: {x: 380, y: 760}},                 // 1.º key = encuadre inicial (sin transición)
  {at: 0.9,  zoom: 1,   focus: {x: 540, y: 960}, dur: 0.4, ease: "out"}, // revelación de mundo
  {at: 1.25, light: 0.78, dur: 0.1}, {at: 1.5, light: 1, dur: 0.1},       // time-lapse: noche / día
  {at: 2.35, zoom: 2.2, focus: {x: 860, y: 935}, dur: 0.35},       // dolly-in al teléfono
  {at: 3.65, zoom: 1,   focus: {x: 540, y: 960}, dur: 0.3},        // vuelve al general
  {at: 4.05, zoom: 0.55, focus: {x: 540, y: 900}, dur: 0.3},       // pull-back: la escala
];
<WorldCamera keys={CAM}>{/* pared, personaje, mostrador, props, UI… en coordenadas del mundo */}</WorldCamera>
```

- **Semántica:** `focus` es el punto del mundo que queda en el centro de la pantalla y `zoom` 1 es el plano general. Cada key solo cambia lo que declara; lo demás se hereda del anterior.
- **Curvas:** `punch` (por defecto: llega con un 2 % de sobrepaso y asienta), `out`, `inOut` y `cut`. El zoom se interpola en escala logarítmica, así acercar ×2 y alejar ×2 se sienten iguales.
- **Motion blur** automático, proporcional a la velocidad del zoom, de 4 px como máximo (`motionBlur`). Ponlo en 0 si molesta en primeros planos de texto.
- **Fórmula de pantalla** (para ubicar algo fuera del mundo, como el origen de la ruptura): `pantalla = 540 + (mundo.x − focus.x)·zoom` y `960 + (mundo.y − focus.y)·zoom`.
- **Lecciones de la prueba:**
  - El fondo del mundo debe ser **más grande que el lienzo** (por ejemplo, x −1200 → 2280 e y −1600 → 3600) para que el pull-back no deje bordes negros.
  - El titular va **fuera** de la cámara, para que no escale. En un dolly-in, elige un `focus` que no deje masas oscuras (el pelo del personaje, el marco de un teléfono) detrás del titular. En la demo, mover el foco 70 px a la derecha sacó el pelo del área del titular.
  - El primer key es el encuadre de arranque. Para una revelación, arranca cerrado sobre el personaje o el objeto motivo y suelta a zoom 1.

### Ruptura (`Viewfinder` → `BrandDrop` → `Shatter` + `Splash` sobre `BlobReveal`)

```tsx
const IMPACT = 5.55;
const ORIGIN = {x: 540 + (640 - 540) * 0.55, y: 960 + (430 - 900) * 0.55}; // objeto en el mundo → pantalla
<>
  <BlobReveal at={IMPACT + 0.03} origin={ORIGIN} outline={BG.violeta}><EscenaNueva /></BlobReveal>  {/* debajo */}
  <Shatter at={IMPACT} origin={ORIGIN} crackColor={BG.amarillo}>
    <Mundo />{/* + sus titulares: se rompen con él */}
  </Shatter>
  <Viewfinder at={IMPACT - 0.4} dur={0.4} />                                           {/* la pausa */}
  <Splash at={IMPACT} origin={ORIGIN} />
  <BrandDrop at={IMPACT} to={ORIGIN} size={170} until={IMPACT + 0.12}><IconoMonark /></BrandDrop>
</>
```

- **Capas, de abajo hacia arriba:** escena nueva (revelada por mancha o círculo), mundo que se rompe, visor, splash y la marca que cae.
- Durante la pausa, la cámara no se mueve (no pongas keys entre el último pull-back y el impacto). El personaje sigue respirando.
- `Shatter` renderiza los hijos una vez por esquirla (≈ 44) **solo** después del impacto. Mantén el mundo liviano y deja de montarlo pasada ≈ 1,5 s (`t < IMPACT + 1.6`).
- La grieta se dibuja de adentro hacia afuera en `crack` s (0,07 por defecto) y después estallan las esquirlas: las del centro más rápido y las de afuera con un retraso de 25 ms por anillo.
- El `origin` es el objeto motivo o la cima de la pila, calculado con la fórmula de pantalla.

### Presentador integrado (`PresenterStage`)

```tsx
const STAGE: StageKey[] = [
  {at: 0,   shot: {mode: "full"}},
  {at: 1.3, shot: {mode: "window", x: 150, y: 780, w: 780, h: 1000, rotate: -3}},
  {at: 2.7, shot: {mode: "hidden"}, dur: 0.45},                     // sale de cuadro: la demo toma la pantalla
  {at: 4.9, shot: {mode: "split", ratio: 0.52}},
  {at: 6.3, shot: {mode: "full"}},
];
<Sequence from={Math.round(P0 * FPS)}>                         {/* tiempos relativos a la entrada */}
  <CircleReveal at={0} origin={{x: 540, y: 1050}} dur={0.3}>
    <GraficaDeFondo />                                          {/* va antes: queda detrás del presentador */}
    <PresenterStage src="clips/video2-raw.mp4" trimBefore={20 * FPS} keys={STAGE}
      face={{x: 620, y: 880}} faceSize={420} sourceHeight={1916} muted={false} />
  </CircleReveal>
</Sequence>
```

- **Un solo `<Video>` que nunca se desmonta**, ni siquiera en `hidden`: la voz y la reproducción siguen continuas entre planos.
- **El morph** es un spring (≈ 0,5 s, ajustable con `dur`) sobre posición, tamaño, radio, giro y encuadre interno. `hidden` desliza el marco hacia abajo fuera del cuadro; el regreso es el inverso.
- **El encuadre** pone el rostro (`face`, en px del video fuente) en el punto de interés de cada plano y nunca deja ver bordes. `faceSize` es el ancho aproximado del rostro en el video fuente.
- **Velo** automático arriba en cámara completa, para leer el titular.
- **`jumpCuts`**: si la locución se ajustó recortando pausas, pasa los tiempos de corte y en `full` y `split` se alterna un punch-in de 7 % que disimula el salto.
- La gráfica que acompaña a cada plano va **antes** de `PresenterStage` en el JSX. En `split`, mueve la UI a la mitad superior en la misma ventana de tiempo del morph (`interpolate` de 0,4 s).
