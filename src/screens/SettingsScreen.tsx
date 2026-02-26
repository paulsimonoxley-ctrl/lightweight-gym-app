import { Layout } from '../components/Layout';
import { T } from '../lib/theme';
import { useSettings } from '../lib/useSettings';

export function SettingsScreen() {
    const { weightUnit, updateWeightUnit } = useSettings();

    return (
        <Layout title="SETTINGS">
            <div style={{ padding: '20px' }}>
                <div style={{
                    background: T.surface,
                    borderRadius: '16px',
                    padding: '20px',
                    border: `1px solid ${T.border}`,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)`
                }}>
                    <h2 style={{
                        color: T.textPrimary,
                        fontFamily: "'Oswald', sans-serif",
                        fontSize: '18px',
                        letterSpacing: '0.05em',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        PREFERENCES
                    </h2>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderBottom: `1px solid ${T.border}`
                    }}>
                        <div>
                            <div style={{ color: T.textPrimary, fontWeight: 500, fontSize: '15px' }}>Weight Unit</div>
                            <div style={{ color: T.textMuted, fontSize: '13px', marginTop: '4px' }}>
                                Choose between kilograms or pounds
                            </div>
                        </div>

                        <div style={{ display: 'flex', background: '#1a1a1e', borderRadius: '8px', padding: '4px' }}>
                            <button
                                onClick={() => updateWeightUnit('kg')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: weightUnit === 'kg' ? T.electric : 'transparent',
                                    color: weightUnit === 'kg' ? '#fff' : T.textMuted,
                                    fontWeight: weightUnit === 'kg' ? 600 : 400,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontFamily: "'Oswald', sans-serif",
                                    letterSpacing: '0.05em'
                                }}
                            >
                                KG
                            </button>
                            <button
                                onClick={() => updateWeightUnit('lbs')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: weightUnit === 'lbs' ? T.electric : 'transparent',
                                    color: weightUnit === 'lbs' ? '#fff' : T.textMuted,
                                    fontWeight: weightUnit === 'lbs' ? 600 : 400,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontFamily: "'Oswald', sans-serif",
                                    letterSpacing: '0.05em'
                                }}
                            >
                                LBS
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
