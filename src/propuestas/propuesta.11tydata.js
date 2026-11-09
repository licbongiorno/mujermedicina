// Datos calculados para cada página de propuesta
export default {
  eleventyComputed: {
    title: (data) => data.p?.titulo,
    description: (data) => data.p?.resumen,
    waMessage: (data) => (data.p ? data.p.waMensaje || `Hola Lucía, quisiera información sobre ${data.p.titulo}.` : undefined),
    schemaExtra: (data) =>
      data.p && {
        "@type": "Course",
        name: data.p.titulo,
        description: data.p.resumen,
        provider: { "@id": `${data.site.url}/#lucia` },
        inLanguage: "es",
        ...(data.p.modalidad?.toLowerCase().includes("virtual") && {
          hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", instructor: { "@id": `${data.site.url}/#lucia` } },
        }),
      },
  },
};
