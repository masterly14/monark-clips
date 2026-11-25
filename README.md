# Monark Clips

Proyecto Remotion de Monark para videos verticales 9:16 (reels, explainers, testimonios y piezas con presentador).
Incluye la skill **Monark Motion** para Claude Code, el kit de componentes, el personaje, los props, los logos y la biblioteca de SFX.

## Qué hay dentro

| Carpeta | Contenido |
|---|---|
| `.claude/skills/monark-motion/` | La skill de edición. Claude Code la carga sola al abrir este proyecto. |
| `src/` | Composiciones de Remotion. `src/motion/kit/` tiene los componentes base y `src/motion/<pieza>/` cada pieza. |
| `public/brand/`, `character/`, `props/` | Logos, personaje en halftone y objetos. El inventario está en `public/assets.manifest.json`. |
| `public/sfx/` | Biblioteca de sonidos. El inventario está en `public/sfx/sfx.manifest.json`. |
| `public/clips/` | Videos y voces de las piezas. **No van en el repo** (son de clientes): se copian desde el Drive del equipo. Ver [public/clips/README.md](public/clips/README.md). |
| `ref/` | Análisis de referencias. Los videos de referencia (`ref/*.mp4`) son de terceros y tampoco van en el repo. |
| `scripts/` | Transcripción (Whisper), generación de SFX (ElevenLabs) y armado de assets. |

## Primera vez (instalación)

**Requisitos:** [Node.js](https://nodejs.org) 22 o superior, [Git](https://git-scm.com) con Git LFS (Git para Windows ya lo trae), [ffmpeg](https://ffmpeg.org) en el PATH y [Claude Code](https://claude.com/claude-code).

1. Clona el repositorio **en una ruta corta** (Windows limita las rutas a 260 caracteres y Remotion falla con rutas largas):
   ```bash
   git lfs install
   git clone <url-del-repo> C:\code\monark-clips
   cd C:\code\monark-clips
   ```
   Si clonaste antes de instalar LFS y los SFX pesan unos pocos bytes, corre `git lfs pull`.
   Los clips de las piezas no vienen en el repo: cópialos desde el Drive del equipo a `public/clips/` (ver [public/clips/README.md](public/clips/README.md)).
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea tu `.env` a partir del ejemplo y pon tu key de ElevenLabs (solo hace falta para generar SFX nuevos):
   ```bash
   copy .env.example .env
   ```
   **Nunca subas `.env` ni pegues la key en un mensaje.**
4. Whisper: la primera vez que transcribas, `scripts/transcribe.mjs` descarga whisper.cpp y el modelo `medium` (≈ 1,5 GB) a `.whisper/`. Esa carpeta no va en el repositorio.
5. Comprueba que todo funciona:
   ```bash
   npm run studio
   ```

## Editar con la skill

Abre esta carpeta en Claude Code y pide, por ejemplo: *"Edita `public/clips/<video>.mp4` con la skill Monark Motion"*.
La skill guía todo el flujo: transcripción, concepto, beat map, construcción, revisión y render. El ejemplo completo es la composición `zapata-reel` (`src/motion/zapata-reel/`).

**Mejorar la skill:** edita los archivos de `.claude/skills/monark-motion/` y súbelos con un commit, como cualquier cambio. Así todo el equipo recibe la mejora con `git pull`. No hagas copias personales en `~/.claude/skills/`.

## Comandos útiles

- Previsualizar: `npm run studio`
- Transcribir: `node scripts/transcribe.mjs <entrada> <salida.json> medium es`
- Frame suelto: `npx remotion still src/index.ts <id> out/x.png --frame=300`
- Render: `npx remotion render src/index.ts <id> out/<id>.mp4`
- Revisar tipos: `npm run typecheck`

Los renders van a `out/` y los temporales a `.tmp/`; ninguna de las dos carpetas se sube.

## Marco "Testimonio" (1080×1920, 30 fps)

Replica el diseño de *Reel Monark v2*: fondo blanco con resplandor cálido, logo Monark + etiqueta,
titular sans + acento serif itálico subrayado, tarjeta de video con cargo/nombre, barra de progreso con
timer, logo del cliente + "CLIENTE MONARK", subtítulos y cierre con logo Monark.

### Agregar un clip nuevo

1. Copia el video a `public/clips/<id>.mp4` y el logo del cliente a `public/brand/`.
2. Transcribe (Whisper medium, local):
   `node scripts/transcribe.mjs public/clips/<id>.mp4 public/clips/<id>.captions.json medium es`
3. Duplica `clips/zapata-satisfaccion.json` → `clips/<id>.json` y ajusta:
   - **Contexto**: `kicker`, `headlineLead` + `headlineAccent`, `speakerRole`, `speakerName`, `footerLabel`
   - **Recorte**: `sourceSize` (tamaño original) y `crop` (x, y, w, h en px del original)
   - **Tiempos**: `trimStartSec` / `trimEndSec`
   - **Whisper**: `captionFixes` para corregir palabras mal transcritas
4. Registra el clip en `src/clips.ts`.
5. Previsualiza con `npm run studio` y renderiza con `npx remotion render src/index.ts <id> out/<id>.mp4`.

### Notas

- Medidas y colores del diseño están en `src/theme.ts` (amarillo `#EFAF1A`, tarjeta 960×680 en x=60/y=500).
- Fuentes (Google Fonts): Plus Jakarta Sans, Instrument Serif itálica, JetBrains Mono. Son aproximaciones
  a las del reel original; se cambian en `src/theme.ts`.
