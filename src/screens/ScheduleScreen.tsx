import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Plus, X, ChevronRight, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Workout } from '../lib/supabase';
import { Layout, T } from '../components/Layout';

interface Commitment {
    id: string;
    workout_id: string;
    scheduled_date: string;
    note: string | null;
    workout?: { name: string; color: string };
}

function ScheduleCalendar({ commitments, selectedDate, onSelectDate }: { commitments: Commitment[]; selectedDate: string | null; onSelectDate: (d: string) => void; }) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    const dayColors: Record<number, string> = {};
    commitments.forEach(c => {
        const d = new Date(c.scheduled_date + 'T00:00:00');
        if (d.getFullYear() === year && d.getMonth() === month) {
            dayColors[d.getDate()] = c.workout?.color || T.violet;
        }
    });

    const cells: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);
    const today = now.getDate();
    const todayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(today).padStart(2, '0')}`;

    return (
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '18px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textMuted, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarDays size={14} style={{ color: '#a78bfa' }} />{monthName}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: T.textDim }}>{d}</div>
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {cells.map((day, i) => {
                    if (day === null) return <div key={`e-${i}`} />;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const color = dayColors[day];
                    const isToday = day === today;
                    const isPast = day < today;
                    const isSelected = selectedDate === dateStr;
                    return (
                        <button
                            key={day}
                            onClick={() => !isPast && onSelectDate(dateStr)}
                            style={{ aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: isSelected ? `1px solid ${T.borderGlow}` : isToday ? `1px solid rgba(124,58,237,0.35)` : '1px solid transparent', background: isSelected ? 'rgba(124,58,237,0.18)' : isToday ? 'rgba(124,58,237,0.08)' : 'transparent', cursor: isPast ? 'default' : 'pointer', opacity: isPast ? 0.35 : 1, padding: 0 }}
                        >
                            <span style={{ fontSize: '12px', fontWeight: isToday ? 700 : 400, color: isSelected ? '#a78bfa' : isToday ? '#a78bfa' : T.textMuted }}>{day}</span>
                            {color && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, marginTop: '2px' }} />}
                        </button>
                    );
                })}
            </div>
            {selectedDate && selectedDate !== todayStr && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${T.border}`, fontSize: '12px', color: T.textMuted }}>
                    Selected: <span style={{ color: '#a78bfa', fontWeight: 600 }}>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
            )}
        </div>
    );
}

