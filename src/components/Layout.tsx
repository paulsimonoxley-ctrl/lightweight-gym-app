import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, History, Settings, CalendarDays } from 'lucide-react';

export const T = {
    bg: '#070708',
    surface: 'rgba(12,10,16,0.98)',
    surfaceSolid: '#0c0a10',
    border: 'rgba(80,55,130,0.18)',
    borderGlow: 'rgba(100,70,160,0.30)',
    violet: '#6a3fc7',
    violetGlow: 'rgba(106,63,199,0.22)',
    crimson: '#8b2222',
    crimsonGlow: 'rgba(139,34,34,0.22)',
    electric: '#3a6a80',
    green: '#3a5c3a',
    textPrimary: '#ccc8dc',
    textMuted: '#524f68',
    textDim: '#2c2a3a',
    concrete: '#111016',
    iron: '#1a182a',
};

export const muteWorkoutColor = (hex: string): string => {
    const map: Record<string, string> = {
        '#e8003d': '#7a2020',
        '#7c3aed': '#4a306e',
        '#0ea5e9': '#1e4a5e',
        '#10b981': '#2a4a36',
    };
    return map[hex?.toLowerCase()] ?? hex;
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
        <div style={{ minHeight: '100dvh', background: T.bg, color: T.textPrimary, fontFamily: "'Outfit', system-ui, sans-serif", display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, background: `radial-gradient(ellipse 90% 45% at 50% -5%, rgba(90,50,180,0.13) 0%, transparent 65%), radial-gradient(ellipse 55% 35% at 95% 98%, rgba(120,28,28,0.10) 0%, transparent 55%)` }} />

            {!hideHeader && (
                <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '14px 20px', backdropFilter: 'blur(28px) saturate(0.9)', background: 'rgba(5,5,8,0.97)', borderBottom: `1px solid rgba(80,55,130,0.22)`, backgroundImage: `repeating-linear-gradient(-46deg, transparent, transparent 3px, rgba(255,255,255,0.007) 4px, transparent 5px)`, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
                    <div />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', overflow: 'hidden', border: `2px solid rgba(106,63,199,0.45)`, boxShadow: `0 0 18px rgba(106,63,199,0.28), inset 0 0 10px rgba(0,0,0,0.7)`, marginBottom: '6px' }}>
                            <img src="/icons/icon-192.png" alt="LightWeight" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '17px', fontWeight: 700, letterSpacing: '0.14em', color: '#ccc8dc', lineHeight: 1 }}>{title || 'LIGHT WEIGHT'}</div>
                        <div style={{ color: T.textMuted, fontSize: '8px', letterSpacing: '0.3em', marginTop: '3px', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>{subtitle || 'COMMIT & CONSIST'}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
                </header>
            )}

            <main style={{ flex: 1, position: 'relative', zIndex: 1, overflowY: 'auto' }}>{children}</main>

            <nav style={{ position: 'sticky', bottom: 0, backdropFilter: 'blur(28px)', background: 'rgba(5,5,8,0.98)', borderTop: `1px solid rgba(80,55,130,0.20)`, display: 'flex', justifyContent: 'space-around', padding: 'max(12px, env(safe-area-inset-bottom)) 0 12px', zIndex: 50, backgroundImage: `repeating-linear-gradient(-46deg, transparent, transparent 3px, rgba(255,255,255,0.006) 4px, transparent 5px)` }}>
                {navItems.map(({ path, icon: Icon, label }) => {
                    const active = loc.pathname === path;
                    return (
                        <button key={path} onClick={() => nav(path)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 16px', color: active ? '#9d88d4' : T.textMuted, transition: 'color 0.15s', position: 'relative' }}>
                            {active && <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', width: '28px', height: '2px', background: `linear-gradient(90deg, transparent, #6a3fc7, transparent)`, borderRadius: '2px' }} />}
                            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>{label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
