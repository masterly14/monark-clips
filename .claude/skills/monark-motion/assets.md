# Monark Motion — dónde está cada asset

**Fuente de verdad:** `public/assets.manifest.json`. Léelo antes de usar cualquier imagen; ahí están la ruta, la caja del contenido (`bbox`) y el uso de cada asset. No adivines rutas.

## Estructura de carpetas (`monark-clips/public/`)

```
public/
├── assets.manifest.json      ← inventario (rutas, bbox, uso)
├── character/
│   ├── raw/                  ← originales de Higgsfield, 1344×752, fondo blanco (NO editar)
│   │   ├── neutral.png  sonrisa.png  habla.png  guino.png
│   │   ├── preocupado.png  feliz-ojos-cerrados.png  sorpresa.png
│   │   ├── peek-derecha.png  peek-abajo.png  badge.png
│   │   ├── mira-titular.png  mira-abajo-derecha.png
│   │   ├── turnaround.png              (solo referencia)
│   │   └── _referencia-aprobada.webp   (solo referencia)
│   └── ht/                   ← procesados: <nombre>.png (papel) · <nombre>-ink.png (tinta) · badge-circle.png
├── props/
│   ├── raw/                  ← cabana, apartamento, glamping, llave, calendario, limpieza, huesped, maleta
│   └── ht/                   ← procesados: <nombre>.png · <nombre>-ink.png
├── brand/                    ← logos de Monark, apps (Airbnb, Booking, WhatsApp) y clientes
├── clips/                    ← videos fuente y sus captions de Whisper
├── music/                    ← cama musical (pendiente)
└── sfx/                      ← SFX generados con ElevenLabs: sfx.manifest.json, <categoria>/<nombre>-vN.wav, _raw/, pedidos/ (ver audio.md)
```

## Versiones procesadas (lo que se usa en el video)

Cada asset tiene tres archivos; el manifiesto los lista en `file`, `ht` e `ink`:

| Campo | Archivo | Qué es | Cuándo usarlo |
|---|---|---|---|
| `file` | `raw/<nombre>.png` | Original con fondo blanco | Nunca directo en video; solo es la fuente |
| `ht` | `ht/<nombre>.png` | Halftone 1 bit: puntos negros sobre **papel blanco**, con transparencia fuera de la silueta | **Por defecto**, sobre cualquier fondo de acto |
| `ink` | `ht/<nombre>-ink.png` | Solo los puntos negros, todo lo demás transparente | **Duotono**: el color del fondo se ve dentro del personaje (tarjeta final, momentos de marca) |

Extra: `character/ht/badge-circle.png` (512×512) es el sticker circular ya recortado. El anillo de 5 px y el punto de estado se dibujan en código.

Los originales están recortados al contenido con 24 px de margen. Las 12 imágenes del personaje comparten encuadre, así que al cambiar de expresión no hay que reposicionar. Escálalas con `image-rendering: pixelated` para que los puntos no se difuminen.

**Regenerar** (por ejemplo, tras agregar o reemplazar un original):
```
node scripts/build-assets.mjs              # todos
node scripts/build-assets.mjs sonrisa      # solo uno
```
Parámetros en el script: celda de halftone de 3 px, curva del personaje `0/0 0.25/0.02 0.45/0.55 0.6/0.9 1/1`, curva de objetos más clara, umbral de fondo 244 para el personaje y 226 para los objetos (excluye la sombra del render).

## Reglas
1. **`raw/` es solo lectura.** Todo procesamiento escribe en `ht/` con el mismo nombre, mediante `scripts/build-assets.mjs`. No edites a mano los archivos de `ht/`.
2. **Nombres en kebab-case, en español y sin tildes**, iguales a la clave del manifiesto. Para agregar un asset: copia el archivo a `raw/` con su nombre, agrega su entrada al manifiesto (`file`, `bbox`, `use`), corre `node scripts/build-assets.mjs <nombre>` y agrega sus campos `ht` e `ink`.
3. **Las expresiones están alineadas** (la cabeza cae en x≈346–358 e y≈10–16 en todas). Para cambiar de expresión basta con cambiar el archivo, sin reposicionar. Si agregas una expresión nueva, verifica que su bbox quede a ±12 px de `neutral`.
4. **Elegir expresión según el beat:**

| Momento | Expresión / pose |
|---|---|
| Entrada del gancho | `peek-derecha` y luego `sonrisa` |
| Locución neutra | alternar `neutral` ↔ `habla` cada 8–12 f mientras hay voz |
| Logro, beneficio | `sonrisa` |
| Dolor, problema | `preocupado` (ya trae gota de sudor) |
| Cifra, revelación, giro | `sorpresa` |
| Resolución, "¡Listo!" | `feliz-ojos-cerrados` |
| Remate, tarjeta final | `guino` o `peek-abajo` |
| Mirar el titular / la tarjeta | `mira-titular` / `mira-abajo-derecha` |
| Sticker circular | `badge` |

5. **Actuar con la cámara.** Las imágenes son fijas, así que la actuación sale del encuadre y del movimiento:

| Acción | Cómo se hace con los assets actuales |
|---|---|
| Contar un secreto | `habla` o `guino` a escala ≈ 2,2, cortado por el borde derecho, con rotación de −6° a 0° en 14 f, como si se inclinara hacia cámara |
| Quedar enterrado | `preocupado` detrás de la pila del problema. Cada tarjeta nueva tapa un poco más y el personaje baja 20 px por tarjeta |
| Salir de los escombros | `sorpresa` → `sonrisa` subiendo desde abajo con spring mientras vuelan las esquirlas |
| Sostener el objeto motivo | El prop en halftone delante del pecho, en la misma capa de respiración que el personaje |
| Volverse sticker | Iris o morph hacia el círculo `badge-circle.png` (ver devices.md A3) |
| Asomarse tras el wordmark | `peek-abajo` en duotono, recortado por la línea base del logo |

6. **Objetos motivo disponibles** (`public/props/ht/`). Elige uno en el paso de Concepto:

| Prop | Metáfora que sostiene | Estado que puede cambiar |
|---|---|---|
| `llave` | Acceso, llegada del huésped, «llaves en mano» | Gira como un dial, entra en una cerradura, cambia de color al confirmarse el check-in |
| `calendario` | Tiempo, ocupación, temporada | Las hojas pasan como time-lapse y los días se llenan |
| `maleta` | El huésped que llega o se va | Rueda hacia la puerta, se abre, cambia su etiqueta de estado |
| `cabana` / `apartamento` / `glamping` | La propiedad del espectador, el «una sola propiedad» frente a la montaña de trabajo | Se enciende la ventana, aparece una pastilla «Ocupada» |
| `limpieza` | Tarea pendiente o hecha | Brilla y suma un check |
| `huesped` | La persona al otro lado del chat | Sonríe, deja una reseña de 5 estrellas |

7. **Pendientes** (también listados en el manifiesto, bajo `missing`): `props/globo` y música. Los SFX ya existen y se amplían por pieza (ver [audio.md](audio.md)). Para los dioramas del acto Problema harían falta piezas de mundo en halftone que hoy no existen: `ventana` (día/noche), `escritorio` o `recepcion`, `telefono` (que vibra), `puerta`. Si un beat los necesita y no existen, avisa al usuario en lugar de inventarlos o constrúyelos en código como formas planas en el estilo de la UI.
