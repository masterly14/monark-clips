# Monark Motion — catálogo de recursos visuales

Cada recurso sirve a un *tipo de frase*. Elige el recurso según lo que dice la locución, no según lo que se vea bonito. Cada uno tiene: **cuándo usarlo**, **anatomía**, **secuencia** (sincronizada con palabras) y un **ejemplo Monark**.

---

## A. Recursos de narrativa

### A1. Checklist de logro (Gancho)
- **Cuándo:** la frase celebra algo que el espectador ya hizo ("¡Abriste tu alojamiento!").
- **Anatomía:** tarjeta clara con la barra de la app (semáforo, ícono y nombre) y un botón de acción oscuro a la derecha (⚡ Publicar). Debajo, un título ("Plan de lanzamiento") y 4 casillas: 3 marcadas y tachadas, y la última vacía. Esa última es el siguiente dolor.
- **Secuencia:** la tarjeta entra con la primera palabra. El cursor viaja al botón. En la palabra acento: clic, confeti y el personaje pasa a `sonrisa`. En la frase siguiente, la casilla vacía se pone roja y aparece la pastilla "⚠ Falta: operación".
- **Monark:** casillas "Fotos listas ✓ · Anuncio en Airbnb ✓ · Precio definido ✓ · Operación diaria ☐".

### A2. Pila caótica (Problema)
- **Cuándo:** la locución enumera dolores ("calendarios, mensajes, limpiezas, pagos…").
- **Anatomía:** tarjetas pequeñas que **se apilan desordenadas** sobre la tarjeta anterior. Cada una entra con un giro aleatorio de ±8°, ligeramente desplazada, y lleva una etiqueta de color en la esquina con su nombre en mono (`calendarios`, `mensajes`). Se suman **anotaciones a mano**: un círculo rojo garabateado y un "¿¡Por qué!?" manuscrito. También pastillas de error (`DOBLE RESERVA`, `SIN RESPUESTA`).
- **Secuencia:** una tarjeta por palabra. El personaje pasa a `preocupado` en el primer dolor y le sale una **gota de sudor en cada palabra**. El fondo pasa a `piedra`. Al final, la pila tapa casi todo el escenario.
- **Regla:** es el único momento en que se permite el desorden. Justo después viene un giro limpio. La versión ampliada, con personaje enterrado y pull-back de escala, es A20.

### A3. Giro con iris (Problema → Solución)
- **Cuándo:** "O… simplemente…", "Hasta que…", "Por eso…".
- **Secuencia:**
  1. En "O…", corte a `violeta` o `amarillo`. La pila sale hacia abajo a la izquierda en 10 f.
  2. El personaje queda dentro de un **círculo blanco con anillo** y mira a cámara.
  3. En la palabra siguiente, el círculo se encoge y viaja al sticker (`IrisToBadge`, 22 f).
  4. Desde ahí el sticker acompaña todos los actos de demostración y cambia de expresión en cada palabra clave.
- **Modo presentador:** el presentador no se encoge a un círculo. Su marco sale de cuadro (D2) y la demo toma la pantalla; la voz sigue.

### A4. Petición en lenguaje natural (IA / automatización)
- **Cuándo:** la locución "dicta" lo que el sistema hace ("Respóndele a Laura con la clave del Wi-Fi y agéndale la limpieza").
- **Anatomía:** tarjeta **oscura** tipo app de chat o asistente, con un campo de entrada abajo ("Pídele algo a Monark…") y un botón circular de enviar.
- **Secuencia:** el texto se **escribe en el campo** al ritmo exacto de la voz (`Typewriter` con la ventana de las palabras). El titular muestra solo las palabras clave ("Responde. Agenda. *Listo.*"). Al terminar la frase: enviar, la burbuja sube y aparecen 2–3 filas de "acciones" con ✓ en verde y en cascada de 4 f (`mensaje_enviado ✓`, `limpieza_agendada ✓`).
- **Cierre:** "*¡Listo!*" en serif con un ✓ en círculo, y el sticker pasa a `feliz-ojos-cerrados`.

