'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { AiChatbot } from '@/components/AiChatbot';

interface Config {
    proxyPort: number;
    targetUrl: string;
    headless: boolean;
    mutatePrice: boolean;
    mutateQuantity: boolean;
    mutateUserId: boolean;
    mutateRole: boolean;
    attackTimeout: number;
    maxPackets: number;
    logLevel: 'verbose' | 'normal' | 'quiet';
    autoSaveHistory: boolean;
    cppCompileFlags: string;
}

const DEFAULT_CONFIG: Config = {
    proxyPort: 8080,
    targetUrl: 'http://localhost:3001',
    headless: true,
    mutatePrice: true,
    mutateQuantity: true,
    mutateUserId: true,
    mutateRole: true,
    attackTimeout: 30,
    maxPackets: 500,
    logLevel: 'normal',
    autoSaveHistory: true,
    cppCompileFlags: 'g++ -O3 -std=c++17 proxy_main.cpp -o proxy_engine.exe -lws2_32',
};

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
        <div
            onClick={() => onChange(!value)}
            style={{
                width: '44px', height: '24px',
                borderRadius: '12px',
                background: value ? 'var(--accent-cyan)' : 'rgba(0,229,255,0.15)',
                border: `1px solid ${value ? 'var(--accent-cyan)' : 'rgba(0,229,255,0.25)'}`,
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.25s ease',
                flexShrink: 0,
            }}
        >
            <div style={{
                position: 'absolute',
                top: '2px',
                left: value ? '22px' : '2px',
                width: '18px', height: '18px',
                borderRadius: '50%',
                background: value ? '#000' : 'rgba(0,229,255,0.5)',
                transition: 'left 0.25s ease',
            }} />
        </div>
    );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="cyber-card" style={{ borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,229,255,0.08)' }}>
                <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                <h2 className="font-headline" style={{ color: 'var(--accent-cyan)', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.05em' }}>{title}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{children}</div>
        </div>
    );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-primary)', fontWeight: 500 }}>{label}</div>
                {hint && <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{hint}</div>}
            </div>
            {children}
        </div>
    );
}

