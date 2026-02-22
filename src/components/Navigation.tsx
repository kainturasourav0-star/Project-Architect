'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pipelineItems = [
    { href: '/', label: 'Dashboard', icon: '⬡' },
    { href: '/ingest', label: 'Ingest', icon: '◈' },
    { href: '/analyze', label: 'Analyze', icon: '◎' },
    { href: '/execute', label: 'Execute', icon: '▶' },
];

const toolItems = [
    { href: '/targets', label: 'Targets', icon: '🎯' },
    { href: '/history', label: 'History', icon: '📂' },
    { href: '/protector', label: 'Protector', icon: '🛡️' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
];

const steps = ['/ingest', '/analyze', '/execute'];

export function Navigation() {
    const pathname = usePathname();
    const [time, setTime] = useState('');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const currentStep = steps.indexOf(pathname) + 1;

    return (
        <nav
            style={{
                background: scrolled ? 'rgba(2, 11, 24, 0.95)' : 'rgba(2, 11, 24, 0.8)',
                borderBottom: '1px solid rgba(0, 229, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                transition: 'background 0.3s',
            }}
        >
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                    {/* Logo */}
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div
                                style={{
                                    width: '36px', height: '36px',
                                    border: '2px solid var(--accent-cyan)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                    background: 'rgba(0, 229, 255, 0.1)',
                                }}
                            >
                                <span style={{ color: 'var(--accent-cyan)', fontSize: '14px', fontWeight: 700 }}>A</span>
                            </div>
                            <div>
                                <div className="font-headline" style={{ color: 'var(--accent-cyan)', fontSize: '1rem', fontWeight: 700, lineHeight: 1, letterSpacing: '0.05em' }}>
                                    PROJECT ARCHITECT
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.6rem', letterSpacing: '0.12em' }}>
                                    LOGIC TUNNELER v3.0
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Nav Items — Pipeline */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
                        {pipelineItems.map((item: { href: string; label: string; icon: string }) => {
                            const active = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                                    <div
                                        style={{
                                            padding: '0.4rem 0.85rem',
                                            borderRadius: '4px',
                                            color: active ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                                            background: active ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
                                            border: active ? '1px solid rgba(0, 229, 255, 0.2)' : '1px solid transparent',
                                            fontSize: '0.82rem',
                                            fontWeight: active ? 600 : 400,
                                            display: 'flex', alignItems: 'center', gap: '0.35rem',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                            fontFamily: "'Space Grotesk', sans-serif",
                                        }}
                                    >
                                        <span style={{ fontSize: '11px' }}>{item.icon}</span>
                                        {item.label}
                                    </div>
                                </Link>
                            );
                        })}


                        {/* Divider */}
                        <div style={{ width: '1px', height: '20px', background: 'rgba(0,229,255,0.18)', margin: '0 0.4rem' }} />

                        {/* Tools */}
                        {toolItems.map((item: { href: string; label: string; icon: string }) => {
                            const active = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                                    <div
                                        style={{
                                            padding: '0.4rem 0.75rem',
                                            borderRadius: '4px',
                                            color: active ? 'var(--accent-purple)' : 'var(--text-secondary)',
                                            background: active ? 'rgba(168,85,247,0.08)' : 'transparent',
                                            border: active ? '1px solid rgba(168,85,247,0.25)' : '1px solid transparent',
                                            fontSize: '0.82rem',
                                            fontWeight: active ? 600 : 400,
                                            display: 'flex', alignItems: 'center', gap: '0.35rem',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                            fontFamily: "'Space Grotesk', sans-serif",
                                        }}
                                    >
                                        <span style={{ fontSize: '11px' }}>{item.icon}</span>
                                        {item.label}
                                    </div>
                                </Link>
                            );
                        })}

                    </div>


                    {/* Right: Time + Login */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {currentStep > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {steps.map((s, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: '28px', height: '4px',
                                            borderRadius: '2px',
                                            background: i < currentStep ? 'var(--accent-cyan)' : 'rgba(0,229,255,0.15)',
                                            transition: 'background 0.3s',
                                        }}
                                    />
                                ))}
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginLeft: '0.25rem' }}>
                                    Step {currentStep}/3
                                </span>
                            </div>
                        )}
                        <span className="font-code" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                            {time}
                        </span>
                        <Link href="/login" style={{ textDecoration: 'none' }}>
                            <button className="btn-cyber" style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}>
                                <span>Operator</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