### A5. Diagrama de integraciones
- **Cuándo:** "Se conecta con…", "Funciona en…".
- **Anatomía:** un nodo central (ícono de Monark en un cuadrado redondeado de 96 px) con líneas punteadas hacia los nodos de abajo (logos de Airbnb, Booking, WhatsApp y Google, en tarjetas blancas de 120 px con su nombre debajo). Abajo, una pastilla oscura con una URL o un estado en mono (`sincronizado · hace 2 s`).
- **Secuencia:** el nodo central entra con la palabra de la marca. Cada nodo hijo entra **cuando se nombra** y su línea se dibuja en 10 f. La pastilla se escribe al final.

### A6. Tarjeta-prueba (una función, un resultado)
- **Cuándo:** la frase dice qué hace una función ("Una sola bandeja para todas las OTAs").
- **Anatomía:** una tarjeta que muestra **el antes y el después en la misma tarjeta**: una petición o acción arriba y el resultado abajo, con una pastilla de estado (`Reserva confirmada`, `200 OK`, `Pagado`).
- **Secuencia:** la tarjeta entra vacía. El contenido se escribe o carga mientras se habla. El cursor hace clic en la acción, aparece un spinner (12 f) y luego el estado con ✓.

### A7. Checkout / pago
- **Cuándo:** pagos, cobros, depósitos.
- **Anatomía:** tarjeta con el ítem (miniatura en halftone, nombre y precio), el método de pago (botón oscuro), un campo de tarjeta con escritura `•••• 1881`, el subtotal y un botón principal "Pagar $X".
- **Secuencia:** se escribe el número, clic, el spinner en el botón y luego "✓ Pagado" en verde. Si hay extras, cada línea se suma y **el total corre** con `Counter`.

### A8. Medidor que se recarga
- **Cuándo:** algo que se consume y se repone solo (inventario de amenities, créditos, disponibilidad).
- **Anatomía:** un número grande "984 / 1,000", una barra de progreso de color fuerte (`coral`), un botón de acción, un toggle "Recarga automática" encendido y una pastilla de evento en mono abajo.
- **Secuencia:** clics que **bajan el número** (−250 en una pastilla roja) hasta 0. Entonces el toggle hace un pulso y el número **corre de vuelta** a 1,000. En la palabra acento ("*solo*"), aparece la pastilla `recarga_automatica ✓`.

### A9. Portal / historial
- **Cuándo:** "Tus huéspedes / propietarios ven…", reportes, historial.
- **Anatomía:** tarjeta con el plan o estado (pastilla `Activo`), un método de pago, una lista "Historial" con 3 filas (fecha, monto y pastilla `Pagado`) y un enlace rojo de acción.
- **Secuencia:** las filas entran en cascada y el cursor hace clic en una acción, que cambia de estado (`Reanudar` → `Cancelar al final del periodo`).

### A10. Globo en halftone con chips
- **Cuándo:** cobertura geográfica, impuestos, multimoneda o huéspedes internacionales. **Solo con datos reales.**
- **Anatomía:** un globo terráqueo en halftone que gira despacio (6°/s). Alrededor flotan chips con bandera, país y concepto (`🇨🇴 CO · IVA`, `🇺🇸 US · USD`). Un sello con ✓ en círculo. Debajo, una fila mono con el dato (`huéspedes de 40+ países`).
- **Secuencia:** el globo entra con escala. Los chips aparecen en cascada desde los marcadores del globo. El acento ("*resuelto.*") va en una **etiqueta negra** con serif blanca.

### A11. KPI con multitud
- **Cuándo:** crecimiento (ingresos del mes, reservas, ocupación).
- **Anatomía:** una tarjeta pequeña con el rótulo mono (`// ingresos del mes`), una cifra grande que corre, una pastilla verde `+$X` y una línea subrayada animada. Abajo, una fila de figuras de personas (pictogramas en halftone) que **se suman** una a una, y el personaje grande sonriendo detrás.
- **Secuencia:** cada vez que entra una figura, la cifra sube y suena un pop suave. El personaje termina con `guiño`.