export default function SettingsPage() {
    const [config, setConfig] = useState<Config>(() => {
        if (typeof window !== 'undefined') {
            const raw = localStorage.getItem('architect_config');
            return raw ? JSON.parse(raw) : DEFAULT_CONFIG;
        }
        return DEFAULT_CONFIG;
    });
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<'proxy' | 'playwright' | 'mutations' | 'cpp' | 'general'>('proxy');

    function update<K extends keyof Config>(key: K, value: Config[K]) {
        setConfig((prev) => ({ ...prev, [key]: value }));
    }

    function saveConfig() {
        localStorage.setItem('architect_config', JSON.stringify(config));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    function resetDefaults() {
        setConfig(DEFAULT_CONFIG);
        localStorage.setItem('architect_config', JSON.stringify(DEFAULT_CONFIG));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    const tabs = [
        { id: 'proxy', label: '⚙️ Proxy', icon: '⚙️' },
        { id: 'playwright', label: '👻 Browser', icon: '👻' },
        { id: 'mutations', label: '✂️ Mutations', icon: '✂️' },
        { id: 'cpp', label: '🔧 C++ Engine', icon: '🔧' },
        { id: 'general', label: '🛡️ General', icon: '🛡️' },
    ] as const;

    return (
        <div style={{ minHeight: '100vh' }}>
            <Navigation />
            <div className="cyber-grid" style={{ position: 'fixed', inset: 0, zIndex: 0 }} />
            <main style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem' }}>

                {/* Header */}
                <div className="animate-cascade reveal-1" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-cyan">CONFIGURATION</span>
                        <span className="badge badge-green">SENTINEL v3.0</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 className="font-headline" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                ⚙️ Settings
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                Configure the Ghost Attack pipeline, C++ proxy, and mutation targets.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={resetDefaults} className="btn-cyber" style={{ fontSize: '0.82rem' }}>
                                <span>↺ Defaults</span>
                            </button>
                            <button
                                onClick={saveConfig}
                                style={{
                                    padding: '0.55rem 1.4rem',
                                    background: saved ? 'var(--accent-green)' : 'var(--accent-cyan)',
                                    border: 'none', borderRadius: '6px',
                                    color: '#000', fontWeight: 700,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    cursor: 'pointer', fontSize: '0.88rem',
                                    transition: 'all 0.3s',
                                }}
                            >
                                {saved ? '✓ Saved!' : '💾 Save Config'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="animate-cascade reveal-2" style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            style={{
                                padding: '0.45rem 1rem',
                                borderRadius: '6px',
                                border: activeTab === t.id ? '1px solid var(--accent-cyan)' : '1px solid rgba(0,229,255,0.15)',
                                background: activeTab === t.id ? 'rgba(0,229,255,0.1)' : 'transparent',
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

                {/* Tab: Proxy */}
                {activeTab === 'proxy' && (
                    <Section title="C++ Proxy Surgeon Configuration" icon="⚙️">
                        <Field label="Proxy Port" hint="The local port the C++ proxy listens on">
                            <input
                                type="number"
                                value={config.proxyPort}
                                onChange={(e) => update('proxyPort', Number(e.target.value))}
                                className="cyber-input"
                                style={{ width: '120px', textAlign: 'center' }}
                            />
                        </Field>
                        <hr className="cyber-divider" style={{ margin: 0 }} />
                        <Field label="Target Application URL" hint="The base URL of the app under test">
                            <input
                                type="text"
                                value={config.targetUrl}
                                onChange={(e) => update('targetUrl', e.target.value)}
                                className="cyber-input"
                                style={{ width: '280px' }}
                                placeholder="http://localhost:3001"
                            />
                        </Field>
                        <hr className="cyber-divider" style={{ margin: 0 }} />
                        <Field label="Max Packets to Intercept" hint="Hard limit on packet interception per session">
                            <input
                                type="number"
                                value={config.maxPackets}
                                onChange={(e) => update('maxPackets', Number(e.target.value))}
                                className="cyber-input"
                                style={{ width: '120px', textAlign: 'center' }}
                            />
                        </Field>
                    </Section>
                )}

                {/* Tab: Browser */}
                {activeTab === 'playwright' && (
                    <Section title="Playwright Ghost Browser" icon="👻">
                        <Field label="Headless Mode" hint="Run Chromium without UI — saves ~1.5GB RAM on 8GB systems">
                            <Toggle value={config.headless} onChange={(v) => update('headless', v)} />
                        </Field>
                        <hr className="cyber-divider" style={{ margin: 0 }} />
                        <Field label="Attack Timeout (seconds)" hint="Max time to wait for each step before failing">
                            <input
                                type="number"
                                value={config.attackTimeout}
                                onChange={(e) => update('attackTimeout', Number(e.target.value))}
                                className="cyber-input"
                                style={{ width: '120px', textAlign: 'center' }}
                            />
                        </Field>
                        <hr className="cyber-divider" style={{ margin: 0 }} />
                        <Field label="Log Level" hint="Controls how verbose the ghost attack terminal is">
                            <select
                                value={config.logLevel}
                                onChange={(e) => update('logLevel', e.target.value as Config['logLevel'])}
                                className="cyber-input"
                                style={{ width: '160px' }}
                            >
                                <option value="verbose">Verbose</option>
                                <option value="normal">Normal</option>
                                <option value="quiet">Quiet</option>
                            </select>
                        </Field>
                    </Section>
                )}

                {/* Tab: Mutations */}
                {activeTab === 'mutations' && (
                    <Section title="JSON Payload Mutation Targets" icon="✂️">
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.6 }}>
                            Toggle which JSON keys the C++ Proxy Surgeon will intercept and mutate during a Ghost Attack.
                        </p>
                        {[
                            { key: 'mutatePrice' as const, label: '"price" field', hint: 'Mutates to: -1 (negative price exploit)', color: 'var(--accent-red)' },
                            { key: 'mutateQuantity' as const, label: '"quantity" field', hint: 'Mutates to: 9999 (inventory overflow)', color: 'var(--accent-orange)' },
                            { key: 'mutateUserId' as const, label: '"user_id" / "id" field', hint: 'Mutates to: 00001 (IDOR enumeration)', color: 'var(--accent-purple)' },
                            { key: 'mutateRole' as const, label: '"role" / "is_admin" field', hint: 'Mutates to: "superadmin" / true (privilege escalation)', color: 'var(--accent-red)' },
                        ].map((m, i) => (
                            <div key={m.key}>
                                {i > 0 && <hr className="cyber-divider" style={{ margin: 0 }} />}
                                <Field label={<span style={{ color: m.color, fontFamily: "'Source Code Pro', monospace", fontSize: '0.8rem' }}>{m.label}</span> as unknown as string} hint={m.hint}>
                                    <Toggle value={config[m.key]} onChange={(v) => update(m.key, v)} />
                                </Field>
                            </div>
                        ))}
                    </Section>
                )}

                {/* Tab: C++ Engine */}
                {activeTab === 'cpp' && (
                    <>
                        <Section title="C++ Proxy Surgeon — Compilation Guide" icon="🔧">
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                <p style={{ marginBottom: '0.75rem' }}>
                                    The Proxy Surgeon is compiled to machine code using <strong style={{ color: 'var(--accent-cyan)' }}>g++ (MinGW)</strong> for maximum speed on your 8GB RAM system.
                                </p>
                                <p><strong style={{ color: 'var(--text-primary)' }}>Step 1 — Download headers:</strong></p>
                                <ul style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>
                                    <li><a href="https://github.com/yhirose/cpp-httplib" target="_blank" rel="noopener" style={{ color: 'var(--accent-cyan)' }}>cpp-httplib</a> → download <code>httplib.h</code></li>
                                    <li><a href="https://github.com/nlohmann/json" target="_blank" rel="noopener" style={{ color: 'var(--accent-cyan)' }}>nlohmann/json</a> → download <code>json.hpp</code></li>
                                </ul>
                                <p><strong style={{ color: 'var(--text-primary)' }}>Step 2 — Place both files in <code>/proxy/</code> directory.</strong></p>
                                <p style={{ marginTop: '0.5rem' }}><strong style={{ color: 'var(--text-primary)' }}>Step 3 — Compile:</strong></p>
                            </div>
                            <div className="terminal-bg" style={{ borderRadius: '8px', padding: '1rem', marginTop: '-0.25rem' }}>
                                <div className="terminal-content">
                                    <pre className="font-code" style={{ fontSize: '0.8rem', color: 'var(--accent-green)', margin: 0 }}>
                                        {config.cppCompileFlags}
                                    </pre>
                                </div>
                            </div>
                            <Field label="Compile Flags" hint="Customize the g++ compilation command">
                                <input
                                    type="text"
                                    value={config.cppCompileFlags}
                                    onChange={(e) => update('cppCompileFlags', e.target.value)}
                                    className="cyber-input"
                                    style={{ width: '100%', maxWidth: '500px', fontFamily: "'Source Code Pro', monospace", fontSize: '0.75rem' }}
                                />
                            </Field>
                        </Section>

                        <Section title="Compilation Flags Reference" icon="📖">
                            {[
                                { flag: '-O3', desc: 'Maximum compiler optimization — makes proxy wire-speed fast' },
                                { flag: '-std=c++17', desc: 'Use modern C++17 features required by cpp-httplib' },
                                { flag: '-lws2_32', desc: 'Link Winsock2 — required for Windows socket networking' },
                                { flag: '-DCPPHTTPLIB_OPENSSL_SUPPORT', desc: 'Enable HTTPS interception (requires OpenSSL)' },
                            ].map((item) => (
                                <div key={item.flag} style={{ display: 'flex', gap: '1rem' }}>
                                    <code className="font-code" style={{ color: 'var(--accent-cyan)', background: 'rgba(0,229,255,0.08)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem', flexShrink: 0, alignSelf: 'flex-start' }}>{item.flag}</code>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</span>
                                </div>
                            ))}
                        </Section>
                    </>
                )}

                {/* Tab: General */}
                {activeTab === 'general' && (
                    <Section title="General Settings" icon="🛡️">
                        <Field label="Auto-save Scan History" hint="Automatically save pipeline results to local history">
                            <Toggle value={config.autoSaveHistory} onChange={(v) => update('autoSaveHistory', v)} />
                        </Field>
                        <hr className="cyber-divider" style={{ margin: 0 }} />
                        <div style={{ padding: '1rem', background: 'rgba(0,229,255,0.04)', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.1)' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>System Info</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                                {[
                                    ['Architect Version', 'v3.0'],
                                    ['Next.js', '16.1.6 (Turbopack)'],
                                    ['Target Architecture', 'i7 8th Gen / 8GB RAM'],
                                    ['Proxy Engine', 'C++17 + cpp-httplib'],
                                    ['Browser Automation', 'Playwright + Chromium'],
                                    ['OCR Backend', 'OpenCV + Pytesseract'],
                                ].map(([k, v]) => (
                                    <div key={k}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{k}: </span>
                                        <span className="font-code" style={{ fontSize: '0.7rem', color: 'var(--text-primary)' }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <hr className="cyber-divider" style={{ margin: 0 }} />
                        <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-red)', marginBottom: '0.5rem' }}>Danger Zone</div>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => { localStorage.removeItem('architect_history'); alert('Scan history cleared.'); }}
                                    style={{ padding: '0.45rem 1rem', background: 'transparent', border: '1px solid rgba(255,51,102,0.35)', borderRadius: '6px', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.78rem', fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    🗑 Clear Scan History
                                </button>
                                <button
                                    onClick={() => { sessionStorage.clear(); alert('Pipeline session cleared.'); }}
                                    style={{ padding: '0.45rem 1rem', background: 'transparent', border: '1px solid rgba(255,51,102,0.35)', borderRadius: '6px', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.78rem', fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    🔄 Reset Pipeline Session
                                </button>
                            </div>
                        </div>
                    </Section>
                )}
            </main>
            <AiChatbot />
        </div>
    );
}
