// Configuración de Eleventy: fuentes en /src, sitio generado en /_site
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // Enlace de WhatsApp con mensaje predeterminado.
  // Si todavía no hay número cargado, devuelve la página de contacto.
  eleventyConfig.addFilter("wa", function (message, number) {
    const phone = String(number || "").replace(/\D/g, "");
    if (!phone) return "/contacto/";
    return `https://wa.me/${phone}?text=${encodeURIComponent(message || "")}`;
  });

  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).href);
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));

  // Bloque visible de "contenido pendiente": marca dónde irá el material real
  // sin inventar textos. Se oculta en producción si site.showPending = false.
  eleventyConfig.addPairedShortcode("pendiente", function (content, label) {
    return `<div class="pending" role="note"><span class="pending__label">${label || "Contenido pendiente"}</span>${content}</div>`;
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
