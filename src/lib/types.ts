// ─── Types ────────────────────────────────────────────────────────────────────
export interface FlowNode {
    id: string;
    label: string;
    type: 'start' | 'action' | 'decision' | 'end';
    x: number;
    y: number;
}

export interface FlowEdge {
    id: string;
    from: string;
    to: string;
    label?: string;
}

export interface WorkflowSchema {
    project: string;
    template: string;
    nodes: FlowNode[];
    edges: FlowEdge[];
}

export interface AttackHypothesis {
    id: string;
    title: string;
    description: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    type: string;
    targetNodes: string[];
    vector: string;
}

// ─── Templates ────────────────────────────────────────────────────────────────
export const exampleTemplates: Record<string, WorkflowSchema> = {
    ecommerce: {
        project: 'Architect_Auto_Hacker',
        template: 'Standard E-Commerce',
        nodes: [
            { id: 'n1', label: 'Browse Products', type: 'start', x: 200, y: 80 },
            { id: 'n2', label: 'Add to Cart', type: 'action', x: 200, y: 180 },
            { id: 'n3', label: 'Apply Promo', type: 'action', x: 400, y: 180 },
            { id: 'n4', label: 'Login / Register', type: 'action', x: 200, y: 280 },
            { id: 'n5', label: 'Set Quantity', type: 'action', x: 200, y: 380 },
            { id: 'n6', label: 'Checkout', type: 'action', x: 200, y: 480 },
            { id: 'n7', label: 'Payment', type: 'action', x: 200, y: 580 },
            { id: 'n8', label: 'Confirmation', type: 'end', x: 200, y: 680 },
        ],
        edges: [
            { id: 'e1', from: 'n1', to: 'n2' },
            { id: 'e2', from: 'n2', to: 'n3' },
            { id: 'e3', from: 'n2', to: 'n4' },
            { id: 'e4', from: 'n3', to: 'n4' },
            { id: 'e5', from: 'n4', to: 'n5' },
            { id: 'e6', from: 'n5', to: 'n6' },
            { id: 'e7', from: 'n6', to: 'n7' },
            { id: 'e8', from: 'n7', to: 'n8' },
        ],
    },
    banking: {
        project: 'Architect_Auto_Hacker',
        template: 'Banking Transfer',
        nodes: [
            { id: 'n1', label: 'Login', type: 'start', x: 200, y: 80 },
            { id: 'n2', label: 'MFA Verify', type: 'decision', x: 200, y: 180 },
            { id: 'n3', label: 'View Balance', type: 'action', x: 200, y: 280 },
            { id: 'n4', label: 'Initiate Transfer', type: 'action', x: 200, y: 380 },
            { id: 'n5', label: 'Set Amount', type: 'action', x: 200, y: 480 },
            { id: 'n6', label: 'Confirm OTP', type: 'decision', x: 200, y: 580 },
            { id: 'n7', label: 'Transfer Complete', type: 'end', x: 200, y: 680 },
        ],
        edges: [
            { id: 'e1', from: 'n1', to: 'n2' },
            { id: 'e2', from: 'n2', to: 'n3', label: 'Verified' },
            { id: 'e3', from: 'n3', to: 'n4' },
            { id: 'e4', from: 'n4', to: 'n5' },
            { id: 'e5', from: 'n5', to: 'n6' },
            { id: 'e6', from: 'n6', to: 'n7', label: 'Approved' },
        ],
    },
    saas: {
        project: 'Architect_Auto_Hacker',
        template: 'SaaS Subscription',
        nodes: [
            { id: 'n1', label: 'Sign Up', type: 'start', x: 200, y: 80 },
            { id: 'n2', label: 'Email Verify', type: 'action', x: 200, y: 180 },
            { id: 'n3', label: 'Choose Plan', type: 'decision', x: 200, y: 280 },
            { id: 'n4', label: 'Trial Access', type: 'action', x: 400, y: 380 },
            { id: 'n5', label: 'Enter Credit Card', type: 'action', x: 200, y: 380 },
            { id: 'n6', label: 'Subscribe', type: 'action', x: 200, y: 480 },
            { id: 'n7', label: 'Dashboard', type: 'end', x: 200, y: 580 },
        ],
        edges: [
            { id: 'e1', from: 'n1', to: 'n2' },
            { id: 'e2', from: 'n2', to: 'n3' },
            { id: 'e3', from: 'n3', to: 'n4', label: 'Free' },
            { id: 'e4', from: 'n3', to: 'n5', label: 'Paid' },
            { id: 'e5', from: 'n4', to: 'n7' },
            { id: 'e6', from: 'n5', to: 'n6' },
            { id: 'e7', from: 'n6', to: 'n7' },
        ],
    },
};
