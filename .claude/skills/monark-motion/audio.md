# Monark Motion: SFX y ritmo sonoro

Los SFX **son parte de la edición**, no un adorno que se agrega al final. Marcan el pulso del montaje: cada corte, cada verbo, cada cambio de estado y cada resultado tiene un sonido que lo hace sentir. Una pieza sin SFX se siente lenta aunque la imagen vaya rápido.

**Paleta:** sonido de producto tech premium. Redondo, seco, cálido y contenido. Nada estridente, nada metálico agresivo, nada caricaturesco, de videojuego o de efecto de stock, y nada que no tenga relación con tecnología o interfaz. Si un sonido llama más la atención que la imagen que acompaña, sobra o va más bajo.

## Dónde está todo (en `monark-clips/`)

| Qué | Dónde |
|---|---|
| Inventario: prompt, descripción, uso, ritmo, volumen, ancla y medidas de cada variante | `public/sfx/sfx.manifest.json` (fuente de verdad) |
| Archivos procesados (WAV 48 kHz, recortados y normalizados a −1 dBFS) | `public/sfx/<categoria>/<nombre>-v<N>.wav` |
| Originales de ElevenLabs (para reprocesar sin gastar créditos) | `public/sfx/_raw/` |
| Pedidos de sonidos nuevos por pieza | `public/sfx/pedidos/<pieza>.json` |
| Generador | `scripts/sfx-gen.mjs` (instrucciones en su cabecera) |
| Componente | `SfxTrack` en `src/motion/kit/sfx.tsx`; la biblioteca tipada se genera en `src/motion/kit/sfx-library.gen.ts` |
| Audición en contexto | Composición `sfx-demo` (`src/motion/kit-demo/SfxDemo.tsx`) |
| Key de ElevenLabs | `monark-clips/.env` → `ELEVENLABS_API_KEY`. **Nunca** la copies a la skill, al manifiesto ni a un mensaje. |

Lee el manifiesto antes de elegir sonidos. No adivines nombres: `SfxName` es un tipo y TypeScript rechaza un nombre que no exista.

## Biblioteca base

| Sonido | Ancla | Cuándo |
|---|---|---|
| `pop` | inicio | Entra una tarjeta, pastilla, chip, burbuja o sticker |
| `tick` | inicio | Casilla, check, cada fila de una cascada |
| `clic` | inicio | Clic del cursor, CTA |
| `tecleo` | inicio | Typewriter (córtalo con `until`) |
| `confirmacion` | inicio | Estado final de éxito (✓ Pagado, Publicada) |
| `alerta` | inicio | Dolor del Problema: pastilla roja, error, conflicto |
| `notificacion` | inicio | Llega un mensaje, una reserva o una reseña |
| `conteo` | inicio | Counter, SlotNumber, SplitFlap (córtalo con `until`) |
| `swipe` | pico | **Corte de fondo en cada verbo de la demo**, cambio de color de acto |
| `whoosh` | pico | Zoom o pull-back de cámara, iris, objeto viajero, morph de planos |
| `riser` | fin | Final del Problema: termina justo donde empieza la pausa del giro |
| `glitch` | inicio | Algo falla en el mundo del Problema (máx. 2 por pieza) |
| `golpe` | inicio | Sello, objeto que aterriza, cifra final que se asienta |
| `impacto` | inicio | El giro: la marca rompe el mundo (uno por pieza) |
| `destello` | inicio | Confeti, logro, insignia; 60–120 ms después del pop o golpe |
| `logo` | inicio | Tarjeta final: el wordmark cae o se escribe |

**Ancla** = qué parte del sonido cae exactamente en el `at` del evento. `inicio` usa el ataque medido (no el primer sample), `pico` el punto más fuerte y `fin` el último instante. Por eso el `at` de un evento es siempre el **frame visual** (el clic, el corte, la llegada), nunca un tiempo corregido a mano.

## Reglas de ritmo

