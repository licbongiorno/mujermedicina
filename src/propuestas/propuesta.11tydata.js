// Datos calculados para cada landing de propuesta
const esCurso = (p) => /taller|ciclo|clase/i.test(`${p.formato || ""} ${p.titulo}`);

export default {
  eleventyComputed: {
    title: (data) => data.p?.seoTitle || data.p?.titulo,
    crumbTitle: (data) => data.p?.titulo,
    description: (data) => data.p?.seoDescription || data.p?.resumen,
    waMessage: (data) => (data.p ? data.p.waMensaje || `Hola Lucía, quisiera información sobre ${data.p.titulo}.` : undefined),
    faqItems: (data) => data.p?.faq,
    breadcrumbs: (data) => {
      if (!data.p) return [];
      const cat = (data.categorias || []).find((c) => c.id === data.p.categoria);
      return [
        { label: "Propuestas", url: "/propuestas/" },
        ...(cat ? [{ label: cat.nombre, url: `/propuestas/#${cat.id}` }] : []),
      ];
    },
    schemaExtra: (data) => {
      const p = data.p;
      if (!p) return undefined;
      const provider = { "@id": `${data.site.url}/#lucia` };
      const base = { name: p.titulo, description: p.seoDescription || p.resumen, url: `${data.site.url}/propuestas/${p.slug}/`, inLanguage: "es" };
      if (esCurso(p)) {
        return {
          "@type": "Course",
          ...base,
          provider,
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: /virtual/i.test(p.modalidad || "") ? "online" : "onsite",
            instructor: provider,
            ...(p.lugar && { location: { "@type": "Place", name: p.lugar, address: { "@type": "PostalAddress", addressRegion: "Córdoba", addressCountry: "AR" } } }),
          },
        };
      }
      return {
        "@type": "Service",
        ...base,
        serviceType: p.titulo,
        provider,
        areaServed: p.lugar ? { "@type": "AdministrativeArea", name: "Córdoba, Argentina" } : undefined,
      };
    },
  },
};
