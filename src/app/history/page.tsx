'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { AiChatbot } from '@/components/AiChatbot';
import type { WorkflowSchema, AttackHypothesis } from '@/lib/types';

interface ScanRecord {
    id: string;
    timestamp: string;
    template: string;
    nodeCount: number;
    edgeCount: number;
    threatScore: number;
    hypothesisCount: number;
    criticalCount: number;
    status: 'complete' | 'partial';
    schema: WorkflowSchema;
    hypotheses: AttackHypothesis[];
}

const SEVERITY_COLOR: Record<number, string> = {};

function generateMockHistory(): ScanRecord[] {
    return [
        {
            id: 'scan_001',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            template: 'Standard E-Commerce',
            nodeCount: 8,
            edgeCount: 8,
            threatScore: 87,
            hypothesisCount: 6,
            criticalCount: 2,
            status: 'complete',
            schema: { project: 'Architect', template: 'Standard E-Commerce', nodes: [], edges: [] },
            hypotheses: [],
        },
        {
            id: 'scan_002',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
            template: 'Banking Transfer',
            nodeCount: 7,
            edgeCount: 6,
            threatScore: 72,
            hypothesisCount: 5,
            criticalCount: 2,
            status: 'complete',
            schema: { project: 'Architect', template: 'Banking Transfer', nodes: [], edges: [] },
            hypotheses: [],
        },
        {
            id: 'scan_003',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            template: 'SaaS Subscription',
            nodeCount: 7,
            edgeCount: 7,
            threatScore: 45,
            hypothesisCount: 4,
            criticalCount: 0,
            status: 'complete',
            schema: { project: 'Architect', template: 'SaaS Subscription', nodes: [], edges: [] },
            hypotheses: [],
        },
    ];
}

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    return `${m}m ago`;
}