1. **Un sonido por evento visual, sincronizado al frame.** El evento visual ya está anclado a la palabra; el SFX se ancla al evento. Nunca adelantado.
2. **Problema lento, demo rápida.** En el Problema, 1 SFX cada 0,6–1 s como máximo, con sonidos graves y apagados (`notificacion`, `alerta`, `glitch`, `whoosh` de cámara); pueden acelerar para mostrar acumulación. En la demo, el `swipe` marca cada verbo (cada 1–1,8 s) y entre medio va la UI: `pop` → `tecleo`/`clic` → `confirmacion`.
3. **El giro se construye con silencio.** `riser` que termina al empezar la pausa de ≈0,25 s, silencio total de SFX en la pausa, y `impacto` en el frame en que cae la marca. Es el pico de energía sonora de la pieza.
4. **Patrón de la demo: entrada → acción → resultado** = `pop` → `clic` (o `tecleo`) → `confirmacion`. El resultado suena una sola vez y deja leer.
5. **Separación mínima de 120 ms** entre dos SFX (SfxTrack avisa en consola si se pisan). Un acento decorativo (`destello`) va 60–120 ms después del principal, nunca encima.
6. **Cascadas:** un `tick` o `pop` por elemento, con las variantes rotando (SfxTrack lo hace solo). Si la cascada tiene más de 6 elementos, sonoriza los primeros 4 y el último.
7. **Texturas** (`tecleo`, `conteo`) duran lo que dura la acción: usa `until` y remata con un sonido puntual (`tick`, `golpe`, `confirmacion`).
8. **Debajo de la voz.** Volúmenes de biblioteca entre 0,2 y 0,4; si un SFX cae sobre una palabra acento, bájalo con `gain: 0.7`. Nada de SFX sobre la tarjeta final salvo `logo` y el `clic` del CTA.
9. **Densidad sana:** en 30 s, entre 20 y 45 eventos. Menos se siente vacío; más se vuelve ruido. Si dudas entre dos sonidos para el mismo instante, deja uno.

## Flujo en cada edición

1. **Mapa de sonido en el beat map.** La columna SFX lleva nombres de la biblioteca con su `at` (el frame visual). Para cada beat pregúntate qué evento visual da el pulso y qué sonido lo marca.
2. **¿Falta algún sonido?** Si un beat necesita algo que la biblioteca no tiene y que es parte de la idea de la pieza (el objeto motivo, un ambiente del Problema), créalo. Ejemplos: llaves que tintinean para el motivo `llave`, ruedas de maleta, una puerta que se abre, un teléfono que vibra sobre una mesa, una taza que se apoya. Antes de crear uno nuevo, revisa si una variante existente sirve.
3. **Escribe el pedido** en `public/sfx/pedidos/<pieza>.json` con la descripción completa de cada sonido nuevo (formato abajo) y genera:
   ```
   node scripts/sfx-gen.mjs --pedido sfx/pedidos/<pieza>.json
   ```
   Hazlo sin preguntar si son ≤ 12 generaciones (cuestan ≈ 5 créditos por cada 0,5 s de audio); por encima de eso, muestra la lista y espera el OK. Informa en la entrega qué se generó y cuántos créditos costó (el script lo imprime y lo guarda en el manifiesto).
4. **Monta la pista** con un solo `SfxTrack` por composición, con todos los eventos de la pieza:
   ```tsx
   <SfxTrack events={[
     {type: "swipe", at: 6.2},
     {type: "pop", at: 6.35},
     {type: "tecleo", at: 6.7, until: 7.4},
     {type: "clic", at: 7.55},
     {type: "confirmacion", at: 7.8},
   ]} />
   ```
   Lo ideal es derivar los eventos del beat map (`beat.sfx[]`) en lugar de escribirlos dos veces.
