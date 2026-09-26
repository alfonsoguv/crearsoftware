/**
 * Comprobacion de salud de produccion, pensada para correr DESPUES de cada
 * despliegue y tumbar el workflow si algo critico no responde.
 *
 * Por que existe (26-sep-2026): al migrar el despliegue de
 * cloudflare/pages-action a wrangler-action, wrangler empezo a aplicar
 * wrangler.toml al proyecto y borro el binding KV de produccion. Durante seis
 * dias /api/bots y /api/subscribe devolvieron 503 y nadie se entero: el
 * contador de agentes de IA no sumo una sola peticion y el alta de newsletter
 * no pudo registrar a nadie. El HTML se servia perfecto, asi que ni el
 * despliegue ni una mirada a la web lo delataban.
 *
 * Uso: node scripts/healthcheck-prod.mjs [origen]
 * Sale con codigo 1 si falla cualquier comprobacion.
 */

const ORIGIN = process.argv[2] || process.env.HEALTHCHECK_ORIGIN || 'https://crearsoftware.com';
const UA = 'crearsoftware-healthcheck/1.0 (+https://crearsoftware.com)';

/**
 * Cada comprobacion: que pide, que espera y por que importa.
 * `check` recibe {status, text, json} y devuelve null si esta bien o el motivo
 * del fallo si no.
 */
const CHECKS = [
  {
    name: 'home',
    path: '/',
    porQue: 'la web responde',
    check: ({ status, text }) => {
      if (status !== 200) return `HTTP ${status}`;
      if (!text.includes('<title>')) return 'la respuesta no parece HTML';
      return null;
    },
  },
  {
    name: 'contador de agentes (KV)',
    path: '/api/bots?days=1',
    porQue: 'es la metrica GEO del sitio; si el binding KV se cae, deja de contar y no se nota',
    check: ({ status, json }) => {
      if (status !== 200) return `HTTP ${status}${json?.error ? ` — ${json.error}` : ''}`;
      if (!json?.ok) return `respuesta no ok: ${JSON.stringify(json).slice(0, 120)}`;
      if (typeof json.totalHits !== 'number') return 'falta totalHits';
      return null;
    },
  },
  {
    name: 'alta de newsletter (KV)',
    path: '/api/subscribe',
    // Un GET no da de alta a nadie: solo comprueba que la funcion vive y que
    // el binding esta. Un 503 aqui es el sintoma del binding perdido.
    check: ({ status, json }) => {
      if (status === 503) return `503${json?.error ? ` — ${json.error}` : ''} (binding KV perdido)`;
      if (status >= 500) return `HTTP ${status}`;
      return null;
    },
    porQue: 'si el KV no esta enlazado, las altas se pierden en silencio',
  },
  {
    name: 'sitemap',
    path: '/sitemap.xml',
    porQue: 'sin sitemap no hay indexacion',
    check: ({ status, text }) => {
      if (status !== 200) return `HTTP ${status}`;
      if (!text.includes('<urlset')) return 'no es un sitemap valido';
      return null;
    },
  },
  {
    name: 'llms.txt',
    path: '/llms.txt',
    porQue: 'palanca GEO: es como los modelos descubren la estructura del sitio',
    check: ({ status }) => (status === 200 ? null : `HTTP ${status}`),
  },
  {
    name: 'rastreadores de IA no bloqueados',
    path: '/robots.txt',
    ua: 'ChatGPT-User',
    // Contra /robots.txt a proposito: la home entra en el contador de agentes
    // y una comprobacion automatica contaminaria la metrica.
    porQue: 'un 403 a los agentes invalida toda la instrumentacion GEO',
    check: ({ status }) => (status === 200 ? null : `HTTP ${status} para ChatGPT-User`),
  },
];

async function ejecutar(c) {
  const url = `${ORIGIN}${c.path}`;
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': c.ua || UA },
      redirect: 'follow',
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* no es JSON: varias comprobaciones no lo necesitan */
    }
    return { ...c, url, fallo: c.check({ status: res.status, text, json }) };
  } catch (err) {
    return { ...c, url, fallo: `no se pudo conectar: ${err.message}` };
  }
}

const resultados = [];
for (const c of CHECKS) {
  // En serie y no en paralelo: son seis peticiones y asi el log se lee en orden.
  resultados.push(await ejecutar(c));
}

console.log(`Comprobacion de salud de ${ORIGIN}\n`);
for (const r of resultados) {
  console.log(`${r.fallo ? 'FALLA ' : 'OK    '} ${r.name}  (${r.path})`);
  if (r.fallo) console.log(`        ${r.fallo}\n        importa porque: ${r.porQue}`);
}

const fallos = resultados.filter((r) => r.fallo);
console.log(`\n${resultados.length - fallos.length}/${resultados.length} correctas`);

if (fallos.length) {
  console.error(`\n${fallos.length} comprobacion(es) fallan en produccion.`);
  process.exit(1);
}
