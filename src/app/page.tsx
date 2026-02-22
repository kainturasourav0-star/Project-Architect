'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { AiChatbot } from '@/components/AiChatbot';
import { SplashScreen } from '@/components/SplashScreen';

const TICKER_EVENTS = [
  '⚡ CRITICAL: Login bypass detected in E-Commerce pipeline',
  '🔬 Proxy Surgeon intercepted price mutation: $99.99 → -$1.00',
  '🔴 IDOR vulnerability: user_id enumeration on /api/user/{id}',
  '✓ Race condition test: 3/5 promo codes applied simultaneously',
  '🧠 Neural flow parser indexed 847 business logic states',
  '⚡ Quantity overflow: INT_MAX injection sent to /api/cart/update',
  '✓ MFA bypass: session token replayed successfully',
  '🔬 Proxy Engine active — 1,204 packets intercepted this session',
];

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Visual Ingestion',
    description: 'Upload a hand-drawn flowchart. Vision AI parses shapes, arrows, and text using OpenCV + Pytesseract.',
    icon: '📷',
    href: '/ingest',
    color: 'var(--accent-cyan)',
    badge: 'PHASE 01',
  },
  {
    step: '02',
    title: 'Threat Analysis',
    description: 'Neural Logic Parser converts flowchart to JSON schema and hypothesizes Business Logic Vulnerabilities with severity scoring.',
    icon: '🧠',
    href: '/analyze',
    color: 'var(--accent-purple)',
    badge: 'PHASE 02',
  },
  {
    step: '03',
    title: 'Ghost Attack',
    description: 'Auto-generated Playwright scripts route through the C++ Proxy Surgeon for real-time payload mutation and exploit execution.',
    icon: '👻',
    href: '/execute',
    color: 'var(--accent-red)',
    badge: 'PHASE 03',
  },
];

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(false);
  const [visible, setVisible] = useState(false);
  const [counts, setCounts] = useState({ scans: 0, flaws: 0, packets: 0 });
  const TICKER = TICKER_EVENTS.join('   ·   ');

  useEffect(() => {
    // Prevent hydration mismatch by loading session state in Effect
    const played = sessionStorage.getItem('architect_splash_played');
    if (!played) {
      setShowSplash(true);
    } else {
      setVisible(true);
    }
  }, []);

  const handleSplashDone = () => {
    sessionStorage.setItem('architect_splash_played', 'true');
    setShowSplash(false);
  };

  useEffect(() => {
    if (!showSplash && (visible || !sessionStorage.getItem('architect_splash_played'))) {
      setTimeout(() => {
        setVisible(true);
        // Animate counters
        const target = { scans: 247, flaws: 1893, packets: 48300 };
        const duration = 1800;
        const start = Date.now();
        const tick = () => {
          const p = Math.min(1, (Date.now() - start) / duration);
          const ease = 1 - Math.pow(1 - p, 3);
          setCounts({
            scans: Math.floor(ease * target.scans),
            flaws: Math.floor(ease * target.flaws),
            packets: Math.floor(ease * target.packets),
          });
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, 100);
    }
  }, [showSplash, visible]);

  if (showSplash) {
    return <SplashScreen onDone={handleSplashDone} />;
  }

  return (
    <div style={{ minHeight: '100vh', opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease', position: 'relative' }}>
      <Navigation />
      <div className="cyber-grid" style={{ position: 'fixed', inset: 0, zIndex: 0 }} />

      {/* Ambient glow orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite', animationDelay: '3s' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,51,102,0.03) 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }} />
      </div>

      {/* Intel Ticker */}
      <div style={{ background: 'rgba(255,51,102,0.07)', borderBottom: '1px solid rgba(255,51,102,0.15)', overflow: 'hidden', position: 'relative', zIndex: 10, animation: 'fade-in 0.4s ease-out' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ background: 'var(--accent-red)', padding: '0.3rem 0.75rem', flexShrink: 0 }}>
            <span className="font-code" style={{ color: '#fff', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em' }}>LIVE</span>
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="font-code animate-ticker" style={{ whiteSpace: 'nowrap', display: 'inline-block', padding: '0.3rem 0', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              {TICKER + '   ·   ' + TICKER}
            </div>
          </div>
        </div>
      </div>

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* ── HERO ── */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem 3rem', textAlign: 'center' }}>
          {/* Animated badge row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', animation: 'slide-up 0.5s ease-out' }}>
            <span className="badge badge-red">
              <span style={{ animation: 'blink 1s step-end infinite' }}>●</span> SENTINEL ACTIVE
            </span>
            <span className="badge badge-purple">C++ PROXY ARMED</span>
            <span className="badge badge-cyan">3 MODULES ONLINE</span>
          </div>

          {/* Headline */}
          <h1
            className="font-headline animate-cascade reveal-1"
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>Project{' '}</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #00e5ff 0%, #a855f7 50%, #ff3366 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Architect
            </span>
            <br />
            <span style={{ fontSize: '0.4em', color: 'var(--text-secondary)', fontWeight: 400, letterSpacing: '0.15em' }}>
              VISUAL-TO-EXPLOIT LOGIC TUNNELER
            </span>
          </h1>

          {/* Accent line */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
            <div style={{ width: '120px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)', transformOrigin: 'left', animation: 'hero-line 0.8s ease-out 0.4s backwards' }} />
          </div>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 2.5rem', lineHeight: 1.75, animation: 'slide-up 0.7s ease-out 0.1s backwards' }}>
            The first automated security pipeline that transforms{' '}
            <strong style={{ color: 'var(--accent-cyan)' }}>hand-drawn business flowcharts</strong> into{' '}
            <strong style={{ color: 'var(--accent-red)' }}>active vulnerability exploits</strong> — powered by Python, C++, OpenCV, and Playwright.
          </p>

          <div className="animate-cascade reveal-2" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '5rem' }}>
            <Link href="/ingest" style={{ textDecoration: 'none' }}>
              <button className="btn-cyber btn-cyber-filled" style={{ fontSize: '1rem', padding: '0.85rem 2.2rem' }}>
                <span>⚡ Launch Pipeline</span>
              </button>
            </Link>
            <Link href="/targets" style={{ textDecoration: 'none' }}>
              <button className="btn-cyber" style={{ fontSize: '1rem', padding: '0.85rem 2.2rem' }}>
                <span>🎯 Manage Targets</span>
              </button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="animate-cascade reveal-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.08)', borderRadius: '12px', overflow: 'hidden', marginBottom: '5rem' }}>
            {[
              { label: 'Scans Completed', value: counts.scans.toLocaleString(), color: 'var(--accent-cyan)', icon: '📊' },
              { label: 'Flaws Detected', value: counts.flaws.toLocaleString(), color: 'var(--accent-red)', icon: '💀' },
              { label: 'Packets Intercepted', value: `${(counts.packets / 1000).toFixed(1)}K`, color: 'var(--accent-purple)', icon: '📡' },
              { label: 'Sentinel Shield', value: '100%', color: 'var(--accent-green)', icon: '🛡️' },
            ].map((s, i) => (
              <div key={s.label} style={{ padding: '1.75rem 1rem', background: 'rgba(5,15,31,0.9)', textAlign: 'center', animation: `counter-up 0.5s ease-out ${0.5 + i * 0.1}s backwards` }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div className="font-headline" style={{ fontSize: '2rem', fontWeight: 700, color: s.color, marginBottom: '0.35rem' }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PIPELINE STEPS ── */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ height: '1px', width: '40px', background: 'rgba(0,229,255,0.3)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>Attack Pipeline</span>
              <div style={{ height: '1px', width: '40px', background: 'rgba(0,229,255,0.3)' }} />
            </div>
            <h2 className="font-headline" style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Three Phases. One Kill.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {PIPELINE_STEPS.map((step, i) => (
              <Link key={step.step} href={step.href} style={{ textDecoration: 'none' }}>
                <div
                  className="cyber-card"
                  style={{
                    padding: '2rem',
                    borderRadius: '12px',
                    height: '100%',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s',
                    animation: `slide-up 0.5s ease-out ${0.2 + i * 0.1}s backwards`,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(-6px)';
                    el.style.borderColor = step.color;
                    el.style.boxShadow = `0 12px 40px ${step.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(0)';
                    el.style.borderColor = 'rgba(0,229,255,0.1)';
                    el.style.boxShadow = '';
                  }}
                >
                  {/* Gradient top border */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: step.color, opacity: 0.7 }} />

                  <div style={{ fontSize: '0.65rem', color: step.color, letterSpacing: '0.2em', fontWeight: 700, marginBottom: '1rem' }}>
                    {step.badge}
                  </div>
                  <div style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>{step.icon}</div>
                  <h3 className="font-headline" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                    {step.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: step.color, fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>Go to {step.title}</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── TOOLS ROW ── */}
        <section style={{ background: 'rgba(5, 15, 31, 0.7)', borderTop: '1px solid rgba(0,229,255,0.07)', borderBottom: '1px solid rgba(0,229,255,0.07)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { icon: '🎯', label: 'Target Manager', desc: 'Save & track all target apps with vulnerability status', href: '/targets', color: 'var(--accent-red)' },
              { icon: '🛡️', label: 'AI Protector', desc: 'Real-time autonomous defense and self-healing system', href: '/protector', color: 'var(--accent-green)' },
              { icon: '📂', label: 'Scan History', desc: 'Browse past pipeline runs, re-execute with one click', href: '/history', color: 'var(--accent-purple)' },
              { icon: '⚙️', label: 'Settings', desc: 'Configure proxy port, mutations, Playwright, and C++ flags', href: '/settings', color: 'var(--accent-cyan)' },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,229,255,0.08)',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = tool.color;
                    el.style.background = `${tool.color}08`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(0,229,255,0.08)';
                    el.style.background = 'transparent';
                  }}
                >
                  <span style={{ fontSize: '2rem', flexShrink: 0 }}>{tool.icon}</span>
                  <div>
                    <div className="font-headline" style={{ color: tool.color, fontWeight: 600, marginBottom: '0.2rem' }}>{tool.label}</div>
                    <div style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tool.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ height: '1px', width: '40px', background: 'rgba(0,229,255,0.3)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>Stack</span>
              <div style={{ height: '1px', width: '40px', background: 'rgba(0,229,255,0.3)' }} />
            </div>
            <h2 className="font-headline" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Optimized for i7 8th Gen · 8GB RAM
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { tech: 'Python + OpenCV + Pytesseract', role: 'Vision / OCR Engine', color: 'var(--accent-cyan)' },
              { tech: 'C++17 + cpp-httplib', role: 'High-Speed Proxy Surgeon (<50MB RAM)', color: 'var(--accent-purple)' },
              { tech: 'Playwright (Headless)', role: 'Ghost Attack Browser Automation', color: 'var(--accent-green)' },
              { tech: 'nlohmann/json', role: 'Real-time JSON Payload Mutation', color: 'var(--accent-orange)' },
              { tech: 'g++ -O3 / MinGW', role: 'Optimized Machine-Code Compilation', color: 'var(--accent-red)' },
              { tech: 'FastAPI / Flask', role: 'Backend Orchestration + API Layer', color: 'var(--accent-cyan)' },
            ].map((item) => (
              <div
                key={item.tech}
                className="cyber-card"
                style={{ padding: '1.1rem 1.25rem', borderRadius: '8px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
              >
                <div style={{ width: '3px', minHeight: '36px', background: item.color, borderRadius: '2px', flexShrink: 0 }} />
                <div>
                  <div className="font-code" style={{ fontSize: '0.78rem', color: item.color, fontWeight: 600, marginBottom: '0.2rem' }}>{item.tech}</div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>{item.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <AiChatbot />
    </div>
  );
}
