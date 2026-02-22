'use client';

import { useEffect, useState, useMemo } from 'react';

export function SplashScreen({ onDone }: { onDone: () => void }) {
    const [phase, setPhase] = useState<'boot' | 'scan' | 'reveal' | 'exit'>('boot');
    const [bootLines, setBootLines] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [scanComplete, setScanComplete] = useState(false);

    const BOOT_LOG = useMemo(() => [
        'BIOS v3.0 — Architect Sentinel Core initializing...',
        'CPU: i7-8750H | RAM: 8192MB | DISK: 256GB SSD',
        'Loading ghost_engine.exe ......... OK',
        'Loading proxy_surgeon.dll ........ OK',
        'Loading neural_parser.mod ........ OK',
        'Mounting OpenCV + Pytesseract ...... OK',
        'Spawning Chromium (headless) ...... OK',
        'C++ Proxy binding to :8080 ........ OK',
        'Playwright attack suite ready .... OK',
        '> SYSTEM ARMED — ALL MODULES FUNCTIONAL',
    ], []);

    useEffect(() => {
        let i = 0;
        const logTimer = setInterval(() => {
            if (i < BOOT_LOG.length) {
                setBootLines((p) => [...p, BOOT_LOG[i]]);
                i++;
            } else {
                clearInterval(logTimer);
            }
        }, 160);
        return () => clearInterval(logTimer);
    }, [BOOT_LOG]);

    useEffect(() => {
        const progTimer = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    clearInterval(progTimer);
                    setTimeout(() => {
                        setScanComplete(true);
                        setPhase('scan');
                        setTimeout(() => {
                            setPhase('exit');
                            setTimeout(onDone, 700);
                        }, 900);
                    }, 300);
                    return 100;
                }
                return p + 2;
            });
        }, 40);
        return () => clearInterval(progTimer);
    }, [onDone]);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: '#020b18',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: phase === 'exit' ? 0 : 1,
                transition: phase === 'exit' ? 'opacity 0.6s ease' : 'none',
                overflow: 'hidden',
            }}
        >
            {/* Grid bg */}
            <div className="cyber-grid" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />

            {/* Scan line sweep */}
            {phase === 'scan' && (
                <div
                    style={{
                        position: 'absolute',
                        left: 0, right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent, #00e5ff, transparent)',
                        boxShadow: '0 0 20px 4px rgba(0,229,255,0.6)',
                        animation: 'scan-down 0.85s ease-in-out forwards',
                    }}
                />
            )}

            {/* Hexagonal logo */}
            <div style={{ position: 'relative', marginBottom: '2rem', animation: 'float 3s ease-in-out infinite' }}>
                {/* Outer ring */}
                <div
                    style={{
                        width: '120px', height: '120px',
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        border: '3px solid var(--accent-cyan)',
                        background: 'rgba(0,229,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 40px rgba(0,229,255,0.35), inset 0 0 24px rgba(0,229,255,0.05)',
                        animation: 'pulse-glow 2s ease-in-out infinite',
                    }}
                >
                    <span
                        className="font-headline"
                        style={{
                            fontSize: '3rem',
                            fontWeight: 900,
                            background: 'linear-gradient(135deg, #00e5ff, #a855f7)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.05em',
                        }}
                    >
                        A
                    </span>
                </div>

                {/* Orbiting dot */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        width: '8px', height: '8px',
                        borderRadius: '50%',
                        background: 'var(--accent-cyan)',
                        boxShadow: '0 0 10px 4px rgba(0,229,255,0.7)',
                        transformOrigin: '0 0',
                        animation: 'orbit 2s linear infinite',
                    }}
                />
            </div>

            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div
                    className="font-headline"
                    style={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        letterSpacing: '0.18em',
                        background: 'linear-gradient(90deg, #00e5ff, #a855f7, #00e5ff)',
                        backgroundSize: '200% 100%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'gradient-shift 2.5s ease-in-out infinite',
                    }}
                >
                    PROJECT ARCHITECT
                </div>
                <div className="font-code" style={{ fontSize: '0.72rem', color: 'rgba(0,229,255,0.5)', letterSpacing: '0.2em', marginTop: '0.4rem' }}>
                    VISUAL-TO-EXPLOIT LOGIC TUNNELER
                </div>
            </div>

            {/* Boot log */}
            <div
                className="terminal-bg font-code"
                style={{
                    width: '100%',
                    maxWidth: '540px',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    maxHeight: '200px',
                    overflowY: 'hidden',
                }}
            >
                {bootLines.map((line, i) => (
                    <div
                        key={i}
                        style={{
                            fontSize: '0.68rem',
                            lineHeight: 1.8,
                            color: line.startsWith('>') ? 'var(--accent-green)' : line.includes('OK') ? 'var(--accent-cyan)' : 'rgba(0,229,255,0.5)',
                            animation: 'fade-in 0.15s ease-out',
                        }}
                    >
                        {line}
                    </div>
                ))}
                {bootLines.length < BOOT_LOG.length && (
                    <span style={{ color: 'var(--accent-cyan)', animation: 'blink 0.6s step-end infinite' }}>█</span>
                )}
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%', maxWidth: '540px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span className="font-code" style={{ fontSize: '0.65rem', color: 'rgba(0,229,255,0.5)' }}>
                        {scanComplete ? 'SYSTEM READY' : 'INITIALIZING MODULES'}
                    </span>
                    <span className="font-code" style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>{progress}%</span>
                </div>
                <div style={{ height: '3px', background: 'rgba(0,229,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                        style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
                            boxShadow: '0 0 10px rgba(0,229,255,0.8)',
                            transition: 'width 0.04s linear',
                            borderRadius: '2px',
                        }}
                    />
                </div>
                {scanComplete && (
                    <div
                        className="font-code"
                        style={{
                            textAlign: 'center',
                            marginTop: '1rem',
                            color: 'var(--accent-green)',
                            fontSize: '0.8rem',
                            letterSpacing: '0.1em',
                            animation: 'pulse-glow 0.8s ease-in-out infinite',
                        }}
                    >
                        ✓ ALL SYSTEMS NOMINAL — ENTERING COMMAND CENTER
                    </div>
                )}
            </div>
        </div>
    );
}
