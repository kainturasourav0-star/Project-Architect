'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { AiChatbot } from '@/components/AiChatbot';
import { exampleTemplates } from '@/lib/types';

interface Target {
    id: string;
    name: string;
    baseUrl: string;
    appType: 'ecommerce' | 'banking' | 'saas' | 'custom';
    notes: string;
    createdAt: string;
    lastScanned?: string;
    status: 'untested' | 'clean' | 'vulnerable';
    threatScore?: number;
}

const APP_TYPE_META: Record<Target['appType'], { label: string; icon: string; color: string; template: string }> = {
    ecommerce: { label: 'E-Commerce', icon: '🛒', color: 'var(--accent-cyan)', template: 'ecommerce' },
    banking: { label: 'Banking/Finance', icon: '🏦', color: 'var(--accent-purple)', template: 'banking' },
    saas: { label: 'SaaS / Subscription', icon: '☁️', color: 'var(--accent-green)', template: 'saas' },
    custom: { label: 'Custom Flow', icon: '🔧', color: 'var(--accent-orange)', template: 'ecommerce' },
};

const STATUS_META: Record<Target['status'], { label: string; color: string; badge: string }> = {
    untested: { label: 'Untested', color: 'var(--text-secondary)', badge: 'badge-cyan' },
    clean: { label: 'Clean', color: 'var(--accent-green)', badge: 'badge-green' },
    vulnerable: { label: 'Vulnerable', color: 'var(--accent-red)', badge: 'badge-red' },
};

const DEMO_TARGETS: Target[] = [
    { id: 'tgt_001', name: 'LocalShop Demo', baseUrl: 'http://localhost:3001', appType: 'ecommerce', notes: 'Local demo E-Commerce store for testing price manipulation', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), lastScanned: new Date(Date.now() - 1000 * 60 * 30).toISOString(), status: 'vulnerable', threatScore: 87 },
    { id: 'tgt_002', name: 'BankTest Sandbox', baseUrl: 'http://localhost:4000', appType: 'banking', notes: 'Banking app sandbox — test MFA bypass and transfer race conditions', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), lastScanned: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), status: 'vulnerable', threatScore: 72 },
    { id: 'tgt_003', name: 'CloudApp SaaS', baseUrl: 'http://localhost:5000', appType: 'saas', notes: 'SaaS platform — trial abuse and subscription flow tests', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), status: 'untested' },
];

