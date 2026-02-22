'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { AiChatbot } from '@/components/AiChatbot';
import { NeuralMap } from '@/components/NeuralMap';
import { generateAttackHypotheses, calculateThreatScore } from '@/lib/hypothesisGenerator';
import { exampleTemplates } from '@/lib/types';
import type { WorkflowSchema, AttackHypothesis } from '@/lib/types';

const SEVERITY_COLORS = {
    CRITICAL: 'var(--accent-red)',
    HIGH: 'var(--accent-orange)',
    MEDIUM: '#ffa600',
    LOW: 'var(--accent-cyan)',
};
const SEVERITY_BADGES: Record<string, string> = {
    CRITICAL: 'badge-red',
    HIGH: 'badge-orange',
    MEDIUM: 'badge-orange',
    LOW: 'badge-cyan',
};

export default function AnalyzePage() {
    const router = useRouter();
    const [schema, setSchema] = useState<WorkflowSchema>(exampleTemplates.ecommerce);
    const [hypotheses, setHypotheses] = useState<AttackHypothesis[]>([]);
    const [threatScore, setThreatScore] = useState(0);
    const [analyzing, setAnalyzing] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);
    const [selectedHyp, setSelectedHyp] = useState<string | null>(null);
    const [scanningMap, setScanningMap] = useState(false);

    useEffect(() => {
        const raw = sessionStorage.getItem('architect_schema');
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                setSchema(parsed);
            } catch (e) {
                console.error("Failed to parse schema", e);
            }
        }
    }, []);

    async function runAnalysis() {
        if (!schema) return;
        setAnalyzing(true);
        setScanningMap(true);
        await new Promise((r) => setTimeout(r, 2200));
        const hyps = generateAttackHypotheses(schema);
        const score = calculateThreatScore(hyps);
        setHypotheses(hyps);
        setThreatScore(score);
        setAnalyzed(true);
        setAnalyzing(false);
        setTimeout(() => setScanningMap(false), 1500);
    }

    function goToExecute() {
        sessionStorage.setItem('architect_hypotheses', JSON.stringify(hypotheses));
        sessionStorage.setItem('architect_threat_score', String(threatScore));
        router.push('/execute');
    }

    const selectedHypObj = hypotheses.find((h) => h.id === selectedHyp);
    const highlightedNodes = selectedHypObj?.targetNodes || [];

    const threatLevel =
        threatScore >= 75 ? 'CRITICAL' : threatScore >= 50 ? 'HIGH' : threatScore >= 25 ? 'MEDIUM' : 'LOW';
    const threatColor = SEVERITY_COLORS[threatLevel];

    return (
        <div style={{ minHeight: '100vh' }}>
            <Navigation />
            <div className="cyber-grid" style={{ position: 'fixed', inset: 0, zIndex: 0 }} />

            <main style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                {/* Header */}
                <div className="animate-cascade reveal-1" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-purple">PHASE 02</span>
                        <span className="badge badge-cyan">NEURAL ANALYSIS</span>
                        {analyzed && (
                            <span className="badge" style={{ background: `${threatColor}20`, color: threatColor, border: `1px solid ${threatColor}60` }}>
                                THREAT LEVEL: {threatLevel}
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                            <h1 className="font-headline" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                🧠 Threat Analysis Engine
                            </h1>
                            {schema && (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                                    Template: <strong style={{ color: 'var(--accent-cyan)' }}>{schema.template}</strong>
                                    {' — '}{schema.nodes.length} nodes · {schema.edges.length} transitions
                                </p>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            {!analyzed ? (
                                <button
                                    onClick={runAnalysis}
                                    disabled={analyzing || !schema}
                                    style={{
                                        padding: '0.65rem 1.5rem',
                                        background: analyzing ? 'rgba(168, 85, 247, 0.2)' : 'var(--accent-purple)',
                                        border: '1px solid var(--accent-purple)',
                                        borderRadius: '6px',
                                        color: '#fff',
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontWeight: 600,
                                        cursor: analyzing ? 'wait' : 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    {analyzing ? (
                                        <>
                                            <span style={{ animation: 'pulse-glow 1s ease-in-out infinite' }}>⚡</span> Neural Deep Scan...
                                        </>
                                    ) : '🧠 Analyze Logic'}
                                </button>
                            ) : (
                                <button
                                    onClick={goToExecute}
                                    style={{
                                        padding: '0.65rem 1.5rem',
                                        background: 'var(--accent-red)',
                                        border: '1px solid var(--accent-red)',
                                        borderRadius: '6px',
                                        color: '#fff',
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    ▶ Build Attack Scripts
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '1.5rem' }}>
                    {/* Left: Neural Map */}
                    <div className="animate-cascade reveal-2">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <h2 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Logic Flow Map
                            </h2>
                            {scanningMap && <span className="badge badge-red" style={{ animation: 'pulse-glow 1.5s ease-in-out infinite' }}>SCANNING</span>}
                        </div>
                        {schema ? (
                            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,229,255,0.1)', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
                                <NeuralMap schema={schema} highlightedIds={highlightedNodes} scanning={scanningMap} />
                            </div>
                        ) : (
                            <div className="cyber-card" style={{ height: '400px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Loading schema...</span>
                            </div>
                        )}

                        {/* Threat Score */}
                        {analyzed && (
                            <div className="cyber-card animate-cascade" style={{ borderRadius: '8px', padding: '1.25rem', marginTop: '1rem', animation: 'glow-pulse-cyan 3s infinite' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        Neural Risk Score
                                    </span>
                                    <span
                                        className="font-headline"
                                        style={{ fontSize: '2rem', fontWeight: 700, color: threatColor }}
                                    >
                                        {threatScore}<span style={{ fontSize: '1rem' }}>/100</span>
                                    </span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${threatScore}%`, background: `linear-gradient(90deg, ${threatColor}, ${threatColor}88)` }} />
                                </div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    {hypotheses.length} attack vectors identified · {hypotheses.filter(h => h.severity === 'CRITICAL').length} critical
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Hypotheses */}
                    <div className="animate-cascade reveal-3">
                        <h2 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                            Attack Hypotheses {analyzed && `(${hypotheses.length})`}
                        </h2>
                        {!analyzed ? (
                            <div className="cyber-card" style={{ borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
                                {analyzing ? (
                                    <div>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse-glow 1.5s ease-in-out infinite' }}>🧠</div>
                                        <div style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>Neural Deep Scan Active...</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                            Analyzing {schema?.nodes.length || 0} states and {schema?.edges.length || 0} transitions
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>🔍</div>
                                        <div style={{ color: 'var(--text-secondary)' }}>Click &quot;Analyze Logic&quot; to generate attack hypotheses</div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '75vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
                                {hypotheses.map((hyp) => (
                                    <div
                                        key={hyp.id}
                                        onClick={() => setSelectedHyp(selectedHyp === hyp.id ? null : hyp.id)}
                                        style={{
                                            padding: '0.9rem 1rem',
                                            borderRadius: '8px',
                                            border: `1px solid ${selectedHyp === hyp.id ? SEVERITY_COLORS[hyp.severity] : 'rgba(0,229,255,0.1)'}`,
                                            background: selectedHyp === hyp.id ? `${SEVERITY_COLORS[hyp.severity]}10` : 'rgba(5, 20, 45, 0.7)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            animation: 'slide-up 0.3s ease-out forwards',
                                        }}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = SEVERITY_COLORS[hyp.severity]; }}
                                        onMouseLeave={(e) => { if (selectedHyp !== hyp.id) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,229,255,0.1)'; }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                                            <span className={`badge ${SEVERITY_BADGES[hyp.severity]}`}>{hyp.severity}</span>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{hyp.type}</span>
                                        </div>
                                        <div style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                                            {hyp.title}
                                        </div>
                                        {selectedHyp === hyp.id && (
                                            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0,229,255,0.08)' }}>
                                                {hyp.description}
                                                <div style={{ marginTop: '0.5rem' }}>
                                                    <span className="badge badge-purple" style={{ fontSize: '0.6rem' }}>📡 {hyp.vector}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <AiChatbot />
        </div>
    );
}


