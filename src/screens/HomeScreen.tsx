import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronRight, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Workout } from '../lib/supabase';
import { Layout, T, muteWorkoutColor } from '../components/Layout';
import { LogoBadge } from '../components/LogoBadge';

interface SessionWithWorkout {
    id: string;
    workout_id: string;
    started_at: string;
    completed_at: string | null;
    notes: string | null;
    workout?: { name: string; color: string };
}

export function HomeScreen() {
    const nav = useNavigate();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [recentSessions, setRecentSessions] = useState<SessionWithWorkout[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            supabase.from('workouts').select('*').order('created_at'),
            supabase.from('session_logs').select('*, workout:workouts(name,color)').order('started_at', { ascending: false }).limit(3),
        ]).then(([w, s]) => {
            if (w.data) setWorkouts(w.data);
            if (s.data) setRecentSessions(s.data as SessionWithWorkout[]);
            setLoading(false);
        });
    }, []);

    const startSession = async (workout: Workout) => {
        const { data } = await supabase.from('session_logs').insert({
            workout_id: workout.id,
            started_at: new Date().toISOString(),
        }).select().single();
        if (data) nav(`/session/${data.id}?workoutId=${workout.id}`);
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

    if (loading) return (
        <Layout hideHeader>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
                <div style={{ textAlign: 'center' }}>
                    <LogoBadge size={80} style={{ borderRadius: '20px', marginBottom: '20px', opacity: 0.6 }} />
                    <div style={{ color: T.textMuted, fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>Loading...</div>
                </div>
            </div>
        </Layout>
    );

    return (
        <Layout hideHeader>
            {/* ── Hero Banner ─────────────────────────────────────────── */}
            <div style={{
                position: 'relative',
                padding: '52px 24px 38px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                overflow: 'hidden',
                borderBottom: `1px solid rgba(80,55,130,0.22)`,
            }}>
                {/* Moody glow + scratches */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: `
                        radial-gradient(ellipse 80% 65% at 50% 0%, rgba(90,50,180,0.18) 0%, transparent 70%),
                        repeating-linear-gradient(-55deg, transparent, transparent 4px, rgba(255,255,255,0.009) 5px, transparent 6px)
                    `,
                }} />

                <LogoBadge size={110} style={{
                    marginBottom: '22px', position: 'relative', zIndex: 1,
                    borderRadius: '26px', border: '3px solid rgba(106,63,199,0.50)',
                    boxShadow: '0 0 40px rgba(106,63,199,0.35), 0 0 80px rgba(106,63,199,0.10), 0 24px 60px rgba(0,0,0,0.8)'
                }} />

                {/* Wordmark */}
                <div style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: '34px', fontWeight: 700, letterSpacing: '0.14em',
                    color: '#ccc8dc',
                    lineHeight: 1, marginBottom: '10px', position: 'relative', zIndex: 1,
                }}>LIGHT WEIGHT</div>

                {/* Chain-line tagline */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
                    <div style={{ height: '1px', width: '36px', background: `linear-gradient(90deg, transparent, rgba(106,63,199,0.55))` }} />
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.34em', color: T.textMuted, textTransform: 'uppercase' }}>COMMIT & CONSIST</span>
                    <div style={{ height: '1px', width: '36px', background: `linear-gradient(90deg, rgba(106,63,199,0.55), transparent)` }} />
                </div>
            </div>

            {/* ── Content ──────────────────────────────────────────────── */}
            <div style={{ padding: '28px 20px', maxWidth: '600px', margin: '0 auto' }}>

                {/* Section divider */}
                <div style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: '10px', fontWeight: 700,
                    letterSpacing: '0.26em', textTransform: 'uppercase', color: T.textMuted,
                    marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                    <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, rgba(106,63,199,0.35), transparent)` }} />
                    SELECT TODAY'S PROGRAM
                    <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, transparent, rgba(106,63,199,0.35))` }} />
                </div>

                {/* Workout cards — muted rusted colours */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '36px' }}>
                    {workouts.map(w => {
                        const c = muteWorkoutColor(w.color);
                        return (
                            <button key={w.id} onClick={() => startSession(w)} style={{
                                cursor: 'pointer',
                                background: `linear-gradient(135deg, rgba(12,10,16,0.98) 0%, rgba(18,14,28,0.96) 100%)`,
                                border: `1px solid ${c}50`,
                                borderRadius: '14px', padding: '16px 18px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                boxShadow: `0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)`,
                                position: 'relative', overflow: 'hidden', textAlign: 'left',
                                transition: 'all 0.18s',
                                // diagonal scratch texture
                                backgroundImage: `repeating-linear-gradient(-50deg, transparent, transparent 3px, rgba(255,255,255,0.007) 4px, transparent 5px)`,
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = c + '90';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,0.7), 0 0 18px ${c}28`;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = c + '50';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)`;
                                }}
                            >
                                {/* Rust left bar */}
                                <div style={{
                                    position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                                    background: c,
                                    boxShadow: `4px 0 14px ${c}50`,
                                }} />
                                <div style={{ paddingLeft: '16px' }}>
                                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '19px', fontWeight: 700, letterSpacing: '0.07em', color: '#ccc8dc', marginBottom: '3px' }}>{w.name.toUpperCase()}</div>
                                    <div style={{ color: T.textMuted, fontSize: '12px' }}>{w.description}</div>
                                </div>
                                <div style={{
                                    width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                                    background: c + '15',
                                    border: `1px solid ${c}40`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Play size={16} style={{ color: c }} />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Recent Sessions */}
                {recentSessions.length > 0 && (
                    <>
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: T.textMuted, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, rgba(106,63,199,0.35), transparent)` }} />
                            <Calendar size={11} style={{ color: T.textMuted }} />
                            RECENT SESSIONS
                            <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, transparent, rgba(106,63,199,0.35))` }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                            {recentSessions.map(s => (
                                <div key={s.id} onClick={() => nav('/history')} style={{
                                    cursor: 'pointer',
                                    background: `rgba(12,10,16,0.8)`,
                                    border: `1px solid rgba(80,55,130,0.16)`,
                                    borderRadius: '11px', padding: '11px 15px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    transition: 'border-color 0.15s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(106,63,199,0.38)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(80,55,130,0.16)'; }}
                                >
                                    <div>
                                        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: '14px', letterSpacing: '0.05em', color: '#ccc8dc', marginBottom: '2px' }}>{s.workout?.name?.toUpperCase() || 'SESSION'}</div>
                                        <div style={{ fontSize: '11px', color: T.textMuted }}>{formatDate(s.started_at)} · {s.completed_at ? 'Completed' : 'Incomplete'}</div>
                                    </div>
                                    <ChevronRight size={14} style={{ color: T.textDim }} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <div style={{ height: '20px' }} />
            </div>
        </Layout>
    );
}
