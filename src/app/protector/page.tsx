'use client';

import { useState, useEffect, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { AiChatbot } from '@/components/AiChatbot';

interface SecurityEvent {
    id: string;
    time: string;
    type: 'info' | 'warn' | 'alert' | 'fix';
    message: string;
}

const INITIAL_EVENTS: SecurityEvent[] = [
    { id: '1', time: '16:40:01', type: 'info', message: 'Sentinel Core v3.0 initialized' },
    { id: '2', time: '16:40:05', type: 'info', message: 'Neural heuristic engine online' },
    { id: '3', time: '16:40:12', type: 'info', message: 'Monitoring network traffic on :8080' },
];

export default function ProtectorPage() {
    const [health, setHealth] = useState(98);
    const [events, setEvents] = useState<SecurityEvent[]>(INITIAL_EVENTS);
    const [toggles, setToggles] = useState({
        healing: true,
        firewall: true,
        malware: true,
        autofix: true,
    });

    // Sync from localStorage on external updates & initial load
    useEffect(() => {
        const h = localStorage.getItem('architect_sentinel_healing') !== 'false';
        const f = localStorage.getItem('architect_sentinel_waf') !== 'false';
        const m = localStorage.getItem('architect_sentinel_malware') !== 'false';
        const a = localStorage.getItem('architect_sentinel_autofix') !== 'false';
        setToggles({ healing: h, firewall: f, malware: m, autofix: a });

        const handleStorage = () => {
            const nh = localStorage.getItem('architect_sentinel_healing') !== 'false';
            const nf = localStorage.getItem('architect_sentinel_waf') !== 'false';
            const nm = localStorage.getItem('architect_sentinel_malware') !== 'false';
            const na = localStorage.getItem('architect_sentinel_autofix') !== 'false';
            setToggles({ healing: nh, firewall: nf, malware: nm, autofix: na });
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);
    const eventContainerRef = useRef<HTMLDivElement>(null);

    // Generate mock security events
    useEffect(() => {
        const interval = setInterval(() => {
            const types: SecurityEvent['type'][] = ['info', 'warn', 'alert'];
            const messages = [
                'Detected suspicious packet rhythm from 192.168.1.45',
                'Unauthorized access attempt on /admin/config blocked',
                'XSS attempt sanitized in real-time',
                'Integrity check: core modules 100% valid',
                'Heuristic scan identifying latent 0-day vectors...',
                'WAF rules updated — 4,821 signatures active',
                'Brute force pattern detected — IP blacklisted for 3600s',
            ];

            const newEvent: SecurityEvent = {
                id: Math.random().toString(36).substr(2, 9),
                time: new Date().toLocaleTimeString('en-GB'),
                type: types[Math.floor(Math.random() * types.length)],
                message: messages[Math.floor(Math.random() * messages.length)],
            };

            setEvents(prev => [...prev.slice(-15), newEvent]);

            if (newEvent.type === 'alert') {
                setHealth(h => Math.max(82, h - 2));
                if (toggles.autofix) {
                    setTimeout(() => {
                        setEvents(prev => [...prev, {
                            id: Math.random().toString(36).substr(2, 9),
                            time: new Date().toLocaleTimeString('en-GB'),
                            type: 'fix',
                            message: '✓ AI Sentinel: Automatically neutralized threat and restored state',
                        }]);
                        setHealth(h => Math.min(100, h + 2.5));
                    }, 1500);
                }
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [toggles.autofix]);

    useEffect(() => {
        if (eventContainerRef.current) {
            eventContainerRef.current.scrollTop = eventContainerRef.current.scrollHeight;
        }
    }, [events]);

    const toggleSwitch = (key: keyof typeof toggles) => {
        const newValue = !toggles[key];
        setToggles(prev => ({ ...prev, [key]: newValue }));

        const storageKeys: Record<string, string> = {
            healing: 'architect_sentinel_healing',
            firewall: 'architect_sentinel_waf',
            malware: 'architect_sentinel_malware',
            autofix: 'architect_sentinel_autofix'
        };
        localStorage.setItem(storageKeys[key], String(newValue));
    };

    const currentHealthColor = health > 90 ? 'var(--accent-green)' : health > 75 ? 'var(--accent-cyan)' : 'var(--accent-red)';

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Navigation />
            <div className="cyber-grid" style={{ position: 'fixed', inset: 0, zIndex: 0 }} />

            <main style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

                {/* Header Section */}
                <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <span className="badge badge-green">AI PROTECTOR</span>
                            <span className="badge badge-cyan">SENTINEL ACTIVE</span>
                        </div>
                        <h1 className="font-headline" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                            🛡️ Security Dashboard
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '600px' }}>
                            Autonomous threat mitigation and real-time app protection. The AI Sentinel monitors every packet and automatically heals corrupted states.
                        </p>
                    </div>

                    <div className="cyber-card" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1.5rem', minWidth: '240px' }}>
                        <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Gauge Circle */}
                            <svg width="80" height="80" viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="36" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                <circle cx="40" cy="40" r="36" fill="transparent" stroke={currentHealthColor} strokeWidth="6"
                                    strokeDasharray={`${2 * Math.PI * 36}`}
                                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - health / 100)}`}
                                    style={{ transition: 'stroke-dashoffset 1s ease, stroke 1s ease', transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
                            </svg>
                            <div style={{ position: 'absolute', fontSize: '1.2rem', fontWeight: 700, color: currentHealthColor }}>{Math.round(health)}%</div>
                        </div>
                        <div>
                            <div className="font-headline" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Health Score</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{health > 90 ? 'EXCELLENT' : 'STABLE'}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)', marginTop: '0.2rem' }}>✓ 0 Active Threats</div>
                        </div>
                    </div>
                </div>

                {/* Grid Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Live Monitoring Visual */}
                        <div className="cyber-card" style={{ height: '400px', borderRadius: '12px', overflow: 'hidden', padding: '1.5rem', position: 'relative' }}>
                            <h3 className="font-headline" style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: '1rem', textTransform: 'uppercase' }}>
                                🛰️ Live Intrusion Map
                            </h3>

                            <div style={{ position: 'relative', height: 'calc(100% - 2rem)', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', overflow: 'hidden' }}>
                                <div className="cyber-grid" style={{ position: 'absolute', inset: 0 }} />

                                {/* Simulated Radar Circles */}
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                    {[100, 200, 300, 400].map(size => (
                                        <div key={size} style={{
                                            width: size, height: size,
                                            border: '1px solid rgba(0,229,255,0.05)',
                                            borderRadius: '50%',
                                            position: 'absolute',
                                            top: '50%', left: '50%',
                                            transform: 'translate(-50%, -50%)'
                                        }} />
                                    ))}
                                    {/* Radar Scanline */}
                                    <div style={{
                                        width: '200px', height: '1px',
                                        background: 'linear-gradient(90deg, transparent, var(--accent-cyan))',
                                        position: 'absolute',
                                        top: '50%', left: '50%',
                                        transformOrigin: '0% 50%',
                                        animation: 'rotate 4s linear infinite'
                                    }} />
                                </div>

                                {/* Threat Blips */}
                                {events.filter(e => e.type === 'alert').map((e, i) => (
                                    <div key={e.id} style={{
                                        position: 'absolute',
                                        top: `${30 + (i * 20) % 40}%`,
                                        left: `${20 + (i * 15) % 60}%`,
                                        width: '8px', height: '8px',
                                        background: 'var(--accent-red)',
                                        borderRadius: '50%',
                                        boxShadow: '0 0 15px var(--accent-red)',
                                        animation: 'pulse-glow 1s ease-in-out infinite'
                                    }}>
                                        <div style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--accent-red)', fontSize: '0.6rem', whiteSpace: 'nowrap' }}>
                                            ERR_BLOCKED: {e.id}
                                        </div>
                                    </div>
                                ))}

                                <style jsx>{`
                        @keyframes rotate {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                            </div>
                        </div>

                        {/* Event Console */}
                        <div className="cyber-card" style={{ height: '300px', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(0,229,255,0.1)', background: 'rgba(0,229,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                                <span className="font-headline" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>SYSTEM SENTINEL LOGS</span>
                                <span className="font-code" style={{ fontSize: '0.7rem', color: 'var(--accent-green)' }}>ENCRYPTED CHANNEL-09</span>
                            </div>
                            <div ref={eventContainerRef} style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: '#000810' }}>
                                {events.map((e) => (
                                    <div key={e.id} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', marginBottom: '0.5rem', fontFamily: "'Source Code Pro', monospace" }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>[{e.time}]</span>
                                        <span style={{
                                            color: e.type === 'alert' ? 'var(--accent-red)' : e.type === 'warn' ? 'var(--accent-orange)' : e.type === 'fix' ? 'var(--accent-green)' : 'var(--accent-cyan)',
                                            fontWeight: e.type === 'alert' || e.type === 'fix' ? 700 : 400
                                        }}>
                                            {e.type.toUpperCase()}:
                                        </span>
                                        <span style={{ color: e.type === 'fix' ? '#fff' : 'rgba(226, 244, 255, 0.8)' }}>{e.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Toggles Panel */}
                        <div className="cyber-card" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                            <h3 className="font-headline" style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                                Security Protocols
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {[
                                    { id: 'healing' as const, label: 'Sentinel Self-Healing', desc: 'Automatically restore app state' },
                                    { id: 'firewall' as const, label: 'Neural Layer WAF', desc: 'Packet filtering at wire speed' },
                                    { id: 'malware' as const, label: 'Malware Shield', desc: 'Zero-day payload recognition' },
                                    { id: 'autofix' as const, label: 'Predictive Auto-Fix', desc: 'Repair logic flaws before exploit' },
                                ].map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</div>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
                                        </div>
                                        <div
                                            onClick={() => toggleSwitch(item.id)}
                                            style={{
                                                width: '40px', height: '20px',
                                                background: toggles[item.id] ? 'var(--accent-cyan)' : 'rgba(0,229,255,0.1)',
                                                borderRadius: '10px',
                                                position: 'relative',
                                                cursor: 'pointer',
                                                transition: 'background 0.3s'
                                            }}
                                        >
                                            <div style={{
                                                width: '14px', height: '14px',
                                                background: '#fff',
                                                borderRadius: '50%',
                                                position: 'absolute',
                                                top: '3px',
                                                left: toggles[item.id] ? '23px' : '3px',
                                                transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-purple)', marginBottom: '0.5rem' }}>Sentinel Tip:</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    Enable &quot;Predictive Auto-Fix&quot; to allow the AI to patch discovered business logic vulnerabilities in Real-time.
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="cyber-card" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                            <h3 className="font-headline" style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: '1rem', textTransform: 'uppercase' }}>
                                Quick Commands
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <button className="btn-cyber" style={{ width: '100%', fontSize: '0.8rem' }}>
                                    <span>⚡ Force Deep Scan</span>
                                </button>
                                <button className="btn-cyber" style={{ width: '100%', fontSize: '0.8rem' }}>
                                    <span>🛡️ Hardwall Lockdown</span>
                                </button>
                                <button className="btn-cyber btn-danger" style={{ width: '100%', fontSize: '0.8rem' }}>
                                    <span>☢️ Purge Session Cache</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </main>

            <AiChatbot />
        </div>
    );
}
