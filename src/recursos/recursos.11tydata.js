export default {
  layout: "layouts/escrito.njk",
  tags: ["escrito"],
  breadcrumbs: [{ label: "Escritos", url: "/recursos/" }],
  permalink: (data) => `/recursos/${data.page.fileSlug}/`,
  waMessage: "Hola Lucía, estuve leyendo tus escritos en la web y quisiera hacerte una consulta.",
  eleventyComputed: {
    schemaExtra: (data) => ({
      "@type": "Article",
      headline: data.title,
      description: data.description,
      datePublished: new Date(data.page.date).toISOString().slice(0, 10),
      inLanguage: "es",
      author: { "@id": `${data.site.url}/#lucia` },
      mainEntityOfPage: `${data.site.url}${data.page.url}`,
    }),
  },
};
