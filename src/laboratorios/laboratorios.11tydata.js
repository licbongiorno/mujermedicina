// Datos comunes de los laboratorios de exploración (ver LABORATORIOS en README.md)
export default {
  layout: "layouts/laboratorio.njk",
  tags: ["laboratorio"],
  labAssets: true,
  breadcrumbs: [{ label: "Laboratorios", url: "/laboratorios/" }],
  permalink: (data) => `/laboratorios/${data.page.fileSlug}/`,
  waMessage: "Hola Lucía, estuve explorando los laboratorios de tu web y quisiera hacerte una consulta.",
  eleventyComputed: {
    crumbTitle: (data) => data.nombre || data.title,
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
      creator: { "@id": `${data.site.url}/#lucia` },
      about: (data.fuentes || []).map((f) => ({ "@type": "CreativeWork", name: f.titulo, url: `${data.site.url}${f.url}` })),
    }),
  },
};
