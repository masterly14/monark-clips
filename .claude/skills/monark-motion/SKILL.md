---
name: monark-motion
description: Sistema de edición "Monark Motion" para videos verticales 9:16 de Monark (reels, explainers, anuncios, videos con presentador). Úsala siempre que haya que editar, animar o montar un video de Monark con motion graphics, titulares palabra por palabra, personaje guía, tarjetas de UI que demuestran el producto, cambios de color por acto o tarjeta final. También cuando el usuario diga "edítalo con la skill", "con el estilo Monark Motion" o "con el patrón de edición".
---

# Monark Motion — guía de edición

Esta skill convierte una locución (o un video con presentador) en una pieza vertical que **entretiene**: una idea visual con un objeto que vuelve, un mundo que se mueve con la cámara, una UI que cambia de estado al ritmo de la voz y un remate que cierra la promesa del gancho. Una buena pieza no es una lista de tarjetas que aparecen. Es una historia corta en la que cada frame viene del anterior.

**Mira el video como animación, no como capturas.** Cada frame es el resultado de elementos que se movieron para llegar ahí: de dónde viene cada cosa, a dónde va, con qué curva y qué palabra lo dispara. Diseña así, revisa así y analiza las referencias así.

El estilo se apoya en estas ideas, medidas sobre seis referencias (ver [análisis largo](references/ANALISIS-REFS-LARGAS.md) y [análisis corto](references/ANALISIS-POCKETSFLOW-CORTOS.md)):

1. **Concepto con objeto.** Antes de las escenas, una metáfora ligada al gancho que da un **objeto motivo** (una llave, una taza, una insignia). El objeto vuelve en toda la pieza y **paga** al final.
2. **Antes en gris, después en color.** El problema ocurre en un **mundo continuo en halftone**, recorrido por la cámara. La marca **rompe ese mundo desde un objeto** y desde ahí todo es color saturado, con corte de fondo en cada verbo.
3. **Sincronía exacta con la voz.** Cada palabra o elemento entra en el frame en que se pronuncia, y nunca antes.
4. **Demostrar con estados.** Toda UI *hace* algo y **evoluciona**: la misma tarjeta atraviesa varios beats cambiando de estado. No reemplaces una tarjeta por otra si puede transformarse.
5. **Siempre algo vivo.** Micro-movimiento constante (vapor, dial, cursor, caret, respiración). La quietud total es una decisión: antes de un impacto (≈0,25 s) o para leer un resultado (≤0,8 s).
6. **Contraste de tres tipografías.** Sans para decir, serif itálica para *sentir*, mono para lo técnico.
7. **Imagen unificada.** El personaje, los objetos y el mundo del problema van en halftone de 1 bit. El color lo ponen los fondos, los acentos y la UI.
8. **El sonido es montaje.** Los SFX marcan el pulso: cada corte, verbo, cambio de estado y resultado suena, sincronizado al frame. Paleta tech premium: redonda, seca y contenida, nunca estridente.

Los tokens exactos (medidas, colores, tiempos, springs) están en [reference.md](reference.md). El catálogo de recursos visuales y transiciones está en [devices.md](devices.md). **Dónde está cada imagen** (personaje, props, logos) y qué expresión usar está en [assets.md](assets.md), y el inventario exacto en `public/assets.manifest.json`. **Los SFX, sus reglas de ritmo y cómo generar sonidos nuevos con ElevenLabs** están en [audio.md](audio.md), y el inventario en `public/sfx/sfx.manifest.json`. Lee los cinco antes de construir. Nunca adivines la ruta de un asset ni el nombre de un sonido.

## Proyecto de trabajo

Esta skill vive **dentro** del proyecto Remotion **`monark-clips`**, en `.claude/skills/monark-motion/`, y todo lo que construye vive en ese mismo proyecto. Las rutas `public/…`, `scripts/…` y `src/motion/…` que menciona son relativas a la raíz del proyecto (la carpeta que contiene `.claude/`).

