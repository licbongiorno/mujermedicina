// Datos calculados para cada página de propuesta (sin escapar HTML dos veces)
const msg = (p) => p.waMensaje || `Hola, me gustaría recibir información sobre ${p.titulo}.`;

export default {
  eleventyComputed: {
    title: (data) => data.p?.titulo,
    description: (data) => data.p?.resumen,
    waMessage: (data) => (data.p ? msg(data.p) : undefined),
    schemaExtra: (data) =>
      data.p && {
        "@type": "Service",
        name: data.p.titulo,
        description: data.p.resumen,
        ...(data.p.categoria && { serviceType: data.p.categoria }),
        provider: { "@id": `${data.site.url}/#identidad` },
      },
  },
};
