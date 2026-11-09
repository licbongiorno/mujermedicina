// Datos globales del sitio.
export default {
  brand: "Mujer Medicina",
  person: "Lucía Di Mauro",
  // Nombre medicina con el que firma
  spiritName: "Mujer Medicina Estrella del Mar",
  roles: ["Mujer medicina", "Artista", "Música", "Danzante", "Tejedora"],
  // Dominio (canonical, sitemap, datos estructurados). Publicado en Vercel;
  // PENDIENTE: cambiar por el dominio propio cuando esté.
  url: (process.env.SITE_URL || "https://mujermedicina-cgke.vercel.app").replace(/\/$/, ""),
  lang: "es-AR",
  locale: "es_AR",
  description:
    "Lucía Di Mauro, mujer medicina, música y tejedora en las sierras de Córdoba. Cantos medicina, ceremonias de temazcal, talleres y armonizaciones para reconectar con la naturaleza y las memorias ancestrales.",
  tagline:
    "Reconectar con la naturaleza y las memorias ancestrales a través del sonido, la voz, los sentidos, la vibración y el ritual.",
  // WhatsApp en formato internacional, solo dígitos
  whatsapp: "5493512818170",
  phoneDisplay: "+54 9 351 281 8170",
  email: "luciadimauro481@gmail.com",
  location: "Sierras de Córdoba, Argentina",
  region: "Córdoba",
  country: "AR",
  instagram: [
    { handle: "mujer.medicina.estelar", label: "Mujer Medicina", main: true },
    { handle: "tacu_espacioholistico", label: "Tacu, espacio holístico" },
    { handle: "tacu_tiendaholistica", label: "Tacu, tienda holística" },
    { handle: "tamea.na", label: "Tameana" },
    { handle: "mandalasquetzalcoatl", label: "Mandalas Quetzalcóatl" },
  ],
  // PENDIENTE: enlace exacto al perfil de Facebook
  facebook: { name: "Lucia Dimauro", url: "" },
  // Mensajes predeterminados de WhatsApp por sección
  waMessages: {
    general: "Hola Lucía, llegué desde tu web y me gustaría hacerte una consulta.",
    sobreMi: "Hola Lucía, leí sobre tu camino en tu web y me gustaría conocer más.",
    propuestas: "Hola Lucía, me gustaría recibir información sobre tus propuestas.",
    tacu: "Hola Lucía, me gustaría saber más sobre Tacu y las actividades del espacio.",
    recursos: "Hola Lucía, estuve leyendo tus escritos en la web y quisiera hacerte una consulta.",
  },
  // Mostrar los recuadros de contenido pendiente (poner en false al publicar)
  showPending: false,
  year: new Date().getFullYear(),
};
