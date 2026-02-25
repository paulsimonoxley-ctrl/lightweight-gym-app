import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, History, Settings, Dumbbell } from 'lucide-react';

export const T = {
    bg: '#050508',
    surface: 'rgba(20,18,30,0.9)',
    surfaceSolid: '#0e0c18',
    border: 'rgba(120,80,200,0.22)',
    borderGlow: 'rgba(160,100,255,0.5)',
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
        { path: '/builder', icon: Settings, label: 'Builder' },
    ];

    return (
        <div style={{
            minHeight: '100dvh',
            background: T.bg, color: T.textPrimary,
            fontFamily: "'Outfit', system-ui, sans-serif",
            display: 'flex', flexDirection: 'column',
            overflowX: 'hidden',
        }}>
            <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
                background: `
          radial-gradient(ellipse 80% 40% at 50% -5%, ${T.violetGlow} 0%, transparent 65%),
          radial-gradient(ellipse 40% 30% at 90% 90%, ${T.crimsonGlow} 0%, transparent 60%),
          radial-gradient(ellipse 30% 20% at 5% 50%, ${T.electricGlow} 0%, transparent 50%)
        `,
            }} />
            <header style={{
                position: 'sticky', top: 0, zIndex: 50,
                padding: '14px 20px',
                backdropFilter: 'blur(20px)',
                background: 'rgba(5,5,8,0.85)',
                borderBottom: `1px solid ${T.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '38px', height: '38px', borderRadius: '10px',
                        background: `linear-gradient(135deg, ${T.violet}, ${T.crimson})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 18px ${T.violetGlow}`,
                        flexShrink: 0,
                    }}>
                        <Dumbbell size={20} color="white" />
                    </div>
                    <div>
                        <div style={{
                            fontFamily: "'Oswald', sans-serif", fontSize: '20px',
                            fontWeight: 700, letterSpacing: '0.08em',
                            background: `linear-gradient(90deg, ${T.textPrimary}, #a78bfa)`,
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            lineHeight: 1,
                        }}>
                            {title || 'LIGHTWEIGHT'}
                        </div>
                        {subtitle && <div style={{ color: T.textMuted, fontSize: '10px', letterSpacing: '0.14em', marginTop: '2px', textTransform: 'uppercase' }}>{subtitle}</div>}
                    </div>
                </div>
                {right}
            </header>
            <main style={{ flex: 1, position: 'relative', zIndex: 1, overflowY: 'auto' }}>
                {children}
            </main>
            <nav style={{
                position: 'sticky', bottom: 0,
                backdropFilter: 'blur(20px)',
                background: 'rgba(5,5,8,0.92)',
                borderTop: `1px solid ${T.border}`,
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
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: '4px 20px',
                                color: active ? '#a78bfa' : T.textMuted,
                                transition: 'color 0.2s',
                            }}
                        >
                            <Icon size={22} />
                            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
