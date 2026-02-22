import type { WorkflowSchema, AttackHypothesis } from './types';

let hypothesisCounter = 0;

function makeId() {
    return `hyp_${++hypothesisCounter}_${Date.now()}`;
}

export function generateAttackHypotheses(schema: WorkflowSchema): AttackHypothesis[] {
    const labels = schema.nodes.map((n) => n.label.toLowerCase());
    const hypotheses: AttackHypothesis[] = [];

    // ─── Login Bypass ────────────────────────────
    const hasLogin = labels.some((l) => l.includes('login') || l.includes('sign in'));
    const hasPay = labels.some((l) => l.includes('pay') || l.includes('checkout') || l.includes('transfer'));

    if (hasLogin && hasPay) {
        hypotheses.push({
            id: makeId(),
            title: 'Authentication Bypass via Direct Endpoint Access',
            description: `Direct navigation to the "${getNodeLabel(schema, 'pay') || 'Checkout'}" endpoint without completing "${getNodeLabel(schema, 'login') || 'Login'}" step. Server may not validate session before processing payment.`,
            severity: 'CRITICAL',
            type: 'Authentication Bypass',
            targetNodes: getNodeIds(schema, ['login', 'pay', 'checkout']),
            vector: 'URL Manipulation / Session Forgery',
        });
    }

    // ─── MFA Bypass ──────────────────────────────
    const hasMFA = labels.some((l) => l.includes('mfa') || l.includes('otp') || l.includes('verify'));
    if (hasLogin && hasMFA && hasPay) {
        hypotheses.push({
            id: makeId(),
            title: 'Multi-Factor Authentication Step Skip',
            description: 'Bypass MFA/OTP verification step by replaying initial session token directly to the authenticated endpoint. Server may accept the pre-MFA token for privileged operations.',
            severity: 'CRITICAL',
            type: 'Step-Skipping Attack',
            targetNodes: getNodeIds(schema, ['mfa', 'otp', 'verify']),
            vector: 'Session Token Replay',
        });
    }

    // ─── Price / Quantity Manipulation ───────────
    const hasCart = labels.some((l) => l.includes('cart') || l.includes('quantity') || l.includes('amount'));
    const hasPrice = labels.some((l) => l.includes('price') || l.includes('amount') || l.includes('set'));
    if (hasCart || hasPrice) {
        hypotheses.push({
            id: makeId(),
            title: 'Negative Quantity / Price Injection',
            description: 'Mutate the "quantity" or "price" JSON field to a negative integer (e.g., -1) or zero via the C++ Proxy Surgeon. If server-side validation is absent, this can result in negative billing or free item acquisition.',
            severity: 'CRITICAL',
            type: 'Parameter Tampering',
            targetNodes: getNodeIds(schema, ['cart', 'quantity', 'amount', 'set']),
            vector: 'JSON Payload Mutation via Proxy Surgeon',
        });

        hypotheses.push({
            id: makeId(),
            title: 'Integer Overflow via Extreme Quantity',
            description: 'Set quantity to 2,147,483,647 (INT_MAX) to trigger integer overflow in backend calculation. Total price may wrap to zero or negative.',
            severity: 'HIGH',
            type: 'Integer Overflow',
            targetNodes: getNodeIds(schema, ['cart', 'quantity', 'set']),
            vector: 'Boundary Value Attack',
        });
    }

    // ─── Promo / Coupon Race Condition ───────────
    const hasPromo = labels.some((l) => l.includes('promo') || l.includes('coupon') || l.includes('discount') || l.includes('apply'));
    if (hasPromo && hasPay) {
        hypotheses.push({
            id: makeId(),
            title: 'Promo Code Race Condition (TOCTOU)',
            description: 'Send concurrent parallel requests to apply the same promo code multiple times simultaneously. If the server lacks atomic transactions, a single-use code may be applied multiple times before the first use is committed.',
            severity: 'HIGH',
            type: 'Race Condition',
            targetNodes: getNodeIds(schema, ['promo', 'coupon', 'apply', 'discount']),
            vector: 'Time-of-Check Time-of-Use (TOCTOU)',
        });
    }

    // ─── IDOR ────────────────────────────────────
    if (hasLogin) {
        hypotheses.push({
            id: makeId(),
            title: 'Insecure Direct Object Reference (IDOR)',
            description: 'Modify the user_id, order_id, or account_id parameter in authenticated requests to access or modify other users\' resources. Server may not verify ownership before returning data.',
            severity: 'HIGH',
            type: 'IDOR',
            targetNodes: getNodeIds(schema, ['login', 'dashboard', 'view']),
            vector: 'Parameter Enumeration',
        });
    }

    // ─── Trial Abuse ──────────────────────────────
    const hasTrial = labels.some((l) => l.includes('trial') || l.includes('free'));
    if (hasTrial) {
        hypotheses.push({
            id: makeId(),
            title: 'Unlimited Trial Extension',
            description: 'Re-register with disposable email aliases to repeatedly activate free trial. Server may not validate email uniqueness at domain level.',
            severity: 'MEDIUM',
            type: 'Business Logic Abuse',
            targetNodes: getNodeIds(schema, ['trial', 'sign up', 'register', 'free']),
            vector: 'Email Alias Enumeration',
        });
    }

    // ─── Default (always include) ─────────────────
    hypotheses.push({
        id: makeId(),
        title: 'Unvalidated State Transition',
        description: `The pipeline has ${schema.nodes.length} states and ${schema.edges.length} transitions. Missing server-side state enforcement means any non-linear navigation between states may be exploitable.`,
        severity: 'MEDIUM',
        type: 'State Machine Confusion',
        targetNodes: schema.nodes.slice(0, 3).map((n) => n.id),
        vector: 'Direct HTTP Request to Out-of-Order Endpoint',
    });

    return hypotheses;
}

function getNodeLabel(schema: WorkflowSchema, keyword: string): string | undefined {
    return schema.nodes.find((n) => n.label.toLowerCase().includes(keyword))?.label;
}

function getNodeIds(schema: WorkflowSchema, keywords: string[]): string[] {
    return schema.nodes
        .filter((n) => keywords.some((k) => n.label.toLowerCase().includes(k)))
        .map((n) => n.id);
}

export function calculateThreatScore(hypotheses: AttackHypothesis[]): number {
    let score = 0;
    for (const h of hypotheses) {
        if (h.severity === 'CRITICAL') score += 25;
        else if (h.severity === 'HIGH') score += 15;
        else if (h.severity === 'MEDIUM') score += 8;
        else score += 3;
    }
    return Math.min(100, score);
}
