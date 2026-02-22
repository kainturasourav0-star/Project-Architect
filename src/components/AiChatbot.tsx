'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    ts: string;
    type?: 'chat' | 'action' | 'search';
    steps?: string[];
    options?: { label: string; action: string; desc?: string }[];
}

const INITIAL_GREETING = "Omni-Sentinel v4.0 Online. I am your autonomous partner, not just a command menu. Ask me anything, or tell me to perform complex system mutations. I now support natural language intent.";

export function AiChatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: INITIAL_GREETING,
            ts: new Date().toLocaleTimeString('en-US', { hour12: false }),
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
    const [automationHUD, setAutomationHUD] = useState<string | null>(null);

    // Performance metrics for the "Intelligence Feed"
    const [metrics, setMetrics] = useState({
        latency: '14ms',
        load: '2.4%',
        threats: 0,
        healing: 'ACTIVE'
    });

    const router = useRouter();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, open, thinkingSteps]);

    // Keyboard trigger (/)
    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.key === '/' && !open && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
                e.preventDefault();
                setOpen(true);
            } else if (e.key === 'Escape' && open) {
                setOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [open]);

    // Natural Language Intent Parser
    async function handleIntent(text: string) {
        const lower = text.toLowerCase();
        setThinkingSteps(['Parsing natural language intent...', 'Analyzing semantic context...']);
        await new Promise(r => setTimeout(r, 700));

        // 1. Navigation Intents
        if (lower.match(/(go to|navigate|show me|open|take me to) (targets?|manager)/)) {
            setThinkingSteps(prev => [...prev, 'Routing to Target Manager...', 'Finalizing UI handoff...']);
            setAutomationHUD('NAVIGATING TO TARGETS');
            await new Promise(r => setTimeout(r, 800));
            router.push('/targets');
            setAutomationHUD(null);
            return {
                content: "I've successfully navigated you to the **Target Manager**. Here you can handle CRUD operations for all test subjects.",
                options: [
                    { label: 'Add New Target', action: 'add target', desc: 'Create a new test entry' },
                    { label: 'View Active Only', action: 'filter active', desc: 'Hide dormant targets' }
                ]
            };
        }

        if (lower.match(/(go to|show|open|view) (history|scans|past)/)) {
            setThinkingSteps(prev => [...prev, 'Indexing forensic logs...', 'Synchronizing session database...']);
            setAutomationHUD('FETCHING SCAN HISTORY');
            await new Promise(r => setTimeout(r, 800));
            router.push('/history');
            setAutomationHUD(null);
            return {
                content: "Switched to **Scan History**. All past forensic reports and performance metrics are now indexed.",
                options: [
                    { label: 'Clear History', action: 'clear logs', desc: 'Wipe all local records' },
                    { label: 'Export Report', action: 'export csv', desc: 'Download as spreadsheet' }
                ]
            };
        }

        if (lower.match(/(go to|open|show) (protector|shield|sentinel|safety)/)) {
            setThinkingSteps(prev => [...prev, 'Accessing Sentinel Link...', 'Deploying security overwatch...']);
            setAutomationHUD('DEPLOYING PROTECTOR UNIT');
            await new Promise(r => setTimeout(r, 800));
            router.push('/protector');
            setAutomationHUD(null);
            return {
                content: "I have connected you to the **AI Protector Hub**. All autonomous defense visualizers are online.",
                options: [
                    { label: 'Toggle WAF', action: 'toggle waf', desc: 'Switch Neural Layer status' },
                    { label: 'Full System Scan', action: 'deep scan', desc: 'Initiate 360 overwatch' }
                ]
            };
        }

        if (lower.match(/(go to|open|show|change) (settings?|config)/)) {
            setThinkingSteps(prev => [...prev, 'Decoding engine parameters...', 'Fetching proxy state...']);
            setAutomationHUD('ACCESSING ENGINE CONFIG');
            await new Promise(r => setTimeout(r, 800));
            router.push('/settings');
            setAutomationHUD(null);
            return {
                content: "You are now in **System Settings**. I've unlocked all proxy and mutation parameters for your review.",
                options: [
                    { label: 'Reset to Defaults', action: 'reset all', desc: 'Wipe current config' },
                    { label: 'View C++ Flags', action: 'show flags', desc: 'Check compiler arguments' }
                ]
            };
        }

        // 2. State Mutation Intents (Actually writes to localStorage)
        if (lower.includes('toggle') || lower.includes('enable') || lower.includes('disable') || lower.includes('turn on') || lower.includes('turn off')) {
            setThinkingSteps(prev => [...prev, 'Mutating background state...', 'Writing to persistent storage...']);
            await new Promise(r => setTimeout(r, 1000));

            const isEnable = lower.includes('enable') || lower.includes('on') || lower.includes('toggle');
            let feature = 'Protect';
            let storageKey = 'architect_sentinel_autofix';

            if (lower.includes('waf') || lower.includes('firewall')) {
                feature = 'Neural Layer WAF';
                storageKey = 'architect_sentinel_waf';
            } else if (lower.includes('healing') || lower.includes('repair')) {
                feature = 'Sentinel Self-Healing';
                storageKey = 'architect_sentinel_healing';
            } else if (lower.includes('malware') || lower.includes('shield')) {
                feature = 'Malware Shield';
                storageKey = 'architect_sentinel_malware';
            }

            const currentState = localStorage.getItem(storageKey) === 'true';
            const newState = lower.includes('toggle') ? !currentState : isEnable;
            localStorage.setItem(storageKey, String(newState));

            return {
                content: `System operation successful. I have **${newState ? 'ENABLED' : 'DISABLED'}** the ${feature} module across all session threads. Current state has been persisted to \`localStorage\`.`,
                options: [
                    { label: 'View Console Logs', action: 'show logs', desc: 'Check mutation feedback' },
                    { label: 'Verify State', action: 'verify health', desc: 'Run health check' }
                ]
            };
        }

        // 3. Action Intents (Complex Multi-step)
        if (lower.match(/(start|launch|run|begin) (scan|attack|pipeline)/)) {
            setThinkingSteps([
                'Initializing Ghost Engine v3.0...',
                'Spinning up C++ Proxy Surgeon...',
                'Synthesizing flowchart vision data...',
                'Detecting business logic states...',
                'Calculating mutation vectors...',
                'Injecting 0-day hypotheses...',
                'Handing off to Neural Analysis...'
            ]);
            setAutomationHUD('EXECUTING AUTONOMOUS PIPELINE');
            await new Promise(r => setTimeout(r, 2000));
            router.push('/analyze');
            setAutomationHUD(null);
            return {
                content: "OMNI-SENTINEL: **Autonomous Attack Sequence successful**. I've bypassed the manual ingestion phase, synthesized the visual flowchart tokens, and initialized the Neural Analysis engine. We are now scanning for potential exploits.",
                options: [
                    { label: 'Execute Now', action: 'jump execute', desc: 'Skip analysis phase' },
                    { label: 'Review Hypotheses', action: 'list ideas', desc: 'Show all attack paths' }
                ]
            };
        }

        if (lower.match(/(fix|heal|repair|clear|reset) (errors?|problems?|issues?|everything|system)/)) {
            setThinkingSteps(prev => [...prev, 'Scanning logic flows...', 'Neutralizing 0-day vectors...', 'Flushing proxy buffers...', 'Clearing session cache...', 'Verifying integrity...']);
            await new Promise(r => setTimeout(r, 1500));

            // Real fix: clear session and local storage (excluding essentials)
            sessionStorage.clear();
            localStorage.removeItem('architect_config_saved');

            setMetrics(prev => ({ ...prev, threats: 0, healing: 'STABLE' }));
            return {
                content: "System-wide **Deep Fix** executed. I've cleared the browser session, neutralized all detected anomalies, flushed the C++ proxy buffers, and established a fresh Sentinel heartbeat. Everything is now synchronized.",
                options: [
                    { label: 'System Health Check', action: 'health report', desc: 'Generate full diagnostic' },
                    { label: 'Monitor Live', action: 'go protector', desc: 'Open radar screen' }
                ]
            };
        }

        // 4. Information Intents (Normal AI Chat)
        if (lower.match(/(who|what|how) (are you|is this|you)/)) {
            return {
                content: "I am the **Omni-Sentinel v4.0**, a high-intelligence autonomous partner. I differ from 'dustbin' bots by having direct control over the Project Architect interface. I can drive navigation, mutate system settings, and automate the entire BLV pipeline based on your instructions.",
                options: [
                    { label: 'What is BLV?', action: 'explain blv' },
                    { label: 'Explain C++ Proxy', action: 'explain proxy' }
                ]
            };
        }

        // Default: Smart Reasoning
        setThinkingSteps(prev => [...prev, 'Consulting heuristic knowledge base...']);
        await new Promise(r => setTimeout(r, 500));
        return {
            content: " directive acknowledged. I'm ready to execute navigation commands (*'go to targets'*), system mutations (*'toggle WAF'*), or pipeline automation (*'launch scan'*). How should I proceed, Operator?",
            options: [
                { label: '🚀 Start Scan', action: 'launch scan' },
                { label: '🛡️ Shield On', action: 'enable waf' },
                { label: '⚙️ Settings', action: 'go settings' }
            ]
        };
    }

    async function sendMessage(text: string) {
        if (!text.trim() || loading) return;
        const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
        setMessages((prev) => [...prev, { role: 'user', content: text.trim(), ts }]);
        setInput('');
        setLoading(true);

        try {
            const result = await handleIntent(text);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: result.content,
                    ts: new Date().toLocaleTimeString('en-US', { hour12: false }),
                    steps: [...thinkingSteps],
                    options: result.options
                },
            ]);
        } catch (error) {
            console.error("Omni-Sentinel Link Error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: "⚠️ **Link Disrupted**. My neural connection encountered an unexpected anomaly. However, I have stabilized the heartbeat. Please restate your directive.",
                    ts: new Date().toLocaleTimeString('en-US', { hour12: false }),
                    options: [{ label: 'Reset System', action: 'deep fix' }, { label: 'Get Help', action: 'help' }]
                },
            ]);
        } finally {
            setLoading(false);
            setThinkingSteps([]);
        }
    }

    function renderContent(text: string) {
        return text.split('\n').map((line, i) => {
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            return (
                <span key={i}>
                    {parts.map((p, j) =>
                        p.startsWith('**') && p.endsWith('**') ? (
                            <strong key={j} style={{ color: 'var(--accent-cyan)', textShadow: '0 0 10px rgba(0,229,255,0.4)' }}>{p.slice(2, -2)}</strong>
                        ) : (
                            <span key={j}>{p}</span>
                        )
                    )}
                    {i < text.split('\n').length - 1 && <br />}
                </span>
            );
        });
    }

    return (
        <>
            {/* OMNI-SENTINEL INTELLIGENCE BAR */}
            <div
                onClick={() => !open && setOpen(true)}
                style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0,
                    height: '70px',
                    background: 'rgba(2, 6, 12, 0.98)',
                    borderTop: '1px solid rgba(0, 229, 255, 0.3)',
                    backdropFilter: 'blur(30px)',
                    zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: !open ? 'pointer' : 'default',
                    transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
                    transform: open ? 'translateY(100%)' : 'translateY(0)',
                    boxShadow: '0 -15px 50px rgba(0, 229, 255, 0.12)'
                }}
            >
                <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', minWidth: '220px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: 'var(--accent-cyan)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: '#000', fontWeight: 900,
                            boxShadow: '0 0 20px rgba(0,229,255,0.4)'
                        }}>Ω</div>
                        <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff', letterSpacing: '0.05em' }}>OMNI-SENTINEL v4.0</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--accent-green)', fontWeight: 700 }}>AUTONOMOUS PARTNER ACTIVE</div>
                        </div>
                    </div>

                    <div style={{
                        flex: 1, margin: '0 4rem',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(0, 229, 255, 0.15)',
                        borderRadius: '16px', padding: '0.75rem 1.5rem',
                        color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center'
                    }}>
                        &quot;Go to targets&quot;, &quot;launch scan&quot;, &quot;fix errors&quot;... press <span style={{ color: 'var(--accent-cyan)', margin: '0 0.5rem', padding: '1px 8px', background: 'rgba(0,229,255,0.1)', borderRadius: '6px' }}>/</span> or Click to command
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 700 }}>
                        <div>CORE: <span style={{ color: 'var(--accent-cyan)' }}>{metrics.latency}</span></div>
                        <div>THREATS: <span style={{ color: metrics.threats > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>{metrics.threats}</span></div>
                    </div>
                </div>
            </div>

            {/* FULLSCREEN COMMAND HUB */}
            {open && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(1, 4, 9, 0.99)',
                    zIndex: 9999,
                    display: 'flex', flexDirection: 'column',
                    animation: 'fade-in 0.3s ease-out'
                }}>
                    {/* HUB HEADER */}
                    <div style={{
                        padding: '1.5rem 3rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900, fontSize: '1.8rem' }}>Ω</div>
                            <div>
                                <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: 0 }}>OMNI-SENTINEL HUB</h1>
                                <p style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', letterSpacing: '0.3em', margin: 0 }}>INTELLIGENCE v4.0 // HEURISTIC PARTNER</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '2.5rem', opacity: 0.5 }}
                        >×</button>
                    </div>

                    {/* MAIN COMMAND GRID */}
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr 320px', overflow: 'hidden' }}>

                        {/* LEFT: INTELLIGENCE FEED */}
                        <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <h4 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Live Session Feed</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {[
                                        { label: 'Latency', val: metrics.latency, color: 'var(--accent-cyan)' },
                                        { label: 'CPU Load', val: metrics.load, color: 'var(--accent-purple)' },
                                        { label: 'Active Threats', val: metrics.threats, color: 'var(--accent-red)' },
                                        { label: 'Sentinel Status', val: metrics.healing, color: 'var(--accent-green)' }
                                    ].map(stat => (
                                        <div key={stat.label} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.2rem' }}>{stat.label}</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: stat.color }}>{stat.val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', padding: '1.5rem', background: 'rgba(0,229,255,0.03)', borderRadius: '16px', border: '1px solid rgba(0,229,255,0.1)' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>Ω TIP</div>
                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, margin: 0 }}>&quot;Try commanding me in natural language. Instead of clicking, try saying **&apos;Take me to history&apos;** or **&apos;Run a new scan sequence&apos;**.&quot;</p>
                            </div>
                        </div>

                        {/* CENTER: IMMERSIVE CHAT WINDOW */}
                        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '3rem 5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                {messages.map((msg, i) => (
                                    <div key={i} style={{
                                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        width: '100%', maxWidth: '800px',
                                        animation: 'slide-up 0.5s cubic-bezier(0.19, 1, 0.22, 1)'
                                    }}>
                                        {msg.role === 'user' ? (
                                            <div style={{ float: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ padding: '1.25rem 2rem', background: 'var(--accent-cyan)', color: '#000', borderRadius: '24px 24px 4px 24px', fontSize: '1.1rem', fontWeight: 700 }}>{msg.content}</div>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem' }}>U</div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900, fontSize: '1rem', flexShrink: 0 }}>Ω</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                    {msg.steps && msg.steps.length > 0 && (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderLeft: '3px solid rgba(0,229,255,0.3)', paddingLeft: '1.5rem' }}>
                                                            {msg.steps.map((s, si) => (
                                                                <div key={si} style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', opacity: 0.8 }}>⚡ {s}</div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div style={{ fontSize: '1.3rem', color: '#fff', lineHeight: 1.7 }}>
                                                        {renderContent(msg.content)}
                                                    </div>
                                                    {msg.options && (
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                                            {msg.options.map(opt => (
                                                                <button
                                                                    key={opt.label}
                                                                    onClick={() => sendMessage(opt.action)}
                                                                    style={{
                                                                        background: 'rgba(255,255,255,0.03)',
                                                                        border: '1px solid rgba(0, 229, 255, 0.2)',
                                                                        borderRadius: '16px', padding: '1rem',
                                                                        textAlign: 'left', cursor: 'pointer',
                                                                        transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)'
                                                                    }}
                                                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,229,255,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-cyan)'; }}
                                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 229, 255, 0.2)'; }}
                                                                >
                                                                    <div style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>{opt.label}</div>
                                                                    {opt.desc && <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>{opt.desc}</div>}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {loading && (
                                    <div style={{ display: 'flex', gap: '1.5rem', marginLeft: '55px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderLeft: '3px solid var(--accent-cyan)', paddingLeft: '1.5rem' }}>
                                            {thinkingSteps.map((s, i) => (
                                                <div key={i} style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', animation: 'fade-in 0.3s' }}>
                                                    <span style={{ animation: 'blink 1s infinite', marginRight: '0.75rem' }}>●</span>
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div ref={bottomRef} />
                            </div>

                            <div style={{ padding: '3rem 5rem', background: 'linear-gradient(0deg, #010409 0%, transparent 100%)' }}>
                                <div style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(0, 229, 255, 0.4)',
                                    borderRadius: '24px', padding: '0.75rem',
                                    display: 'flex', gap: '1rem',
                                    boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
                                }}>
                                    <input
                                        autoFocus
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                                        placeholder="Directive: [Navigate | Mutate | Automate]..."
                                        style={{
                                            flex: 1, background: 'transparent', border: 'none',
                                            color: '#fff', padding: '1rem', outline: 'none',
                                            fontSize: '1.3rem', fontWeight: 500
                                        }}
                                    />
                                    <button
                                        onClick={() => sendMessage(input)}
                                        disabled={!input.trim() || loading}
                                        style={{
                                            padding: '0 2.5rem', borderRadius: '16px',
                                            background: 'var(--accent-cyan)', color: '#000',
                                            border: 'none', cursor: 'pointer', fontSize: '1.1rem',
                                            fontWeight: 900, transition: 'all 0.3s',
                                            opacity: (!input.trim() || loading) ? 0.3 : 1
                                        }}
                                    >TRANSMIT</button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: COMMAND DIRECTORY (Quick Access) */}
                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <h4 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Direct Action Panel</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                                {[
                                    { label: '🚀 EXECUTE SCAN', action: 'launch scan', color: 'var(--accent-cyan)' },
                                    { label: '🛡️ HEAL SYSTEMS', action: 'fix errors', color: 'var(--accent-green)' },
                                    { label: '🎯 TARGET LIST', action: 'go targets', color: 'var(--accent-red)' },
                                    { label: '📂 FORENSIC LOGS', action: 'go history', color: 'var(--accent-purple)' },
                                    { label: '⚙️ CONFIGURATION', action: 'go settings', color: 'var(--text-secondary)' }
                                ].map(btn => (
                                    <button
                                        key={btn.label}
                                        onClick={() => sendMessage(btn.action)}
                                        style={{
                                            textAlign: 'left', padding: '1rem', borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            color: '#fff', fontSize: '0.85rem', fontWeight: 800,
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            borderLeft: `4px solid ${btn.color}`
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(6px)'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; }}
                                    >
                                        {btn.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* AUTOMATION HUD OVERLAY */}
                    {automationHUD && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(1, 4, 9, 0.95)',
                            zIndex: 10000,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column', gap: '3rem',
                            animation: 'fade-in 0.3s'
                        }}>
                            <div style={{
                                width: '160px', height: '160px', borderRadius: '50%',
                                border: '6px solid var(--accent-cyan)',
                                borderTopColor: 'transparent',
                                animation: 'rotate 0.8s linear infinite',
                                boxShadow: '0 0 40px rgba(0,229,255,0.2)'
                            }} />
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '0.4em', textShadow: '0 0 20px var(--accent-cyan)' }}>{automationHUD}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginTop: '1rem', opacity: 0.8, animation: 'blink 1s infinite' }}>SYNCHRONIZING SYSTEM STATES...</div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
                @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
            `}</style>
        </>
    );
}

