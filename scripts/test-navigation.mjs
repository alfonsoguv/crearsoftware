import { chromium, request as playwrightRequest } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:8789';
const results = { pass: 0, fail: 0, errors: [] };

function log(status, message) {
  const icon = status === 'PASS' ? '✓' : '✗';
  console.log(`  ${icon} ${message}`);
  if (status === 'PASS') {
    results.pass += 1;
    return;
  }
  results.fail += 1;
  results.errors.push(message);
}

function matchesStatus(actual, expected) {
  if (Array.isArray(expected)) return expected.includes(actual);
  return actual === expected;
}

async function testPage(page, url, checks = {}) {
  try {
    const response = await page.goto(url, {
      waitUntil: checks.waitUntil || 'domcontentloaded',
      timeout: checks.timeout || 10000,
    });
    const expectedStatus = checks.expectedStatus ?? 200;
    const actualStatus = response?.status() ?? 0;

    if (!matchesStatus(actualStatus, expectedStatus)) {
      log('FAIL', `${url} -> HTTP ${actualStatus} (esperado ${expectedStatus})`);
      return false;
    }

    if (checks.title) {
      const title = await page.title();
      if (!title || title.includes('{{')) {
        log('FAIL', `${url} -> titulo invalido: "${title}"`);
        return false;
      }
    }

    if (checks.hasContent) {
      const selector = checks.contentSelector || 'main';
      const text = await page.textContent(selector).catch(() => '');
      if (!text || text.trim().length < (checks.minLength || 50)) {
        log('FAIL', `${url} -> contenido insuficiente en ${selector}`);
        return false;
      }
    }

    if (checks.noPlaceholders) {
      const html = await page.content();
      if (html.includes('{{') && html.includes('}}')) {
        const match = html.match(/\{\{([^}]+)\}\}/);
        log('FAIL', `${url} -> placeholder sin resolver: {{${match?.[1] || 'desconocido'}}}`);
        return false;
      }
    }

    if (checks.bodyIncludes) {
      const html = await page.content();
      const required = Array.isArray(checks.bodyIncludes) ? checks.bodyIncludes : [checks.bodyIncludes];
      for (const snippet of required) {
        if (!html.includes(snippet)) {
          log('FAIL', `${url} -> no contiene "${snippet}"`);
          return false;
        }
      }
    }

    if (checks.bodyExcludes) {
      const html = await page.content();
      const forbidden = Array.isArray(checks.bodyExcludes) ? checks.bodyExcludes : [checks.bodyExcludes];
      for (const snippet of forbidden) {
        if (html.includes(snippet)) {
          log('FAIL', `${url} -> contiene texto prohibido "${snippet}"`);
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    log('FAIL', `${url} -> ${error.message}`);
    return false;
  }
}

async function testResponse(api, path, options = {}) {
  const response = await api.fetch(`${BASE}${path}`, {
    method: options.method || 'GET',
    headers: options.headers,
    data: options.data,
    maxRedirects: 0,
  });

  const actualStatus = response.status();
  const expectedStatus = options.expectedStatus ?? 200;
  if (!matchesStatus(actualStatus, expectedStatus)) {
    log('FAIL', `${path} -> HTTP ${actualStatus} (esperado ${expectedStatus})`);
    return null;
  }

  const contentType = response.headers()['content-type'] || '';
  if (options.contentTypeIncludes && !contentType.includes(options.contentTypeIncludes)) {
    log('FAIL', `${path} -> content-type "${contentType}" no incluye "${options.contentTypeIncludes}"`);
    return null;
  }

  const body = await response.text();
  if (options.bodyIncludes) {
    const required = Array.isArray(options.bodyIncludes) ? options.bodyIncludes : [options.bodyIncludes];
    for (const snippet of required) {
      if (!body.includes(snippet)) {
        log('FAIL', `${path} -> body no contiene "${snippet}"`);
        return null;
      }
    }
  }

  if (options.bodyExcludes) {
    const forbidden = Array.isArray(options.bodyExcludes) ? options.bodyExcludes : [options.bodyExcludes];
    for (const snippet of forbidden) {
      if (body.includes(snippet)) {
        log('FAIL', `${path} -> body contiene texto prohibido "${snippet}"`);
        return null;
      }
    }
  }

  return { response, body, contentType };
}

async function testNewsletterUi(page) {
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await page.fill('#newsletter-email', `qa+${Date.now()}@example.com`);
  await page.click('.newsletter-form button[type="submit"]');

  const status = page.locator('.newsletter-status');
  await status.waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForFunction(() => {
    const element = document.querySelector('.newsletter-status');
    return Boolean(element && element.textContent && element.textContent.trim().length > 0);
  }, { timeout: 10000 });

  const message = ((await status.textContent()) || '').trim();
  const acceptedMessages = [
    'Suscripcion recibida. Gracias por apuntarte.',
    'La suscripcion todavia no esta disponible. Estamos terminando la configuracion.',
    'No hemos podido procesar la suscripcion. Revisa el correo e intentalo de nuevo.',
  ];
  const normalized = message
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

  if (!acceptedMessages.includes(normalized)) {
    log('FAIL', `Newsletter UI -> mensaje inesperado: "${message}"`);
    return false;
  }

  log('PASS', `Newsletter UI -> ${message}`);
  return true;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const api = await playwrightRequest.newContext({ baseURL: BASE });

  console.log('\n=== TEST 1: Paginas principales ===');
  for (const url of ['/', '/blog/', '/autor/alfonso-gutierrez/']) {
    const ok = await testPage(page, `${BASE}${url}`, { title: true, hasContent: true, noPlaceholders: true });
    if (ok) log('PASS', `${url} carga correctamente`);
  }

  console.log('\n=== TEST 2: Entradas desde el indice ===');
  await page.goto(`${BASE}/blog/`, { waitUntil: 'domcontentloaded' });
  const postLinks = await page.$$eval('a[href]', (anchors) => {
    return anchors
      .map((anchor) => anchor.getAttribute('href'))
      .filter((href) => href && (href.match(/\/\d{4}\/\d{2}\/\d{2}\//) || href.startsWith('/blog/')) && href !== '/blog/')
      .slice(0, 20);
  });
  console.log(`  Encontrados ${postLinks.length} enlaces de posts`);

  for (const link of postLinks) {
    const ok = await testPage(page, `${BASE}${link}`, { title: true, hasContent: true, noPlaceholders: true });
    if (ok) log('PASS', `${link} -> OK`);
  }

  console.log('\n=== TEST 3: Categorias y guias ===');
  const categories = [
    'inteligencia-artificial',
    'desarrollo-software',
    'tecnologia-empresarial',
    'innovacion-digital',
    'productividad-herramientas',
  ];
  for (const category of categories) {
    const ok = await testPage(page, `${BASE}/categoria/${category}/`, { title: true, hasContent: true, noPlaceholders: true });
    if (ok) log('PASS', `/categoria/${category}/ -> OK`);
  }

  const guides = [
    'guia-agentes-ia-empresas',
    'guia-desarrollo-software-moderno',
    'guia-transformacion-digital-pymes',
    'guia-herramientas-productividad-2026',
    'guia-ia-generativa-creacion-contenido',
  ];
  for (const guide of guides) {
    const ok = await testPage(page, `${BASE}/guia/${guide}/`, { title: true, hasContent: true, noPlaceholders: true });
    if (ok) log('PASS', `/guia/${guide}/ -> OK`);
  }

  console.log('\n=== TEST 4: Navegacion principal ===');
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const blogNav = page.locator('a[href="/blog/"]').first();
  if (await blogNav.count()) {
    await blogNav.click();
    await page.waitForLoadState('domcontentloaded');
    if (page.url().includes('/blog/')) log('PASS', 'Navegacion -> Blog');
    else log('FAIL', `Navegacion -> Blog llevo a ${page.url()}`);
  } else {
    log('FAIL', 'Navegacion -> enlace a /blog/ no encontrado');
  }

  console.log('\n=== TEST 5: Muestra de posts historicos ===');
  const oldPosts = [
    '/2007/03/16/realidad-espanola-en-uso-de-las-tic/',
    '/2008/04/12/lenguajes-de-programacion/',
    '/2009/02/02/la-demostracion-de-software/',
    '/2012/01/25/demostracion-de-software/',
    '/2015/05/18/historia-del-crm/',
  ];
  for (const post of oldPosts) {
    const ok = await testPage(page, `${BASE}${post}`, { title: true, hasContent: true, noPlaceholders: true });
    if (ok) log('PASS', `${post} -> OK`);
  }

  console.log('\n=== TEST 6: Sitemap y assets criticos ===');
  if (await testResponse(api, '/sitemap.xml', { expectedStatus: 200, contentTypeIncludes: 'xml' })) {
    log('PASS', '/sitemap.xml -> OK');
  }

  const assetChecks = [
    ['/css/variables.css', 200, 'text/css'],
    ['/css/fonts.css', 200, 'text/css'],
    ['/wp-content/uploads/2015/04/persist1.jpg', 200, 'image/jpeg'],
    ['/wp-content/uploads/2007/04/linux071.pdf', 200, 'application/pdf'],
    ['/files/2007/04/indicadores.thumbnail.png', 200, 'image/png'],
  ];
  for (const [assetPath, status, contentType] of assetChecks) {
    if (await testResponse(api, assetPath, { expectedStatus: status, contentTypeIncludes: contentType })) {
      log('PASS', `${assetPath} -> ${contentType}`);
    }
  }

  console.log('\n=== TEST 7: 404 real para paginas y assets ===');
  if (await testPage(page, `${BASE}/esta-ruta-no-existe/`, {
    expectedStatus: 404,
    hasContent: true,
    bodyIncludes: 'No encontramos esa pagina.',
    bodyExcludes: 'Construyendo software con propósito desde 2007',
  })) {
    log('PASS', 'Pagina inexistente -> 404 con plantilla propia');
  }

  if (await testResponse(api, '/does-not-exist.png', {
    expectedStatus: 404,
    bodyIncludes: 'No encontramos esa pagina.',
  })) {
    log('PASS', 'Asset inexistente -> 404');
  }

  // Regresión de la Issue #33: el endpoint de ingesta de eventos se retiró
  // porque aceptaba escrituras anónimas en KV y agotaba el cupo compartido con
  // el alta de newsletter. Si algún día vuelve a responder, hay que enterarse.
  if (await testResponse(api, '/api/event', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data: { type: 'pageview', path: '/blog/' },
    expectedStatus: [404, 405],
  })) {
    log('PASS', '/api/event retirado (Issue #33)');
  }

  // Solo se admiten 7, 28 y 90: con un rango continuo, variar la query esquivaba
  // la caché y forzaba un recorrido completo de KV en cada petición.
  const botsDays = await testResponse(api, '/api/bots?days=14', {
    expectedStatus: [200, 503],
  });
  if (botsDays) {
    let body = null;
    try { body = JSON.parse(botsDays.body); } catch { /* respuesta no JSON */ }
    if (!body || body.ok === false || body.days === 28) {
      log('PASS', '/api/bots?days=14 -> ventana normalizada a 28');
    } else {
      log('FAIL', `/api/bots?days=14 -> devolvio days=${body.days}, esperaba 28`);
    }
  }

  console.log('\n=== TEST 8: Newsletter ===');
  const subscribe = await testResponse(api, '/api/subscribe', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      origin: BASE,
    },
    data: {
      email: `qa+${Date.now()}@example.com`,
      source: 'navigation-test',
      utm: { utm_source: 'qa', utm_medium: 'script' },
    },
    expectedStatus: [200, 201, 202, 429, 503],
    contentTypeIncludes: 'application/json',
    bodyExcludes: 'Internal Server Error',
  });
  if (subscribe) log('PASS', `/api/subscribe -> ${subscribe.response.status()}`);

  await testNewsletterUi(page);

  await api.dispose();
  await browser.close();

  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTADOS: ${results.pass} correctos, ${results.fail} fallos`);
  if (results.errors.length > 0) {
    console.log('\nFALLOS:');
    for (const error of results.errors) console.log(`  ✗ ${error}`);
  }
  console.log();

  process.exit(results.fail > 0 ? 1 : 0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
