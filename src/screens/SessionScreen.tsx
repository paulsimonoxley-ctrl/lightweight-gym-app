import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Timer, Search, PlayCircle, Music, CheckCircle, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Exercise } from '../lib/supabase';
import { WorkoutDatabase } from '../components/WorkoutDatabase';
import { AIAlternativeModal } from '../components/AIAlternativeModal';
import { VideoModal } from '../components/VideoModal';
import { Layout, T } from '../components/Layout';

const SESSION_MINUTES = 30;

export function SessionScreen() {
    const { id: sessionId } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const workoutId = searchParams.get('workoutId');
    const nav = useNavigate();

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(SESSION_MINUTES * 60);
    const [isComplete, setIsComplete] = useState(false);
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    useEffect(() => {
        if (!workoutId) return;
        supabase.from('exercises').select('*').eq('workout_id', workoutId).order('order_index')
            .then(({ data }) => { if (data) setExercises(data); setLoading(false); });
    }, [workoutId]);

    useEffect(() => {
        if (isComplete) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(p => {
                if (p <= 1) { clearInterval(timerRef.current); setIsComplete(true); return 0; }
                return p - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [isComplete]);

    const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    const progressPct = ((SESSION_MINUTES * 60 - timeLeft) / (SESSION_MINUTES * 60)) * 100;
    const isLast5 = timeLeft <= 5 * 60;
    const active = exercises[currentIdx];

    const handleLog = async (weight: number, reps: number) => {
        if (active && sessionId) {
            await supabase.from('set_logs').insert({ session_log_id: sessionId, exercise_id: active.id, actual_weight: weight, actual_reps: reps });
        }
        setTimeout(() => {
            if (currentIdx < exercises.length - 1) setCurrentIdx(c => c + 1);
            else completeSession();
        }, 1200);
    };

    const completeSession = async () => {
        if (sessionId) await supabase.from('session_logs').update({ completed_at: new Date().toISOString() }).eq('id', sessionId);
        setIsComplete(true);
    };

    const handleReplace = (newName: string) => {
        setExercises(prev => { const next = [...prev]; next[currentIdx] = { ...next[currentIdx], name: newName }; return next; });
        setIsAIOpen(false);
    };

    if (loading) return (<Layout title="LIGHTWEIGHT"><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><div style={{ color: T.textMuted }}>Loading exercises...</div></div></Layout>);

    if (isComplete) return (
        <Layout title="LIGHTWEIGHT">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: '32px 20px', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `radial-gradient(circle, ${T.violetGlow}, transparent)`, border: `2px solid ${T.borderGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: `0 0 40px ${T.violetGlow}` }}>
                    <Zap size={36} style={{ color: '#a78bfa' }} />
                </div>
                <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 700, letterSpacing: '0.06em', color: T.textPrimary, marginBottom: '12px' }}>PROTOCOL COMPLETE</h1>
                <p style={{ color: T.textMuted, fontSize: '16px', lineHeight: 1.6, maxWidth: '320px', marginBottom: '36px' }}>Incredible effort. Your session has been logged. Rest up and return stronger.</p>
                <button onClick={() => nav('/')} style={{ background: `linear-gradient(135deg, ${T.violet}, ${T.crimson})`, border: 'none', borderRadius: '16px', padding: '16px 40px', color: 'white', fontSize: '16px', fontWeight: 700, fontFamily: "'Oswald', sans-serif", letterSpacing: '0.1em', cursor: 'pointer', boxShadow: `0 0 30px ${T.violetGlow}` }}>RETURN TO DASHBOARD</button>
            </div>
        </Layout>
    );

    return (
        <Layout title="LIGHTWEIGHT" subtitle="In Session" right={
            <div style={{ background: isLast5 ? 'rgba(232,0,61,0.15)' : 'rgba(20,18,30,0.9)', border: `1px solid ${isLast5 ? T.crimson : T.border}`, borderRadius: '12px', padding: '8px 16px', textAlign: 'right', boxShadow: isLast5 ? `0 0 20px ${T.crimsonGlow}` : 'none', transition: 'all 0.5s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Timer size={16} style={{ color: isLast5 ? T.crimson : '#a78bfa' }} />
                    <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '24px', fontWeight: 700, color: isLast5 ? T.crimson : T.textPrimary }}>{fmt(timeLeft)}</span>
                </div>
                <div style={{ fontSize: '9px', color: T.textMuted, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '2px' }}>{isLast5 ? '\u26a0 Ending Soon' : 'Remaining'}</div>
            </div>
        }>
            <div style={{ height: '3px', background: 'rgba(120,80,200,0.1)' }}>
                <div style={{ height: '100%', width: `${progressPct}%`, background: `linear-gradient(90deg, ${T.violet}, ${T.crimson})`, transition: 'width 1s linear' }} />
            </div>
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {active && (
                    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '24px 22px', boxShadow: '0 0 40px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${T.violet}, ${T.crimson}, transparent)` }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '26px', fontWeight: 700, letterSpacing: '0.04em', color: T.textPrimary, margin: '0 0 8px' }}>{active.name.toUpperCase()}</h2>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <span style={{ fontSize: '11px', color: '#a78bfa', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '8px', padding: '3px 10px' }}>{active.focus}</span>
                                    <span style={{ fontSize: '11px', color: T.textDim, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '3px 10px' }}>{currentIdx + 1} of {exercises.length}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <button onClick={() => setIsVideoOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.28)', color: T.electric, borderRadius: '10px', padding: '8px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}><PlayCircle size={14} /> Form</button>
                                <button onClick={() => setIsAIOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.28)', color: '#a78bfa', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}><Search size={14} /> Adapt</button>
                            </div>
                        </div>
                        <WorkoutDatabase key={active.id} exerciseName={active.name} targetWeight={active.target_weight} targetReps={active.target_reps} onLogComplete={handleLog} />
                    </div>
                )}
                <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '18px', padding: '18px 20px' }}>
                    <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textMuted, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={13} style={{ color: '#a78bfa' }} /> Today's Flow</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {exercises.map((ex, idx) => {
                            const isCurr = idx === currentIdx;
                            const isDone = idx < currentIdx;
                            return (
                                <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0, background: isCurr ? `radial-gradient(circle, ${T.violet}, ${T.crimson})` : isDone ? 'rgba(255,255,255,0.1)' : 'transparent', border: isCurr ? `2px solid ${T.borderGlow}` : '2px solid rgba(255,255,255,0.12)', boxShadow: isCurr ? `0 0 10px ${T.violetGlow}` : 'none' }} />
                                    <span style={{ fontSize: '14px', color: isCurr ? T.textPrimary : isDone ? T.textDim : T.textMuted, fontWeight: isCurr ? 600 : 400, textDecoration: isDone ? 'line-through' : 'none' }}>{ex.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '18px', overflow: 'hidden', height: '160px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', zIndex: 2, background: `linear-gradient(90deg, transparent, ${T.crimson}, ${T.violet}, transparent)` }} />
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&loop=1&playlist=jfKfPfyJRdk&controls=1" title="Focus Stream" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: 'block', border: 'none' }} />
                    <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 3, background: 'rgba(5,5,8,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: '#c4b5fd', pointerEvents: 'none' }}>
                        <Music size={12} /> FOCUS STREAM
                    </div>
                </div>
            </div>
            {isAIOpen && active && <AIAlternativeModal originalExercise={active.name} focus={active.focus || ''} onClose={() => setIsAIOpen(false)} onSelectAlternative={handleReplace} />}
            {isVideoOpen && active && <VideoModal exerciseName={active.name} videoUrl={active.video_url || undefined} onClose={() => setIsVideoOpen(false)} />}
        </Layout>
    );
}
