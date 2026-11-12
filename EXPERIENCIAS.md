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

---

## Laboratorios (`/laboratorios/`)

Páginas completas de exploración. Todas siguen el mismo recorrido, con índice lateral que marca
el avance: **Introducción → Objetivo → Explorar → Comprender → Cierre**, más navegación
anterior/siguiente, propuestas relacionadas y una nota de origen que distingue
*Palabras de Lucía* (textuales) de *Contexto general*.

| # | Laboratorio | Interacción | Basado en |
|---|---|---|---|
| 1 | Los cuatro elementos | Tocar uno = identidad y movimiento; dos = dónde se encuentran (vapor, humo, altar); cuatro = círculo completo. Cuestionario de 5 preguntas con fuente. | Somos los cuatro elementos, Armado de altar, Temazcal, Sahúmo |
| 2 | Armado de altar | 4 telas, los 4 elementos y 9 objetos de la lista del escrito. Arrastrar, flechas, girar, tamaño, quitar. Se guarda en el navegador, se descarga en PNG y se imprime. | Armado de altar |
| 3 | Mandalas | Generador: puntas, vueltas, trazo, forma, paleta; modo Fibonacci, centro de girasol, versión para colorear. Descarga PNG/SVG, impresión y enlace que reconstruye la mandala. | Mandalas tejidas |
| 4 | Temazcal, paso a paso | Recorrido con scroll: cada párrafo mueve la escena (domo, fuego, abuelas, agua, vapor y cantos). | Ceremonias de temazcal |
| 5 | Cuatro encuentros | Ciclo de cuatro cuartos, calendario según la frecuencia (15 días / mensual) y carpeta de lo que queda. | Transmisión de Cantos Medicina |
| 6 | Las siete estrellas | Cielo nocturno: encender las Pléyades, ver sus nombres, unirlas. | Tameana |
| 7 | Proporción áurea | Rectángulos de Fibonacci con espiral y convergencia a φ; comparador de proporciones; girasol con ángulo variable. | Criterio de diseño del sitio |

Para sumar uno: crear `src/laboratorios/<slug>.njk` con `orden`, `nombre`, `tipo`, `minutos`,
`acento`, `ilustracion`, `propuestasLab` y `fuentes`, y usar `{% labsec %}`, `{% voz %}` y
`{% contexto %}`. Aparece solo en el índice, el buscador, el sitemap, `llms.txt` y en las
propuestas que nombre. La lógica va en `src/assets/js/laboratorios.js` (`data-lab="…"`) y los
estilos en `src/assets/css/laboratorios.css`; ambos se descargan solo en esas páginas.

El índice `/laboratorios/` incluye además un catálogo filtrable de las 15 experiencias que viven
dentro de escritos y propuestas (`src/_data/experiencias.json`).
