import { X, PlayCircle } from 'lucide-react';

const theme = { violet: '#7c3aed', violetGlow: 'rgba(124,58,237,0.4)', crimson: '#e8003d', borderGlow: 'rgba(160,100,255,0.55)', textPrimary: '#f0eeff', textMuted: '#7d7a9c', textDim: '#4a4768' };

interface VideoModalProps { exerciseName: string; videoUrl: string | undefined; onClose: () => void; }

export function VideoModal({ exerciseName, videoUrl, onClose }: VideoModalProps) {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'rgba(5,5,8,0.97)', backdropFilter: 'blur(24px)' }}>
            <div style={{ background: 'rgba(14,12,24,1)', border: `1px solid ${theme.borderGlow}`, borderRadius: '24px', width: '100%', maxWidth: '720px', boxShadow: `0 0 80px ${theme.violetGlow}`, overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', zIndex: 2, background: `linear-gradient(90deg, transparent, ${theme.violet}, ${theme.crimson}, transparent)` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(120,80,200,0.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(232,0,61,0.2))', border: `1px solid ${theme.borderGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PlayCircle size={18} style={{ color: '#a78bfa' }} /></div>
                        <div>
                            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '18px', fontWeight: 700, letterSpacing: '0.08em', color: theme.textPrimary, margin: 0 }}>{exerciseName.toUpperCase()} \u2014 FORM GUIDE</h2>
                            <p style={{ color: theme.textDim, fontSize: '11px', letterSpacing: '0.1em', margin: '2px 0 0' }}>Watch & understand proper execution</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme.textMuted }}><X size={18} /></button>
                </div>
                <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                    {videoUrl ? (
                        <iframe style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} src={`${videoUrl}?autoplay=1`} title={`${exerciseName} Tutorial`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: theme.textMuted }}>
                            <PlayCircle size={48} style={{ opacity: 0.3 }} />
                            <p style={{ fontSize: '14px', letterSpacing: '0.1em', margin: 0 }}>No tutorial available for this exercise.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
