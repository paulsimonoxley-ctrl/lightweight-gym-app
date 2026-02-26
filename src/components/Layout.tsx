import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, History, Settings, CalendarDays, Dumbbell } from 'lucide-react';

// ─── Shared theme ─────────────────────────────────────────────
export const T = {
    bg: '#0a0b0d',
    surface: 'rgba(18,18,24,0.95)',
    surfaceSolid: '#101018',
    border: 'rgba(120,80,200,0.20)',
    borderGlow: 'rgba(160,100,255,0.45)',
    violet: '#7c3aed',
    violetGlow: 'rgba(124,58,237,0.35)',
    crimson: '#e8003d',
    crimsonGlow: 'rgba(232,0,61,0.35)',
    electric: '#00d4ff',
    electricGlow: 'rgba(0,212,255,0.22)',
    green: '#10b981',
    sky: '#0ea5e9',
    textPrimary: '#f0eeff',
    textMuted: '#7d7a9c',
    textDim: '#3e3c58',
};

interface LayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    right?: ReactNode;
}

export function Layout({ children, title, subtitle, right }: LayoutProps) {
    const nav = useNavigate();
    const loc = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/history', icon: History, label: 'History' },
        { path: '/schedule', icon: CalendarDays, label: 'Schedule' },
        { path: '/builder', icon: Settings, label: 'Builder' },
    ];

    return (
        <div style={{
            minHeight: '100dvh',
            background: T.bg,
            color: T.textPrimary,
            fontFamily: "'Outfit', system-ui, sans-serif",
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
        }}>
            {/* Concrete texture overlay */}
            <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
                background: `
                    radial-gradient(ellipse 80% 40% at 50% -5%, ${T.violetGlow} 0%, transparent 65%),
                    radial-gradient(ellipse 40% 30% at 90% 90%, ${T.crimsonGlow} 0%, transparent 60%),
                    url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")
                `,
            }} />

            {/* Header */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 50,
                padding: '12px 20px',
                backdropFilter: 'blur(20px)',
                background: 'rgba(8,8,12,0.92)',
                borderBottom: `1px solid rgba(120,80,200,0.25)`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Logo badge — industrial chain ring motif */}
                    <div style={{
                        width: '42px', height: '42px', borderRadius: '12px',
                        background: `linear-gradient(135deg, #1a1030, #0d0818)`,
                        border: `2px solid rgba(124,58,237,0.6)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 18px ${T.violetGlow}, inset 0 0 12px rgba(0,0,0,0.6)`,
                        flexShrink: 0,
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', inset: 0, borderRadius: '10px',
                            background: `radial-gradient(circle at 40% 35%, rgba(124,58,237,0.25), transparent 60%)`,
                        }} />
                        <Dumbbell size={20} color="#c4b5fd" />
                    </div>
                    <div>
                        <div style={{
                            fontFamily: "'Oswald', sans-serif",
                            fontSize: '19px',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            background: `linear-gradient(90deg, #f0eeff, #c4b5fd)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 1,
                        }}>
                            {title || 'LIGHT WEIGHT'}
                        </div>
                        <div style={{
                            color: T.textMuted,
                            fontSize: '9px',
                            letterSpacing: '0.22em',
                            marginTop: '3px',
                            textTransform: 'uppercase',
                            fontFamily: "'Oswald', sans-serif",
                        }}>
                            {subtitle || 'COMMIT & CONSIST'}
                        </div>
                    </div>
                </div>
                {right}
            </header>

            {/* Page content */}
            <main style={{ flex: 1, position: 'relative', zIndex: 1, overflowY: 'auto' }}>
                {children}
            </main>

            {/* Bottom Nav */}
            <nav style={{
                position: 'sticky', bottom: 0,
                backdropFilter: 'blur(20px)',
                background: 'rgba(8,8,12,0.95)',
                borderTop: `1px solid rgba(120,80,200,0.2)`,
                display: 'flex', justifyContent: 'space-around',
                padding: 'max(10px, env(safe-area-inset-bottom)) 0 10px',
                zIndex: 50,
            }}>
                {navItems.map(({ path, icon: Icon, label }) => {
                    const active = loc.pathname === path;
                    return (
                        <button
                            key={path}
                            onClick={() => nav(path)}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: '4px 14px',
                                color: active ? '#a78bfa' : T.textMuted,
                                transition: 'color 0.2s',
                                position: 'relative',
                            }}
                        >
                            {active && (
                                <div style={{
                                    position: 'absolute', top: '-1px', left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '24px', height: '2px',
                                    background: 'linear-gradient(90deg, transparent, #7c3aed, transparent)',
                                    borderRadius: '2px',
                                }} />
                            )}
                            <Icon size={20} />
                            <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
