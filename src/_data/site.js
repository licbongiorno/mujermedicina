// Datos globales del sitio. Todo lo que dice PENDIENTE se completa
// cuando llegue la información real (no se inventa).
export default {
  // Nombre de marca provisorio, tomado del encargo
  brand: "Mujer Medicina",
  // PENDIENTE: nombre y apellido de ella, tal como quiere presentarse
  person: "",
  // PENDIENTE: dominio definitivo (se usa en canonical, sitemap y datos estructurados)
  url: "https://mujermedicina.example",
  lang: "es-AR",
  locale: "es_AR",
  // PENDIENTE: descripción general, a partir de sus propios textos
  description: "Mujer Medicina: un espacio de bienestar, autoconocimiento y prácticas terapéuticas.",
  // PENDIENTE: número de WhatsApp en formato internacional, solo dígitos (ej.: 5491122334455)
  whatsapp: "",
  // PENDIENTE: correo, redes y zona/ciudad de atención
  email: "",
  location: "",
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
  },
  // Mensajes predeterminados de WhatsApp por sección
  waMessages: {
    general: "Hola, llegué desde tu web y me gustaría hacerte una consulta.",
    sobreMi: "Hola, leí sobre vos en tu web y me gustaría conocer más sobre tu trabajo.",
    propuestas: "Hola, me gustaría recibir información sobre tus propuestas.",
    experiencias: "Hola, me gustaría saber sobre los próximos encuentros y talleres.",
    recursos: "Hola, estuve leyendo los recursos de tu web y quisiera hacerte una consulta.",
  },
  // Mostrar los recuadros de contenido pendiente (poner en false al publicar)
  showPending: true,
  year: new Date().getFullYear(),
};
