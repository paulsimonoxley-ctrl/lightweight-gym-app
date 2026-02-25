import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SetLog } from '../lib/supabase';
import { Layout, T } from '../components/Layout';

interface SessionWithSets {
    id: string;
    workout_id: string | null;
    started_at: string;
    completed_at: string | null;
    notes: string | null;
    workout?: { name: string; color: string };
    set_logs?: (SetLog & { exercise?: { name: string } })[];
}

export function HistoryScreen() {
    const nav = useNavigate();
    const [sessions, setSessions] = useState<SessionWithSets[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.from('session_logs')
            .select('*, workout:workouts(name,color), set_logs(*, exercise:exercises(name))')
            .order('started_at', { ascending: false }).limit(30)
            .then(({ data }) => { if (data) setSessions(data as SessionWithSets[]); setLoading(false); });
    }, []);

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    const formatTime = (d: string) => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const duration = (s: SessionWithSets) => {
        if (!s.completed_at) return 'In progress';
        return `${Math.floor((new Date(s.completed_at).getTime() - new Date(s.started_at).getTime()) / 60000)} min`;
    };

    if (loading) return (<Layout title="HISTORY" subtitle="Session logs"><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><div style={{ color: T.textMuted }}>Loading logs...</div></div></Layout>);
    if (sessions.length === 0) return (
        <Layout title="HISTORY" subtitle="Session logs">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
                <Calendar size={48} style={{ color: T.textDim }} />
                <p style={{ color: T.textMuted, fontSize: '16px' }}>No sessions logged yet.</p>
                <button onClick={() => nav('/')} style={{ background: `linear-gradient(135deg, ${T.violet}, ${T.crimson})`, border: 'none', borderRadius: '14px', padding: '14px 28px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.1em' }}>START YOUR FIRST SESSION</button>
            </div>
        </Layout>
    );

    return (
        <Layout title="HISTORY" subtitle="Session logs">
            <div style={{ padding: '24px 20px', maxWidth: '600px', margin: '0 auto' }}>
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
                <div style={{ height: '20px' }} />
            </div>
        </Layout>
    );
}
