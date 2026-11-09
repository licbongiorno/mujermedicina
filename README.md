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

### Formato de una propuesta

```json
{
  "slug": "nombre-en-la-url",
  "titulo": "Nombre de la propuesta",
  "categoria": "Terapias",
  "resumen": "Una o dos frases.",
  "descripcion": ["Párrafo 1", "Párrafo 2"],
  "paraQuien": "A quién está dirigida.",
  "modalidad": "Presencial / online",
  "duracion": "",
  "lugar": "",
  "acento": "jade",
  "waMensaje": "Hola, quisiera información sobre ..."
}
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