- **Ubicación del proyecto:** donde cada persona del equipo clonó el repositorio. No hay una ruta fija. Trabaja siempre en la raíz del clon. No crees un proyecto nuevo ni copies assets a otro lado.
- **Cómo reconocerlo:** tiene `public/assets.manifest.json`, `src/motion/kit/index.tsx` y `scripts/build-assets.mjs`. Si la sesión no está en esa carpeta, ubícalo antes de construir o pregunta al usuario dónde está.
- **Primera vez en un equipo nuevo:** sigue el `README.md` del proyecto (`npm install`, `.env` a partir de `.env.example`, `git lfs pull` para los SFX). Los videos y voces de `public/clips/` y los videos de `ref/` **no están en el repositorio** (material de clientes y de terceros): se copian desde el Drive del equipo. Si falta un clip que una composición necesita, pídeselo al usuario en lugar de buscarlo en otro lado, y nunca lo agregues a un commit. Si falta `node_modules`, corre `npm install` antes de renderizar o transcribir. El modelo de Whisper (`.whisper/`, ≈ 1,5 GB) no va en el repositorio: `scripts/transcribe.mjs` lo descarga solo la primera vez. Si la descarga falla, usa directamente `.whisper/main.exe -m <ggml-medium.bin> -f <wav 16 kHz> -l es -ml 1 -sow -oj`.
- **Credenciales:** la key de ElevenLabs va en `.env` (ignorado por git). Si falta, pide al usuario que la ponga; nunca la escribas en el repo, en la skill ni en un mensaje.
- **Ruta larga en Windows:** si Remotion falla al lanzar Chrome (`spawn … ENOENT`), revisa que la ruta no pase de 260 caracteres. Clona en una ruta corta (por ejemplo `C:\code\monark-clips`) o mapea la carpeta padre a una unidad (`subst M: <carpeta padre>`).
- **Editar la skill:** se edita aquí, en `.claude/skills/monark-motion/` del repositorio, y se comparte con un commit como cualquier otro cambio. No hagas copias personales en `~/.claude/skills/`, para que no haya dos versiones.

---

## Flujo de trabajo (obligatorio, en este orden)

### 1. Ingesta
- `ffprobe` del material. El lienzo de salida es siempre **1080×1920**. Usa **60 fps** para piezas 100 % animadas y **30 fps** si el material del presentador viene a 30.
- Transcribe con Whisper usando timestamps por palabra (`node scripts/transcribe.mjs <in> <out.json> medium es`). Los tiempos por palabra de whisper.cpp suelen llegar 0,1–0,4 s tarde: verifica los anclajes importantes con la forma de onda o con `silencedetect`.
- Corrige a mano los nombres propios y términos de marca (Monark, PMS, OTAs, Airbnb, Booking, WhatsApp…) con un mapa de correcciones. Nunca edites el JSON a mano.
- **Ajusta la locución del presentador antes de montar:** detecta pausas con `silencedetect=noise=-32dB:d=0.22`, recorta cada una dejando 60 ms a cada lado (`select`/`aselect` de ffmpeg) y transcribe **la versión ajustada** (así los tiempos ya son los finales). Guarda los cortes en `public/clips/<pieza>-tight.cuts.txt` y pasa sus tiempos a `PresenterStage` como `jumpCuts` para disimular los saltos con un punch-in. En video2 esto bajó la pieza de 61,8 a 56,4 s sin quitar palabras. Monta la voz como pista global (`<Audio>` del WAV ajustado) y el video del presentador en silencio.

- **Material real de apoyo** (una llamada, un testimonio): si el usuario lo entrega, úsalo como gancho siguiendo [devices.md A35](devices.md): frase clave de 8–12 s, cortes por envolvente de energía y la ventana de la llamada como puente al presentador.

### 2. Concepto (antes del beat map)
Escribe en tres líneas, y muéstralas al usuario si la pieza es nueva:

```
Metáfora: <idea visual que hace tangible el gancho>          ej. "la llegada del huésped como cuenta regresiva"
Objeto motivo: <objeto que vuelve y cómo cambia de estado>    ej. "llave en el sticker; gira como dial"
Pago: <qué hace el objeto al final que cierra la promesa>     ej. "la llave abre la puerta en la tarjeta final"
```

