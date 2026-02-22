'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AiChatbot } from '@/components/AiChatbot';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if (!email || !password) {
            setError('All fields required');
            return;
        }
        setError('');
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1500));

        // Demo credentials check
        if (email === 'operator@architect.io' && password === 'ghost2024') {
            setSuccess(true);
        } else {
            setError('Invalid credentials. Try: operator@architect.io / ghost2024');
        }
        setLoading(false);
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background */}
            <div className="cyber-grid" style={{ position: 'fixed', inset: 0, zIndex: 0 }} />
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'radial-gradient(ellipse at center, rgba(0, 229, 255, 0.04) 0%, transparent 70%)',
                    zIndex: 0,
                }}
            />

            {/* Scan line */}
            <div
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
                    animation: 'ticker-scroll 4s linear infinite',
                    zIndex: 1,
                }}
            />

            {/* Login Card */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '100%',
                    maxWidth: '420px',
                    padding: '1.5rem',
                }}
            >
                <div
                    style={{
                        background: 'rgba(5, 15, 31, 0.92)',
                        border: '1px solid rgba(0, 229, 255, 0.25)',
                        borderRadius: '16px',
                        padding: '2.5rem',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 0 60px rgba(0, 229, 255, 0.1), 0 0 120px rgba(0, 229, 255, 0.04)',
                    }}
                >
                    {/* Logo */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div
                            style={{
                                width: '60px', height: '60px',
                                margin: '0 auto 1rem',
                                border: '2px solid var(--accent-cyan)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                background: 'rgba(0, 229, 255, 0.08)',
                                animation: 'float 4s ease-in-out infinite',
                            }}
                        >
                            <span style={{ color: 'var(--accent-cyan)', fontSize: '24px', fontWeight: 700 }}>A</span>
                        </div>
                        <div className="font-headline" style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                            PROJECT ARCHITECT
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', letterSpacing: '0.15em', marginTop: '0.2rem' }}>
                            OPERATOR PORTAL — GHOST PROTOCOL
                        </div>
                    </div>

                    {success ? (
                        <div style={{ textAlign: 'center', animation: 'slide-up 0.4s ease-out' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                            <div className="font-headline" style={{ color: 'var(--accent-green)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                Access Granted
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginBottom: '1.5rem' }}>
                                Welcome, Operator. Ghost Protocol Active.
                            </div>
                            <Link href="/" style={{ textDecoration: 'none' }}>
                                <button
                                    style={{
                                        width: '100%', padding: '0.75rem',
                                        background: 'var(--accent-green)', border: 'none',
                                        borderRadius: '8px', color: '#000',
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                                    }}
                                >
                                    ⚡ Enter Command Center
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                                        Operator ID
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="operator@architect.io"
                                        className="cyber-input"
                                        autoComplete="email"
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                                        Ghost Key
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="cyber-input"
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            {/* Demo hint */}
                            <div style={{
                                padding: '0.6rem 0.9rem',
                                background: 'rgba(168, 85, 247, 0.08)',
                                border: '1px solid rgba(168, 85, 247, 0.2)',
                                borderRadius: '6px',
                                marginBottom: '1rem',
                                fontSize: '0.72rem',
                                color: 'var(--accent-purple)',
                                lineHeight: 1.5,
                            }}>
                                <strong>Demo:</strong> operator@architect.io / ghost2024
                            </div>

                            {error && (
                                <div style={{
                                    padding: '0.6rem 0.9rem',
                                    background: 'rgba(255, 51, 102, 0.08)',
                                    border: '1px solid rgba(255, 51, 102, 0.3)',
                                    borderRadius: '6px',
                                    marginBottom: '1rem',
                                    fontSize: '0.75rem',
                                    color: 'var(--accent-red)',
                                }}>
                                    ⚠️ {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%', padding: '0.8rem',
                                    background: loading ? 'rgba(0, 229, 255, 0.2)' : 'var(--accent-cyan)',
                                    border: '1px solid var(--accent-cyan)',
                                    borderRadius: '8px',
                                    color: loading ? 'var(--accent-cyan)' : '#000',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
                                    fontSize: '0.9rem',
                                    letterSpacing: '0.05em',
                                    transition: 'all 0.3s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                }}
                            >
                                {loading ? (
                                    <><span style={{ animation: 'pulse-glow 1s ease-in-out infinite' }}>⚡</span> Authenticating...</>
                                ) : '🔐 Initiate Ghost Protocol'}
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                                <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                                    ← Return to Command Center
                                </Link>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.65rem', color: 'rgba(0,229,255,0.25)', letterSpacing: '0.1em' }}>
                    ARCHITECT SENTINEL v3.0 · ENCRYPTED CHANNEL · AUTHORIZED USE ONLY
                </div>
            </div>

            <AiChatbot />
        </div>
    );
}
