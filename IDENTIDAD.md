# Identidad visual · Mujer Medicina

Paleta extraída por análisis de color (cuantización) de las dos imágenes entregadas:
el **logo** (mandala circular) y la **imagen de referencia** de colorimetría,
siguiendo su pedido: *blanco, celeste y verde*.

## Paleta (versión pastel)

Pedido de Lucía: **blanco, celeste y verde, en tonos medios y pastel**, como la imagen de referencia
de aguas turquesa. Se quitaron los tonos cálidos (coral y ocre); el único elemento con color cálido
es el propio logo.

| Rol | HEX |
|---|---|
| Texto principal | `#1D313B` |
| Títulos | `#284C53` |
| Botones y enlaces (contraste AA) | `#2B6F72` |
| Turquesa medio | `#5FB0B3` |
| Celeste | `#85CFD1` |
| Celeste claro | `#BAE4E3` |
| Bruma (fondos suaves) | `#E1F4F4` |
| Menta | `#7FCBA9` |
| Verde pastel | `#A6CE98` |
| Verde del botón de WhatsApp | `#3B7A5C` |
| Fondo general | `#F8FCFC` |
| Secciones destacadas y pie | degradé `#A9DCDC → #8FCFCF → #9FD6C4` |

**Los cuatro elementos** tienen cada uno un ícono animado y su color en pastel:
fuego (rojo `#F2A29B`, la llama titila), agua (azul `#9CCBEB`, la gota forma ondas),
aire (amarillo `#F3DC8E`, el viento fluye) y tierra (verde `#AFD49A`, el brote se mece).

Contrastes verificados (WCAG AA): todos los textos superan 4.5:1.

## Tipografía

- **Fraunces** (títulos): serif con eje "soft", trazos redondeados y algo de imperfección
  manual; tiene calidez sin caer en las caligrafías típicas de lo "espiritual".
- **Figtree** (texto): sans humanista, muy legible en móvil.

## Recursos gráficos y movimiento

- El mandala del logo es el único símbolo: aparece en el inicio "respirando"
  (escala lenta de 9 s) y como marca de agua en las páginas internas.
- Formas orgánicas (halos que cambian de forma lentamente, ola en el pie).
- Aparición suave del contenido al desplazarse. Todo el movimiento se desactiva
  si la persona tiene activada la opción de reducir movimiento.
- Cada propuesta puede tener su acento (`agua`, `jade`, `salvia`, `ocre`, `coral`, `noche`)
  para diferenciarse sin romper la unidad.

## Voz narrativa

Tomada de sus cuadernillos («Transmisión de Cantos Medicina» y «Conectando con los cuatro elementos»).

- **Cercana y de tú a tú.** Habla de vos (voseo) y a veces de tú; usa la primera persona del plural para caminar *con* la persona: «iremos recorriendo», «nos encontraremos».
- **Ritual y ancestral.** Vocabulario recurrente: *medicina*, *pulso*, *recordar*, *abuelos y abuelas*, *Gran Espíritu*, *Pacha*, *altar*, *ofrenda*, *honrar*, *convidar*, *chispa divina*, *somos uno*, *memoria ancestral*, *vibración*, *crecer con Amor*.
- **Inclusiva.** «preparada, o preparado», «vos misma, vos mismo», «todxs», «abuelxs».
- **Simple y profunda a la vez.** Frases breves, afirmaciones directas («Así de simple es el poder que tenemos»), preguntas que se responde sola («¿Lleva trabajo? Sí»).
- **Alentadora.** Cierra invitando a animarse: «Si yo pude, vos también», «Que sea pura medicina para el alma».

En la web se respetan sus palabras; solo se corrigió la ortografía y se ordenaron los textos para la lectura en pantalla.

## Estructura invisible: proporción áurea y Fibonacci

La geometría organiza la web sin mostrarse. Es un criterio de diseño, no una regla: cuando una
medida más simple se lee mejor, se usa la simple. Prioridad: legibilidad → usabilidad →
accesibilidad → equilibrio → coherencia → proporción.

Variables en `src/assets/css/main.css` (`:root`):

| Qué | Cómo | Variables |
|---|---|---|
| Escala de medidas | Sucesión de Fibonacci en píxeles: 2, 3, 5, 8, 13, 21, 34, 55, 89, 144 | `--f2` … `--f144` |
| Espacios | Cada nivel va de un número de Fibonacci al siguiente entre teléfono y escritorio (21→34, 34→55, 55→89, 89→144) | `--space-1` … `--space-6` |
| Tipografía | Potencias de φ sobre el tamaño base: en escritorio pasos enteros (φ, φ², φ³), en teléfono medios pasos para no agrandar de más | `--fs-lead`, `--fs-h3`, `--fs-h2`, `--fs-h1` |
| Columnas | Texto e imagen en 1,618 : 1 (inicio, propuestas, Tacu, laboratorios, módulos de Fibonacci y girasol) | `grid-template-columns: 1.618fr 1fr` |
| Radios | 21 px | `--radius` |
| Tiempo | Duraciones en décimas de Fibonacci: 0,21 · 0,34 · 0,55 · 0,89 · 1,44 · 2,33 s; órbitas de 55 s | `--dur-1` … `--dur-6`, `--dur-ciclo` |
| Distribución | Ángulo áureo (137,508°): el polvo que barre el tambor y el centro de girasol de las mandalas se reparten como semillas | `--golden-angle`, `src/_data/geo.js` |

Curvas de movimiento con nombre propio: `--ease-brote` (crecer con un pequeño impulso),
`--ease-onda` (ir y volver, como el agua), `--ease-humo` (elevarse y disiparse).

Los elementos tienen color pastel y tinta con contraste: `--el-fuego` / `--el-fuego-tinta`, etc.

### Lo que no se afirma

En el laboratorio de proporción áurea se separan tres miradas: matemática verificable,
interpretación artística y significado simbólico. No se atribuyen a φ efectos sobre la salud
ni se repiten mitos no comprobados (Partenón, cuerpo humano, pinturas «exactas»).