export function ScheduleScreen() {
    const nav = useNavigate();
    const [commitments, setCommitments] = useState<Commitment[]>([]);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchAll = async () => {
        const [c, w] = await Promise.all([
            supabase.from('commitments').select('*, workout:workouts(name,color)').order('scheduled_date'),
            supabase.from('workouts').select('*').order('created_at'),
        ]);
        if (c.data) setCommitments(c.data as Commitment[]);
        if (w.data) setWorkouts(w.data);
        setLoading(false);
    };

    useEffect(() => { fetchAll(); }, []);

    const openModal = (date: string) => { setSelectedDate(date); setSelectedWorkout(null); setNote(''); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setSelectedDate(null); };

    const saveCommitment = async () => {
        if (!selectedWorkout || !selectedDate) return;
        await supabase.from('commitments').insert({ workout_id: selectedWorkout.id, scheduled_date: selectedDate, note: note || null });
        setShowModal(false); setNote('');
        fetchAll();
    };

    const deleteCommitment = async (id: string) => {
        await supabase.from('commitments').delete().eq('id', id);
        fetchAll();
    };

    const startCommitment = async (c: Commitment) => {
        const { data } = await supabase.from('session_logs').insert({ workout_id: c.workout_id, started_at: new Date().toISOString() }).select().single();
        if (data) nav(`/session/${data.id}?workoutId=${c.workout_id}`);
    };

    const upcoming = commitments.filter(c => c.scheduled_date >= new Date().toISOString().slice(0, 10));
    const past = commitments.filter(c => c.scheduled_date < new Date().toISOString().slice(0, 10));

    if (loading) return (<Layout title="SCHEDULE" subtitle="Commit & Consist"><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><div style={{ color: T.textMuted }}>Loading...</div></div></Layout>);

    return (
        <Layout title="SCHEDULE" subtitle="Commit & Consist">
            <div style={{ padding: '24px 20px', maxWidth: '600px', margin: '0 auto' }}>
                <ScheduleCalendar commitments={commitments} selectedDate={selectedDate} onSelectDate={openModal} />

                {/* Upcoming */}
                <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textMuted, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CalendarDays size={14} style={{ color: '#a78bfa' }} /> Upcoming</span>
                    <button onClick={() => { const today = new Date().toISOString().slice(0, 10); openModal(today); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', padding: '5px 10px', color: '#a78bfa', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        <Plus size={12} /> Add
                    </button>
                </h2>

                {upcoming.length === 0 ? (
                    <div style={{ background: T.surface, border: `1px dashed ${T.border}`, borderRadius: '16px', padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
                        <CalendarDays size={32} style={{ color: T.textDim, margin: '0 auto 12px' }} />
                        <p style={{ color: T.textMuted, fontSize: '14px', margin: 0 }}>Tap a date on the calendar to commit to a workout</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        {upcoming.map(c => {
                            const color = c.workout?.color || T.violet;
                            const dateStr = new Date(c.scheduled_date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
                            return (
                                <div key={c.id} style={{ background: T.surface, border: `1px solid ${color}44`, borderRadius: '16px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: color, borderRadius: '16px 0 0 16px' }} />
                                    <div style={{ paddingLeft: '10px', flex: 1 }}>
                                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '16px', fontWeight: 700, letterSpacing: '0.05em', color: T.textPrimary }}>{c.workout?.name?.toUpperCase() || 'WORKOUT'}</div>
                                        <div style={{ fontSize: '12px', color: T.textMuted, marginTop: '2px' }}>{dateStr}{c.note ? ` · ${c.note}` : ''}</div>
                                    </div>
                                    <button onClick={() => startCommitment(c)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: `linear-gradient(135deg, ${T.violet}, ${T.crimson})`, border: 'none', borderRadius: '10px', padding: '8px 14px', color: 'white', fontSize: '12px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}><Play size={12} /> Start</button>
                                    <button onClick={() => deleteCommitment(c.id)} style={{ background: 'rgba(232,0,61,0.1)', border: '1px solid rgba(232,0,61,0.25)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: T.crimson, display: 'flex' }}><X size={14} /></button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {past.length > 0 && (
                    <>
                        <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textDim, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ChevronRight size={12} /> Past Commitments
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: 0.5 }}>
                            {past.slice(-5).reverse().map(c => (
                                <div key={c.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: T.textMuted }}>{c.workout?.name || 'Workout'}</div>
                                        <div style={{ fontSize: '11px', color: T.textDim }}>{new Date(c.scheduled_date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                                    </div>
                                    <button onClick={() => deleteCommitment(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textDim }}><X size={13} /></button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Add Commitment Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(5,5,8,0.9)', backdropFilter: 'blur(16px)' }}>
                    <div style={{ background: 'rgba(14,12,24,1)', border: `1px solid ${T.borderGlow}`, borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '600px', padding: '28px 24px 32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '20px', fontWeight: 700, letterSpacing: '0.08em', color: T.textPrimary, margin: 0 }}>COMMIT TO WORKOUT</h3>
                                {selectedDate && <p style={{ color: T.textMuted, fontSize: '13px', margin: '4px 0 0' }}>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>}
                            </div>
                            <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`, borderRadius: '10px', padding: '8px', cursor: 'pointer', color: T.textMuted, display: 'flex' }}><X size={18} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                            {workouts.map(w => (
                                <button key={w.id} onClick={() => setSelectedWorkout(w)} style={{ background: selectedWorkout?.id === w.id ? `${w.color}18` : T.surface, border: selectedWorkout?.id === w.id ? `1px solid ${w.color}88` : `1px solid ${T.border}`, borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: w.color, flexShrink: 0, boxShadow: selectedWorkout?.id === w.id ? `0 0 10px ${w.color}` : 'none' }} />
                                    <div>
                                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '15px', fontWeight: 700, letterSpacing: '0.05em', color: T.textPrimary }}>{w.name.toUpperCase()}</div>
                                        <div style={{ fontSize: '12px', color: T.textMuted }}>{w.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <input placeholder="Note (optional — e.g. Morning session)" value={note} onChange={e => setNote(e.target.value)} style={{ width: '100%', background: 'rgba(5,5,8,0.8)', border: `1px solid ${T.border}`, borderRadius: '12px', padding: '12px 16px', color: T.textPrimary, fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }} />
                        <button onClick={saveCommitment} disabled={!selectedWorkout} style={{ width: '100%', background: selectedWorkout ? `linear-gradient(135deg, ${T.violet}, ${T.crimson})` : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '14px', padding: '16px', color: selectedWorkout ? 'white' : T.textDim, fontSize: '15px', fontWeight: 700, fontFamily: "'Oswald', sans-serif", letterSpacing: '0.1em', cursor: selectedWorkout ? 'pointer' : 'default', boxShadow: selectedWorkout ? `0 0 24px ${T.violetGlow}` : 'none', transition: 'all 0.2s' }}>COMMIT TO THIS WORKOUT</button>
                    </div>
                </div>
            )}
        </Layout>
    );
}
