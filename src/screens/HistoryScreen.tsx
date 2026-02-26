import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SetLog } from '../lib/supabase';
import { Layout, T, muteWorkoutColor } from '../components/Layout';

interface SessionWithSets {
    id: string; workout_id: string | null; started_at: string;
    completed_at: string | null; notes: string | null;
    workout?: { name: string; color: string };
    set_logs?: (SetLog & { exercise?: { name: string } })[];
}

function CalendarView({ sessions }: { sessions: SessionWithSets[] }) {
    const now = new Date();
    const year = now.getFullYear(); const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    const dayColors: Record<number, string> = {};
    sessions.forEach(s => {
        const d = new Date(s.started_at);
        if (d.getFullYear() === year && d.getMonth() === month)
            dayColors[d.getDate()] = muteWorkoutColor(s.workout?.color || '#7c3aed');
    });
    const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    while (cells.length % 7 !== 0) cells.push(null);
    const today = now.getDate();
    return (
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '18px', marginBottom: '22px', backgroundImage: `repeating-linear-gradient(-48deg, transparent, transparent 3px, rgba(255,255,255,0.006) 4px, transparent 5px)` }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textMuted, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={13} style={{ color: T.textMuted }} />{monthName}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' }}>
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} style={{ textAlign: 'center', fontSize: '10px', color: T.textDim, fontWeight: 600 }}>{d}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
                {cells.map((day, i) => {
                    if (!day) return <div key={`e-${i}`} />;
                    const color = dayColors[day];
                    const isToday = day === today;
                    return (
                        <div key={day} style={{ aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', background: isToday ? 'rgba(106,63,199,0.10)' : 'transparent', border: isToday ? `1px solid rgba(106,63,199,0.30)` : '1px solid transparent' }}>
                            <span style={{ fontSize: '11px', fontWeight: isToday ? 700 : 400, color: isToday ? '#9d88d4' : T.textMuted }}>{day}</span>
                            {color && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, marginTop: '2px' }} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function HistoryScreen() {
    const nav = useNavigate();
    const [sessions, setSessions] = useState<SessionWithSets[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSessions = () => {
        supabase.from('session_logs').select('*, workout:workouts(name,color), set_logs(*, exercise:exercises(name))').order('started_at', { ascending: false }).limit(50)
            .then(({ data }) => { if (data) setSessions(data as SessionWithSets[]); setLoading(false); });
    };
    useEffect(() => { fetchSessions(); }, []);

    const clearHistory = async () => {
        if (!confirm('Delete all session history? This cannot be undone.')) return;
        await supabase.from('session_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        setSessions([]);
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    const formatTime = (d: string) => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const duration = (s: SessionWithSets) => s.completed_at ? `${Math.floor((new Date(s.completed_at).getTime() - new Date(s.started_at).getTime()) / 60000)} min` : 'In progress';

    if (loading) return (<Layout title="HISTORY" subtitle="Session logs"><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><div style={{ color: T.textMuted }}>Loading logs...</div></div></Layout>);

    return (
        <Layout title="HISTORY" subtitle="Session logs">
            <div style={{ padding: '24px 20px', maxWidth: '600px', margin: '0 auto' }}>
                <CalendarView sessions={sessions} />
                {sessions.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', paddingTop: '32px' }}>
                        <Calendar size={44} style={{ color: T.textDim }} />
                        <p style={{ color: T.textMuted, fontSize: '15px' }}>No sessions logged yet.</p>
                        <button onClick={() => nav('/')} style={{ background: `linear-gradient(135deg, ${T.violet}, ${T.crimson})`, border: 'none', borderRadius: '12px', padding: '13px 26px', color: '#ccc8dc', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.1em' }}>START YOUR FIRST SESSION</button>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {sessions.map(s => {
                                const c = muteWorkoutColor(s.workout?.color || '#7c3aed');
                                const isExpanded = expanded === s.id;
                                return (
                                    <div key={s.id} style={{ background: T.surface, border: `1px solid ${c}40`, borderRadius: '14px', overflow: 'hidden', backgroundImage: `repeating-linear-gradient(-48deg, transparent, transparent 3px, rgba(255,255,255,0.005) 4px, transparent 5px)` }}>
                                        <div onClick={() => setExpanded(isExpanded ? null : s.id)} style={{ cursor: 'pointer', padding: '15px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: c }} />
                                            <div style={{ paddingLeft: '14px' }}>
                                                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '16px', fontWeight: 700, letterSpacing: '0.05em', color: '#ccc8dc', marginBottom: '3px' }}>{s.workout?.name?.toUpperCase() || 'SESSION'}</div>
                                                <div style={{ color: T.textMuted, fontSize: '11px' }}>{formatDate(s.started_at)} · {formatTime(s.started_at)} · {duration(s)}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {s.completed_at ? <CheckCircle size={16} style={{ color: '#3a6b4a' }} /> : <XCircle size={16} style={{ color: T.crimson }} />}
                                                <ChevronRight size={15} style={{ color: T.textDim, transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                                            </div>
                                        </div>
                                        {isExpanded && (
                                            <div style={{ borderTop: `1px solid ${T.border}`, padding: '14px 18px 14px 32px' }}>
                                                {s.set_logs && s.set_logs.length > 0 ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                                                        {s.set_logs.map(sl => (
                                                            <div key={sl.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <div style={{ fontSize: '13px', color: T.textPrimary }}>{sl.exercise?.name || 'Exercise'}</div>
                                                                <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '13px', fontWeight: 700, color: '#9d88d4', background: 'rgba(106,63,199,0.08)', border: '1px solid rgba(106,63,199,0.18)', borderRadius: '7px', padding: '3px 10px' }}>{sl.actual_weight > 0 ? `${sl.actual_weight} × ${sl.actual_reps}` : `BW × ${sl.actual_reps}`}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : <p style={{ color: T.textDim, fontSize: '12px', margin: 0 }}>No sets recorded.</p>}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: `1px solid ${T.border}` }}>
                            <button onClick={clearHistory} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(139,34,34,0.06)', border: '1px solid rgba(139,34,34,0.22)', borderRadius: '12px', padding: '13px', color: T.crimson, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,34,34,0.12)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,34,34,0.06)'; }}>
                                <Trash2 size={15} /> Clear All History
                            </button>
                        </div>
                    </>
                )}
                <div style={{ height: '20px' }} />
            </div>
        </Layout>
    );
}
