import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, Save, X, GripVertical } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Workout, Exercise } from '../lib/supabase';
import { Layout, T } from '../components/Layout';

export function BuilderScreen() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [exercises, setExercises] = useState<Record<string, Exercise[]>>({});
    const [expanded, setExpanded] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showNewWorkout, setShowNewWorkout] = useState(false);
    const [newWorkoutName, setNewWorkoutName] = useState('');
    const [newWorkoutDesc, setNewWorkoutDesc] = useState('');
    const [newWorkoutColor, setNewWorkoutColor] = useState('#7c3aed');
    const [addingExFor, setAddingExFor] = useState<string | null>(null);
    const [exForm, setExForm] = useState({ name: '', focus: '', target_weight: '', target_reps: '', video_url: '' });
    const [editingEx, setEditingEx] = useState<Exercise | null>(null);

    const loadWorkouts = async () => {
        const { data: ws } = await supabase.from('workouts').select('*').order('created_at');
        if (!ws) return;
        setWorkouts(ws);
        const exByWorkout: Record<string, Exercise[]> = {};
        for (const w of ws) {
            const { data: exs } = await supabase.from('exercises').select('*').eq('workout_id', w.id).order('order_index');
            exByWorkout[w.id] = exs || [];
        }
        setExercises(exByWorkout);
        setLoading(false);
    };

    useEffect(() => { loadWorkouts(); }, []);

    const saveNewWorkout = async () => {
        if (!newWorkoutName.trim()) return;
        await supabase.from('workouts').insert({ name: newWorkoutName, description: newWorkoutDesc, color: newWorkoutColor });
        setNewWorkoutName(''); setNewWorkoutDesc(''); setShowNewWorkout(false);
        loadWorkouts();
    };
    const deleteWorkout = async (id: string) => {
        if (!confirm('Delete this workout and all its exercises?')) return;
        await supabase.from('workouts').delete().eq('id', id);
        loadWorkouts();
    };
    const saveExercise = async (workoutId: string) => {
        if (!exForm.name.trim()) return;
        await supabase.from('exercises').insert({ workout_id: workoutId, name: exForm.name, focus: exForm.focus, target_weight: parseFloat(exForm.target_weight) || 0, target_reps: parseInt(exForm.target_reps) || 8, video_url: exForm.video_url || null, order_index: exercises[workoutId]?.length || 0 });
        setExForm({ name: '', focus: '', target_weight: '', target_reps: '', video_url: '' }); setAddingExFor(null);
        loadWorkouts();
    };
    const saveEditedExercise = async () => {
        if (!editingEx) return;
        await supabase.from('exercises').update({ name: editingEx.name, focus: editingEx.focus, target_weight: editingEx.target_weight, target_reps: editingEx.target_reps, video_url: editingEx.video_url }).eq('id', editingEx.id);
        setEditingEx(null); loadWorkouts();
    };
    const deleteExercise = async (id: string) => { await supabase.from('exercises').delete().eq('id', id); loadWorkouts(); };

    const inputSt: React.CSSProperties = { background: 'rgba(5,5,8,0.8)', border: `1px solid ${T.border}`, borderRadius: '10px', padding: '10px 14px', color: T.textPrimary, fontSize: '14px', fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' };
    const colorOpts = ['#e8003d', '#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];

    if (loading) return (<Layout title="BUILDER" subtitle="Manage workouts"><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><div style={{ color: T.textMuted }}>Loading...</div></div></Layout>);

    return (
        <Layout title="BUILDER" subtitle="Manage workouts & exercises">
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                {!showNewWorkout ? (
                    <button onClick={() => setShowNewWorkout(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(124,58,237,0.08)', border: '1px dashed rgba(124,58,237,0.4)', borderRadius: '16px', padding: '16px', color: '#a78bfa', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginBottom: '20px', letterSpacing: '0.05em' }}>
                        <Plus size={18} /> Add New Workout Program
                    </button>
                ) : (
                    <div style={{ background: T.surface, border: `1px solid ${T.borderGlow}`, borderRadius: '18px', padding: '20px', marginBottom: '20px' }}>
                        <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '15px', letterSpacing: '0.1em', color: T.textPrimary, margin: '0 0 14px' }}>NEW WORKOUT</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input placeholder="Name" value={newWorkoutName} onChange={e => setNewWorkoutName(e.target.value)} style={inputSt} />
                            <input placeholder="Description (optional)" value={newWorkoutDesc} onChange={e => setNewWorkoutDesc(e.target.value)} style={inputSt} />
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ color: T.textMuted, fontSize: '13px' }}>Colour:</span>
                                {colorOpts.map(c => <button key={c} onClick={() => setNewWorkoutColor(c)} style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, border: newWorkoutColor === c ? '3px solid white' : '2px solid transparent', cursor: 'pointer' }} />)}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={saveNewWorkout} style={{ flex: 1, background: `linear-gradient(135deg, ${T.violet}, ${T.crimson})`, border: 'none', borderRadius: '10px', padding: '11px', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Save</button>
                                <button onClick={() => setShowNewWorkout(false)} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`, borderRadius: '10px', padding: '11px 16px', color: T.textMuted, cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {workouts.map(w => {
                        const isExp = expanded === w.id;
                        const exs = exercises[w.id] || [];
                        return (
                            <div key={w.id} style={{ background: T.surface, border: `1px solid ${w.color}44`, borderRadius: '18px', overflow: 'hidden' }}>
                                <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', position: 'relative' }} onClick={() => setExpanded(isExp ? null : w.id)}>
                                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: w.color, borderRadius: '18px 0 0 18px' }} />
                                    <div style={{ paddingLeft: '14px' }}>
                                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '17px', fontWeight: 700, letterSpacing: '0.05em', color: T.textPrimary }}>{w.name.toUpperCase()}</div>
                                        <div style={{ color: T.textMuted, fontSize: '12px', marginTop: '2px' }}>{exs.length} exercise{exs.length !== 1 ? 's' : ''}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <button onClick={e => { e.stopPropagation(); deleteWorkout(w.id); }} style={{ background: 'rgba(232,0,61,0.1)', border: '1px solid rgba(232,0,61,0.25)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: T.crimson }}><Trash2 size={14} /></button>
                                        {isExp ? <ChevronUp size={16} style={{ color: T.textDim }} /> : <ChevronDown size={16} style={{ color: T.textDim }} />}
                                    </div>
                                </div>
                                {isExp && (
                                    <div style={{ borderTop: `1px solid ${T.border}`, padding: '14px 18px' }}>
                                        {exs.map(ex => (
                                            <div key={ex.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: `1px solid ${T.border}` }}>
                                                <GripVertical size={16} style={{ color: T.textDim, marginTop: '2px', flexShrink: 0 }} />
                                                {editingEx?.id === ex.id ? (
                                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        <input value={editingEx.name} onChange={e => setEditingEx({ ...editingEx, name: e.target.value })} style={{ ...inputSt, padding: '8px 12px' }} />
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                                            <input placeholder="Focus" value={editingEx.focus || ''} onChange={e => setEditingEx({ ...editingEx, focus: e.target.value })} style={{ ...inputSt, padding: '8px 12px' }} />
                                                            <input placeholder="YouTube URL" value={editingEx.video_url || ''} onChange={e => setEditingEx({ ...editingEx, video_url: e.target.value })} style={{ ...inputSt, padding: '8px 12px' }} />
                                                            <input type="number" placeholder="Weight" value={editingEx.target_weight} onChange={e => setEditingEx({ ...editingEx, target_weight: parseFloat(e.target.value) })} style={{ ...inputSt, padding: '8px 12px' }} />
                                                            <input type="number" placeholder="Reps" value={editingEx.target_reps} onChange={e => setEditingEx({ ...editingEx, target_reps: parseInt(e.target.value) })} style={{ ...inputSt, padding: '8px 12px' }} />
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button onClick={saveEditedExercise} style={{ flex: 1, background: `linear-gradient(135deg, ${T.violet}, ${T.crimson})`, border: 'none', borderRadius: '8px', padding: '9px', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Save size={14} /> Save</button>
                                                            <button onClick={() => setEditingEx(null)} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`, borderRadius: '8px', padding: '9px 14px', color: T.textMuted, cursor: 'pointer' }}><X size={14} /></button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: '14px', fontWeight: 600, color: T.textPrimary }}>{ex.name}</div>
                                                            <div style={{ fontSize: '12px', color: T.textMuted, marginTop: '2px' }}>{ex.focus} · {ex.target_weight > 0 ? `${ex.target_weight} lbs` : 'BW'} × {ex.target_reps}</div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                                            <button onClick={() => setEditingEx(ex)} style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#a78bfa' }}><Edit2 size={13} /></button>
                                                            <button onClick={() => deleteExercise(ex.id)} style={{ background: 'rgba(232,0,61,0.08)', border: '1px solid rgba(232,0,61,0.2)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: T.crimson }}><Trash2 size={13} /></button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                        {addingExFor === w.id ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                                                <input placeholder="Exercise name *" value={exForm.name} onChange={e => setExForm({ ...exForm, name: e.target.value })} style={{ ...inputSt, padding: '10px 12px' }} />
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                                    <input placeholder="Focus" value={exForm.focus} onChange={e => setExForm({ ...exForm, focus: e.target.value })} style={{ ...inputSt, padding: '10px 12px' }} />
                                                    <input placeholder="YouTube URL" value={exForm.video_url} onChange={e => setExForm({ ...exForm, video_url: e.target.value })} style={{ ...inputSt, padding: '10px 12px' }} />
                                                    <input type="number" placeholder="Target weight" value={exForm.target_weight} onChange={e => setExForm({ ...exForm, target_weight: e.target.value })} style={{ ...inputSt, padding: '10px 12px' }} />
                                                    <input type="number" placeholder="Target reps" value={exForm.target_reps} onChange={e => setExForm({ ...exForm, target_reps: e.target.value })} style={{ ...inputSt, padding: '10px 12px' }} />
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => saveExercise(w.id)} style={{ flex: 1, background: `linear-gradient(135deg, ${T.violet}, ${T.crimson})`, border: 'none', borderRadius: '10px', padding: '11px', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Add Exercise</button>
                                                    <button onClick={() => setAddingExFor(null)} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`, borderRadius: '10px', padding: '11px 16px', color: T.textMuted, cursor: 'pointer' }}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={e => { e.stopPropagation(); setAddingExFor(w.id); setExpanded(w.id); }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(124,58,237,0.06)', border: '1px dashed rgba(124,58,237,0.3)', borderRadius: '10px', padding: '11px', color: '#a78bfa', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>
                                                <Plus size={16} /> Add Exercise
                                            </button>
                                        )}
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
