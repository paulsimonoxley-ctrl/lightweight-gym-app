import { useState } from 'react';
import { History, TrendingUp } from 'lucide-react';

const theme = {
    bg: '#050508', surface: 'rgba(20,18,30,0.85)', border: 'rgba(120,80,200,0.25)',
    violet: '#7c3aed', violetGlow: 'rgba(124,58,237,0.35)',
    crimson: '#e8003d', crimsonGlow: 'rgba(232,0,61,0.35)',
    electric: '#00d4ff', textPrimary: '#f0eeff', textMuted: '#7d7a9c', textDim: '#4a4768',
    success: '#10b981', successBg: 'rgba(16,185,129,0.1)', warnBg: 'rgba(232,0,61,0.1)',
};

interface WorkoutDatabaseProps {
    exerciseName: string;
    targetWeight: number;
    targetReps: number;
    onLogComplete: (weight: number, reps: number) => void;
}

export function WorkoutDatabase({ targetWeight, targetReps, onLogComplete }: WorkoutDatabaseProps) {
    const [actualWeight, setActualWeight] = useState(targetWeight.toString());
    const [actualReps, setActualReps] = useState('');
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'warning' | 'neutral' } | null>(null);

    const handleLog = () => {
        const w = parseFloat(actualWeight);
        const r = parseInt(actualReps, 10);
        if (isNaN(w) || isNaN(r)) { setFeedback({ message: 'Enter valid weight and reps to continue.', type: 'warning' }); return; }
        if (w > targetWeight) setFeedback({ message: `\uD83D\uDD25 Beast mode. +${(w - targetWeight).toFixed(1)}lbs over target.`, type: 'success' });
        else if (w === targetWeight && r > targetReps) setFeedback({ message: `\u26A1 +${r - targetReps} extra reps. Up the weight next session.`, type: 'success' });
        else if (w < targetWeight || r < targetReps) setFeedback({ message: 'Target missed. Rest well \u2014 you\'ll crush it next session.', type: 'warning' });
        else setFeedback({ message: 'Target locked. Increase weight next session.', type: 'neutral' });
        onLogComplete(w, r);
    };

    const inputStyle: React.CSSProperties = { background: 'rgba(5,5,8,0.8)', border: '1px solid rgba(120,80,200,0.3)', borderRadius: '12px', padding: '10px 12px', textAlign: 'center', color: theme.textPrimary, fontSize: '18px', fontFamily: "'Space Grotesk', monospace", fontWeight: 700, width: '72px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' };
    const labelStyle: React.CSSProperties = { display: 'block', fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: theme.textDim, textAlign: 'center', marginTop: '6px' };

    return (
        <div>
            <div style={{ background: 'rgba(5,5,8,0.5)', border: `1px solid ${theme.border}`, borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid rgba(120,80,200,0.12)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.textDim }}>
                    <span>Timeline</span><span style={{ textAlign: 'center' }}>Target</span><span style={{ textAlign: 'right' }}>Actual</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '14px 20px', fontSize: '14px', color: theme.textDim, fontWeight: 400, borderBottom: '1px solid rgba(120,80,200,0.08)' }}>
                    <span>Previous Session</span>
                    <span style={{ textAlign: 'center', fontFamily: "'Space Grotesk', monospace" }}>{targetWeight} <span style={{ opacity: 0.4, fontSize: '11px' }}>LBS</span> \u00d7 {targetReps}</span>
                    <span style={{ textAlign: 'right' }}>\u2014</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px 20px', fontSize: '14px', color: theme.textPrimary, fontWeight: 600, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><History size={15} style={{ color: theme.violet }} /><span>Current Set</span></div>
                    <div style={{ textAlign: 'center', fontFamily: "'Space Grotesk', monospace", color: '#a78bfa' }}>{targetWeight} <span style={{ opacity: 0.4, fontSize: '11px' }}>LBS</span> \u00d7 {targetReps}</div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                        <div>
                            <input type="number" value={actualWeight} onChange={e => setActualWeight(e.target.value)} onFocus={e => { e.target.style.borderColor = theme.violet; e.target.style.boxShadow = `0 0 14px ${theme.violetGlow}`; }} onBlur={e => { e.target.style.borderColor = 'rgba(120,80,200,0.3)'; e.target.style.boxShadow = 'none'; }} style={inputStyle} />
                            <label style={labelStyle}>LBS</label>
                        </div>
                        <span style={{ color: theme.textDim, fontFamily: 'monospace' }}>\u00d7</span>
                        <div>
                            <input type="number" placeholder="0" value={actualReps} onChange={e => setActualReps(e.target.value)} onFocus={e => { e.target.style.borderColor = theme.crimson; e.target.style.boxShadow = `0 0 14px ${theme.crimsonGlow}`; }} onBlur={e => { e.target.style.borderColor = 'rgba(120,80,200,0.3)'; e.target.style.boxShadow = 'none'; }} style={{ ...inputStyle, borderColor: actualReps ? 'rgba(232,0,61,0.3)' : 'rgba(120,80,200,0.3)' }} />
                            <label style={labelStyle}>Reps</label>
                        </div>
                    </div>
                </div>
            </div>
            {feedback && (
                <div style={{ padding: '14px 18px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', fontWeight: 500, lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: '10px', background: feedback.type === 'success' ? theme.successBg : feedback.type === 'warning' ? theme.warnBg : 'rgba(120,80,200,0.08)', border: `1px solid ${feedback.type === 'success' ? 'rgba(16,185,129,0.3)' : feedback.type === 'warning' ? 'rgba(232,0,61,0.3)' : 'rgba(120,80,200,0.2)'}`, color: feedback.type === 'success' ? theme.success : feedback.type === 'warning' ? theme.crimson : '#a78bfa' }}>
                    <TrendingUp size={16} style={{ flexShrink: 0 }} />{feedback.message}
                </div>
            )}
            <button onClick={handleLog} style={{ width: '100%', background: feedback && feedback.type !== 'warning' ? `linear-gradient(135deg, rgba(124,58,237,0.3), rgba(232,0,61,0.3))` : `linear-gradient(135deg, ${theme.violet}, ${theme.crimson})`, border: feedback && feedback.type !== 'warning' ? `1px solid ${theme.border}` : 'none', borderRadius: '16px', padding: '18px 24px', color: 'white', fontSize: '16px', fontWeight: 700, fontFamily: "'Oswald', sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: feedback && feedback.type !== 'warning' ? '0 0 20px rgba(124,58,237,0.2)' : '0 0 30px rgba(124,58,237,0.5)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                {feedback && feedback.type !== 'warning' ? 'ADVANCE TO NEXT EXERCISE \u2192' : 'LOG TARGET & CONTINUE \u2192'}
            </button>
        </div>
    );
}
