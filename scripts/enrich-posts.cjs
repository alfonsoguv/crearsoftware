#!/usr/bin/env node
/**
 * Script to enrich blog post frontmatter with:
 * - Meta descriptions in Spanish (~150-155 chars)
 * - Categories (from 5 predefined)
 * - Normalized tags
 * - Reading time (based on wordCount / 200 wpm)
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'blog-posts');

const posts = {
  "agentes-de-voz-con-ia-analisis-completo-del-panorama-2025": {
    description: "Analisis completo del panorama de agentes de voz con IA en 2025: mercado, financiacion, casos de uso y tendencias clave segun a16z.",
    category: "inteligencia-artificial",
    tags: ["agentes de voz", "inteligencia artificial", "startups IA", "atencion al cliente", "automatizacion"]
  },
  "¿como-es-el-ciclo-de-adopcion-tecnologica": {
    description: "Descubre las fases del ciclo de adopcion tecnologica: innovadores, early adopters, pragmaticos y rezagados. Claves para cruzar el abismo.",
    category: "innovacion-digital",
    tags: ["adopcion tecnologica", "innovacion", "startups", "early adopters", "estrategia empresarial"]
  },
  "como-la-ia-de-vo-revoluciona-el-marketing-ia-en-2024": {
    description: "Guia completa sobre como la IA de voz transforma el marketing digital: SEO por voz, chatbots, voice commerce y estrategias de conversion.",
    category: "inteligencia-artificial",
    tags: ["IA de voz", "marketing digital", "SEO por voz", "chatbots", "voice commerce", "automatizacion"]
  },
  "como-la-ia-de-voz-conversacional-transformara-nuestros-negocios": {
    description: "Como la IA de voz conversacional revolucionara la atencion al cliente, las ventas y la eficiencia operativa en los negocios del futuro.",
    category: "inteligencia-artificial",
    tags: ["IA conversacional", "IA de voz", "atencion al cliente", "ventas", "transformacion digital"]
  },
  "como-los-bots-de-inteligencia-artificial-estan-transformando-las-ventas-y-el-marketing-en-espana": {
    description: "Bots de IA para ventas y marketing en Espana: tendencias, herramientas como Victoria y casos de exito reales de empresas espanolas.",
    category: "tecnologia-empresarial",
    tags: ["bots IA", "ventas", "marketing", "automatizacion comercial", "CRM", "startups espanolas"]
  },
  "demostracion-de-software": {
    description: "Guia profesional para demos de software empresarial: preparacion, comunicacion con el cliente y tecnicas de cierre comercial efectivo.",
    category: "tecnologia-empresarial",
    tags: ["demo de software", "preventa", "software empresarial", "ventas B2B", "comercial"]
  },
  "guia-para-hacer-prompts-en-google-veo-2": {
    description: "Guia avanzada para crear prompts en Google Veo 2: parametros de camara, estilos visuales, tecnicas cinematograficas y ejemplos practicos.",
    category: "inteligencia-artificial",
    tags: ["Google Veo 2", "prompts", "IA generativa", "video IA", "ingenieria de prompts"]
  },
  "historia-del-crm": {
    description: "Historia completa del CRM: desde los rolodex de los 80 hasta Salesforce, la nube y el futuro con IA de voz y asistentes inteligentes.",
    category: "tecnologia-empresarial",
    tags: ["CRM", "historia tecnologica", "Salesforce", "software empresarial", "ventas", "gestion de clientes"]
  },
  "ia-de-voz-en-la-educacion-personalizacion-accesibilidad-y-nuevos-modelos-docentes": {
    description: "La IA de voz en educacion: tutoria personalizada, accesibilidad para discapacidades y nuevos roles docentes en la era digital.",
    category: "inteligencia-artificial",
    tags: ["IA en educacion", "IA de voz", "accesibilidad", "personalizacion", "EdTech", "docencia"]
  },
  "ia-en-2025-las-10-tendencias-mas-destacadas": {
    description: "Las 10 tendencias de IA mas importantes en 2025: agentes inteligentes, microempresas, IA de voz y el impacto en la sociedad y el trabajo.",
    category: "inteligencia-artificial",
    tags: ["tendencias IA", "agentes IA", "futuro del trabajo", "microempresas", "IA de voz"]
  },
  "impacto-de-la-inteligencia-artificial-en-los-roles-creativos-en-2025": {
    description: "Como la IA impacta los roles creativos en 2025: automatizacion, nuevas habilidades y la colaboracion entre humanos y maquinas en el diseno.",
    category: "inteligencia-artificial",
    tags: ["IA generativa", "creatividad", "diseno", "futuro del trabajo", "automatizacion", "colaboracion humano-IA"]
  },
  "jovenes-en-la-red-dominio-gratis": {
    description: "Programa Jovenes en Red del Gobierno de Espana: como obtener un dominio .es gratis y herramientas web para jovenes hasta 30 anos.",
    category: "innovacion-digital",
    tags: ["dominios web", "presencia digital", "emprendimiento joven", "internet", "gobierno digital"]
  },
  "la-demostracion-de-software": {
    description: "Las 10 claves para una demostracion de software exitosa: desde la toma de datos previa hasta el seguimiento comercial posterior.",
    category: "tecnologia-empresarial",
    tags: ["demo de software", "preventa", "ventas B2B", "software empresarial", "comercial"]
  },
  "la-era-de-la-inteligencia": {
    description: "Traduccion del articulo de Sam Altman sobre la Era de la Inteligencia: como la IA transformara la prosperidad y el progreso humano.",
    category: "inteligencia-artificial",
    tags: ["Sam Altman", "OpenAI", "AGI", "futuro de la IA", "deep learning", "superinteligencia"]
  },
  "la-guia-definitiva-sobre-el-protocolo-de-contexto-del-modelo-mcp": {
    description: "Guia definitiva sobre el protocolo MCP: como conectar modelos de IA con tus herramientas y aplicaciones de forma estandarizada.",
    category: "desarrollo-software",
    tags: ["MCP", "protocolo IA", "LLMs", "integracion IA", "desarrollo software", "API"]
  },
  "lecciones-historicas-de-resistencias-tecnologicas-de-la-imprenta-a-la-inteligencia-artificial": {
    description: "Lecciones historicas de resistencia al cambio tecnologico: de la imprenta a la IA. Como superar el miedo a la innovacion en tu empresa.",
    category: "innovacion-digital",
    tags: ["resistencia al cambio", "historia tecnologica", "innovacion", "transformacion digital", "etica IA"]
  },
  "lenguajes-de-programacion": {
    description: "Analisis de cuota de mercado de lenguajes de programacion por ventas de libros: Java, C#, Python, Ruby y las tendencias del momento.",
    category: "desarrollo-software",
    tags: ["lenguajes de programacion", "Java", "Python", "desarrollo software", "tendencias tech"]
  },
  "los-agentes-estan-llegando-por-que-el-invierno-de-la-ia-no-sera-tan-frio": {
    description: "Por que no habra invierno de la IA: agentes inteligentes, startups de ultima milla y el futuro de la interaccion humano-computadora.",
    category: "inteligencia-artificial",
    tags: ["agentes IA", "startups IA", "invierno IA", "futuro tecnologico", "interaccion humano-IA"]
  },
  "meta-acelera-su-estrategia-de-ia-por-voz-innovacion-llama-4-y-el-futuro-de-la-conversacion-digital": {
    description: "Meta impulsa la IA de voz con Llama 4: modelo omni conversacional, integracion en WhatsApp y gafas Ray-Ban. Asi sera el futuro digital.",
    category: "inteligencia-artificial",
    tags: ["Meta", "Llama 4", "IA de voz", "IA conversacional", "innovacion digital"]
  },
  "modelos-de-voz-a-voz-s2s-la-revolucion-en-la-ia-conversacional": {
    description: "Modelos Speech-to-Speech (S2S): como funcionan, aplicaciones en atencion al cliente, educacion y salud, y por que eliminan el texto intermedio.",
    category: "inteligencia-artificial",
    tags: ["Speech-to-Speech", "IA conversacional", "traduccion en tiempo real", "NLP", "IA de voz"]
  },
  "modelos-o3-de-openai-la-ia-que-ya-supera-a-los-mejores-programadores-y-revoluciona-el-futuro-del-tra": {
    description: "OpenAI o3: el modelo de IA que supera a los mejores programadores. Agentes inteligentes, futuro del trabajo y el impacto en la ingenieria.",
    category: "inteligencia-artificial",
    tags: ["OpenAI", "modelo o3", "programacion IA", "agentes IA", "futuro del trabajo", "AGI"]
  },
  "novedades-de-alexa-la-ia-generativa-revoluciona-asistentes-de-voz": {
    description: "Alexa con IA generativa: conversaciones naturales, acciones autonomas y modelo de suscripcion. Lo que cambiara en los asistentes de voz.",
    category: "inteligencia-artificial",
    tags: ["Alexa", "asistentes de voz", "IA generativa", "Amazon", "hogar inteligente"]
  },
  "open-ai-presenta-deep-research": {
    description: "Deep Research de OpenAI: el agente de IA que investiga la web en profundidad y genera informes completos en minutos. Como funciona y que ofrece.",
    category: "inteligencia-artificial",
    tags: ["OpenAI", "Deep Research", "agentes IA", "investigacion IA", "productividad"]
  },
  "plataformas-de-agentes-de-voz-con-ia-en-europa-especial-foco-en-espana": {
    description: "Comparativa de plataformas de agentes de voz con IA en Europa y Espana: Dialogflow, Cognigy, PolyAI, precios y casos de uso reales.",
    category: "inteligencia-artificial",
    tags: ["agentes de voz", "plataformas IA", "Europa", "Espana", "atencion al cliente", "comparativa"]
  },
  "que-es-un-bot-sdr-y-como-puede-ayudar-a-tus-ventas": {
    description: "Que es un bot SDR y como automatiza la cualificacion de leads para triplicar tus ventas. Beneficios, ejemplo practico y herramientas clave.",
    category: "tecnologia-empresarial",
    tags: ["bot SDR", "cualificacion de leads", "automatizacion de ventas", "CRM", "inteligencia artificial en ventas"]
  },
  "reflexiones-sobre-la-evolucion-de-openai-hacia-la-agi": {
    description: "Reflexiones sobre la evolucion de OpenAI hacia la AGI: lecciones de ChatGPT, gobernanza, etica y el futuro de la inteligencia artificial.",
    category: "inteligencia-artificial",
    tags: ["OpenAI", "AGI", "ChatGPT", "etica IA", "gobernanza tecnologica", "Sam Altman"]
  },
  "stargate-project-vs-proyecto-manhattan-un-salto-cuantico-en-la-inversion-tecnologica": {
    description: "Stargate Project vs Proyecto Manhattan: 500.000M en infraestructura IA. Analisis de la mayor inversion tecnologica de la historia.",
    category: "innovacion-digital",
    tags: ["Stargate Project", "inversion tecnologica", "infraestructura IA", "innovacion", "geopolitica tech"]
  },
  "tendencias-de-la-sintesis-de-voz-por-ia-para-2025": {
    description: "Tendencias de sintesis de voz IA para 2025: voice cloning, TTS emocional, aplicaciones en gaming, educacion y creacion de contenido.",
    category: "inteligencia-artificial",
    tags: ["sintesis de voz", "Text-to-Speech", "voice cloning", "IA de voz", "tendencias tech"]
  },
  "terminos-anglosajones-de-moda-sobre-rrhh": {
    description: "Glosario de terminos anglosajones de RRHH: empowerment, mentoring, profit sharing, gainsharing, feedback 360 y downshifting explicados.",
    category: "tecnologia-empresarial",
    tags: ["recursos humanos", "gestion empresarial", "empowerment", "mentoring", "feedback 360"]
  },
  "transforma-tu-marketing-con-ia-beneficios-y-aplicaciones-clave": {
    description: "Como transformar tu marketing con IA: segmentacion, automatizacion, chatbots y herramientas clave para mejorar conversion y engagement.",
    category: "inteligencia-artificial",
    tags: ["marketing IA", "automatizacion", "chatbots", "segmentacion", "conversion", "herramientas IA"]
  },
  "transformacion-digital-claves-de-una-empresa-ia-first": {
    description: "Claves para convertir tu empresa en IA-first: beneficios, stack tecnologico, caso practico de Victoria SDR y guia de implementacion.",
    category: "tecnologia-empresarial",
    tags: ["transformacion digital", "empresa IA-first", "automatizacion", "stack IA", "productividad"]
  },
  "vcena-con-desarrolladores": {
    description: "Cronica de la vCena con desarrolladores Velneo: preguntas sobre V7, mejoras solicitadas y feedback directo de la comunidad de desarrollo.",
    category: "desarrollo-software",
    tags: ["Velneo", "comunidad desarrollo", "software empresarial", "eventos tech", "feedback"]
  },
  "ventas-inteligentes-por-voz": {
    description: "Ventas inteligentes con IA de voz: como Victoria de Vidiv cualifica leads 24/7 y reduce el trabajo comercial con conversaciones naturales.",
    category: "tecnologia-empresarial",
    tags: ["ventas IA", "IA de voz", "cualificacion de leads", "SDR virtual", "automatizacion comercial"]
  }
};

// Process each file
const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));

for (const file of files) {
  const slug = file.replace('.md', '');
  const postData = posts[slug];

  if (!postData) {
    console.log(`SKIP: No data for ${slug}`);
    continue;
  }

  const filePath = path.join(BLOG_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Parse frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    console.log(`SKIP: No frontmatter in ${file}`);
    continue;
  }

  const frontmatter = fmMatch[1];
  const body = fmMatch[2];

  // Extract wordCount
  const wcMatch = frontmatter.match(/wordCount:\s*(\d+)/);
  const wordCount = wcMatch ? parseInt(wcMatch[1]) : 1000;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Build new frontmatter by replacing fields
  let newFm = frontmatter;

  // Replace description
  newFm = newFm.replace(/description:\s*".*?"/, `description: "${postData.description}"`);

  // Replace category
  newFm = newFm.replace(/category:\s*".*?"/, `category: "${postData.category}"`);

  // Replace tags
  const tagsStr = JSON.stringify(postData.tags);
  newFm = newFm.replace(/tags:\s*\[.*?\]/, `tags: ${tagsStr}`);

  // Add readingTime if not present
  if (!newFm.includes('readingTime')) {
    newFm += `\nreadingTime: ${readingTime}`;
  }

  const newContent = `---\n${newFm}\n---\n${body}`;
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`OK: ${slug} (${readingTime} min)`);
}

console.log('\nDone! All posts enriched.');