Busca la metáfora en la frase del gancho: un tiempo («antes de que…»), un secreto («lo que nadie te cuenta»), una casa, un peso, un desorden. Escoge un objeto que exista en `public/props/` o en el personaje (llave, calendario, maleta, cabaña, insignia en el suéter). Planta el objeto en el primer plano para que pueda pagar después.

### 3. Beat map
Divide la transcripción en **beats** (una frase o idea, de 0,8 a 3,5 s) y agrúpalos en actos según la plantilla de abajo. Escribe el beat map como tabla o JSON con esta forma:

```
beat | t_in–t_out | locución | titular editado (acento) | plano | qué evoluciona → estado final | puente al siguiente (objeto o corte) | motivo | SFX
```

- **Titular editado:** condensa la voz. «Tu cripto y tus llaves nunca salen de tu dispositivo» se vuelve «Tus llaves. *Tu* dispositivo.» No todas las palabras tienen que aparecer.
- **Plano:** `graphics`, `full`, `split`, `window`, `hidden` (presentador fuera de cuadro) o `cutout` en piezas con presentador (ver abajo). Nunca un círculo pequeño.
- **Puente:** cómo nace la escena siguiente de esta (círculo desde el check, pastilla que vuela, objeto que se condensa). Si no hay objeto, corte seco en la palabra.
- **SFX:** nombres de la biblioteca (`public/sfx/sfx.manifest.json`) con su `at` = el frame del evento visual que marcan. Diseña el mapa de sonido junto con la imagen, no al final (reglas de ritmo en [audio.md](audio.md)). Si la pieza necesita un sonido que no existe (el objeto motivo, un ambiente del Problema), escribe su pedido en `public/sfx/pedidos/<pieza>.json` y genéralo con `node scripts/sfx-gen.mjs --pedido …` antes de construir.
- Ancla la aparición a la palabra que introduce la idea y reserva una ventana para leer el resultado. Si el usuario pidió "hazlo directo", decide tú y sigue.

### 4. Plantilla narrativa (adáptala; no es obligatorio usar todos los actos)

| Acto | Función | Ejemplo Monark | Recurso típico |
|---|---|---|---|
| **1. Gancho** | Nombrar al espectador, su deseo o un secreto, y **plantar el objeto motivo** | "Tu huésped llega en 10 minutos… ¿todo listo?" / "Psst… esto nadie te lo cuenta de rentar tu cabaña." | Primer plano del personaje con el objeto. Fondo tinta con foco o crema. Titular grande. |
| **2. Problema** | Hacer **físico** el dolor en un mundo continuo y gris | "Mensajes a las 2 a. m., reservas cruzadas, limpiezas sin confirmar…" | Diorama en halftone (recepción, cocina, escritorio) con cámara que entra y sale. Time-lapse con utilería (calendario, ventana día/noche). Pila que crece y entierra al personaje. Contador de tiempo perdido. |
| **3. Giro** | Pausa y ruptura | "O… simplemente Monark." | ≈0,25 s de quietud con esquinas de visor. La marca cae sobre el objeto y **rompe el mundo** (grietas, splash, mancha). El color entra desde ese punto. El personaje se vuelve sticker. |
| **4. Demostración** | Un beneficio por verbo, **con la misma UI evolucionando** | "Conecta Airbnb, fija tu precio, comparte el enlace." | Corte de fondo en cada verbo detrás de una tarjeta que cambia de estado. Puentes desde objetos. Dato clave duplicado en grande. Ráfaga de héroes para listas de integraciones. |
| **5. Resolución** | Una palabra que cierra la enumeración | "*Resuelto.*" | Sello en etiqueta que golpea y checks en cascada sobre todo lo visible. |
| **6. Recapitulación y pago** | Juntar lo logrado y cerrar la promesa | "Toda tu operación, en un solo lugar." | Los resultados de cada escena vuelven juntos alrededor del logo. **El objeto motivo cumple** (la llave abre, el café sigue caliente). |
| **7. Tarjeta final** | Marca + CTA | "Monark · Link en el perfil" | Wordmark que se escribe o cae, personaje que asoma detrás, CTA con pulso y clic, URL que se escribe. Sostén ≥ 2,5 s. |