### A12. Sello de resolución
- **Cuándo:** la palabra que cierra la enumeración ("*Resuelto.*", "*Listo.*", "*Hecho.*").
- **Anatomía:** la serif itálica blanca dentro de una **etiqueta negra** (padding 18/34, radio 10) girada −4°. Variante: una serif gigante con contorno, sobre toda la pantalla.
- **Secuencia:** golpe (`Stamp`), una sacudida de 3 f y checks con ✓ que aparecen en cascada sobre todas las tarjetas visibles. SFX de golpe sordo.

### A13. Teléfono contenedor
- **Cuándo:** "Monark lo convierte en…", "Todo en una app".
- **Anatomía:** un iPhone (marco negro, isla dinámica, radio 86) con la app de Monark. Las tarjetas sueltas del acto anterior **vuelan y se meten** dentro de la pantalla y se convierten en filas de la app.
- **Secuencia:** se escribe la URL o el nombre en la barra, aparece la pastilla `EN VIVO` y el cursor hace clic en un botón de la lista.

### A14. Bento (resumen de muchas funciones)
- **Cuándo:** la locución nombra 4–6 funciones seguidas.
- **Anatomía:** una cuadrícula de 2×3 (en 9:16) con tarjetas de radio 24 sobre `crema`, con líneas de retícula tenues. Cada tarjeta lleva su rótulo mono (`// calendario`, `// asistente ia`, `// limpieza`, `// pagos`). Una celda es `// en vivo` con el personaje o presentador.
- **Secuencia:** cada tarjeta **se activa al nombrarse**. Se ilumina el borde con el color de acento y su micro-animación corre (contador, casilla o gráfico). Cierra con el Sello.

### A15. Objeto que conecta dos escenas
- **Cuándo:** el resultado de un beat es el punto de partida del siguiente.
- **Secuencia:** conserva un objeto reconocible (la reserva, un PDF o una confirmación). El objeto ocupa el foco y activa una máscara que revela el plano siguiente. Dentro de ese plano sigue siendo legible y cambia de función.
- **Monark:** la reserva confirmada se convierte en la fila que dispara limpieza o check-in. El acento de voz aterriza en esa fila.

### A16. Una petición, una acción y una prueba
- **Cuándo:** el usuario pregunta o pide algo que el producto puede hacer.
- **Secuencia:** escribe la petición, pasa el texto a una burbuja y muestra una acción pequeña. El resultado cambia de escala y se sostiene para que se lea. Si hay dos peticiones, aparecen y se resuelven una después de la otra.
- **Monark:** un huésped pregunta por su llegada. Se escribe la respuesta y el estado cambia a «Enviado». En gráfica completa la respuesta tiene tamaño de lectura y el encabezado conserva solo la idea de la voz.

### A17. Cifra que cambia de estado
- **Cuándo:** la locución contrasta un conteo, precio o tiempo ya aprobado.
- **Secuencia:** muestra el estado inicial, destaca una posición o un dígito y actualiza el valor cuando ocurre la acción. Mantén las cifras alineadas y el estado final quieto.
- **Monark:** cada nueva propiedad entra a la cuadrícula y el total avanza una vez por tarjeta. Si es una demostración, el número describe esa escena.

## A′. Recursos aprendidos de las referencias largas

Medidos en el [análisis largo](references/ANALISIS-REFS-LARGAS.md). Son los que hacen que la pieza se sienta animada y no una sucesión de tarjetas.