export default function TargetsPage() {
    const router = useRouter();
    const [targets, setTargets] = useState<Target[]>(() => {
        if (typeof window !== 'undefined') {
            const raw = localStorage.getItem('architect_targets');
            return raw ? JSON.parse(raw) : DEMO_TARGETS;
        }
        return DEMO_TARGETS;
    });
    const [showForm, setShowForm] = useState(false);
    const [newTarget, setNewTarget] = useState<Omit<Target, 'id' | 'createdAt' | 'status'>>({
        name: '',
        baseUrl: '',
        appType: 'ecommerce',
        notes: '',
    });
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // State is initialized lazily from localStorage

    function save(list: Target[]) {
        localStorage.setItem('architect_targets', JSON.stringify(list));
        setTargets(list);
    }

    function addTarget() {
        if (!newTarget.name || !newTarget.baseUrl) return;
        const t: Target = {
            ...newTarget,
            id: `tgt_${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'untested',
        };
        save([...targets, t]);
        setNewTarget({ name: '', baseUrl: '', appType: 'ecommerce', notes: '' });
        setShowForm(false);
    }

    function deleteTarget(id: string) {
        save(targets.filter((t) => t.id !== id));
        setDeleteConfirm(null);
    }

    function launchScan(target: Target) {
        const meta = APP_TYPE_META[target.appType];
        sessionStorage.setItem('architect_target_url', target.baseUrl);
        // Pre-select the matching template
        sessionStorage.setItem('architect_schema', JSON.stringify(exampleTemplates[meta.template as keyof typeof exampleTemplates] || exampleTemplates.ecommerce));
        router.push('/analyze');
    }

    const vulnCount = targets.filter((t) => t.status === 'vulnerable').length;
    const untestedCount = targets.filter((t) => t.status === 'untested').length;

    return (
        <div style={{ minHeight: '100vh' }}>
            <Navigation />
            <div className="cyber-grid" style={{ position: 'fixed', inset: 0, zIndex: 0 }} />
            <main style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>

                {/* Header */}
                <div className="animate-cascade reveal-1" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-red">TARGET MANAGER</span>
                        <span className="badge badge-cyan">{targets.length} TARGETS</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 className="font-headline" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                🎯 Target Manager
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                Manage the web applications you want to test. Click a target to launch the Ghost Attack pipeline.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            style={{
                                padding: '0.6rem 1.4rem',
                                background: 'var(--accent-cyan)',
                                border: 'none', borderRadius: '8px',
                                color: '#000', fontWeight: 700,
                                fontFamily: "'Space Grotesk', sans-serif",
                                cursor: 'pointer', fontSize: '0.88rem',
                            }}
                        >
                            + Add Target
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="animate-cascade reveal-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                        { label: 'Total Targets', value: targets.length, color: 'var(--accent-cyan)', icon: '🎯' },
                        { label: 'Vulnerable', value: vulnCount, color: 'var(--accent-red)', icon: '💀' },
                        { label: 'Untested', value: untestedCount, color: 'var(--accent-orange)', icon: '⚠️' },
                    ].map((s) => (
                        <div key={s.label} className="cyber-card" style={{ padding: '1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', animation: 'glow-pulse-cyan 3s infinite' }}>
                            <span style={{ fontSize: '2rem' }}>{s.icon}</span>
                            <div>
                                <div className="font-headline" style={{ fontSize: '1.8rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Form */}
                {showForm && (
                    <div className="cyber-card" style={{ borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', animation: 'slide-up 0.25s ease-out', border: '1px solid rgba(0,229,255,0.35)' }}>
                        <h2 className="font-headline" style={{ color: 'var(--accent-cyan)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>➕ Add New Target</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target Name</label>
                                <input value={newTarget.name} onChange={(e) => setNewTarget((p) => ({ ...p, name: e.target.value }))} placeholder="MyShop Production" className="cyber-input" style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Base URL</label>
                                <input value={newTarget.baseUrl} onChange={(e) => setNewTarget((p) => ({ ...p, baseUrl: e.target.value }))} placeholder="http://localhost:3001" className="cyber-input" style={{ width: '100%' }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>App Type</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {(Object.entries(APP_TYPE_META) as [Target['appType'], (typeof APP_TYPE_META)[keyof typeof APP_TYPE_META]][]).map(([k, v]) => (
                                    <button
                                        key={k}
                                        onClick={() => setNewTarget((p) => ({ ...p, appType: k }))}
                                        style={{
                                            padding: '0.4rem 0.9rem',
                                            borderRadius: '6px',
                                            border: newTarget.appType === k ? `1px solid ${v.color}` : '1px solid rgba(0,229,255,0.15)',
                                            background: newTarget.appType === k ? `${v.color}15` : 'transparent',
                                            color: newTarget.appType === k ? v.color : 'var(--text-secondary)',
                                            cursor: 'pointer', fontSize: '0.8rem',
                                            fontFamily: "'Space Grotesk', sans-serif",
                                        }}
                                    >
                                        {v.icon} {v.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Notes (optional)</label>
                            <textarea value={newTarget.notes} onChange={(e) => setNewTarget((p) => ({ ...p, notes: e.target.value }))} placeholder="What specific flow or vulnerability to test?" rows={2} className="cyber-input" style={{ width: '100%', resize: 'vertical' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={addTarget} disabled={!newTarget.name || !newTarget.baseUrl} style={{ padding: '0.55rem 1.4rem', background: 'var(--accent-cyan)', border: 'none', borderRadius: '6px', color: '#000', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem', opacity: !newTarget.name || !newTarget.baseUrl ? 0.5 : 1 }}>
                                ✓ Save Target
                            </button>
                            <button onClick={() => setShowForm(false)} style={{ padding: '0.55rem 1.2rem', background: 'transparent', border: '1px solid rgba(0,229,255,0.25)', borderRadius: '6px', color: 'var(--text-secondary)', fontFamily: "'Space Grotesk', sans-serif", cursor: 'pointer', fontSize: '0.83rem' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Targets Grid */}
                {targets.length === 0 ? (
                    <div className="cyber-card" style={{ borderRadius: '12px', padding: '4rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', opacity: 0.3, marginBottom: '1rem' }}>🎯</div>
                        <div style={{ color: 'var(--text-secondary)' }}>No targets yet. Add your first target to begin scanning.</div>
                    </div>
                ) : (
                    <div className="animate-cascade reveal-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {targets.map((t) => {
                            const meta = APP_TYPE_META[t.appType];
                            const status = STATUS_META[t.status];
                            return (
                                <div
                                    key={t.id}
                                    className="cyber-card"
                                    style={{
                                        borderRadius: '10px',
                                        padding: '1.25rem',
                                        display: 'flex', flexDirection: 'column', gap: '0.75rem',
                                        border: t.status === 'vulnerable' ? '1px solid rgba(255,51,102,0.3)' : '1px solid rgba(0,229,255,0.1)',
                                        position: 'relative', overflow: 'hidden',
                                    }}
                                >
                                    {/* Status stripe */}
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: status.color }} />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '1.6rem' }}>{meta.icon}</span>
                                            <div>
                                                <div className="font-headline" style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.92rem' }}>{t.name}</div>
                                                <div style={{ fontSize: '0.68rem', color: meta.color }}>{meta.label}</div>
                                            </div>
                                        </div>
                                        <span className={`badge ${status.badge}`} style={{ fontSize: '0.6rem' }}>{status.label}</span>
                                    </div>

                                    <div className="font-code" style={{ fontSize: '0.73rem', color: 'var(--accent-cyan)', background: 'rgba(0,229,255,0.06)', padding: '0.35rem 0.6rem', borderRadius: '4px', wordBreak: 'break-all' }}>
                                        {t.baseUrl}
                                    </div>

                                    {t.notes && (
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{t.notes}</p>
                                    )}

                                    {t.threatScore !== undefined && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div className="progress-bar" style={{ flex: 1 }}>
                                                <div className="progress-fill" style={{ width: `${t.threatScore}%`, background: t.threatScore >= 75 ? 'var(--accent-red)' : 'var(--accent-orange)' }} />
                                            </div>
                                            <span className="font-code" style={{ fontSize: '0.72rem', color: status.color }}>{t.threatScore}/100</span>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => launchScan(t)}
                                            style={{ flex: 1, padding: '0.45rem', background: 'var(--accent-red)', border: 'none', borderRadius: '5px', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, cursor: 'pointer', fontSize: '0.78rem' }}
                                        >
                                            ⚡ Attack
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(deleteConfirm === t.id ? null : t.id)}
                                            style={{ padding: '0.45rem 0.75rem', background: 'transparent', border: '1px solid rgba(255,51,102,0.3)', borderRadius: '5px', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.78rem' }}
                                        >
                                            🗑
                                        </button>
                                    </div>

                                    {deleteConfirm === t.id && (
                                        <div style={{ padding: '0.6rem', background: 'rgba(255,51,102,0.08)', borderRadius: '6px', border: '1px solid rgba(255,51,102,0.25)', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Delete this target?</div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => deleteTarget(t.id)} style={{ flex: 1, padding: '0.35rem', background: 'var(--accent-red)', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>Delete</button>
                                                <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '0.35rem', background: 'transparent', border: '1px solid rgba(0,229,255,0.25)', borderRadius: '4px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Space Grotesk', sans-serif" }}>Cancel</button>
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
