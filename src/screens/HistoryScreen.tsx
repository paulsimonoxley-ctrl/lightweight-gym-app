import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SetLog } from '../lib/supabase';
import { Layout } from '../components/Layout';
import { T } from '../lib/theme';

interface SessionWithSets {
    id: string;
    workout_id: string | null;
    started_at: string;
    completed_at: string | null;
    notes: string | null;
    workout?: { name: string; color: string };
    set_logs?: (SetLog & { exercise?: { name: string } })[];
}

function CalendarView({ sessions }: { sessions: SessionWithSets[] }) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    const dayColors: Record<number, string> = {};
    sessions.forEach(s => {
        const d = new Date(s.started_at);
        if (d.getFullYear() === year && d.getMonth() === month) {
            dayColors[d.getDate()] = s.workout?.color || T.violet;
        }
    });

    const cells: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);
    const today = now.getDate();

    return (
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '18px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textMuted, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={14} style={{ color: '#a78bfa' }} />{monthName}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: T.textDim }}>{d}</div>
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {cells.map((day, i) => {
                    if (day === null) return <div key={`e-${i}`} />;
                    const color = dayColors[day];
                    const isToday = day === today;
                    return (
                        <div key={day} style={{ aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: isToday ? 'rgba(124,58,237,0.12)' : 'transparent', border: isToday ? `1px solid rgba(124,58,237,0.35)` : '1px solid transparent' }}>
                            <span style={{ fontSize: '12px', fontWeight: isToday ? 700 : 400, color: isToday ? '#a78bfa' : T.textMuted }}>{day}</span>
                            {color && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, marginTop: '2px' }} />}
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
        supabase.from('session_logs')
            .select('*, workout:workouts(name,color), set_logs(*, exercise:exercises(name))')
            .order('started_at', { ascending: false }).limit(50)
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
    const duration = (s: SessionWithSets) => {
        if (!s.completed_at) return 'In progress';
        return `${Math.floor((new Date(s.completed_at).getTime() - new Date(s.started_at).getTime()) / 60000)} min`;
    };

    if (loading) return (<Layout title="HISTORY" subtitle="Session logs"><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><div style={{ color: T.textMuted }}>Loading logs...</div></div></Layout>);

    return (
        <Layout title="HISTORY" subtitle="Session logs">
            <div style={{ padding: '24px 20px', maxWidth: '600px', margin: '0 auto' }}>
                <CalendarView sessions={sessions} />
                {sessions.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', paddingTop: '40px' }}>
                        <Calendar size={48} style={{ color: T.textDim }} />
                        <p style={{ color: T.textMuted, fontSize: '16px' }}>No sessions logged yet.</p>
                        <button onClick={() => nav('/')} style={{ background: `linear-gradient(135deg, ${T.violet}, ${T.crimson})`, border: 'none', borderRadius: '14px', padding: '14px 28px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.1em' }}>START YOUR FIRST SESSION</button>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {sessions.map(s => {
                                const color = s.workout?.color || T.violet;
                                const isExpanded = expanded === s.id;
                                return (
                                    <div key={s.id} style={{ background: T.surface, border: `1px solid ${color}33`, borderRadius: '18px', overflow: 'hidden', boxShadow: `0 0 20px ${color}18` }}>
                                        <div onClick={() => setExpanded(isExpanded ? null : s.id)} style={{ cursor: 'pointer', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: color, borderRadius: '18px 0 0 18px' }} />
                                            <div style={{ paddingLeft: '14px' }}>
                                                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '17px', fontWeight: 700, letterSpacing: '0.05em', color: T.textPrimary, marginBottom: '4px' }}>{s.workout?.name?.toUpperCase() || 'SESSION'}</div>
                                                <div style={{ color: T.textMuted, fontSize: '12px' }}>{formatDate(s.started_at)} · {formatTime(s.started_at)} · {duration(s)}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {s.completed_at ? <CheckCircle size={18} style={{ color: T.green }} /> : <XCircle size={18} style={{ color: T.crimson }} />}
                                                <ChevronRight size={16} style={{ color: T.textDim, transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                                            </div>
                                        </div>
                                        {isExpanded && (
                                            <div style={{ borderTop: `1px solid ${T.border}`, padding: '16px 20px 16px 34px' }}>
                                                {s.set_logs && s.set_logs.length > 0 ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                        {s.set_logs.map(sl => (
                                                            <div key={sl.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <div style={{ fontSize: '14px', fontWeight: 500, color: T.textPrimary }}>{sl.exercise?.name || 'Exercise'}</div>
                                                                <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '14px', fontWeight: 700, color: '#a78bfa', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '8px', padding: '4px 12px' }}>
                                                                    {sl.actual_weight > 0 ? `${sl.actual_weight} × ${sl.actual_reps}` : `BW × ${sl.actual_reps}`}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : <p style={{ color: T.textDim, fontSize: '13px', margin: 0 }}>No sets recorded.</p>}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${T.border}` }}>
                            <button onClick={clearHistory} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(232,0,61,0.06)', border: '1px solid rgba(232,0,61,0.25)', borderRadius: '14px', padding: '14px', color: T.crimson, fontSize: '14px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,0,61,0.12)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,0,61,0.06)'; }}>
                                <Trash2 size={16} /> Clear All History
                            </button>
                        </div>
                    </>
                )}
                <div style={{ height: '20px' }} />
            </div>
        </Layout>
    );
}