Usa **15–25 s** para una sola promesa con pruebas cortas y **30–45 s** para explicadores o testimonios con más contexto. El problema dura ≈ 25–35 % de la pieza. La demostración va rápida (≈1–1,8 s por escena).

### 5. Construcción (Remotion, en `monark-clips/`)
- Una composición por pieza en `src/motion/<pieza>/`. Escenas declarativas (`acts[]` → `beats[]`) con tiempos tomados del JSON de Whisper. Registra plano, detonante, acción, resultado, puente y estado del motivo. Si recortas o aceleras la locución, mapea primero el tiempo fuente al tiempo final.
- Reutiliza los componentes base de `src/motion/kit/`. Si un recurso del catálogo no existe, créalo ahí (lista en [reference.md](reference.md#7-kit-de-componentes)) para que la próxima pieza lo tenga.
- **Ejemplo completo:** la composición `zapata-reel` (`src/motion/zapata-reel/`) usa toda la skill sobre un video con presentador: concepto y beat map con SFX en `beats.ts`, mundo gris con cámara, ruptura, planos del presentador sin burbuja, tarjeta viva, cifras tragamonedas y tarjeta final con el pago del motivo. Cópiala como punto de partida para piezas con presentador.
- **Ya implementados y probados:** `WorldCamera` (cámara del escenario), la ruptura (`Viewfinder`, `BrandDrop`, `Shatter`, `Splash`, `BlobReveal`, `CircleReveal`) y `PresenterStage` (cámara completa, ventana, dividida y salida de cuadro, con morph). Úsalos siguiendo [reference.md §10](reference.md#10-cómo-usar-la-cámara-la-ruptura-y-el-presentador-integrado) y parte de la composición `kit-demo`.
- **Monta la escena como un mundo con cámara**, no como capas sueltas: agrupa el diorama en un contenedor y anima su `transform` (escala y traslación) para entrar, salir y revelar. Los objetos que pasan de escena conservan su posición en pantalla en el frame del corte.
- Monta **una pista de locución continua** desde el inicio, con música y SFX en pistas aparte. Si el narrador cambia de plano, el video de cámara va silenciado y la voz sigue desde una única pista global.
- Monta los SFX con **un solo `<SfxTrack events={…} />`** (kit) por composición, derivado de los `sfx[]` del beat map. El componente alinea cada sonido por su ancla medida (ataque, pico o fin), rota variantes y avisa si dos sonidos se pisan.

### 6. Revisión antes del render final (no te la saltes)
- **Ráfagas, no capturas sueltas.** Para cada transición y cada demo, renderiza 6–9 frames consecutivos (`--frames=a-b` o stills seguidos a `--scale=0.4`) y ármalos en una tira con `ffmpeg tile`. Comprueba que cada elemento viene de algún sitio, que el objeto puente conserva su posición y que el estado final se lee.
- **Hoja general** a 4 fps con timecode de toda la pieza: comprueba el ritmo de color, que el motivo esté presente y que no haya tramos muertos.
- **Auditoría de movimiento** con el comando de [reference.md §9](reference.md#9-auditoría-de-movimiento): en la región gráfica, ≤ 45 % de frames quietos y ninguna racha quieta de más de 1,2 s fuera de la tarjeta final.
- **Audio:** revisa los avisos de `SfxTrack` en consola, comprueba con `silencedetect` que los SFX clave (giro, cortes de la demo) arrancan en su tiempo, y pide al usuario que escuche los sonidos nuevos (`node scripts/sfx-gen.mjs --preview <nombres>`). Registra lo aprobado o descartado con `--aprobar` / `--descartar`.
- Revisa contra la **checklist de calidad** de abajo. Corrige y vuelve a revisar.

### 7. Render y verificación
Renderiza el MP4. Verifica con `ffprobe` la duración, el tamaño 1080×1920 y la pista de audio, y con `volumedetect` que el audio no esté vacío ni saturado. Entrega el archivo con un resumen del concepto y del beat map, y con los SFX generados para la pieza (nombres, créditos y cuáles faltan por escuchar).

---

## Reglas de layout 9:16 (resumen; las medidas exactas están en reference.md)

```
┌──────────────────────────────┐
│  TITULAR (arriba izq.)   (◉) │  ← sticker del motivo (objeto o personaje) con estado
│  palabra *acento*            │
│                              │
│   ┌──────────────────────┐   │
│   │                      │   │
│   │   ESCENARIO GRANDE   │   │  ← la UI o el mundo ocupan el cuadro (≈ y 560–1640)
│   │   (algo evoluciona)  │   │
│   │                      │   │
│   └──────────────────────┘   │
│  [chip de dato]              │  ← cronómetro, lupa o pegatina junto a la UI
└──────────────────────────────┘
```
- El titular va arriba a la izquierda, alineado a la izquierda, con margen de 80 px y **≈ 84 px** de cuerpo. Es pequeño para que el escenario mande. En el gancho y en la tarjeta final puede crecer hasta 118 px.
- El escenario es grande: un teléfono ocupa ≈ 45–50 % del ancho y ≈ 1000 px de alto. Una tarjeta, ≈ 85–90 % del ancho. Un objeto aislado nunca es un ícono pequeño en medio de un fondo vacío.
- Deja libre la franja inferior de 260 px para la interfaz de Reels/TikTok si hay texto importante. El personaje y los objetos sí pueden ocuparla.

## Reglas de texto
- El titular se construye **palabra por palabra**: cada palabra sube desde una máscara con un leve blur al pronunciarse.
- **Condensa la voz**: el titular dice la idea, la UI aporta el detalle y la voz el resto. Usa los puntos suspensivos para generar suspenso («…por *una* cabaña», «O…»), escritos punto por punto.
- **Una palabra acento por titular**, en serif itálica, a ≈ 1,25 veces el cuerpo de la sans y en el color de acento de la escena (cambia con el fondo o con el tinte contextual). Suele ser el sustantivo emocional: *minutos*, *Resuelto*, *sin*, *gratis*.
- El acento puede llevar una decoración que se dibuja: subrayado a mano, **tachado** de una palabra para reemplazarla («~~abrir Monark~~ *nunca más*») o etiqueta de color («en *beta*»).
- Cuando la respuesta es una cifra, **la cifra reemplaza al titular** en ese espacio con dígitos que ruedan, sincronizada con la misma cifra pequeña dentro de la UI.
- Al cambiar de frase, el titular sale con blur y opacidad en 3–4 frames y sube 20 px. En una enumeración del mismo acto puede quedarse y sumar la línea nueva debajo.
- **Nada de subtítulos en caja** en este estilo: el titular *es* el subtítulo.

## Reglas del personaje (personaje propio de Monark)
- Personaje 3D tipo "toy", renderizado en **halftone de 1 bit**. Nunca a color, salvo en la tarjeta final, donde se tiñe en duotono con el color de fondo.
- **Assets disponibles:** 7 expresiones y 5 poses en `public/character/raw/`. El detalle y la tabla de qué expresión usar están en [assets.md](assets.md). Usa siempre las versiones de `public/character/ht/`.
- Siempre está vivo: respira (escala 1 → 1,015 en 2,4 s) y se balancea (±1,5°).
- **Actúa, no solo cambia de cara.** Con las mismas imágenes, la cámara y el encuadre hacen la actuación: primer plano enorme que se inclina hacia cámara para contar un secreto, asomarse por un borde, quedar enterrado bajo la pila del problema y salir de los escombros, sostener el objeto motivo, encogerse en el sticker y asomarse detrás del wordmark.
- **Reacciona en la palabra clave** de cada beat: cambia de expresión en ese frame (corte seco, sin crossfade) con un pequeño squash (escala 1 → 1,04 → 1 en 8 f).

## Planos con presentador (integrado, no partido a la mitad)

Cuando hay un presentador grabado, él cumple el papel del personaje: es el ancla que entra, sale, se encoge y vuelve. **La pantalla dividida al 50 % es un recurso más, no la plantilla.** Encadena varios planos y conecta cada cambio con un movimiento.

| Plano | Cuándo sirve | Qué vemos |
|---|---|---|
| **Cámara completa** (`full`) | Gancho, opinión, emoción, CTA. | Presentador limpio con zoom suave 1 → 1,05. La UI puede **entrar flotando en el espacio libre junto a la cabeza**, hacia donde él señala, sin tapar la cara. Titular arriba sobre velo. |
| **Fuera de cuadro** (`hidden`) | La demo necesita toda la pantalla. | El marco del presentador **sale como un objeto** (se redondea, gira 5° y baja fuera del cuadro) y la gráfica queda a pantalla completa con su gramática. **La voz sigue.** Vuelve con el movimiento inverso, grande, cuando llega una opinión, emoción o CTA. |
| **Ventana** (`window`) | La explicación y la prueba conviven, pero la escena necesita movimiento. | El presentador va dentro de un **rectángulo redondeado que es un objeto de la escena**: entra, se inclina, se encoge, lo empuja una tarjeta, se mete en la pantalla de un teléfono como videollamada. |
| **Recorte** (`cutout`) | Máxima integración, si hay matte con alfa. | Presentador sin fondo, de pie sobre los fondos de color. Las tarjetas se apilan delante y detrás de él, el fondo corta en cada verbo detrás y los objetos lo rodean, como el personaje en la referencia. |
| **Dividida** (`split`) | Explicación sostenida con una prueba compacta. | Proporción **animada** (por ejemplo, 62/38 → 45/55) según lo que necesite cada beat. La gráfica **rompe la costura**: las tarjetas cruzan el borde y los objetos caen al panel del presentador. El panel tiene esquinas redondeadas y no es una línea recta fija. |
| **Gráfica completa** (`graphics`) | Flujo, comparación, resultado, transformación. | La gráfica ocupa el cuadro con su propio mundo y cámara. La voz continúa. |

- **Nunca muestres al presentador en un círculo pequeño** (burbuja, sticker o miniatura en una esquina). Una cara diminuta no se lee, se ve como una videollamada y le quita cuadro a la gráfica. Si la gráfica necesita el cuadro, el presentador sale (`hidden`); si tiene que verse, se ve grande (`full`, `window` de ≥ 520 × 740 px o `split`). El sticker circular queda solo para el objeto motivo o el personaje animado.
- **Implementación:** `PresenterStage` hace `full`, `window`, `split` y `hidden` con un único video que nunca se reinicia. Programa los planos como keys en el tiempo, igual que la cámara (ver [reference.md §10](reference.md#10-cómo-usar-la-cámara-la-ruptura-y-el-presentador-integrado)). No uses el `Presenter` antiguo en piezas nuevas.
- **Cambia de plano con un objeto o una palabra, nunca con un fundido.** Salida de cuadro (el marco baja como un objeto) en la palabra que abre la demo y regreso con el movimiento inverso cuando vuelve la emoción. Morph de cámara completa a ventana o a dividida. Una tarjeta que empuja la ventana fuera. La ventana que cae dentro del teléfono de la UI.
- **Ritmo de cara:** vuelve a ver la cara grande (`full`, `window` grande o `cutout`) cada 6–10 s y en cada opinión o CTA. Entre medio la voz la mantiene presente: no hace falta ver una cara pequeña.
- **No repitas el mismo plano más de 2 beats seguidos** salvo que la escena siga evolucionando. Usa al menos tres planos distintos en una pieza de 30 s o más, y no más de un 35 % del tiempo en `split`.
- La gráfica de un plano con presentador cumple las mismas reglas que una pieza animada: grande, viva, con estados, con puentes y con el motivo presente.
- **Recorte (`cutout`)** necesita un video con alfa (WebM VP9 con alfa o ProRes 4444) generado antes, por ejemplo con un segmentador de personas cuadro a cuadro. Si no hay matte, usa `window`, `split` y salidas de cuadro: dan casi la misma integración sin pre-proceso. No improvises un croma sobre un fondo que no es croma.

## Ritmo y legibilidad

- **Problema lento y continuo; demo rápida y saturada.** En el problema, una frase de 3–4 s ocurre en el mismo mundo y la cámara se mueve dentro de él. En la demo, el fondo corta en cada verbo (≈ 1–1,8 s) mientras la UI sigue en su sitio y evoluciona.
- Monta la demo en tres pasos: **entrada → acción → resultado**. Un campo se escribe, una solicitud se envía y aparece la respuesta. Mantén legible el resultado y arranca el siguiente beat después.
- **Duplica en grande lo que importa:** la cifra en el titular, un chip de tiempo junto al teléfono, una lupa sobre el dato o una pegatina con confeti.
- Deja quieta la parte que el espectador está leyendo y mantén vivo el resto (vapor, caret, dial del motivo).
- Cambia de escala cuando cambia la pregunta: mundo completo para ver el problema, dolly-in para enseñar una acción, pull-back para mostrar la escala y cara para explicarlo.
- **Tinte contextual:** cuando se muestra una app concreta, la escena toma su color (WhatsApp → menta y acento verde, Airbnb → coral, Booking → cobalto) y el anillo del sticker también.
- Toma de las referencias el ritmo, la causalidad y la jerarquía. Construye las tarjetas, paleta, textos y personajes con recursos de Monark.
- **Para analizar una referencia** (o una pieza propia): transcribe, haz la hoja a 4 fps con timecode y, en cada cambio, una ráfaga a 30 fps de 0,5–0,8 s. Describe cada elemento como «de dónde → a dónde, con qué curva, por qué palabra y cómo queda». Mide la quietud. Separa mediciones de aproximaciones y guarda la regla aplicable a Monark en `references/`.

## Checklist de calidad (todas deben cumplirse)
- [ ] La pieza tiene **metáfora, objeto motivo y pago** escritos. El motivo aparece en el gancho, acompaña la demo y cumple en el cierre.
- [ ] El problema ocurre en un mundo continuo (con cámara o acumulación), no en tarjetas sueltas sobre fondo plano.
- [ ] Al menos **dos transiciones nacen de un objeto** (círculo desde un elemento, objeto que se condensa, pastilla que vuela, ruptura desde un impacto).
- [ ] Cada UI cambia de estado al menos una vez y, cuando puede, la misma tarjeta atraviesa varios beats.
- [ ] Cada palabra y cada elemento entran a ±2 frames de su timestamp verificado; nunca antes.
- [ ] Auditoría de movimiento: en la región gráfica, ≤ 45 % de frames quietos y ninguna racha quieta > 1,2 s fuera de la tarjeta final.
- [ ] En la demo, cambio de fondo o de escena cada 1–2 s.
- [ ] El titular condensa la voz, mide ≈ 84 px (hasta 118 en gancho y cierre), lleva una sola palabra acento y tiene contraste AA.
- [ ] El escenario es grande: ningún beat queda reducido a un ícono o una tarjeta pequeña en medio de un fondo vacío.
- [ ] Con presentador: al menos tres planos distintos, ≤ 35 % del tiempo en `split`, la cara vuelve a verse grande cada 6–10 s y **nunca aparece en un círculo pequeño** (sale de cuadro o se ve grande).
- [ ] La tarjeta final dura ≥ 2,5 s, con el CTA legible y el botón clicado.
- [ ] Ningún texto importante queda en la franja inferior de 260 px ni cortado por los márgenes.
- [ ] Los claims, precios, cifras y beneficios están confirmados por el usuario (no inventes cifras).
- [ ] La voz es continua e inteligible entre planos. La música acompaña los acentos; si falta, registra que la mezcla queda pendiente.
- [ ] **SFX:** cada corte de la demo lleva su `swipe`, cada acción de UI su sonido (entrada → acción → resultado), el giro tiene `riser` → pausa → `impacto`, ningún par de SFX queda a menos de 120 ms y todos suenan por debajo de la voz. Los sonidos nuevos tienen descripción, uso y ritmo en el manifiesto.
