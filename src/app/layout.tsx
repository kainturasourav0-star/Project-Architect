import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project Architect | Logic Tunneler',
  description: 'Automated Business Logic Vulnerability (BLV) testing pipeline. Turns hand-drawn flowcharts into active security exploits.',
  keywords: ['cybersecurity', 'BLV', 'business logic', 'penetration testing', 'automated testing'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen relative overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
        {/* Global Scanline Overlay */}
        <div style={{
          position: 'fixed', inset: 0,
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.04))',
          backgroundSize: '100% 4px, 3px 100%',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: 0.15
        }} />
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          height: '2px', background: 'rgba(0, 229, 255, 0.15)',
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
          zIndex: 100000,
          pointerEvents: 'none',
          animation: 'scanline 10s linear infinite'
        }} />
        {children}
      </body>
    </html>
  );
}
