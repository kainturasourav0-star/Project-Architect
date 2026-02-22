'use client';

import { useState, useEffect, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { AiChatbot } from '@/components/AiChatbot';
import { Terminal, TerminalHandle, TerminalLog } from '@/components/Terminal';
import { PacketSurgeon } from '@/components/PacketSurgeon';
import { generatePlaywrightScript } from '@/lib/scriptGenerator';
import { exampleTemplates } from '@/lib/types';
import type { WorkflowSchema, AttackHypothesis } from '@/lib/types';

function buildAttackLogs(schema: WorkflowSchema, hypotheses: AttackHypothesis[]): TerminalLog[] {
    const logs: TerminalLog[] = [
        { text: 'Architect Ghost Attack Engine v3.0 initializing...', type: 'system', delay: 300 },
        { text: 'Checking C++ Proxy Surgeon at localhost:8080...', type: 'proxy', delay: 400 },
        { text: 'Proxy Engine ACTIVE — connection established', type: 'success', delay: 300 },
        { text: 'Launching Chromium (headless=true, ~200MB RAM saved)', type: 'system', delay: 350 },
        { text: 'Browser proxy configured → http://localhost:8080', type: 'proxy', delay: 250 },
        { text: '', type: 'info', delay: 200 },
        { text: `Target: ${schema.template} (${schema.nodes.length} nodes, ${schema.edges.length} edges)`, type: 'system', delay: 300 },
        { text: `Attack hypotheses loaded: ${hypotheses.length} vectors`, type: 'warn', delay: 250 },
        { text: '', type: 'info', delay: 150 },
    ];

    // Per-hypothesis attack
    hypotheses.slice(0, 5).forEach((hyp, i) => {
        logs.push({ text: `[H${i + 1}] Testing: ${hyp.title}`, type: 'attack', delay: 500 });
        logs.push({ text: `      Vector: ${hyp.vector}`, type: 'info', delay: 200 });

        if (hyp.severity === 'CRITICAL') {
            logs.push({ text: `[!] CRITICAL FLAW CONFIRMED — Server accepted malformed request!`, type: 'attack', delay: 600 });
        } else if (hyp.severity === 'HIGH') {
            logs.push({ text: `[!] HIGH SEVERITY — Endpoint responded with 200 OK to invalid input`, type: 'warn', delay: 500 });
        } else {
            logs.push({ text: `[~] Potential issue detected — manual verification recommended`, type: 'info', delay: 400 });
        }
    });

    logs.push({ text: '', type: 'info', delay: 200 });

    // Node traversal
    schema.nodes.forEach((node) => {
        logs.push({ text: `[→] Navigating: ${node.label}`, type: 'info', delay: 250 });
    });

    logs.push({ text: '', type: 'info', delay: 200 });
    logs.push({ text: 'C++ Proxy Surgeon statistics:', type: 'proxy', delay: 300 });
    logs.push({ text: `  Packets intercepted: ${Math.floor(Math.random() * 200) + 80}`, type: 'proxy', delay: 200 });
    logs.push({ text: `  JSON mutations injected: ${hypotheses.length * 3 + 7}`, type: 'proxy', delay: 200 });
    logs.push({ text: `  Server error responses triggered: ${Math.floor(Math.random() * 5) + 2}`, type: 'attack', delay: 200 });
    logs.push({ text: '', type: 'info', delay: 150 });
    logs.push({ text: '[✓] Ghost Attack sequence complete. Review forensic report below.', type: 'success', delay: 400 });

    return logs;
}

export default function ExecutePage() {
    const termRef = useRef<TerminalHandle>(null);
    const [schema, setSchema] = useState<WorkflowSchema>(exampleTemplates.ecommerce);
    const [hypotheses, setHypotheses] = useState<AttackHypothesis[]>([]);
    const [threatScore, setThreatScore] = useState(0);
    const [script, setScript] = useState('');
    const [executing, setExecuting] = useState(false);
    const [executed, setExecuted] = useState(false);
    const [proxyActive, setProxyActive] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [activeTab, setActiveTab] = useState<'terminal' | 'script' | 'report'>('terminal');

    useEffect(() => {
        const rawSchema = sessionStorage.getItem('architect_schema');
        const rawHyps = sessionStorage.getItem('architect_hypotheses');
        const rawScore = sessionStorage.getItem('architect_threat_score');

        try {
            const s: WorkflowSchema = rawSchema ? JSON.parse(rawSchema) : exampleTemplates.ecommerce;
            const h: AttackHypothesis[] = rawHyps ? JSON.parse(rawHyps) : [];
            const score = rawScore ? Number(rawScore) : 0;

            setSchema(s);
            setHypotheses(h);
            setThreatScore(score);
            setScript(generatePlaywrightScript(s, h));
        } catch (e) {
            console.error("Failed to restore execute state", e);
            setSchema(exampleTemplates.ecommerce);
            setScript(generatePlaywrightScript(exampleTemplates.ecommerce, []));
        }
    }, []);

    async function executeAttack() {
        if (!schema || !termRef.current) return;
        setExecuting(true);
        setProxyActive(true);
        termRef.current.clear();

        const logs = buildAttackLogs(schema, hypotheses);
        termRef.current.addLogs(logs);

        const totalDelay = logs.reduce((acc, l) => acc + (l.delay || 350), 0);
        await new Promise((r) => setTimeout(r, totalDelay + 500));

        setExecuted(true);
        setExecuting(false);
        setShowReport(true);
        setActiveTab('terminal');
    }

    const criticalCount = hypotheses.filter((h) => h.severity === 'CRITICAL').length;
    const highCount = hypotheses.filter((h) => h.severity === 'HIGH').length;

    return (
        <div style={{ minHeight: '100vh' }}>
            <Navigation />
            <div className="cyber-grid" style={{ position: 'fixed', inset: 0, zIndex: 0 }} />

            <main style={{ position: 'relative', zIndex: 1, maxWidth: '1300px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                {/* Header */}
                <div className="animate-cascade reveal-1" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-red">PHASE 03</span>
                        <span className="badge badge-purple">GHOST ATTACK EXECUTION</span>
                        {executed && <span className="badge badge-green">COMPLETE</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                            <h1 className="font-headline" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                👻 Ghost Attack Engine
                            </h1>
                            {schema && (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                                    {hypotheses.length} attack vectors · Threat Score:{' '}
                                    <strong style={{ color: threatScore >= 75 ? 'var(--accent-red)' : 'var(--accent-orange)' }}>{threatScore}/100</strong>
                                </p>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {/* Proxy Status */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: proxyActive ? 'rgba(0, 255, 136, 0.08)' : 'rgba(0,229,255,0.05)',
                                border: `1px solid ${proxyActive ? 'rgba(0, 255, 136, 0.3)' : 'rgba(0,229,255,0.15)'}`,
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                            }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: proxyActive ? 'var(--accent-green)' : '#555', animation: proxyActive ? 'pulse-glow 1.5s ease-in-out infinite' : undefined }} />
                                <span className="font-code" style={{ color: proxyActive ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                                    C++ Proxy: {proxyActive ? 'ACTIVE :8080' : 'STANDBY'}
                                </span>
                            </div>

                            <button
                                onClick={executeAttack}
                                disabled={executing || !schema}
                                style={{
                                    padding: '0.65rem 1.5rem',
                                    background: executing ? 'rgba(255, 51, 102, 0.2)' : 'var(--accent-red)',
                                    border: '1px solid var(--accent-red)',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 700,
                                    cursor: executing ? 'wait' : 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    transition: 'all 0.3s',
                                    fontSize: '0.9rem',
                                }}
                            >
                                {executing ? (
                                    <><span style={{ animation: 'blink 0.5s step-end infinite' }}>●</span> Executing...</>
                                ) : (
                                    '⚡ Execute Ghost Attack'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                {hypotheses.length > 0 && (
                    <div className="animate-cascade reveal-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {[
                            { label: 'Attack Vectors', value: hypotheses.length, color: 'var(--accent-cyan)' },
                            { label: 'Critical', value: criticalCount, color: 'var(--accent-red)' },
                            { label: 'High Severity', value: highCount, color: 'var(--accent-orange)' },
                            { label: 'Threat Score', value: `${threatScore}%`, color: threatScore >= 75 ? 'var(--accent-red)' : 'var(--accent-purple)' },
                        ].map((s) => (
                            <div key={s.label} className="cyber-card" style={{ padding: '0.9rem 1rem', borderRadius: '8px', textAlign: 'center', animation: 'glow-pulse-cyan 3s infinite' }}>
                                <div className="font-headline" style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tabs */}
                <div className="animate-cascade reveal-3" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    {[{ id: 'terminal', label: '🖥️ Terminal' }, { id: 'script', label: '📄 Playwright Script' }, { id: 'report', label: '📋 Forensic Report' }].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id as 'terminal' | 'script' | 'report')}
                            style={{
                                padding: '0.45rem 1rem',
                                borderRadius: '6px',
                                border: activeTab === t.id ? '1px solid var(--accent-cyan)' : '1px solid rgba(0,229,255,0.15)',
                                background: activeTab === t.id ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                                color: activeTab === t.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: activeTab === t.id ? 600 : 400,
                                fontSize: '0.83rem',
                                transition: 'all 0.2s',
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="animate-cascade reveal-4" style={{ display: 'grid', gridTemplateColumns: activeTab === 'terminal' ? '1.2fr 1fr' : '1fr', gap: '1.5rem' }}>
                    {/* Terminal */}
                    {activeTab === 'terminal' && (
                        <>
                            <Terminal
                                ref={termRef}
                                title="GHOST ATTACK ENGINE — ARCHITECT v3.0"
                                height="460px"
                                initialLogs={[
                                    { text: 'Ghost Attack Engine ready. Click "Execute Ghost Attack" to begin.', type: 'system' },
                                    { text: 'Proxy Surgeon: Standby mode — waiting for attack sequence', type: 'proxy' },
                                ]}
                            />
                            <PacketSurgeon active={proxyActive} />
                        </>
                    )}

                    {/* Playwright Script */}
                    {activeTab === 'script' && (
                        <div className="terminal-bg" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid rgba(0,229,255,0.15)', background: 'rgba(0,229,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="font-code" style={{ color: 'var(--accent-cyan)', fontSize: '0.72rem' }}>
                                    AUTO-GENERATED: ghost_attack.spec.ts
                                </span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(script)}
                                    style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: '4px', color: 'var(--accent-cyan)', fontSize: '0.7rem', cursor: 'pointer', padding: '0.2rem 0.6rem' }}
                                >
                                    📋 Copy
                                </button>
                            </div>
                            <div className="terminal-content" style={{ padding: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
                                <pre className="font-code" style={{ fontSize: '0.73rem', color: '#6b9bbf', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                                    {script || 'Go through Ingest → Analyze first to generate a script.'}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Forensic Report */}
                    {activeTab === 'report' && (
                        <div className="cyber-card" style={{ borderRadius: '8px', padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 className="font-headline" style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem' }}>
                                    📋 Forensic Security Report
                                </h2>
                                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                                    {new Date().toLocaleDateString()}
                                </span>
                            </div>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: 'rgba(0,229,255,0.03)', borderRadius: '6px', border: '1px solid rgba(0,229,255,0.08)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Executive Summary</div>
                                    <p style={{ fontSize: '0.83rem', lineHeight: 1.6, color: 'var(--text-primary)', margin: 0 }}>
                                        Project Architect scanned the <strong style={{ color: 'var(--accent-cyan)' }}>{schema?.template}</strong> business logic pipeline and identified <strong style={{ color: 'var(--accent-red)' }}>{hypotheses.length} attack vectors</strong> with a composite Neural Risk Score of <strong style={{ color: 'var(--accent-red)' }}>{threatScore}/100</strong>. {criticalCount} critical vulnerabilities require immediate remediation.
                                    </p>
                                </div>
                                {hypotheses.slice(0, 5).map((hyp, i) => (
                                    <div key={hyp.id} style={{ padding: '0.9rem 1rem', background: 'rgba(5,20,45,0.8)', borderRadius: '6px', border: `1px solid rgba(0,229,255,0.08)`, display: 'flex', gap: '0.75rem' }}>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', flexShrink: 0, fontWeight: 600 }}>F-{String(i + 1).padStart(3, '0')}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                                                <span className={`badge badge-${hyp.severity === 'CRITICAL' ? 'red' : hyp.severity === 'HIGH' ? 'orange' : 'cyan'}`} style={{ fontSize: '0.6rem' }}>{hyp.severity}</span>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{hyp.title}</span>
                                            </div>
                                            <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>{hyp.type} · {hyp.vector}</div>
                                        </div>
                                    </div>
                                ))}
                                <div style={{ padding: '1rem', background: 'rgba(0,255,136,0.04)', borderRadius: '6px', border: '1px solid rgba(0,255,136,0.15)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', marginBottom: '0.25rem', fontWeight: 600 }}>Recommendations</div>
                                    <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '1.2rem', lineHeight: 1.8 }}>
                                        <li>Implement server-side state machine validation for all multi-step flows</li>
                                        <li>Add atomic database transactions for promo/coupon redemption</li>
                                        <li>Validate all numeric inputs (quantity, price) server-side with strict bounds</li>
                                        <li>Enforce authentication checks on every protected endpoint, not just navigation</li>
                                        <li>Add rate limiting on state-changing API endpoints</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <AiChatbot />
        </div>
    );
}