5. **Revisa** (parte del paso 6 de la skill):
   - Avisos de `SfxTrack` en consola (sonidos sin archivo o pisados).
   - Render y `volumedetect`: el pico final de la mezcla no pasa de −1 dBFS antes de la masterización.
   - Escucha la mezcla con atención a los cortes de plano y al giro. Yo (Claude) puedo medir pero no escuchar: pide al usuario que escuche las variantes nuevas (`node scripts/sfx-gen.mjs --preview <nombres>` arma `public/sfx/_preview.wav` y `_preview.txt` con la línea de tiempo) o la composición `sfx-demo`.
6. **Registra la escucha.** Lo que el usuario apruebe o descarte queda en el manifiesto:
   ```
   node scripts/sfx-gen.mjs --aprobar pop-v2          (o un nombre entero, o "todo")
   node scripts/sfx-gen.mjs --descartar clic-v1       (la próxima corrida genera un reemplazo)
   node scripts/sfx-gen.mjs --nota swipe-v3 "muy brillante, usar solo en fondos claros"
   ```
   Las variantes descartadas desaparecen de `SfxTrack` al regenerar la librería.

## Cómo escribir un sonido nuevo

Formato del pedido (`public/sfx/pedidos/<pieza>.json`):

```json
{
  "pieza": "llegada-huesped",
  "usa": ["swipe", "pop", "clic", "confirmacion", "impacto", "logo"],
  "sonidos": {
    "llaves": {
      "categoria": "objeto",
      "descripcion": "Tintineo breve y limpio de un llavero pequeño de metal fino; dos o tres notas claras, sin ruido de manipulación.",
      "uso": "El objeto motivo llave: aparece en el sticker, gira como dial, abre la puerta en la tarjeta final.",
      "ritmo": "Acento del motivo: suena en cada cambio de estado de la llave (máx. 3 veces por pieza).",
      "prompt": "A short clean jingle of a small fine metal keyring, two or three clear delicate notes, no handling noise",
      "duracion": 0.8,
      "influencia": 0.55,
      "volumen": 0.3,
      "ancla": "inicio",
      "variantes": 2
    }
  }
}
```

- **Todo sonido nuevo lleva `descripcion` (cómo suena), `uso` (cuándo va) y `ritmo` (qué pulso marca)**, en español y con detalle. Es lo que permite reutilizarlo en otra pieza sin escucharlo todo de nuevo. El script agrega por variante la fecha, los créditos, las medidas (duración, ataque, pico, RMS) y un `perfil` legible ("corto (415 ms), ataque suave (70 ms), pico a 146 ms, cola media").
- **Prompt en inglés**: material + acción + duración + carácter. Ej.: "A soft rounded UI pop, like a small glass bubble…". El estilo común (premium, seco, sin reverb, sin música, sin voz) se agrega solo desde `estilo` en el manifiesto.
- **Evita** en el prompt: loud, epic, explosion, cartoon, game, laser, alarm, siren, horror, y nombres de marcas o apps ("WhatsApp sound"): describe el sonido de forma genérica.
- `duracion` mínima 0,5 s (el script recorta el silencio). `influencia` 0,5–0,6 (más alta = más literal). `volumen` 0,2–0,4. `ancla`: `inicio` para golpes y clics, `pico` para swipes y whooshes, `fin` para risers.
- Nombres en kebab-case, en español y sin tildes. Si el sonido ya existe en la biblioteca, el pedido no lo sobrescribe: lo reutiliza.

## Mantenimiento

- `node scripts/sfx-gen.mjs` sin argumentos completa las variantes que falten (por ejemplo, tras descartar alguna).
- `--reprocesar` vuelve a recortar y normalizar desde `_raw/` si cambian los criterios del script, sin gastar créditos.
- `--dry` muestra qué se generaría.
- La key actual no tiene permiso para leer el saldo de la cuenta (`user_read`): el costo se ve por generación en la salida del script y en el campo `creditos` de cada variante.
- Música: la cama musical sigue pendiente (`public/music/`). ElevenLabs también genera música por API; si se implementa, sigue el mismo patrón (manifiesto con descripción, procesado y audición).
