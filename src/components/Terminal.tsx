'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

export interface TerminalLog {
    text: string;
    type?: 'info' | 'warn' | 'attack' | 'success' | 'error' | 'system' | 'proxy';
    delay?: number;
}

interface TerminalProps {
    title?: string;
    initialLogs?: TerminalLog[];
    autoScroll?: boolean;
    height?: string;
}

export interface TerminalHandle {
    addLog: (log: TerminalLog) => void;
    clear: () => void;
    addLogs: (logs: TerminalLog[]) => void;
}

const LOG_COLORS: Record<string, string> = {
    info: '#6b9bbf',
    warn: '#ffa600',
    attack: '#ff3366',
    success: '#00ff88',
    error: '#ff3366',
    system: '#00e5ff',
    proxy: '#a855f7',
};

const LOG_PREFIXES: Record<string, string> = {
    info: '[*]',
    warn: '[!]',
    attack: '[ATTACK]',
    success: '[✓]',
    error: '[ERR]',
    system: '[SYS]',
    proxy: '[PROXY]',
};

export const Terminal = forwardRef<TerminalHandle, TerminalProps>(
    ({ title = 'ARCHITECT ENGINE', initialLogs = [], autoScroll = true, height = '400px' }, ref) => {
        const [logs, setLogs] = useState<(TerminalLog & { id: number })[]>([]);
        const bottomRef = useRef<HTMLDivElement>(null);
        const counterRef = useRef(0);

        useEffect(() => {
            if (initialLogs.length > 0) {
                setLogs(initialLogs.map((l) => ({ ...l, id: ++counterRef.current })));
            }
        }, [initialLogs]);

        useEffect(() => {
            if (autoScroll && bottomRef.current) {
                bottomRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, [logs, autoScroll]);

        useImperativeHandle(ref, () => ({
            addLog(log: TerminalLog) {
                setLogs((prev) => [...prev, { ...log, id: ++counterRef.current }]);
            },
            clear() {
                setLogs([]);
            },
            addLogs(newLogs: TerminalLog[]) {
                let i = 0;
                const addNext = () => {
                    if (i >= newLogs.length) return;
                    const log = newLogs[i++];
                    setLogs((prev) => [...prev, { ...log, id: ++counterRef.current }]);
                    setTimeout(addNext, log.delay ?? 400);
                };
                addNext();
            },
        }));

        return (
            <div className="terminal-bg" style={{ borderRadius: '8px', height }}>
                {/* Title Bar */}
                <div
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.5rem 1rem',
                        borderBottom: '1px solid rgba(0, 229, 255, 0.15)',
                        background: 'rgba(0, 229, 255, 0.04)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57' }} />
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#febc2e' }} />
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28c840' }} />
                        <span className="font-code" style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', marginLeft: '0.5rem', letterSpacing: '0.1em' }}>
                            {title}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)', animation: 'pulse-glow 2s ease-in-out infinite' }} />
                        <span className="font-code" style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>ACTIVE</span>
                    </div>
                </div>

                {/* Logs */}
                <div className="terminal-content" style={{ padding: '1rem', height: `calc(${height} - 40px)`, overflowY: 'auto' }}>
                    {logs.map((log) => {
                        const type = log.type || 'info';
                        const color = LOG_COLORS[type] || LOG_COLORS.info;
                        const prefix = LOG_PREFIXES[type] || '[*]';
                        return (
                            <div
                                key={log.id}
                                className="font-code"
                                style={{
                                    fontSize: '0.78rem',
                                    marginBottom: '0.2rem',
                                    lineHeight: 1.6,
                                    animation: 'fade-in 0.2s ease-out forwards',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                }}
                            >
                                <span style={{ color: 'rgba(0, 229, 255, 0.4)', userSelect: 'none' }}>
                                    {new Date().toLocaleTimeString('en-US', { hour12: false })} {' '}
                                </span>
                                <span style={{ color, fontWeight: type === 'attack' || type === 'system' ? 700 : 400 }}>
                                    {prefix} {log.text}
                                </span>
                            </div>
                        );
                    })}
                    <div className="font-code" style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
                        <span style={{ animation: 'blink 1s step-end infinite' }}>█</span>
                    </div>
                    <div ref={bottomRef} />
                </div>
            </div>
        );
    }
);

Terminal.displayName = 'Terminal';
