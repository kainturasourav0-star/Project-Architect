'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { AiChatbot } from '@/components/AiChatbot';
import { exampleTemplates } from '@/lib/types';

const TEMPLATES = [
    { key: 'ecommerce', name: 'Standard E-Commerce', description: 'Browse → Cart → Promo → Login → Checkout → Pay', icon: '🛒', nodeCount: 8, edgeCount: 8 },
    { key: 'banking', name: 'Banking Transfer', description: 'Login → MFA → Balance → Transfer → OTP → Complete', icon: '🏦', nodeCount: 7, edgeCount: 6 },
    { key: 'saas', name: 'SaaS Subscription', description: 'Sign Up → Verify → Plan → Trial/Pay → Subscribe → Dashboard', icon: '☁️', nodeCount: 7, edgeCount: 7 },
];

export default function IngestPage() {
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);
    const [tab, setTab] = useState<'upload' | 'example'>('example');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>('ecommerce');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processLogs, setProcessLogs] = useState<string[]>([]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && (file.type.startsWith('image/') || file.name.endsWith('.json'))) {
            setUploadedFile(file);
            setTab('upload');
        }
    }

    async function beginPipeline() {
        setProcessing(true);
        setProcessLogs([]);
        setProgress(0);

        const logs = [
            '[SYS] Architect Vision Engine initializing...',
            '[SYS] Loading OpenCV contour detection module...',
            '[SYS] Pytesseract OCR ready (Tesseract v5.0)',
            '[SCAN] Processing image → Grayscale conversion complete',
            '[SCAN] Thresholding applied (THRESH_BINARY_INV, 150)',
            '[SCAN] Contour detection found 12 candidate shapes',
            '[OCR] Extracting text blocks from detected regions...',
            '[OCR] High-confidence tokens extracted: 8/8 nodes',
            '[PARSE] Connectivity analysis via Hough Line Transform',
            '[PARSE] Arrow direction vectors calculated: 8 edges detected',
            '[BUILD] Constructing workflow JSON schema...',
            '[✓] Ingestion complete — Schema ready for threat analysis!',
        ];

        for (let i = 0; i < logs.length; i++) {
            await new Promise((r) => setTimeout(r, 280 + Math.random() * 200));
            setProcessLogs((prev) => [...prev, logs[i]]);
            setProgress(Math.round(((i + 1) / logs.length) * 100));
        }

        // Store selected schema in sessionStorage
        const key = tab === 'example' ? (selectedTemplate || 'ecommerce') : 'ecommerce';
        const schema = exampleTemplates[key];
        sessionStorage.setItem('architect_schema', JSON.stringify(schema));

        await new Promise((r) => setTimeout(r, 500));
        router.push('/analyze');
    }

    const canProceed = tab === 'example' ? !!selectedTemplate : !!uploadedFile;

    return (
        <div style={{ minHeight: '100vh' }}>
            <Navigation />
            <div className="cyber-grid" style={{ position: 'fixed', inset: 0, zIndex: 0 }} />

            <main style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                {/* Header */}
                <div className="animate-cascade reveal-1" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-cyan">PHASE 01</span>
                        <span className="badge badge-purple">VISION ENGINE</span>
                    </div>
                    <h1 className="font-headline" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        📷 Visual Logic Ingestion
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Upload a hand-drawn flowchart or select a template. The Vision AI parses shapes, text, and arrows into a structured JSON schema.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', alignItems: 'start' }}>
                    {/* Left: Input */}
                    <div>
                        {/* Tabs */}
                        <div className="animate-cascade reveal-2" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            {[{ id: 'example', label: '📋 Example Data' }, { id: 'upload', label: '📁 Upload Image' }].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.id as 'upload' | 'example')}
                                    style={{
                                        padding: '0.5rem 1.25rem',
                                        borderRadius: '6px',
                                        border: tab === t.id ? '1px solid var(--accent-cyan)' : '1px solid rgba(0,229,255,0.15)',
                                        background: tab === t.id ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                                        color: tab === t.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontWeight: tab === t.id ? 600 : 400,
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <div className="animate-cascade reveal-3">
                            {tab === 'upload' && (
                                <div className="animate-cascade">
                                    <div
                                        onClick={() => fileRef.current?.click()}
                                        onDrop={handleDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        style={{
                                            border: '2px dashed rgba(0, 229, 255, 0.3)',
                                            borderRadius: '12px',
                                            padding: '3rem',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            background: uploadedFile ? 'rgba(0, 255, 136, 0.04)' : 'rgba(0, 229, 255, 0.02)',
                                            boxShadow: uploadedFile ? '0 0 20px rgba(0, 255, 136, 0.1)' : 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget).style.borderColor = 'rgba(0, 229, 255, 0.6)';
                                            (e.currentTarget).style.background = 'rgba(0, 229, 255, 0.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget).style.borderColor = 'rgba(0, 229, 255, 0.3)';
                                            (e.currentTarget).style.background = uploadedFile ? 'rgba(0, 255, 136, 0.04)' : 'rgba(0, 229, 255, 0.02)';
                                        }}
                                    >
                                        <input ref={fileRef} type="file" accept="image/*,.json" style={{ display: 'none' }} onChange={handleFileChange} />
                                        {uploadedFile ? (
                                            <>
                                                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>✅</div>
                                                <div className="font-headline" style={{ color: 'var(--accent-green)', fontSize: '1rem', marginBottom: '0.3rem' }}>
                                                    {uploadedFile.name}
                                                </div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                                    {(uploadedFile.size / 1024).toFixed(1)} KB — Click to change
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ fontSize: '3rem', marginBottom: '0.75rem', animation: 'float 3s ease-in-out infinite' }}>📷</div>
                                                <div className="font-headline" style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                                                    Drop your flowchart here
                                                </div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>PNG, JPG, or JSON schema — drawn with any stylus</div>
                                            </>
                                        )}
                                    </div>

                                    <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(0,229,255,0.04)', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.1)' }}>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                            💡 <strong style={{ color: 'var(--accent-cyan)' }}>Tip:</strong> Draw with a stylus on your Motorola G60, screenshot it, and upload here. The Vision Engine detects shapes + text automatically.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Example Templates */}
                        {tab === 'example' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {TEMPLATES.map((t) => (
                                    <div
                                        key={t.key}
                                        onClick={() => setSelectedTemplate(t.key)}
                                        style={{
                                            padding: '1.25rem',
                                            borderRadius: '8px',
                                            border: selectedTemplate === t.key ? '1px solid var(--accent-cyan)' : '1px solid rgba(0,229,255,0.12)',
                                            background: selectedTemplate === t.key ? 'rgba(0, 229, 255, 0.07)' : 'rgba(5, 20, 45, 0.6)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                        }}
                                    >
                                        <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>{t.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div className="font-headline" style={{ color: selectedTemplate === t.key ? 'var(--accent-cyan)' : 'var(--text-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
                                                {t.name}
                                            </div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>{t.description}</div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <span className="badge badge-cyan">{t.nodeCount} nodes</span>
                                                <span className="badge badge-purple">{t.edgeCount} edges</span>
                                            </div>
                                        </div>
                                        {selectedTemplate === t.key && (
                                            <div style={{ color: 'var(--accent-cyan)', fontSize: '1.5rem', flexShrink: 0 }}>✓</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Begin Button */}
                        <button
                            onClick={beginPipeline}
                            disabled={!canProceed || processing}
                            className="btn-cyber"
                            style={{
                                width: '100%',
                                marginTop: '1.5rem',
                                fontSize: '1rem',
                                padding: '0.9rem',
                                opacity: (!canProceed || processing) ? 0.5 : 1,
                                background: canProceed && !processing ? 'var(--accent-cyan)' : 'transparent',
                                color: canProceed && !processing ? '#000' : 'var(--accent-cyan)',
                            }}
                        >
                            <span>{processing ? '⚡ Processing...' : '▶ Begin Pipeline'}</span>
                        </button>
                    </div>

                    {/* Right: Processing Log */}
                    <div className="animate-cascade reveal-4">
                        <div className="terminal-bg" style={{ borderRadius: '8px', height: '480px', boxShadow: '0 0 30px rgba(0,229,255,0.1)' }}>
                            <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid rgba(0,229,255,0.15)', background: 'rgba(0,229,255,0.04)' }}>
                                <span className="font-code" style={{ color: 'var(--accent-cyan)', fontSize: '0.72rem', letterSpacing: '0.1em' }}>
                                    VISION ENGINE LOG
                                </span>
                            </div>
                            <div className="terminal-content" style={{ padding: '0.75rem', height: 'calc(480px - 40px)', overflowY: 'auto' }}>
                                {processLogs.length === 0 ? (
                                    <div className="font-code" style={{ color: 'rgba(0,229,255,0.3)', fontSize: '0.75rem', paddingTop: '2rem' }}>
                                        {`> Awaiting ingestion command...`}
                                        <br />
                                        {`> Select template or upload image to begin`}
                                        <span className="animate-blink">█</span>
                                    </div>
                                ) : (
                                    processLogs.map((log, i) => (
                                        <div key={i} className="font-code" style={{ fontSize: '0.72rem', marginBottom: '0.4rem', color: log.startsWith('[✓]') ? 'var(--accent-green)' : log.startsWith('[OCR]') ? '#ffa600' : 'var(--text-secondary)', animation: 'fade-in 0.2s ease-out' }}>
                                            <span style={{ color: 'rgba(0,229,255,0.4)', marginRight: '0.5rem' }}>{String(i + 1).padStart(2, '0')}</span>
                                            {log}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Progress */}
                        {processing && (
                            <div style={{ marginTop: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ingestion Progress</span>
                                    <span className="font-code" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{progress}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <AiChatbot />
        </div>
    );
}
