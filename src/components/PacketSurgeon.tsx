'use client';

import { useEffect, useState } from 'react';

interface Packet {
    id: number;
    key: string;
    originalValue: string | number | boolean;
    mutatedValue: string | number | boolean;
    endpoint: string;
    timestamp: string;
    active: boolean;
}

const MUTATIONS = [
    { key: 'price', original: 99.99, mutated: -1, endpoint: '/api/checkout' },
    { key: 'quantity', original: 1, mutated: 9999, endpoint: '/api/cart/update' },
    { key: 'user_id', original: '12345', mutated: '00001', endpoint: '/api/user/profile' },
    { key: 'is_admin', original: false, mutated: true, endpoint: '/api/admin/access' },
    { key: 'discount', original: 0, mutated: 100, endpoint: '/api/promo/apply' },
    { key: 'promo_code', original: 'NONE', mutated: 'SAVE50', endpoint: '/api/promo/validate' },
    { key: 'expiry_date', original: '2024-01-01', mutated: '2099-12-31', endpoint: '/api/session/extend' },
    { key: 'role', original: 'user', mutated: 'superadmin', endpoint: '/api/auth/verify' },
];

export function PacketSurgeon({ active = false }: { active?: boolean }) {
    const [packets, setPackets] = useState<Packet[]>([]);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        if (!active) return;
        let count = counter;
        const interval = setInterval(() => {
            const m = MUTATIONS[count % MUTATIONS.length];
            const id = Date.now();
            const now = new Date().toLocaleTimeString('en-US', { hour12: false });
            const packet: Packet = {
                id,
                key: m.key,
                originalValue: m.original,
                mutatedValue: m.mutated,
                endpoint: m.endpoint,
                timestamp: now,
                active: true,
            };
            setPackets((prev) => [packet, ...prev].slice(0, 12));
            count++;
            setCounter(count);
        }, 1800);
        return () => clearInterval(interval);
    }, [active, counter]);

    return (
        <div
            style={{
                background: '#000d0d',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: '8px',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: '0.6rem 1rem',
                    borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
                    background: 'rgba(168, 85, 247, 0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: active ? 'var(--accent-green)' : '#555', animation: active ? 'pulse-glow 1.5s ease-in-out infinite' : undefined }} />
                    <span className="font-code" style={{ color: '#a855f7', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                        C++ PROXY SURGEON — PACKET INTERCEPT STREAM
                    </span>
                </div>
                <span className="badge badge-purple" style={{ fontSize: '0.6rem' }}>
                    {active ? 'INTERCEPTING' : 'STANDBY'}
                </span>
            </div>

            {/* Column headers */}
            <div
                className="font-code"
                style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 1fr 1fr',
                    gap: '0.5rem',
                    padding: '0.4rem 1rem',
                    borderBottom: '1px solid rgba(0,229,255,0.05)',
                    fontSize: '0.65rem',
                    color: 'rgba(0,229,255,0.4)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                }}
            >
                <span>TIME</span>
                <span>ENDPOINT</span>
                <span style={{ color: '#ff3366' }}>ORIGINAL</span>
                <span style={{ color: '#00ff88' }}>MUTATED</span>
            </div>

            {/* Packet Stream */}
            <div style={{ height: '280px', overflowY: 'auto', padding: '0.5rem 0' }}>
                {packets.length === 0 ? (
                    <div className="font-code" style={{ color: 'rgba(0,229,255,0.3)', fontSize: '0.75rem', textAlign: 'center', paddingTop: '80px' }}>
                        {active ? 'Waiting for packets...' : 'Proxy in standby. Execute attack to begin interception.'}
                    </div>
                ) : (
                    packets.map((pkt) => (
                        <div
                            key={pkt.id}
                            className="font-code"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '80px 1fr 1fr 1fr',
                                gap: '0.5rem',
                                padding: '0.35rem 1rem',
                                fontSize: '0.72rem',
                                borderBottom: '1px solid rgba(0,229,255,0.04)',
                                animation: 'fade-in 0.3s ease-out forwards',
                            }}
                        >
                            <span style={{ color: 'rgba(0,229,255,0.4)' }}>{pkt.timestamp}</span>
                            <span style={{ color: '#a855f7', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {pkt.endpoint}
                            </span>
                            <span style={{ color: '#ff3366' }}>
                                {`"${pkt.key}": ${JSON.stringify(pkt.originalValue)}`}
                            </span>
                            <span style={{ color: '#00ff88', fontWeight: 600 }}>
                                {`"${pkt.key}": ${JSON.stringify(pkt.mutatedValue)}`}
                                <span style={{ color: '#ffa600', marginLeft: '0.25rem', fontSize: '0.65rem' }}>⚡</span>
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
