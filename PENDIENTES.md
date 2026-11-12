# Contenido y materiales pendientes · Mujer Medicina

Todo lo que está acá necesita información o material de Lucía. La web funciona completa sin
estos elementos: cada espacio está preparado para recibirlos sin romper el diseño.

## Fotografías

| Dónde | Qué hace falta | Cómo se carga |
|---|---|---|
| Tacu (`/tacu/`) | Fotos reales del espacio: el algarrobo, el domo del temazcal, el salón, el paisaje | `src/_data/galeria.json` → lista `tacu`. Mientras esté vacía se ven tres ilustraciones. |
| Sobre mí | Un retrato de Lucía (si quiere mostrarlo) | Hoy no hay foto a propósito: no se usan imágenes ficticias de personas reales. |
| Propuestas | Fotos de ceremonias, rondas, talleres o mandalas tejidas reales | Pueden sumarse como bloque nuevo; hoy cada propuesta tiene su ilustración propia. |
| Imagen para redes (`og.jpg`) | Opcional: una por propuesta | Hoy todas comparten la imagen del mandala. |

## Textos e información

- **Tameana**: solo se sabe que es «una terapia vibracional pleyadiana» que Lucía facilita. Faltan: en qué consiste, duración, modalidad (presencial / a distancia), para quién es.
- **Armonizaciones**: falta qué tipo de armonizaciones son, duración y modalidad.
- **Yoga**: falta estilo, días, horarios, nivel y quién da las clases.
- **Clases de inglés**: falta nivel, modalidad (individual / grupal / virtual), quién las dicta.
- **Talleres de canto, Sahúmo Medicina y Mandalas tejidas**: falta duración, cantidad de encuentros, materiales y si son presenciales o virtuales.
- **Rondas de canto**: frecuencia habitual.
- **Cantos Medicina**: en qué orden se recorren los elementos en los cuatro encuentros (la web usa fuego · agua · aire · tierra, el orden del sistema visual; confirmar o corregir en `src/_data/elementos.json`).
- **Tacu**: si se quiere, una descripción del lugar (sin dirección exacta si no se desea publicar) y cómo llegar en términos generales.
- **Testimonios**: `src/_data/testimonios.json` está vacío. Solo testimonios reales y con permiso.
- **Agenda**: `src/_data/eventos.json` está vacío. Al cargar fechas aparecen solas en el inicio y en cada propuesta, con datos estructurados de evento.
- **Facebook**: falta el enlace exacto al perfil (`src/_data/site.js`).

## Datos técnicos

- **Dominio propio**: cuando exista, cambiarlo en `src/_data/site.js` (`url`) o con la variable `SITE_URL` en Vercel.
- **Google Search Console**: verificar la propiedad y enviar `/sitemap.xml` (requiere la cuenta de Lucía).
- **Revisión de los laboratorios**: Lucía puede leerlos y decir si alguna frase, objeto del altar o explicación no la representa. Todo lo que no es textual suyo está marcado como «Contexto general» o como actividad de exploración.
