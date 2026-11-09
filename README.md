# Mujer Medicina · sitio web

Sitio estático generado con [Eleventy](https://www.11ty.dev/). Rápido, sin base de datos,
se puede publicar en cualquier hosting estático (Netlify, Cloudflare Pages, GitHub Pages).

```bash
npm install
npm run dev     # vista previa en http://localhost:8080
npm run build   # genera el sitio en /_site
```

## Dónde se edita cada cosa

| Qué | Archivo |
|---|---|
| Nombre, dominio, **WhatsApp**, correo, redes, mensajes predeterminados | `src/_data/site.js` |
| Menú | `src/_data/navigation.json` |
| **Propuestas / servicios** (generan tarjeta + página propia) | `src/_data/propuestas.json` |
| Páginas | `src/*.njk`, `src/propuestas/` |
| Estilos y paleta | `src/assets/css/main.css` (ver `IDENTIDAD.md`) |

### Agregar una propuesta nueva

Cada propuesta de `src/_data/propuestas.json` genera sola su landing en `/propuestas/<slug>/`,
su tarjeta, su entrada en el menú, en el universo del inicio, en el pie, en el formulario,
en el sitemap, en `llms.txt` y sus datos estructurados. No hace falta tocar plantillas.

```json
{
  "slug": "nombre-en-la-url",
  "titulo": "Nombre completo",
  "nombreCorto": "Nombre para menús",
  "categoria": "canto-y-ceremonia",          // id de src/_data/categorias.json
  "acento": "jade",                          // agua · jade · salvia · ocre · coral · noche
  "ilustracion": "cantos",                   // archivo de src/_includes/ilustraciones/
  "kicker": "Taller · En Tacu",
  "seoTitle": "Título para Google",
  "seoDescription": "Descripción para Google (hasta ~160 caracteres)",
  "resumen": "Una o dos frases para tarjetas.",
  "lead": "Frase del encabezado.",
  "formato": "", "modalidad": "", "lugar": "", "duracion": "", "frecuencia": "",
  "cita": { "texto": "" },
  "intro": ["Párrafo", "Párrafo"],
  "bloques": [
    { "tipo": "texto", "titulo": "", "parrafos": [""], "contexto": false },
    { "tipo": "lista", "titulo": "", "items": [""] },
    { "tipo": "pilares", "titulo": "", "items": [{ "titulo": "", "texto": "" }] },
    { "tipo": "pasos", "titulo": "", "items": [""] },
    { "tipo": "cita", "texto": "", "fuente": "", "enlace": "" },
    { "tipo": "elementos" }
  ],
  "faq": [{ "q": "Pregunta", "a": "Respuesta" }],
  "relacionadas": ["otro-slug"],
  "escritos": ["slug-de-escrito"],
  "instagram": "usuario",
  "waMensaje": "Mensaje predeterminado de WhatsApp"
}
```

Los bloques con `"contexto": true` explican la práctica en general (no son afirmaciones sobre Lucía).

### Agenda de próximas fechas

`src/_data/eventos.json`. Cada fecha aparece en la landing de su propuesta y en el inicio,
con botón «Reservar» por WhatsApp y datos estructurados de evento para Google.
Si no hay fechas, la sección no se muestra; las fechas pasadas se ocultan solas.

```json
[{ "propuesta": "ceremonias-de-temazcal", "fecha": "2026-12-12", "hora": "17:00", "titulo": "", "lugar": "", "modalidad": "", "nota": "" }]
```

### Testimonios

`src/_data/testimonios.json`. Se muestran en el inicio y en la landing de la propuesta indicada.
Usar solo testimonios reales y con permiso de la persona.

```json
[{ "texto": "…", "nombre": "Nombre", "lugar": "Córdoba", "propuesta": "transmision-de-cantos-medicina" }]
```

## Contenido pendiente

Los recuadros punteados marcan dónde va el contenido real (no se inventan textos).
Al publicar, poner `showPending: false` en `src/_data/site.js`.

## SEO / GEO incluido

Títulos y descripciones por página, canonical, Open Graph, JSON-LD (WebSite, Persona/Organización,
Service por propuesta), `sitemap.xml`, `robots.txt`, `llms.txt` (resumen para asistentes de IA),
URLs amigables, imágenes WebP con dimensiones, accesibilidad (saltar al contenido, foco visible,
contraste AA, menú accesible por teclado).

## Publicación (Vercel)

El sitio está conectado a Vercel: cada cambio en la rama `main` de GitHub se publica solo.
Vercel instala, construye (`npm run build`) y publica la carpeta `_site` según `vercel.json`.

Importante: no subir archivos sueltos con "Add files via upload". La estructura de carpetas
(`src/assets/css/`, `src/_includes/`, etc.) es necesaria para que el sitio funcione.
