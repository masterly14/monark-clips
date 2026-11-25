# Cuatro referencias largas · por qué entretienen y qué pasa a Monark

Cuatro anuncios del mismo estudio (personaje toy en halftone, UI real, titular palabra por palabra), de 29 a 44 s. Se estudiaron como **secuencias de movimiento**, no como capturas: para cada cambio se miró de dónde sale cada elemento, hacia dónde va, con qué curva, qué palabra lo dispara y en qué estado queda.

## Método

- **Material:** `ref5` 1080×1920 · 60 fps · 29,5 s · `ref6` 1080×1350 · 60 fps · 29,5 s · `ref7` 1920×1080 · 60 fps · 34,9 s · `ref8` 720×1280 · 30 fps · 43,9 s.
- **Archivos recibidos:** `ref5` = `ssstwitter.com_1795575365235.mp4`, `ref6` = `…1795578228696.mp4`, `ref7` = `…1795578268465.mp4`, `ref8` = `…1795578321119.mp4`.
- **Transcripción:** whisper.cpp `medium` con tiempos por palabra ([ref5](ref5.words.json) · [ref6](ref6.words.json) · [ref7](ref7.words.json) · [ref8](ref8.words.json)). Los tiempos de palabra de whisper.cpp salen entre 0,1 y 0,4 s **tarde** respecto a la imagen. Para anclar, usa el inicio de frase (más fiable) o `silencedetect`.
- **Muestreo:** hojas de contacto a 4 fps con timecode para ver la pieza entera. Ráfagas a 30 fps (cada frame) de 0,5–0,8 s alrededor de cada transición: el frame anterior, el avance y el estado que queda.
- **Medición de quietud:** proporción de frames sin cambio visible (`scene_score < 0,0015` a 30 fps) y la racha quieta más larga. El comando está en [reference.md §9](../reference.md#9-auditoría-de-movimiento).
- Los tiempos con «≈» se leyeron en hojas de 4 fps (±0,25 s). Los demás son de ráfagas a 30 fps (±0,03 s).

## Medidas que separan la referencia de lo que generaba la Skill

| Medida | ref5 | ref6 | ref7 | ref8 | Monark `video2-motion` (mitad gráfica) |
|---|---|---|---|---|---|
| Frames quietos | 38 % | 30 % | 40 % | 52 %* | **60 %** |
| Racha quieta más larga | 1,1 s | 1,1 s | 0,7 s | 2,7 s* | **2,9 s** |
| Cambios de fondo/escena | ≈14 | ≈13 | ≈14 | ≈16 | ≈5 |
| Duración media de una escena en la demo | ≈1,3 s | ≈1,3 s | ≈1,6 s | ≈1,8 s | ≈4–6 s |
| Titular sans (en lienzo de 1080 de ancho) | ≈84 px | ≈84 px | — | ≈80 px | 118 px |
| Escenas con un objeto que persiste y cambia de estado | taza, tarjeta, teléfono | pila, tarjeta, globo | llave, teléfono | insignia, chat, cifra | ninguna |

\* ref8 acumula su racha quieta en la tarjeta final, que se sostiene a propósito.

**Lectura:** la referencia no es «más rápida» por cortar más. Siempre hay algo que avanza (vapor, un dial, un cursor, un dígito, una pila que crece), el escenario ocupa el cuadro y el titular cede espacio. En `video2-motion` la gráfica es una tarjeta pequeña y centrada en media pantalla de color, que se queda quieta varios segundos mientras habla el presentador.

---

## ref5 · «Pour a coffee» (9:16, 29,5 s)

**Concepto:** una promesa medida con un objeto cotidiano. *Sirve un café: antes de que se enfríe, ya estarás vendiendo.* La taza es el reloj de todo el video.

| Voz (frase) | Qué se mueve y cómo queda |
|---|---|
| 0,2 «Pour a coffee» | Fondo tinta con viñeta. Un chorro cae en la taza en halftone y sale vapor animado. El personaje, abajo a la izquierda, sonríe y parpadea. El titular entra palabra por palabra y *coffee* va en serif. |
| 1,5 «Before it gets cold, you'll be selling online» | En *cold* aparece un **dial de temporizador** alrededor de la taza, con una aguja que empieza a girar. Entre frases, el titular se desvanece con blur en 3 frames. |
| 4,4 → 4,9 transición | El plano oscuro se **comprime hacia abajo** (≈10 frames). Era un detalle de un mundo más grande: un escritorio blanco con monitor, ventana, calendario, nota «launch soon!!», personaje y taza **en el mismo sitio**. Es una revelación de mundo por continuidad. |
| ≈5 «You've been almost ready for months» | **Time-lapse con utilería:** el calendario pasa de ENE a OCT (≈0,25 s por mes), la ventana alterna sol y luna, la luz de la escena baja y sube con el día y la noche, y el spinner del monitor no termina de cargar. *almost ready* entre comillas en serif. |
| 7,8 «The website's not done…» | **Dolly-in** de la cámara al monitor (≈10 frames, ease-out, escala ≈2,5×). Dentro, la cinta «UNDER CONSTRUCTION» y «Loading…». Luego la pantalla cambia a «Checkout · Not connected / Not set up». El cursor intenta clic en «Set up payments», deshabilitado. |
| 10,6 «Taxes? Later!» | La cámara vuelve atrás. Una hoja «TAXES» cae al escritorio y se apila con otras. En *Later* el personaje la aparta sin mirarla. |
| 12,7 «Not anymore!» | Empuje lento de cámara hacia personaje y taza. |
| 13,3 → 13,7 «Pocketsflow!» | El icono de la marca **cae desde arriba con estela** y entra **en la taza**. De la taza sale un splash de pintura en colores de la marca y, desde ahí, una **mancha orgánica lima con borde rosa** se expande en ≈6 frames. El mundo gris pasa a color y el escritorio desaparece. El wordmark se escribe letra por letra. |
| 14,7 «Name it. Price it. Upload it.» | La taza ahora es un **sticker con dial arriba a la derecha** y queda ahí hasta el final. Una sola tarjeta «Define your product» **evoluciona**: se escribe el título, los dígitos del precio ruedan de 00 a 29 y el PDF se arrastra y su barra carga de 77 a 100 %. El fondo hace **corte en cada verbo**: violeta en *Name*, y así sucesivamente. |
| ≈16,5 «You're live!» | La tarjeta sale hacia abajo y **se condensa en su fila resumen** («My e-book $29 · Unpublished»). Un círculo rosa crece desde detrás de ella. Entra el sello «● LIVE» y la pastilla cambia a «Published». |
| ≈17,5 «Share your link» | Fondo azul. Clic en «Copy link» → «Copied!». La **pastilla del enlace sale volando y se convierte en la URL del teléfono** que entra desde la izquierda. |
| ≈18,5 «Buyers get their file the second they pay» | Fondo naranja. Teléfono grande (≈44 % del ancho): Buy → formulario de pago → clic → «Purchase Successful» → Download. Junto al teléfono, un **chip de cronómetro «0:01»** prueba la palabra *second*. |
| ≈20,7 «Taxes handled» | Fondo lima. Un globo en halftone gira y los **chips de país** (DE VAT 19 %, FR VAT 20 %…) salen en cascada con ✓. Sello «Handled ✓» en etiqueta azul. |
| ≈22 «No monthly fee» | Fondo violeta. La pastilla «$39/mo» queda **aplastada por dos bloques lima** que llegan desde los lados. Después, un contador **split-flap** de «$3/mo» pasa a «$0/mo» y se va a una esquina. |
| ≈23,5 «Your first sale could be today» | Fondo rosa. Cae la notificación «New sale +$29.00». **El personaje levanta la taza y bebe: el café sigue caliente.** Es el pago de la promesa del gancho. |
| ≈25,3 «Start free…» | Fondo azul. Botón lima «Start free» con pulso de anillo. El wordmark se escribe y la cabeza del personaje asoma por detrás. La URL se escribe en una pastilla negra con una fila mono debajo. La taza sigue en su esquina. Se sostiene ≈3 s. |

## ref6 · «Here's what nobody tells you» (4:5, 29,5 s)

**Concepto:** el secreto que nadie cuenta. La complejidad se vuelve **física**: el papeleo entierra al personaje.

| Voz | Qué se mueve y cómo queda |
|---|---|
| 0,1 «Selling online?» | Primer plano enorme del personaje asomado por la derecha, inclinado hacia cámara, con la boca abierta al hablar. Titular grande en dos líneas. |
| 1,6 «Here's what nobody tells you» | *nobody* en serif. Una carpeta «CLASSIFIED» entra desde la izquierda y el personaje **guiña**. En *you* la carpeta se abre y muestra un checklist «SETUP». La cámara se va hacia el checklist y el personaje queda gigante y cortado a la derecha. |
| 3,6 «You'll need a website, a checkout, a payment account» | Fondo blanco con el personaje al centro. **Cada sustantivo es una ventana que cae y se apila delante de él**: website builder con «Loading…», luego checkout y luego payment account, sobre la que golpea el sello «UNDER REVIEW». Las ventanas anteriores se quedan. |
| 7,4 «tax rules for every country» | Chips de IVA y banderas llegan desde los bordes y se pegan alrededor. |
| 9,6 «weeks of setup» | Un calendario «SETUP · Week» pasa de 1 a 8 (≈0,25 s por semana). El personaje cierra los ojos, resignado. |
| 11,2 «…for one product» | **Pull-back** (≈7 frames): llueven tarjetas desde arriba y aparece una **montaña de papeleo** con el personaje enterrado. Arriba de todo, un único icono diminuto con la etiqueta mono «1 product». Es contraste de escala. |
| 13,2 «Or…» | **Pausa intencional** de ≈0,25 s: se dibujan esquinas de visor (viewfinder) en el cuadro, como una cámara que encuadra. |
| 13,8 «just Pocketsflow» | El icono de la marca cae desde arriba sobre el producto. **Desde el punto de impacto se abre una telaraña de grietas lima**, la montaña **estalla en esquirlas** que salen despedidas y el lima llena el cuadro. **El producto diminuto se vuelve protagonista** junto al icono. El personaje sale de los escombros abajo a la derecha. |
| 15,2 «Upload it, set a price, share your link» | Misma tarjeta viva. **Corte de fondo en cada verbo** (violeta → azul en *set* → círculo rosa en *share*), mientras la tarjeta sigue en su sitio. La URL copiada se convierte en el teléfono. |
| 18 «Cards, Apple Pay and PayPal» | Cada pestaña de pago **se resalta al nombrarse**. |
| 20,4 «Taxes handled in over 130 countries» | Del ✓ de pago **sale un círculo lima y el globo emerge del teléfono**. El número **del titular cuenta** 29 → 87 → 117 → 128 → 130+. Un círculo violeta se cierra alrededor del globo y se pasa a la escena siguiente. |
| 23,4 «No monthly fee» | Pastilla aplastada por bloques y split-flap a «$0/mo», como en ref5. |
| 24,8 «Start selling free…» | Igual que ref5. El sticker de esta pieza es el **personaje en un círculo**, siempre arriba a la derecha. |

## ref7 · «Your crypto deserves a better home» (16:9, 34,9 s)

**Concepto:** una casa para el dinero. Cada beneficio de seguridad se representa con **un objeto físico conectado a la UI**.

| Voz | Qué se mueve |
|---|---|
| 0,5 «Hey!» | El personaje asoma junto a una caja de cartón llena de monedas y le sale un globo «Hey!». |
| 1,4 «Your crypto deserves a better home» | *home* en serif violeta. |
| 3,4 «Meet Pocketsflow Wallet» | Un círculo violeta nace del icono de la app. **El personaje entra en el círculo y se convierte en el sticker** abajo a la izquierda. El wordmark se escribe y entra la etiqueta «Beta». |
| 5,6 «Your crypto, your keys…» | Un candado y **una llave que entra en la cerradura y gira** (destello). En pantalla dice «Your crypto. Your keys.»: es **una versión condensada** de lo que se oye. |
| 7,6 «never leave your device» | La llave se queda dentro. Un anillo de pulso al cerrar. |
| 9,2 «Solana, Ethereum, Base, Polygon, Arbitrum» | Fondo lima. Un contador en mono «1 network → 5 networks» y cada logo entra **al nombrarse** con su etiqueta. Después **los logos vuelan dentro del teléfono** y el saldo corre de $0 a $3.167. |
| 14,4 «Send, receive and swap in a few clicks» | La pantalla del teléfono **cambia de estado por verbo** (QR, formulario, Swapped ✓) con clic del cursor. |
| 17,4 «You see the network fee before you send» | Una **lupa** pasa sobre la comisión. En pantalla: «See the *fee* before you send.» |
| 19,9 «A shady site trying to drain you?» | Fondo tinta. Una tarjeta «FREE AIRDROP» extiende **una manguera de aspiradora** hacia la billetera. |
| 22,8 «…warns you in red» | Fondo rojo y advertencia de transacción. Clic en «Reject»: la manguera se retira. |
| 25,4 «Back it up with your email and a passkey, or use your ledger» | Un sobre **vuela al teléfono**, una huella pulsa en el botón y un **Ledger se enchufa con su cable**. |
| 29,2 «…in beta. Try it now…» | *beta* va en una etiqueta lima. El dashboard web sale y el cursor navega. |

## ref8 · «Here's a little secret» (9:16, 43,9 s)

**Concepto:** un secreto susurrado. La tienda se maneja desde la IA que ya usas.

| Momento | Qué se mueve |
|---|---|
| 0–2,4 «Psst. Here's a little secret…» | Fondo tinta con **un foco de luz** detrás del personaje. Rótulo mono `// psst` y el texto se escribe **como en una terminal** con bloque verde. En el pecho del personaje hay **una insignia azul de la marca con un punto verde**. |
| 2,5 transición | Corte a azul: **la insignia del pecho crece, rodeada por un anillo lima, y se convierte en el dashboard**, que sube mientras el personaje cae fuera de cuadro. Es un objeto plantado en el primer plano que paga en el segundo. |
| ≈2,6 «You never have to open Pocketsflow again» (en pantalla: «You never open Pocketsflow *again.*») | El cursor recorre el dashboard. Sobre *Pocketsflow* **se dibuja un tachado** y entra *again.* en serif lima con subrayado a mano. El dashboard cae y el personaje sube. Un círculo blanco nace de un punto. |
| ≈5,8 «Your whole store now runs from the AI you already use» | Titular centrado bajo el logo. Los iconos de las IA **se agrupan y orbitan**. |
| ≈9,2–12,8 Claude · ChatGPT · Codex · Grok · Cursor | **Ráfaga de héroes**: cada app ocupa el cuadro ≈0,7 s con su color propio. El icono siguiente entra pequeño y crece, y **los anteriores se apilan como rastro en la esquina superior izquierda**. Los cambios se hacen con círculo desde el icono. |
| ≈13 «connected over MCP» | Los iconos **orbitan alrededor del núcleo** de la marca con pulsos de anillo. |
| ≈13,7 «Just sign in and click Allow» | Ventana OAuth: el cursor hace clic en «Allow access» → «✓ Allowed» → pastilla «connected». |
| ≈15 «No API key, no code» | Barrido diagonal rosa. La clave se escribe, **una línea blanca la corta y estalla en fragmentos que caen**. El bloque `mcp.json` **se aplasta hasta ser una línea** y de ahí nace un círculo que abre la escena siguiente. |
| ≈17,5 «Then ask.» | **Tinte contextual**: escena crema, acento terracota y anillo del sticker del mismo color, como la app mostrada. La voz dicta la petición («Launch my presets at $29, 20% off this weekend») y el campo la escribe **al mismo ritmo** durante ≈4 s mientras el titular («Then *ask.*») se queda quieto. Llamadas de herramienta con spinner → ✓ en cascada. |
| ≈23,5 «Done! It's live with a checkout link» | *Done!* con **líneas de énfasis** (emanata). La tarjeta del producto **se sale del chat y crece**: precio tachado $29 → $23,20, etiqueta LAUNCH20. La URL se escribe y se resalta, y **la pastilla sale volando hacia la escena siguiente** con un barrido diagonal. |
| ≈26,5 «How did sales go this week?» | Escena menta (contexto ChatGPT): teléfono con teclado y la pregunta se escribe. Después **el titular desaparece y su lugar lo ocupa la respuesta en grande**: $2,480 con **dígitos tipo tragamonedas**, sincronizado con la cifra pequeña del teléfono. Las barras crecen y entra la pegatina «+18 %» con confeti. |
| ≈33,5 «Refunds? Emails?» | El sticker se encoge a un punto. **Dos paneles entran en diagonal desde lados opuestos** y parten el cuadro en dos bandas horizontales: arriba la terminal oscura con *Refunds?* y abajo la app crema con *Emails?*. Corren en paralelo. |
| ≈35,2 «Just ask.» | Barrido diagonal blanco a azul. Las peticiones flotan como chips desde ambos lados. |
| ≈36,8 «Your whole store, in plain words.» | Iris al núcleo y **recapitulación**: los resultados de todas las escenas (producto $23,20, $2,480, $49 refunded, «Sent to 1,284») vuelven alrededor del núcleo. Confeti. |
| ≈39,5 cierre | El wordmark se escribe con la cabeza del personaje detrás. Fila de iconos, «Start free», la URL se escribe y el cursor hace clic. Se sostiene ≈3 s. |

---

## Patrones comunes (lo que pasa a la Skill)

1. **Un concepto con objeto, no una lista de funciones.** Cada pieza parte de una metáfora ligada al gancho (café que se enfría, papeleo que entierra, casa para el dinero, secreto susurrado). La metáfora da un **objeto motivo** que vuelve y tiene **pago** al final.
2. **El motivo vive en un sticker con estado.** El objeto o el personaje se queda en una esquina durante la demo, y su estado avanza (dial que gira, anillo con el color de la escena, punto «en vivo»).
3. **Antes en gris; después en color.** El problema ocurre en un **mundo continuo en halftone gris**, con cámara que se mueve (dolly-in, pull-back, revelación). La marca **rompe ese mundo desde un objeto** (splash, grietas) y desde ahí todo es color saturado.
4. **Acumulación → pausa → liberación.** Los dolores se apilan físicamente con contadores de tiempo (meses, semanas). Un pull-back muestra la escala. Hay ≈0,25 s de quietud («Or…») y después el impacto.
5. **Transiciones nacidas de un objeto.** El círculo de color crece desde la tarjeta, el check, la insignia, el icono o el globo. Un objeto se condensa en su fila resumen. Una pastilla vuela y se vuelve parte de la escena siguiente. Un bloque se aplasta hasta ser una línea. El corte seco queda para el cambio de fondo **detrás** de una UI que se queda.
6. **La UI evoluciona en vez de reemplazarse.** Una tarjeta atraviesa 2–3 beats cambiando de estado. Los números ruedan por dígito. Los botones cambian de etiqueta tras el clic.
7. **El dato clave se duplica en grande.** El titular cede su sitio a la cifra (tragamonedas), aparece un chip de tiempo al lado del teléfono, una lupa sobre la comisión o una pegatina «+18 %».
8. **Titular corto, editado y pequeño.** ≈84 px. El acento serif es ≈1,25× y cambia de color con la escena. El texto **condensa** la voz y usa «…» para generar suspenso. Decoraciones: subrayado a mano, tachado dibujado y etiqueta de color. Sale con blur en 3–4 frames.
9. **Micro-movimiento constante y quietud intencional.** Vapor, dial, cursor, caret, spinner o respiración. La quietud total se reserva para justo antes del impacto y para la tarjeta final.
10. **El personaje actúa.** Se acerca a cámara, guiña, asoma, queda enterrado, sostiene y bebe la taza, se vuelve sticker y asoma tras el wordmark.
11. **Ráfagas y paralelos.** Para listas de integraciones: un héroe por nombre, con su color, y rastro de los anteriores en una esquina. Para dos ejemplos simultáneos: dos bandas que entran desde lados opuestos.
12. **Tinte contextual.** La escena adopta el color de la app que muestra (fondo, acento y anillo del sticker).
13. **Recapitulación y cierre en capas.** Antes de la tarjeta final, los resultados de la pieza vuelven juntos. Después, el motivo cierra su promesa y la tarjeta final entra por capas y se sostiene ≈3 s.

## Cómo se traduce a Monark

| Referencia | Monark (ejemplo; valida guion y claims con el usuario) |
|---|---|
| Taza que se enfría como reloj | **La llave** (`props/llave`) como motivo: gira en el sticker como un dial mientras «el huésped llega en 10 minutos». Pago: la llave abre la puerta en el cierre. |
| Escritorio con calendario y ventana día/noche | Recepción o cocina de la cabaña en halftone: el teléfono vibra con mensajes, el calendario se llena de reservas cruzadas y la ventana pasa del día a la noche mientras el anfitrión sigue contestando. |
| Montaña de papeleo y «1 product» | Montaña de chats de WhatsApp, avisos de Airbnb y Booking, tareas de limpieza y cobros pendientes, con **una sola cabaña** diminuta arriba. |
| Icono que cae y rompe el mundo | La mariposa o el icono de Monark cae sobre la cabaña, abre grietas amarillas y la montaña estalla. |
| Ráfaga de apps con rastro | Airbnb (coral) · Booking (cobalto) · WhatsApp (verde): un héroe por nombre, y los anteriores se apilan en la esquina. |
| Tinte contextual | Escena de WhatsApp en verde menta con acento verde, escena de Airbnb con fondo coral. |
| Cifra que reemplaza al titular | «Ocupación del mes» o «respuestas automáticas» con dígitos de tragamonedas, **solo con datos aprobados**. |
