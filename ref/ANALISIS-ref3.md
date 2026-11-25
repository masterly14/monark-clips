# Análisis: video de referencia "Pocketsflow" → adaptación Monark

Fuente: `ref/ref3.mp4` · 1920×1080 · 60 fps · 15.06 s · locución en inglés + efectos de sonido.

## 1. Transcripción (Whisper, con tiempos)

| t (s) | Locución |
|---|---|
| 0.05 | "Psst." |
| 1.16 | "Got something to sell?" |
| 2.00 · 3.08 · 3.57 | "Courses, · e-books, · apps?" |
| 4.00 – 6.40 | "Pocketsflow turns it into a store in minutes." |
| 7.00 – 9.40 | "Checkout, subscriptions, upsells, taxes, payouts?" |
| 10.00 | "Handled." |
| 11.00 – 13.24 | "You create. We handle the flow." |
| 14.00 | (pitidos / jingle de cierre) |

Una idea por frase, y cada frase tiene su escena. La animación sigue la locución palabra por palabra.

## 2. Estructura, acto por acto

El propio video rotula sus actos arriba a la izquierda (`// 01 — hook`, `// 02 — …`, `// 03 — store`, `// 04 — handled`, `// 05 — flow`).

| Acto | Tiempo | Fondo | Qué pasa en pantalla |
|---|---|---|---|
| **01 hook** | 0–2.1 s | Blanco | El personaje **asoma por el borde derecho**, se centra y le sale un globo de diálogo que se **escribe a máquina** ("ps" → "psst_" con cursor). Luego se corre a la derecha y entra el titular palabra por palabra, con una máscara que lo sube desde abajo: "Got something / to *sell?*". La palabra clave cambia a **serif itálica azul** y se le **dibuja un subrayado a mano**. Sobre "Got" el personaje abre la boca. |
| **02 catálogo** | 2.1–4.3 s | **Azul eléctrico plano** | Corte duro a azul (entra una forma que se transforma). El personaje queda a la izquierda. Las tarjetas entran volando, con giro 3D y en cascada, **cada una justo cuando se nombra**: Courses $149 → Ebooks $29 → Apps $4.99/mo. Cada tarjeta lleva su rótulo mono (`// course 01`) y un objeto 3D en **halftone**. El personaje guiña el ojo. |
| **03 store** | 4.3–7.0 s | Blanco | Las tarjetas se meten dentro de un **iPhone** y se convierten en la tienda ("Your Store", lista de productos con botón "Get it now"). En la barra de URL **se escribe** `yourname.pocketsflow.com` y aparece la insignia **LIVE**. A la izquierda, el titular palabra por palabra: "Pocketsflow turns it into / a store / in *minutes.*" (la itálica azul otra vez). Al final, un cursor hace clic en "Get it now". El personaje mira el teléfono. |
| **Transición** | 7.0–7.2 s | Negro | **Zoom violento** con desenfoque de movimiento sobre el texto "Apple Pay" (se alcanza a leer "ple P"). La cámara se aleja y aterriza en el dashboard. |
| **04 handled** | 7.2–11.0 s | Blanco con cuadrícula tenue | Dashboard **bento** de 3 columnas. Cada tarjeta se activa **cuando se nombra**: checkout (se escribe la tarjeta "4242…", Apple Pay); subscriptions (el precio corre hasta **$9/month** y una línea de meses se llena); upsells (una casilla se marca, el subtotal sube y el botón pasa de "Pay $149" a "$201.60"); taxes (los chips EU VAT ✓, UK VAT ✓, US sales tax ✓ se marcan en secuencia); payouts (el contador va de $0.00 a **$12,480.00** y suben unas barras). La tarjeta central, `// on air`, muestra al personaje en vivo. En "Handled." cae un **sello gigante** "*Handled.*" (serif itálica azul, girado, con marco), entra grande y se asienta pequeño. Además aparecen checks azules en cada tarjeta, "✓ Paid" en el botón y un círculo que se dibuja alrededor. |
| **05 flow** | 11.0–13.4 s | **Negro** | El personaje sale de un fundido en halftone. El titular entra palabra por palabra: "You *create.*" en blanco y serif itálica, luego "We handle" en gris. "*flow.*" llega en azul dentro de un **iris o foco blanco de halftone** que se expande y llena la pantalla. |
| **06 end card** | 13.4–15 s | Blanco | Las letras de "Pocketsflow" **caen y rebotan** una por una (con giro). El personaje **asoma por detrás del logo** (solo la mitad superior) y guiña. Debajo entran el subtítulo "The payment infrastructure that *you deserve.*", el botón azul "Start selling", la URL y una fila mono de datos (65,000+ creators · 160+ countries · no monthly fee). |