export default function HistoryPage() {
    const router = useRouter();
    const [records, setRecords] = useState<ScanRecord[]>(() => {
        if (typeof window !== 'undefined') {
            const raw = localStorage.getItem('architect_history');
            if (raw) return JSON.parse(raw);
            const mock = generateMockHistory();
            localStorage.setItem('architect_history', JSON.stringify(mock));
            return mock;
        }
        return [];
    });
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'time' | 'score' | 'critical'>('time');
    const [selected, setSelected] = useState<string | null>(null);

    // Lazy initialization handled above

    function clearHistory() {
        if (confirm('Clear all scan history?')) {
            localStorage.removeItem('architect_history');
            setRecords([]);
        }
    }

    function restoreScan(record: ScanRecord) {
        sessionStorage.setItem('architect_schema', JSON.stringify(record.schema));
        sessionStorage.setItem('architect_hypotheses', JSON.stringify(record.hypotheses));
        sessionStorage.setItem('architect_threat_score', String(record.threatScore));
        router.push('/execute');
    }

    const filtered = records
        .filter((r) => r.template.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'score') return b.threatScore - a.threatScore;
            if (sortBy === 'critical') return b.criticalCount - a.criticalCount;
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });

    const totalScans = records.length;
    const avgScore = records.length ? Math.round(records.reduce((s, r) => s + r.threatScore, 0) / records.length) : 0;
    const totalCritical = records.reduce((s, r) => s + r.criticalCount, 0);

    return (
        <div style={{ minHeight: '100vh' }}>
            <Navigation />
            <div className="cyber-grid" style={{ position: 'fixed', inset: 0, zIndex: 0 }} />
            <main style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

                {/* Header */}
                <div className="animate-cascade reveal-1" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-purple">SCAN HISTORY</span>
                        <span className="badge badge-cyan">{totalScans} RECORDS</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 className="font-headline" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                📂 Scan History
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.85rem' }}>
                                All past pipeline runs stored locally. Click a record to restore and re-execute.
                            </p>
                        </div>
                        <button onClick={clearHistory} className="btn-cyber btn-danger" style={{ fontSize: '0.82rem' }}>
                            <span>🗑 Clear All</span>
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="animate-cascade reveal-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                        { label: 'Total Scans', value: totalScans, color: 'var(--accent-cyan)', icon: '📊' },
                        { label: 'Avg Threat Score', value: `${avgScore}/100`, color: avgScore >= 70 ? 'var(--accent-red)' : 'var(--accent-orange)', icon: '🎯' },
                        { label: 'Total Criticals Found', value: totalCritical, color: 'var(--accent-red)', icon: '💀' },
                    ].map((s) => (
                        <div key={s.label} className="cyber-card" style={{ padding: '1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', animation: 'glow-pulse-cyan 3s infinite' }}>
                            <span style={{ fontSize: '2rem' }}>{s.icon}</span>
                            <div>
                                <div className="font-headline" style={{ fontSize: '1.8rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search + Sort */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="🔍  Search templates..."
                        className="cyber-input"
                        style={{ maxWidth: '280px', fontSize: '0.83rem' }}
                    />
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {[{ id: 'time', label: '🕐 Newest' }, { id: 'score', label: '🎯 Score' }, { id: 'critical', label: '💀 Critical' }].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setSortBy(opt.id as 'time' | 'score' | 'critical')}
                                style={{
                                    padding: '0.4rem 0.85rem',
                                    borderRadius: '6px',
                                    border: sortBy === opt.id ? '1px solid var(--accent-cyan)' : '1px solid rgba(0,229,255,0.15)',
                                    background: sortBy === opt.id ? 'rgba(0,229,255,0.1)' : 'transparent',
                                    color: sortBy === opt.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                                    cursor: 'pointer', fontSize: '0.8rem',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    transition: 'all 0.2s',
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Records */}
                {filtered.length === 0 ? (
                    <div className="cyber-card" style={{ borderRadius: '12px', padding: '4rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>📂</div>
                        <div style={{ color: 'var(--text-secondary)' }}>No scan records found. Run a pipeline to generate history.</div>
                    </div>
                ) : (
                    <div className="animate-cascade reveal-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {filtered.map((rec) => {
                            const scoreColor = rec.threatScore >= 75 ? 'var(--accent-red)' : rec.threatScore >= 50 ? 'var(--accent-orange)' : 'var(--accent-cyan)';
                            const isExpanded = selected === rec.id;
                            return (
                                <div
                                    key={rec.id}
                                    className="cyber-card"
                                    style={{
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: isExpanded ? '1px solid rgba(0,229,255,0.35)' : '1px solid rgba(0,229,255,0.1)',
                                        transition: 'border-color 0.2s',
                                    }}
                                >
                                    {/* Row */}
                                    <div
                                        onClick={() => setSelected(isExpanded ? null : rec.id)}
                                        style={{
                                            padding: '1rem 1.25rem',
                                            display: 'grid',
                                            gridTemplateColumns: '1fr auto auto auto auto',
                                            alignItems: 'center',
                                            gap: '1.5rem',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div>
                                            <div className="font-headline" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                                                {rec.template}
                                            </div>
                                            <div className="font-code" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                                {rec.id} · {timeAgo(rec.timestamp)} · {rec.nodeCount} nodes · {rec.edgeCount} edges
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div className="font-headline" style={{ fontSize: '1.4rem', fontWeight: 700, color: scoreColor }}>{rec.threatScore}</div>
                                            <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Score</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div className="font-headline" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{rec.hypothesisCount}</div>
                                            <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Vectors</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div className="font-headline" style={{ fontSize: '1.4rem', fontWeight: 700, color: rec.criticalCount > 0 ? 'var(--accent-red)' : 'var(--text-secondary)' }}>{rec.criticalCount}</div>
                                            <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Critical</div>
                                        </div>
                                        <span style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem', transition: 'transform 0.2s', display: 'block', transform: isExpanded ? 'rotate(90deg)' : 'none' }}>›</span>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(0,229,255,0.08)', paddingTop: '1rem', animation: 'slide-up 0.2s ease-out' }}>
                                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                <button
                                                    onClick={() => restoreScan(rec)}
                                                    style={{
                                                        padding: '0.5rem 1.2rem',
                                                        background: 'var(--accent-red)',
                                                        border: '1px solid var(--accent-red)',
                                                        borderRadius: '6px',
                                                        color: '#fff',
                                                        fontFamily: "'Space Grotesk', sans-serif",
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        fontSize: '0.83rem',
                                                    }}
                                                >
                                                    ⚡ Re-Execute Attack
                                                </button>
                                                <button
                                                    onClick={() => router.push('/ingest')}
                                                    style={{
                                                        padding: '0.5rem 1.2rem',
                                                        background: 'transparent',
                                                        border: '1px solid rgba(0,229,255,0.3)',
                                                        borderRadius: '6px',
                                                        color: 'var(--accent-cyan)',
                                                        fontFamily: "'Space Grotesk', sans-serif",
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        fontSize: '0.83rem',
                                                    }}
                                                >
                                                    🔁 Re-Ingest Template
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setRecords((prev) => {
                                                            const updated = prev.filter((r) => r.id !== rec.id);
                                                            localStorage.setItem('architect_history', JSON.stringify(updated));
                                                            return updated;
                                                        });
                                                    }}
                                                    style={{
                                                        padding: '0.5rem 1.2rem',
                                                        background: 'transparent',
                                                        border: '1px solid rgba(255,51,102,0.3)',
                                                        borderRadius: '6px',
                                                        color: 'var(--accent-red)',
                                                        fontFamily: "'Space Grotesk', sans-serif",
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        fontSize: '0.83rem',
                                                    }}
                                                >
                                                    🗑 Delete
                                                </button>
                                            </div>
                                            <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.25rem' }}>
                                                <div className="font-code" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Scanned: {new Date(rec.timestamp).toLocaleString()}</div>
                                                <div className="font-code" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Status: <span style={{ color: 'var(--accent-green)' }}>COMPLETE</span></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
            <AiChatbot />
        </div>
    );
}
