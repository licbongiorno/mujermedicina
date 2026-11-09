// Configuración de Eleventy: fuentes en /src, sitio generado en /_site
import { HtmlBasePlugin } from "@11ty/eleventy";
import { build } from "esbuild";

export default function (eleventyConfig) {
  // Permite publicar en una subcarpeta (ej.: usuario.github.io/mujermedicina/).
  // Ajusta automáticamente todos los enlaces internos del HTML.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // Enlace de WhatsApp con mensaje predeterminado.
  // Si todavía no hay número cargado, devuelve la página de contacto.
  eleventyConfig.addFilter("wa", function (message, number) {
    const phone = String(number || "").replace(/\D/g, "");
    if (!phone) return "/contacto/";
    return `https://wa.me/${phone}?text=${encodeURIComponent(message || "")}`;
  });

  // URL absoluta respetando la subcarpeta incluida en site.url
  eleventyConfig.addFilter("absoluteUrl", (path, base) => String(base).replace(/\/$/, "") + path);
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));
  eleventyConfig.addFilter("buscarId", (list, id) => (list || []).find((x) => x.id === id));
  // Agenda: eventos futuros (opcionalmente de una propuesta), ordenados por fecha
  eleventyConfig.addFilter("proximos", (list, slug) => {
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    return (list || [])
      .filter((e) => new Date(`${e.fecha}T00:00:00`) >= hoy && (!slug || e.propuesta === slug))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  });
  eleventyConfig.addFilter("fechaEvento", (iso) => {
    const d = new Date(`${iso}T12:00:00`);
    return {
      dia: d.toLocaleDateString("es-AR", { day: "numeric" }),
      mes: d.toLocaleDateString("es-AR", { month: "short" }).replace(".", ""),
      larga: d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    };
  });
  eleventyConfig.addFilter("rest", (list) => (list || []).slice(1));
  eleventyConfig.addFilter("ig", (handle) => `https://www.instagram.com/${handle}/`);

  // Mensaje de WhatsApp de una propuesta
  eleventyConfig.addFilter("waPropuesta", (p) => p.waMensaje || `Hola Lucía, quisiera información sobre ${p.titulo}.`);

  // Categorías en el orden en que aparecen en propuestas.json
  eleventyConfig.addFilter("categorias", (list) => [...new Set(list.map((p) => p.categoria).filter(Boolean))]);

  // Buscar elementos por slug / id
  eleventyConfig.addFilter("porSlug", (list, slugs) => (slugs || []).map((s) => list.find((p) => p.slug === s)).filter(Boolean));
  eleventyConfig.addFilter("categoria", (cats, id) => cats.find((c) => c.id === id) || { id, nombre: id });
  eleventyConfig.addFilter("deCategoria", (list, id) => list.filter((p) => p.categoria === id));
  eleventyConfig.addFilter("escritosPorSlug", (coll, slugs) => (slugs || []).map((s) => coll.find((e) => e.page.fileSlug === s)).filter(Boolean));

  // Divide un título en palabras para la animación tipográfica (el texto sigue siendo legible)
  eleventyConfig.addFilter("palabras", (text) =>
    String(text || "")
      .split(/(\s+)/)
      .map((w, i) => (/^\s+$/.test(w) ? w : `<span class="w"><span style="--wi:${i}">${w}</span></span>`))
      .join("")
  );

  // Escritos (Recursos), del más reciente al más antiguo
  eleventyConfig.addCollection("escritos", (api) =>
    api.getFilteredByTag("escrito").sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addFilter("fechaLarga", (d) =>
    new Date(d).toLocaleDateString("es-AR", { month: "long", year: "numeric", timeZone: "UTC" })
  );

  // Bloque visible de "contenido pendiente": marca dónde irá el material real
  // sin inventar textos. Se oculta en producción si site.showPending = false.
  eleventyConfig.addPairedShortcode("pendiente", function (content, label) {
    return `<div class="pending" role="note"><span class="pending__label">${label || "Contenido pendiente"}</span>${content}</div>`;
  });

  // Al terminar, minifica CSS y JS del sitio generado
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    await build({
      entryPoints: [`${dir.output}/assets/css/main.css`, `${dir.output}/assets/js/main.js`],
      outdir: `${dir.output}/assets`,
      outbase: `${dir.output}/assets`,
      allowOverwrite: true,
      minify: true,
      target: ["es2020", "chrome100", "safari15", "firefox100"],
      logLevel: "warning",
    });
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    pathPrefix: process.env.PATH_PREFIX || "/",
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