## 3. Sistema visual (lo que hace que no se vea genérico)

1. **Una sola técnica de imagen: halftone / dither de 1 bit.** El personaje 3D, los productos (laptop, libros, edificios) y las miniaturas están todos tramados en blanco y negro. El único color de todo el video es el **acento**. Esa unidad es el 80 % del estilo.
2. **Personaje guía con expresiones.** Muñeco 3D estilo toy, pelo rizado y suéter con un parche cuadrado. Cambia de cara en cada beat (neutro, sonrisa, boca abierta, guiño, ojos cerrados de felicidad). Funciona como "presentador": asoma, mira lo que pasa y reacciona. Nunca está quieto (respira y se balancea).
3. **Paleta mínima:** blanco roto `#FAFAFA`, tinta `#111`, gris para texto secundario, **un acento** (azul `#2563EB`) y negro para el acto emocional.
4. **Tres tipografías con un rol fijo cada una:**
   - **Grotesk bold** (tipo Inter o Geist) para titulares.
   - **Serif itálica condensada** (tipo Instrument Serif) solo para la palabra clave de cada frase, en color de acento. Es el "momento" de cada frase.
   - **Mono** (tipo Geist Mono o IBM Plex Mono) para rótulos tipo código (`// checkout`, `// on air`) y para la meta de esquina.
5. **Meta de "sala de edición":** arriba a la izquierda va el nombre del acto (`// 04 — handled`) y arriba a la derecha `POCKETSFLOW 00:00:10:33` con **timecode corriendo**. Da sensación de producto hecho por gente técnica.
6. **Interfaz real, no ilustrativa:** cada claim se *demuestra* con UI funcionando (se escribe, se marca, cuenta, se carga). Nada es decorativo.

## 4. Gramática de movimiento (reglas para clonarla)

- **Sincronía exacta con la voz:** cada palabra o ítem entra en el frame en que se pronuncia (las tarjetas de 02, los chips de 04 y el titular de 01, 03 y 05).
- **Texto:** palabras que suben desde una máscara invisible con un leve blur; la palabra clave entra como serif itálica de acento y luego se le dibuja el subrayado.
- **Escritura a máquina** con cursor parpadeante (globo, URL, número de tarjeta).
- **Contadores** que corren hasta el valor final con easing de salida ($0 → $12,480; $ → $9).
- **Springs suaves a 60 fps** en todo lo que entra (tarjetas con giro 3D y cascada de unos 3 frames).
- **Transiciones con intención:** corte duro de color (blanco → azul), zoom con desenfoque de movimiento, iris o foco circular en halftone, y letras que caen en el logo final.
- **Sello de cierre** ("Handled."): entra al 300 %, gira y se asienta con un rebote. Es el clímax del video.
- **Ritmo:** 6 actos en 15 s, de unos 2.5 s cada uno. Nunca hay más de una idea nueva a la vez.

## 5. Propuesta de adaptación a Monark

### Personaje guía: la mariposa Monark en halftone
Recomiendo que la **mariposa origami del logo** sea la guía, en lugar de inventar un muñeco. Es la figura propia de la marca, ya existe como vector y se puede tramar en halftone de forma procedural dentro de Remotion (dither Bayer sobre canvas), así que no depende de renders 3D externos.
- **Sin cara.** La personalidad viene del movimiento: aleteo en cada beat, se inclina para "mirar", **se posa** sobre la tarjeta o palabra que se nombra, vuela entre actos (y eso hace de transición), y al final aterriza sobre la "o" amarilla del logotipo Monark.
- **Alternativa:** un personaje anfitrión 3D estilo toy, como el de la referencia. Para eso harían falta renders o imágenes del personaje en 5–6 expresiones, que tú tendrías que generar en otra herramienta. Yo después los tramo y los animo.