### A18. Mundo del problema (diorama con cámara)
- **Cuándo:** el acto Problema, cuando la voz describe una situación que dura («llevas meses…», «cada noche…»).
- **Anatomía:** una escena en halftone gris armada como un set: una superficie (mesa o mostrador) que cruza el cuadro en y ≈ 1250, el personaje detrás, el objeto motivo a su lado y 3–5 piezas de utilería (teléfono, calendario, ventana, nota adhesiva, monitor). Todo vive en **un contenedor con cámara** (`scale` y `translate`).
- **Secuencia:** entra por **revelación**: el plano cerrado del gancho se comprime o se aleja y resulta ser un detalle de este mundo, con el personaje y el objeto en el mismo sitio de la pantalla (≈ 10 f, out-cubic). Cada frase del problema mueve la cámara dentro del mundo: **dolly-in** a la pantalla del teléfono o del monitor (≈ 10–14 f a escala 2–2,5×, ease-out) para enseñar el detalle y salida al plano general para la siguiente queja.
- **Monark:** la recepción de la cabaña: celular que vibra con mensajes de huéspedes, calendario, llave colgada, ventana. Dolly-in al chat de WhatsApp con 14 mensajes sin leer.
- **Componente:** `WorldCamera` (y `cameraAt`). Uso y lecciones en [reference.md §10](reference.md#10-cómo-usar-la-cámara-la-ruptura-y-el-presentador-integrado).

### A19. Time-lapse con utilería
- **Cuándo:** «llevas meses…», «semanas de…», «todas las noches…».
- **Secuencia:** dentro del diorama, el tiempo pasa con objetos: el calendario cambia de hoja cada 0,25 s (ENE → OCT), la ventana alterna sol y luna y **la luz de toda la escena baja y sube** (brillo 1 → 0,82 → 1) con cada noche. El spinner del monitor sigue cargando o el contador de mensajes sube. El personaje parpadea o mira el reloj. El titular se queda quieto mientras corre el tiempo.

### A20. Pila que entierra y pull-back de escala
- **Cuándo:** la enumeración de dolores («necesitas web, pasarela, cuenta, impuestos…»).
- **Secuencia:** cada sustantivo es una ventana o tarjeta que **cae y se apila delante del personaje** (spring de tarjeta, giro ±6°) y se queda. Sobre algunas golpea un sello (`EN REVISIÓN`, `SIN RESPUESTA`). Un contador de tiempo acompaña («Semana 1 → 8»). En la frase de escala («…por *una* cabaña»), **pull-back** (≈ 7–10 f, escala 1 → 0,5) mientras llueven más tarjetas desde arriba: aparece una montaña con el personaje enterrado y, en la cima, el objeto diminuto con una etiqueta mono (`1 cabaña`).
- **Regla:** es el único momento con desorden. Lo que sigue es una ruptura limpia (A21).

### A21. Ruptura desde un impacto
- **Cuándo:** el giro («O… simplemente Monark»).
- **Secuencia:**
  1. **Pausa** de ≈ 0,25 s en «O…»: todo se congela y se dibujan cuatro esquinas de visor en el cuadro.
  2. La marca (icono o mariposa) **cae desde arriba con estela** (≈ 8 f, in-quad) sobre el objeto motivo o la cima de la pila.
  3. Desde el punto de impacto, en 3 f, se abre una **telaraña de grietas** en amarillo Monark. En 6–10 f el mundo **estalla en esquirlas** que salen radiales con rotación y gravedad, y el color de fondo llena el cuadro desde ese punto. Variante orgánica: **splash** de pintura desde el objeto y **mancha** de borde irregular (con contorno de 6 px en violeta) que crece hasta cubrir el cuadro.
  4. El objeto que estaba enterrado queda como protagonista junto a la marca, y el personaje sale de los escombros.
- SFX: golpe sordo + cristal.
- **Componentes:** `Viewfinder`, `BrandDrop`, `Shatter`, `Splash`, `BlobReveal` (y `CircleReveal` para la variante circular). Orden de capas en [reference.md §10](reference.md#10-cómo-usar-la-cámara-la-ruptura-y-el-presentador-integrado).

### A22. Sticker del motivo con estado
- **Cuándo:** toda la demostración.
- **Anatomía:** círculo de Ø 180 arriba a la derecha (o abajo a la izquierda en piezas con titular largo) con el objeto motivo o el personaje en halftone. Encima, un **indicador de estado**: dial de 60 marcas que se vacía, anillo con el color de la escena o punto «en vivo».
- **Secuencia:** el estado avanza en cada beat (el dial gira 6° por beat, el anillo cambia de color en cada corte de fondo). Al final el motivo sale del sticker y **cumple su pago** en grande.

### A23. Tarjeta viva entre verbos
- **Cuándo:** 2–4 verbos seguidos sobre el mismo objeto («nómbralo, ponle precio, súbelo»).
- **Secuencia:** una sola tarjeta se queda en su sitio. **El fondo hace corte seco en cada verbo** detrás de ella y la tarjeta ejecuta ese verbo: se escribe el título, los dígitos del precio ruedan (00 → 29), se arrastra un archivo y su barra carga hasta 100 % con ✓. El titular acumula los verbos en líneas.

### A24. Objeto que se condensa en su resumen
- **Cuándo:** se termina de configurar algo y empieza su vida («¡Ya está publicada!»).
- **Secuencia:** la tarjeta grande sale hacia abajo (10 f) y en su lugar queda **su fila resumen** (miniatura, nombre, precio, pastilla de estado). Un círculo del color siguiente crece desde detrás de la tarjeta. La pastilla cambia (`Borrador` → `Publicada`) y entra un sello `● EN VIVO`.

### A25. Pastilla que vuela a la escena siguiente
- **Cuándo:** el resultado de un beat es la entrada del siguiente (enlace copiado → teléfono del huésped; reserva → calendario).
- **Secuencia:** clic en «Copiar» → «¡Copiado!». La pastilla del enlace se despega, viaja en curva (18 f) y **aterriza como la URL** del teléfono que entra desde un lado.

### A26. Cifra que reemplaza al titular
- **Cuándo:** la voz pregunta y la respuesta es un número («¿Cómo te fue esta semana?»).
- **Secuencia:** el titular sale con blur. En su lugar aparece un rótulo mono pequeño (`// esta semana`) y la cifra grande (cuerpo 150–170, `tabular-nums`) **rueda dígito por dígito como tragamonedas** (cada dígito cae y rebota, en cascada de 3 f de izquierda a derecha), sincronizada con la misma cifra pequeña dentro de la UI. Luego entra una pegatina inclinada (`+18 %`) con confeti. **Solo con cifras aprobadas.**

### A27. Chip de prueba junto a la UI
- **Cuándo:** la voz dice un tiempo, un costo o un riesgo («al segundo», «antes de enviar», «te avisa»).
- **Anatomía y secuencia:** un chip con borde negro grueso y sombra dura fuera de la UI, a su lado, a la altura del dato: cronómetro `⏱ 0:01`, lupa que pasa sobre la comisión y la amplía, o una alerta roja. Entra con spring en la palabra.

### A28. Precio aplastado y split-flap
- **Cuándo:** «sin mensualidad», «sin comisión», «gratis».
- **Secuencia:** la pastilla del precio viejo (`$39/mes`) queda en el centro. Dos bloques del color de acento llegan desde los lados (8 f, in-expo) y la **aplastan** con una sacudida. De los bloques sale un contador **split-flap** (fichas negras con dígito blanco) que pasa por valores intermedios y se asienta en `$0`. El nuevo dígito va en el color de acento.

### A29. Ráfaga de héroes con rastro
- **Cuándo:** la voz nombra 3–6 integraciones o canales seguidos.
- **Secuencia:** cada nombre ocupa el cuadro ≈ 0,6–0,8 s: ícono grande (Ø 240, radio 56) con su nombre debajo y **fondo en su color de marca**. El ícono siguiente entra pequeño y crece con un círculo de su color. **Los anteriores se apilan como rastro** en una esquina (Ø 64, en columna). Al final, todos orbitan alrededor del núcleo de Monark con pulsos de anillo (ver A5).

### A30. Bandas paralelas
- **Cuándo:** dos ejemplos que ocurren a la vez («¿Reembolsos? ¿Mensajes masivos?»).
- **Secuencia:** el sticker se encoge a un punto y sale. Dos paneles entran **desde lados opuestos** (arriba desde la izquierda y abajo desde la derecha, 6 f, out-cubic) y parten el cuadro en dos bandas horizontales. Cada banda tiene su titular y su UI, y corren en paralelo con un desfase de ≈ 0,5 s.

### A31. Metáfora física conectada a la UI
- **Cuándo:** un beneficio abstracto (seguridad, aviso, respaldo, conexión).
- **Secuencia:** un objeto físico en halftone actúa sobre la UI: una **llave entra en la cerradura y gira** (acceso), una **manguera** intenta absorber la billetera y se retira al rechazar (riesgo), un **cable se enchufa** a un dispositivo, un **sobre vuela** al teléfono. El objeto se queda conectado a la UI con una línea o cable dibujado.
- **Monark:** la llave del check-in entra en el teléfono y la reserva pasa a «Check-in listo».

### A32. Recapitulación alrededor del núcleo
- **Cuándo:** justo antes de la tarjeta final («Toda tu operación, en un solo lugar»).
- **Secuencia:** iris al núcleo (ícono de Monark al centro, con nodos de integraciones). **Los resultados de cada escena vuelven** como minitarjetas alrededor: la reserva confirmada, la cifra del mes, el mensaje respondido, la limpieza hecha. Entran en cascada de 4 f. Una pastilla con la frase acento entra sobre el núcleo y salta confeti.

### A33. Secreto con foco
- **Cuándo:** el gancho es una confidencia («Psst…», «Esto nadie te lo cuenta»).
- **Anatomía:** fondo `tinta` con un **foco de luz radial** detrás del personaje (crema al 90 % que cae a tinta en r ≈ 560). Rótulo mono `// psst` arriba y el texto escrito **como en terminal**, con bloque de caret amarillo. El personaje en primer plano parpadea y guiña.

### A34. Insignia plantada que se vuelve UI
- **Cuándo:** el corte del gancho a la primera demo.
- **Secuencia:** en el primer plano, el personaje lleva en el pecho una insignia pequeña de Monark con punto verde. En el corte, **la insignia crece desde el pecho** rodeada por un anillo amarillo y se convierte en la tarjeta o en el dashboard, que sube mientras el personaje cae fuera de cuadro (14–18 f).

### A35. Clip real como gancho (llamada, testimonio, captura)
- **Cuándo:** existe una grabación real (una llamada con el cliente, un audio, una reseña en video) donde alguien dice el resultado con sus palabras. Es la prueba más fuerte: va **antes** del presentador, como gancho.
- **Selección:** transcribe toda la grabación y elige la frase que dice el resultado y la emoción (cifra + reacción). Apunta a 8–12 s. Quita muletillas, autocorrecciones («no, mejor dicho») y pausas, pero **nunca cambies el sentido**.
- **Cortes precisos:** los tiempos por palabra de whisper.cpp fallan en audio de llamada. Corta por la **envolvente de energía** (RMS cada 20–40 ms) en los silencios entre ráfagas, transcribe **cada ráfaga suelta** para saber qué contiene y vuelve a transcribir el clip final para verificar la frase completa. Guarda los tramos en `public/clips/<clip>.segs.txt`.
- **Encuadre:** recorta solo el recuadro de quien habla (sin la cuadrícula de la llamada ni marcas de agua de terceros), lo más cerca del rostro que permita la resolución (≤ 2,5× de ampliación), dentro de una **ventana grande** (960 × 760) con borde blanco y sombra suave, y punch-in alterno de 7 % en cada corte. **Intro limpia:** fondo **blanco liso**, sin etiqueta «REC», sin rótulo «// llamada con…» y sin badges ni stickers circulares (tampoco `MotifSticker`). Se descartó en zapata-reel y otra vez en catalina-reel: la ventana y la voz ya dicen que es una llamada real, y los adornos la hacen ver como plantilla. En la intro solo van la ventana de quien habla (recortando el nombre de Meet), las barras de voz, los titulares y un objeto de UI ligado al motivo. En catalina-reel el fondo blanco se extendió a toda la pieza y el color quedó en paneles y UI.
- **Animación:** **fondo blanco liso** (preferencia del usuario para este gancho; titulares con los colores de `crema`, cifra en violeta), barras de voz en tinta y violeta que reaccionan a la envolvente del audio, titular palabra por palabra que condensa lo que dice, la cifra como tragamonedas que reemplaza al titular, pruebas que entran junto a la ventana (reseñas, chips) y el **objeto motivo plantado** en la palabra de la reacción.
- **Puente al video largo:** la ventana de la llamada es el objeto. En el último frame de la intro, el presentador aparece **en ese mismo rectángulo** (`PresenterStage` con un primer key `window` igual a la ventana) y se abre a cámara completa en ≈ 0,5 s con un `whoosh`. El motivo sigue en su sticker sin reaparecer (`at` negativo en la pieza larga).
- **Ejemplo:** `src/motion/zapata-reel/CallIntro.tsx` (11,2 s) antes del video largo.

---

## B. Transiciones

Regla general: **el cambio nace de algo que ya está en pantalla.** El corte seco queda para el fondo que cambia detrás de una UI que se queda, y para el cambio de acto en una palabra fuerte.

| Transición | Cuándo | Cómo |
|---|---|---|
| **Corte de fondo detrás de la UI** | Cada verbo de la demo | Corte seco del color en la primera sílaba. La UI y el sticker siguen exactamente en su sitio. |
| **Círculo desde un objeto** | Cambio de escena dentro de la demo | Un círculo del color siguiente crece desde detrás de la tarjeta, desde el ✓, desde un punto o desde el ícono (10–14 f, out-cubic). Lo que sigue en escena es lo que salió de ese objeto. |
| **Revelación de mundo** | Gancho → Problema | El plano cerrado se comprime o se aleja y resulta parte del diorama. El personaje y el objeto conservan su posición en pantalla. Ver A18. |
| **Dolly-in / pull-back** | Dentro del mundo del problema | Escala del contenedor 1 → 2,5 (detalle) o 1 → 0,5 (escala) en 7–14 f. Ver A18 y A20. |
| **Ruptura** | Problema → Solución | Ver A21. |
| **Condensar** | Fin de una configuración | La tarjeta se reduce a su fila resumen. Ver A24. |
| **Objeto viajero** | El resultado es la entrada del siguiente beat | Ver A25. |
| **Aplastar a línea** | Cerrar un bloque técnico (código, clave) | El bloque se aplasta en vertical hasta ser una línea de 4 px (6 f, in-cubic), la línea se encoge al centro y de ese punto nace un círculo que abre la escena siguiente. |
| **Fragmentar** | Negar algo («sin clave», «sin código») | Una línea blanca cruza el objeto y lo parte. Los fragmentos caen con rotación y gravedad. |
| **Barrido diagonal** | Cambio de contexto (de una app a otra) | Una banda del color siguiente cruza en diagonal desde una esquina (8–10 f). Puede llevar un objeto viajero. |
| **Paneles opuestos** | Entrar a dos ejemplos en paralelo | Ver A30. |
| **Iris a sticker** | El personaje pasa a acompañar | Ver A3. |
| **Zoom látigo** | Pasar de la UI a otra escala ("…y luego…") | Zoom ×6 a una palabra de la UI en 8 f, con motion blur, y corte. El acto nuevo arranca con un leve *pull-back* (escala 1,08 → 1 en 16 f). |
| **Foco / iris abierto** | Al tagline o la tarjeta final | Un círculo de halftone del color de acento crece desde la palabra acento hasta llenar la pantalla en 18 f. |
| **Contención** | Tarjetas → teléfono | Ver A13. |
| **Cambios de plano con presentador** | Ver sección D | Salida y regreso de cuadro, morph a ventana o a dividida, ventana empujada o metida en un teléfono. Nunca a un círculo pequeño. |

Conserva la salida del texto y el movimiento de objetos dentro de su plano. Nunca uses fundidos cruzados entre escenas.

## C. Tarjeta final (siempre igual en estructura)

1. Corte a `amarillo` o `cobalto`, o círculo desde el objeto motivo después de su pago.
2. **El logo de Monark tiene la «o» amarilla: sobre fondo `amarillo` desaparece.** Pon el wordmark sobre una placa blanca (radio 36, padding 26/40, sombra de tarjeta) o usa otro fondo. El wordmark entra **letra por letra** (si es imagen, se revela en barrido con máscara de izquierda a derecha en 18 f). El objeto motivo puede quedarse pequeño en una esquina.
3. El personaje se asoma por **detrás** del wordmark (solo cabeza), en duotono con el fondo, y guiña.
4. Tagline en 2 líneas, centrada: sans 44 y luego serif itálica 56 con la frase de acento.
5. Botón CTA blanco, de radio total, con flecha. El cursor llega, hace clic y aparece la onda.
6. Debajo, un campo de URL o "Link en el perfil" que se escribe.
7. Una fila mono de 3–4 beneficios separados por `·`, en 22 px al 60 % de opacidad.
8. La música sube y suena el remate. Se sostiene ≥ 2.5 s.

## D. Recursos con presentador

El presentador cumple el papel del personaje de la referencia: ancla, reacciona, se encoge y vuelve. Estos recursos evitan que la pieza se quede en «gráfica arriba, cara abajo».

### D1. UI en el aire junto a la cabeza (`full`)
- **Cuándo:** el presentador menciona algo concreto sin dejar de ser el foco («me llegó esta reserva…»).
- **Secuencia:** una tarjeta, burbuja de chat o notificación entra con spring **en el espacio libre junto a la cabeza** (del lado al que mira o señala), con una sombra que la separa del fondo. Se mueve un poco con un paralaje suave (±8 px) y ejecuta su acción. Nunca tapa la caja de la cara (`face` ± 120 px). Sale hacia el borde más cercano.

### D2. Salida y regreso de cuadro
- **Cuándo:** arranca una demo que necesita el cuadro completo, o una escena del mundo gris.
- **Secuencia:** en la palabra que abre la demo, el marco del presentador (cámara completa, ventana o dividida) **sale como un objeto**: se redondea (radio 44), gira 5° y baja fuera del cuadro con spring (≈ 0,45 s). La gráfica ya está debajo y queda a pantalla completa. La voz sigue sin corte.
- **Regreso:** el movimiento inverso (sube desde abajo y se endereza) cuando vuelve la opinión, la emoción o el CTA, directo a `full`, `window` o `split`.
- **Prohibido:** encoger al presentador a una burbuja, un sticker o una miniatura en una esquina.
- **Componente:** `PresenterStage` con keys `{shot: {mode: "hidden"}}`, `window`, `split` y `full`. El mismo componente hace D2, D3 y D4. Ver [reference.md §10](reference.md#10-cómo-usar-la-cámara-la-ruptura-y-el-presentador-integrado).

### D3. Ventana como objeto de la escena (`window`)
- **Anatomía:** el video en un rectángulo de radio 44, borde blanco de 6 px y sombra `0 40px 80px -30px rgba(0,0,0,0.45)`. Tamaño típico: 760×1000 centrado abajo, o 520×700 a un lado.
- **Secuencia:** la ventana entra inclinada (−4° → 0°) y luego se comporta como una tarjeta: **una tarjeta de UI entra y la empuja** a un lado y la encoge, se apila con otras tarjetas, o **cae dentro de la pantalla de un teléfono** como videollamada con la interfaz de Monark alrededor.

### D4. Pantalla dividida que respira y se rompe (`split`)
- **Secuencia:** la proporción no es fija. Empieza 55/45 y se ajusta a lo que necesita el beat (más gráfica cuando hay que leer, más cara cuando hay que creerle) con transiciones de 12 f. Las tarjetas de arriba **cruzan la costura** y se apoyan sobre el panel del presentador. Los objetos (un check, un billete, una llave) pueden **caer** del panel gráfico al del presentador. El panel del presentador tiene esquinas superiores redondeadas (radio 44) y un margen de 24 px a los lados para que se lea como objeto, no como corte.

### D5. Presentador recortado entre capas (`cutout`)
- **Requisito:** video con alfa preparado antes (ver SKILL.md).
- **Secuencia:** el presentador está de pie sobre el fondo del acto. El fondo corta en cada verbo detrás de él. En el problema, las tarjetas se apilan delante de su torso (A20). En la demo, la UI flota a un lado y los objetos le pasan por delante y por detrás. Funciona exactamente como el personaje de la referencia.

### D6. Reacción del presentador a la gráfica
- **Cuándo:** un resultado aparece mientras el presentador está visible.
- **Secuencia:** cuando la gráfica llega a su estado final (✓, cifra, sello), el video del presentador hace un **micro-zoom** de 1 → 1,04 en 10 f o un leve empujón en dirección contraria al impacto, como si reaccionara. Así gráfica y cámara se sienten como un mismo espacio.
