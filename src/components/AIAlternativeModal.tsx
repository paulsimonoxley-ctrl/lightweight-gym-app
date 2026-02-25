import { useState } from 'react';
import { Bot, Youtube, ArrowRight, X, Zap } from 'lucide-react';

const theme = { bg: '#050508', surface: 'rgba(20,18,30,0.98)', border: 'rgba(120,80,200,0.25)', borderGlow: 'rgba(160,100,255,0.55)', violet: '#7c3aed', violetGlow: 'rgba(124,58,237,0.35)', crimson: '#e8003d', crimsonGlow: 'rgba(232,0,61,0.35)', electric: '#00d4ff', electricGlow: 'rgba(0,212,255,0.25)', textPrimary: '#f0eeff', textMuted: '#7d7a9c', textDim: '#4a4768' };

interface AIAlternativeModalProps { originalExercise: string; focus: string; onClose: () => void; onSelectAlternative: (newExercise: string) => void; }

const alternatives = [
    { name: 'Decline Push-ups (Feet Elevated)', rationale: 'Zero setup time. Hits the upper chest similarly to the incline press. Requires no equipment.', isBodyweight: true },
    { name: 'Reverse Grip Dumbbell Press', rationale: 'If dumbbells are available, the reverse grip strongly activates the upper pectorals.', isBodyweight: false },
    { name: 'Cable Incline Fly', rationale: 'Constant tension throughout the range of motion \u2014 excellent substitute when the barbell is occupied.', isBodyweight: false },
];

export function AIAlternativeModal({ originalExercise, focus, onClose, onSelectAlternative }: AIAlternativeModalProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showAlternatives, setShowAlternatives] = useState<typeof alternatives | null>(null);

    const generateAlternatives = () => {
        setIsGenerating(true);
        setTimeout(() => { setShowAlternatives(alternatives); setIsGenerating(false); }, 1800);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'rgba(5,5,8,0.96)', backdropFilter: 'blur(24px)' }}>
            <div style={{ background: 'rgba(14,12,24,1)', border: `1px solid ${theme.borderGlow}`, borderRadius: '24px', width: '100%', maxWidth: '520px', maxHeight: '88vh', overflowY: 'auto', boxShadow: `0 0 80px ${theme.violetGlow}, 0 0 160px rgba(0,0,0,0.9)`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${theme.violet}, ${theme.crimson}, transparent)` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px 20px', borderBottom: '1px solid rgba(120,80,200,0.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(232,0,61,0.2))', border: `1px solid ${theme.borderGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={18} style={{ color: '#a78bfa' }} /></div>
                        <div>
                            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '20px', fontWeight: 700, letterSpacing: '0.08em', color: theme.textPrimary, margin: 0 }}>GEMINI ADAPT</h2>
                            <p style={{ color: theme.textDim, fontSize: '11px', letterSpacing: '0.1em', margin: '2px 0 0' }}>AI-Powered Exercise Alternatives</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme.textMuted }}><X size={18} /></button>
                </div>
                <div style={{ padding: '28px', overflowY: 'auto', maxHeight: 'calc(88vh - 100px)' }}>
                    <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '14px', padding: '18px', marginBottom: '24px' }}>
                        <p style={{ color: theme.textDim, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 6px' }}>Finding alternatives for</p>
                        <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '22px', fontWeight: 700, color: theme.textPrimary, margin: '0 0 4px', letterSpacing: '0.05em' }}>{originalExercise.toUpperCase()}</p>
                        <p style={{ color: '#a78bfa', fontSize: '13px', margin: 0 }}>{focus}</p>
                    </div>
                    {!showAlternatives && !isGenerating && (
                        <button onClick={generateAlternatives} style={{ width: '100%', background: `linear-gradient(135deg, ${theme.violet}, ${theme.crimson})`, border: 'none', borderRadius: '16px', padding: '18px 24px', color: 'white', fontFamily: "'Oswald', sans-serif", fontSize: '17px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: `0 0 30px ${theme.violetGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <Zap size={20} /> Generate Smart Alternatives
                        </button>
                    )}
                    {isGenerating && (
                        <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `radial-gradient(circle, ${theme.violetGlow}, transparent)`, border: `2px solid ${theme.borderGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 1.5s infinite' }}><Bot size={26} style={{ color: '#a78bfa' }} /></div>
                            <p style={{ color: '#a78bfa', fontSize: '14px', fontWeight: 600, textAlign: 'center', margin: 0 }}>Analyzing biomechanics...</p>
                        </div>
                    )}
                    {showAlternatives && (
                        <div>
                            <p style={{ color: theme.textDim, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 16px' }}>Suggested Alternatives</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {showAlternatives.map((alt, i) => (
                                    <div key={i} style={{ background: 'rgba(20,18,30,0.8)', border: '1px solid rgba(120,80,200,0.2)', borderRadius: '18px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                                        {alt.isBodyweight && <div style={{ position: 'absolute', top: 0, right: 0, background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.15))', border: '1px solid rgba(0,212,255,0.3)', borderTopRightRadius: '18px', borderBottomLeftRadius: '12px', padding: '5px 12px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00d4ff' }}>Equipment Free</div>}
                                        <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '18px', fontWeight: 700, letterSpacing: '0.05em', color: theme.textPrimary, margin: '0 0 10px', paddingRight: alt.isBodyweight ? '110px' : '0' }}>{alt.name}</h3>
                                        <p style={{ color: theme.textMuted, fontSize: '13px', lineHeight: 1.6, margin: '0 0 16px' }}>{alt.rationale}</p>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', color: theme.textMuted, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}><Youtube size={16} style={{ color: '#ff4444' }} /> Watch Form</button>
                                            <button onClick={() => onSelectAlternative(alt.name)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: `linear-gradient(135deg, ${theme.violet}, ${theme.crimson})`, border: 'none', borderRadius: '12px', padding: '12px', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 0 20px ${theme.violetGlow}` }}>Swap Exercise <ArrowRight size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
