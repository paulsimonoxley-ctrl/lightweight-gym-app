import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronRight, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Workout } from '../lib/supabase';
import { Layout, T } from '../components/Layout';

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
                    <img src="/icons/icon-192.png" alt="LightWeight" style={{ width: '80px', height: '80px', borderRadius: '20px', marginBottom: '20px', opacity: 0.7 }} />
                    <div style={{ color: T.textMuted, fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>Loading...</div>
                </div>
            </div>
        </Layout>
    );

    return (
        <Layout hideHeader>
            {/* Hero Banner */}
            <div style={{
                position: 'relative', padding: '48px 24px 36px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                overflow: 'hidden', borderBottom: `1px solid rgba(100,60,180,0.25)`,
            }}>
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.22) 0%, transparent 70%), repeating-linear-gradient(-55deg, transparent, transparent 4px, rgba(255,255,255,0.008) 5px, transparent 6px)`,
                }} />
                <div style={{
                    width: '110px', height: '110px', borderRadius: '26px', overflow: 'hidden',
                    border: `3px solid rgba(124,58,237,0.6)`,
                    boxShadow: `0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(124,58,237,0.15), 0 20px 60px rgba(0,0,0,0.7)`,
                    marginBottom: '20px', position: 'relative', zIndex: 1,
                }}>
                    <img src="/icons/icon-192.png" alt="LightWeight" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: '34px', fontWeight: 700, letterSpacing: '0.14em',
                    background: `linear-gradient(180deg, #ffffff 0%, #c4b5fd 100%)`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    lineHeight: 1, marginBottom: '10px', position: 'relative', zIndex: 1,
                }}>LIGHT WEIGHT</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
                    <div style={{ height: '1px', width: '32px', background: `linear-gradient(90deg, transparent, rgba(124,58,237,0.6))` }} />
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.32em', color: T.textMuted, textTransform: 'uppercase' }}>COMMIT & CONSIST</span>
                    <div style={{ height: '1px', width: '32px', background: `linear-gradient(90deg, rgba(124,58,237,0.6), transparent)` }} />
                </div>
            </div>

            <div style={{ padding: '28px 20px', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: T.textMuted, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, rgba(124,58,237,0.4), transparent)` }} />
                    SELECT TODAY'S PROGRAM
                    <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, transparent, rgba(124,58,237,0.4))` }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
                    {workouts.map(w => (
                        <button key={w.id} onClick={() => startSession(w)} style={{
                            cursor: 'pointer',
                            background: `linear-gradient(135deg, rgba(14,12,20,0.97) 0%, rgba(20,16,32,0.95) 100%)`,
                            border: `1px solid ${w.color}40`, borderRadius: '16px',
                            padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            boxShadow: `0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
                            position: 'relative', overflow: 'hidden', textAlign: 'left',
                            backgroundImage: `repeating-linear-gradient(-50deg, transparent, transparent 3px, rgba(255,255,255,0.006) 4px, transparent 5px)`,
                            transition: 'all 0.18s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = w.color + 'aa'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.6), 0 0 20px ${w.color}30`; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = w.color + '40'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`; }}
                        >
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: w.color, boxShadow: `4px 0 16px ${w.color}60` }} />
                            <div style={{ paddingLeft: '16px' }}>
                                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '20px', fontWeight: 700, letterSpacing: '0.06em', color: '#ede8ff', marginBottom: '4px' }}>{w.name.toUpperCase()}</div>
                                <div style={{ color: T.textMuted, fontSize: '12px' }}>{w.description}</div>
                            </div>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0, background: w.color + '18', border: `1px solid ${w.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 12px ${w.color}30` }}>
                                <Play size={18} style={{ color: w.color }} />
                            </div>
                        </button>
                    ))}
                </div>

                {recentSessions.length > 0 && (
                    <>
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: T.textMuted, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, rgba(124,58,237,0.4), transparent)` }} />
                            <Calendar size={11} style={{ color: '#a78bfa' }} />
                            RECENT SESSIONS
                            <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, transparent, rgba(124,58,237,0.4))` }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {recentSessions.map(s => (
                                <div key={s.id} onClick={() => nav('/history')} style={{ cursor: 'pointer', background: `rgba(14,12,20,0.8)`, border: `1px solid rgba(100,60,180,0.18)`, borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(100,60,180,0.18)'; }}
                                >
                                    <div>
                                        <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: '14px', letterSpacing: '0.05em', color: '#ede8ff', marginBottom: '2px' }}>{s.workout?.name?.toUpperCase() || 'SESSION'}</div>
                                        <div style={{ fontSize: '11px', color: T.textMuted }}>{formatDate(s.started_at)} · {s.completed_at ? 'Completed' : 'Incomplete'}</div>
                                    </div>
                                    <ChevronRight size={15} style={{ color: T.textDim }} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}
