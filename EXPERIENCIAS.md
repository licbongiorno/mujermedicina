# Mapa de experiencias · Mujer Medicina

Cada experiencia nace de una frase o idea que **ya está** en el contenido de Lucía.
Nada agrega información nueva: dibuja lo que el texto dice.

Principios: una acción visual por bloque · máximo cuatro palabras por escena ·
los elementos permanecen y se transforman · cada escena termina en una imagen clara ·
todo funciona con toque, teclado y `prefers-reduced-motion` (versión estática completa).

Tecnología: SVG + CSS + un módulo JS liviano (`assets/js/experiencias.js`, sin dependencias)
que se carga **solo** en las páginas que tienen experiencias. Cada experiencia se activa
por `data-exp="nombre"` y se dispara al entrar en pantalla.

---

## Escritos (guías de recursos) · prioridad máxima

### Somos los cuatro elementos
| Bloque | Mensaje | Acción visual | Tipo | Interacción | Imagen final |
|---|---|---|---|---|---|
| «Somos polvo de estrellas… somos luz» | Venimos de la luz | Puntos dispersos convergen y forman un círculo luminoso | Escena al entrar | Ver | Círculo de luz · «Somos luz» |
| «Todo se vuelve dual» | Al encarnar aparece la dualidad | El círculo se abre en sol y luna | Escena al entrar | Ver | Sol y luna · «Luz y oscuridad» |
| «La chispa divina que sos… no se muere» | La esencia permanece aunque nos condicionen | Anillos grises (hábitos, mandatos) rodean una chispa que sigue latiendo | Escena al entrar | Ver | Chispa encendida entre anillos · «La chispa sigue ahí» |
| «La medicina del canto, del tambor y la sonaja» | El latido eleva la vibración y saca el polvo | Tambor interactivo: cada golpe emite ondas que barren el polvo y encienden la chispa | Ejercicio | Tocar el tambor (con sonido opcional) | Chispa limpia y brillante · «Vibración que despierta» |

### Armado de altar
| Bloque | Mensaje | Acción visual | Tipo | Interacción | Imagen final |
|---|---|---|---|---|---|
| «Los cuatro elementos» + «La ubicación será como tú lo sientas» | Armar tu propio espacio sagrado | Una tela circular; la persona coloca tierra, agua, aire y fuego y los ubica donde siente | Ejercicio | Tocar para colocar, arrastrar para mover (o flechas del teclado) | Al estar los cuatro, un mandala los une · «Tu altar está activo» |

## Landings de propuestas

| Propuesta | Mensaje | Acción visual | Tipo | Interacción | Imagen final |
|---|---|---|---|---|---|
| Transmisión de Cantos Medicina | Un elemento por encuentro, un ciclo completo | Un círculo se completa de a un cuarto, cada cuarto con el color de su elemento | Escena al entrar + selección | Tocar cada encuentro | Círculo completo · «Un círculo completo» |
| Ceremonias de temazcal | Cómo sucede la ceremonia (texto «¿Qué es el temazcal?») | Secuencia: el fuego calienta las piedras → las abuelas entran → se vierte agua → vapor y cantos | Paso a paso | Anterior / siguiente / reproducir | Domo con vapor y cantos |
| Rondas de canto medicina | Cada voz se suma a las demás | Un círculo de lugares vacíos que se completa con cada voz; al cerrarse, todas laten juntas | Ejercicio | «Sumá una voz» | Ronda completa latiendo en sincronía |
| Talleres de canto | Dos fuentes: formación musical y canto medicina | Dos corrientes que fluyen y se unen en una sola | Escena al entrar | Ver | «Dos fuentes, una voz» |
| Sahúmo Medicina | El fuego enciende, el aire lleva el humo | El humo del sahumador se inclina hacia donde se mueve el dedo o el cursor | Interacción directa | Mover / arrastrar | Humo en reposo, ascendente |
| Mandalas tejidas | Un don que se transmite hilo a hilo | El mandala se teje vuelta a vuelta a medida que se lee | Vinculada al scroll | Desplazarse | Mandala completo |
| Tameana | Las Pléyades, siete estrellas | Siete estrellas apagadas; al tocarlas se encienden y se unen en constelación | Ejercicio | Tocar cada estrella | Constelación completa · «Las Siete Hermanas» |
| Armonizaciones | Volver a la pureza del ser | Ondas agitadas que se aquietan al deslizar un control | Interacción directa | Control deslizante | Línea serena · «Hacia la calma» |
| Yoga | Posturas, respiración y atención | Un círculo que se expande y recoge al ritmo de la respiración | Práctica guiada | Comenzar / detener | Círculo en reposo |
| Clases de inglés | El aprendizaje como parte del camino | Los cuatro elementos en tarjetas que se dan vuelta: español ↔ inglés | Ejercicio | Tocar para girar | Las cuatro palabras descubiertas |

## Microinteracciones globales
- Onda de agua desde el punto donde se toca un botón (vibración, resonancia).
- Barra de progreso de lectura en landings y escritos.
- Recorrido del inicio: al llegar a «Hoy», un brote germina al final de la línea.