### Paleta y tipografía Monark
- El azul pasa a **amarillo Monark `#EFAF1A`**. El amarillo sobre blanco no se lee bien como texto, así que la palabra en serif itálica va en **tinta con un subrayado o resaltado amarillo dibujado a mano**. En los actos de fondo amarillo y negro sí va en amarillo o en tinta según contraste.
- El acto 02 (azul plano) pasa a **amarillo plano**. El negro del acto 05 se mantiene.
- Tipografías: **Plus Jakarta Sans** + **Instrument Serif itálica** + **JetBrains Mono**. Son las que ya usa la plantilla de testimonios, así que todo queda coherente.
- Meta de esquina: `// 01 — hook` y `MONARK 00:00:02:00`.
- Imágenes de propiedades (cabaña, apartamento, glamping) **en halftone**, igual que los productos de la referencia.

### Guion adaptado (ES, ~15 s, beat por beat)

| Acto | Locución propuesta | Pantalla Monark |
|---|---|---|
| 01 hook (blanco) | "Psst… ¿Tienes una propiedad para *rentar?*" | La mariposa entra aleteando por el borde con el globo "psst_" escribiéndose. Titular palabra por palabra; "rentar?" en serif itálica con subrayado amarillo. |
| 02 catálogo (amarillo) | "¿Cabaña, apartamento, glamping?" | Tres tarjetas halftone (`// cabaña 01 · $180/noche`, `// apto 02`, `// glamping 03`) que entran al nombrarse. La mariposa se posa en cada una. |
| 03 producto (blanco) | "Monark la pone a vender en *minutos.*" | iPhone con la propiedad publicada; los chips **Airbnb · Booking · Web** se conectan, aparece "SINCRONIZADO" y el calendario se llena de reservas. |
| zoom | — | Zoom con desenfoque sobre "Reserva confirmada" que lleva al bento. |
| 04 resuelto (bento) | "Canales, calendario, asistente IA, limpieza, pagos… *Resuelto.*" | Tarjetas que se activan al nombrarse: `// canales` (Airbnb/Booking ✓), `// calendario` (ocupación sube), `// asistente IA` (chat de WhatsApp contestando), `// limpieza` (tarea ✓), `// pagos` (contador de ingresos). Al centro, `// en vivo` con la mariposa. Sello gigante "*Resuelto.*" con el contorno de la mariposa. |
| 05 flow (negro) | "Tú *hospedas.* Nosotros operamos." | Iris de halftone amarillo con la mariposa en el centro. |
| 06 end card | "Monark." | Las letras de Monark caen; la mariposa aterriza sobre la "o" amarilla. Subtítulo "El PMS que *tus huéspedes sienten.*", botón "Link en el perfil" y una fila mono de beneficios (ejemplo: 30 % dcto. · implementación gratis). |

Los textos del guion y los beneficios son propuestas: hay que validar los claims reales antes de producir.

### Lo que se necesita para producirlo
1. **Locución:** la grabas tú (ideal, por la voz de marca) o la generamos con TTS. El montaje se sincroniza palabra por palabra con Whisper, igual que en los videos anteriores.
2. **Formato:** la referencia es 16:9. Para Reels/TikTok propongo **9:16**, con el titular arriba y la mariposa y la UI abajo; también puede salir en 16:9 para web o YouTube.
3. **Imágenes de propiedades reales** (opcional). Si no hay, uso ilustraciones simples tramadas.
4. **Efectos de sonido** (whoosh, clics, tecleo, sello). La referencia los usa mucho; habría que conseguir una librería libre o que la aportes tú.

### Cómo se construiría en el proyecto
- Una composición nueva `monark-explainer` con un archivo por acto, más componentes reutilizables: `Halftone` (dither de cualquier imagen o SVG), `Butterfly` (posturas y aleteo), `WordReveal` (palabra por palabra con acento serif), `Typewriter`, `Counter`, `Stamp` y `Iris`.
- Los tiempos salen de la transcripción de la locución nueva, como en `video2-editado`.
