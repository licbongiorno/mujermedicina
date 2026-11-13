// Datos comunes de los laboratorios de exploración (ver LABORATORIOS en README.md)
import { execFileSync } from "node:child_process";

// Fecha de la última modificación real del archivo (git). Si no hay historial, usa la del archivo.
const ultimaModificacion = (data) => {
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", data.page.inputPath], { encoding: "utf8" }).trim();
    if (iso) return new Date(iso);
  } catch {}
  return data.page.date;
};

export default {
  layout: "layouts/laboratorio.njk",
  tags: ["laboratorio"],
  labAssets: true,
  breadcrumbs: [{ label: "Laboratorios", url: "/laboratorios/" }],
  permalink: (data) => `/laboratorios/${data.page.fileSlug}/`,
  waMessage: "Hola Lucía, estuve explorando los laboratorios de tu web y quisiera hacerte una consulta.",
  eleventyComputed: {
    crumbTitle: (data) => data.nombre || data.title,
    actualizado: ultimaModificacion,
    schemaExtra: (data) => ({
      "@type": "LearningResource",
      name: data.nombre || data.title,
      description: data.description,
      url: `${data.site.url}${data.page.url}`,
      inLanguage: "es",
      learningResourceType: data.tipo,
      educationalUse: "Actividad de exploración",
      isAccessibleForFree: true,
      timeRequired: data.minutos ? `PT${data.minutos}M` : undefined,
      dateModified: data.actualizado ? new Date(data.actualizado).toISOString().slice(0, 10) : undefined,
      creator: { "@id": `${data.site.url}/#lucia` },
      about: (data.fuentes || []).map((f) => ({ "@type": "CreativeWork", name: f.titulo, url: `${data.site.url}${f.url}` })),
    }),
  },
};
