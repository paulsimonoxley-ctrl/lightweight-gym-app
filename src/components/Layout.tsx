import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, History, Settings, CalendarDays } from 'lucide-react';

// ─── Shared theme ──────────────────────────────────────────────────
export const T = {
    bg: '#080809',
    surface: 'rgba(14,12,20,0.97)',
    surfaceSolid: '#0e0c14',
    border: 'rgba(100,60,180,0.22)',
    borderGlow: 'rgba(160,100,255,0.45)',
    violet: '#7c3aed',
    violetGlow: 'rgba(124,58,237,0.35)',
    crimson: '#e8003d',
    crimsonGlow: 'rgba(232,0,61,0.35)',
    electric: '#00d4ff',
    electricGlow: 'rgba(0,212,255,0.22)',
    green: '#10b981',
    textPrimary: '#ede8ff',
    textMuted: '#6b6880',
    textDim: '#3a384f',
    concrete: '#1a1820',
};

interface LayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    right?: ReactNode;
    hideHeader?: boolean;
}

export function Layout({ children, title, subtitle, right, hideHeader }: LayoutProps) {
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
            <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
                background: `
                    radial-gradient(ellipse 90% 45% at 50% -8%, rgba(124,58,237,0.2) 0%, transparent 60%),
                    radial-gradient(ellipse 50% 35% at 95% 95%, rgba(232,0,61,0.12) 0%, transparent 55%)
                `,
            }} />

            {!hideHeader && (
                <header style={{
                    position: 'sticky', top: 0, zIndex: 50,
                    padding: '10px 20px',
                    backdropFilter: 'blur(28px) saturate(1.2)',
                    background: 'rgba(6,5,10,0.96)',
                    borderBottom: `1px solid rgba(100,60,180,0.28)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.006) 4px, transparent 5px)`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '46px', height: '46px', borderRadius: '12px',
                            overflow: 'hidden',
                            border: `2px solid rgba(124,58,237,0.55)`,
                            boxShadow: `0 0 20px rgba(124,58,237,0.4), 0 0 40px rgba(124,58,237,0.1), inset 0 0 10px rgba(0,0,0,0.6)`,
                            flexShrink: 0,
                        }}>
                            <img src="/icons/icon-192.png" alt="LightWeight" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                            <div style={{
                                fontFamily: "'Oswald', sans-serif",
                                fontSize: '20px', fontWeight: 700, letterSpacing: '0.12em',
                                background: `linear-gradient(90deg, #ede8ff 0%, #c4b5fd 60%, #a78bfa 100%)`,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                lineHeight: 1,
                            }}>{title || 'LIGHT WEIGHT'}</div>
                            <div style={{
                                color: T.textMuted, fontSize: '9px', letterSpacing: '0.28em',
                                marginTop: '3px', textTransform: 'uppercase',
                                fontFamily: "'Oswald', sans-serif", fontWeight: 400,
                            }}>{subtitle || 'COMMIT & CONSIST'}</div>
                        </div>
                    </div>
                    {right}
                </header>
            )}

            <main style={{ flex: 1, position: 'relative', zIndex: 1, overflowY: 'auto' }}>
                {children}
            </main>

            <nav style={{
                position: 'sticky', bottom: 0,
                backdropFilter: 'blur(28px)',
                background: 'rgba(6,5,10,0.97)',
                borderTop: `1px solid rgba(100,60,180,0.22)`,
                display: 'flex', justifyContent: 'space-around',
                padding: 'max(12px, env(safe-area-inset-bottom)) 0 12px',
                zIndex: 50,
                backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.005) 4px, transparent 5px)`,
            }}>
                {navItems.map(({ path, icon: Icon, label }) => {
                    const active = loc.pathname === path;
                    return (
                        <button key={path} onClick={() => nav(path)} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '4px 16px',
                            color: active ? '#a78bfa' : T.textMuted,
                            transition: 'color 0.15s',
                            position: 'relative',
                        }}>
                            {active && (
                                <div style={{
                                    position: 'absolute', top: '-1px', left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '28px', height: '2px',
                                    background: `linear-gradient(90deg, transparent, ${T.violet}, transparent)`,
                                    borderRadius: '2px',
                                    boxShadow: `0 0 8px rgba(124,58,237,0.5)`,
                                }} />
                            )}
                            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>{label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
