import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronRight, Calendar, Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Workout, SessionLog } from '../lib/supabase';
import { Layout, T } from '../components/Layout';

interface SessionWithWorkout extends SessionLog {
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
        <Layout subtitle="Mentzer HIT Protocol">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div style={{ color: T.textMuted, fontSize: '14px', letterSpacing: '0.1em' }}>Loading your programs...</div>
            </div>
        </Layout>
    );

    return (
        <Layout subtitle="Mentzer HIT Protocol">
            <div style={{ padding: '24px 20px', maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: '13px', fontWeight: 600,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: T.textMuted, margin: '0 0 16px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                    <Flame size={14} style={{ color: T.crimson }} />
                    Select Today's Workout
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
                    {workouts.map(w => (
                        <button
                            key={w.id}
                            onClick={() => startSession(w)}
                            style={{
                                cursor: 'pointer', background: T.surface,
                                border: `1px solid ${w.color}44`, borderRadius: '18px',
                                padding: '20px 22px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                transition: 'all 0.2s', boxShadow: `0 0 30px ${w.color}18`,
                                position: 'relative', overflow: 'hidden', textAlign: 'left',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = w.color + 'aa'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = w.color + '44'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: w.color, borderRadius: '18px 0 0 18px', boxShadow: `2px 0 12px ${w.color}66` }} />
                            <div style={{ paddingLeft: '14px' }}>
                                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '20px', fontWeight: 700, letterSpacing: '0.05em', color: T.textPrimary, marginBottom: '4px' }}>{w.name.toUpperCase()}</div>
                                <div style={{ color: T.textMuted, fontSize: '13px' }}>{w.description}</div>
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0, background: w.color + '22', border: `1px solid ${w.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Play size={18} style={{ color: w.color }} />
                            </div>
                        </button>
                    ))}
                </div>
                {recentSessions.length > 0 && (
                    <>
                        <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textMuted, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={14} style={{ color: '#a78bfa' }} />
                            Recent Sessions
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {recentSessions.map(s => (
                                <div key={s.id} onClick={() => nav('/history')} style={{ cursor: 'pointer', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '14px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '14px', color: T.textPrimary, marginBottom: '2px' }}>{s.workout?.name || 'Session'}</div>
                                        <div style={{ fontSize: '12px', color: T.textMuted }}>{formatDate(s.started_at)} · {s.completed_at ? 'Completed' : 'Incomplete'}</div>
                                    </div>
                                    <ChevronRight size={16} style={{ color: T.textDim }} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}
