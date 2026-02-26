// ─── Industrial theme (lightened for readability) ────────────────────────────
export const T = {
    bg: '#12111a',
    surface: 'rgba(28,25,40,0.97)',
    surfaceSolid: '#1c1928',
    border: 'rgba(120,90,190,0.28)',
    borderGlow: 'rgba(140,100,210,0.45)',
    // Primary accent: vivid-enough purple
    violet: '#8a5cf6',
    violetGlow: 'rgba(138,92,246,0.30)',
    // Secondary: mid rust-red
    crimson: '#c0392b',
    crimsonGlow: 'rgba(192,57,43,0.28)',
    electric: '#4a9ab5',    // readable teal-blue
    green: '#4a8c5c',       // mid moss green
    textPrimary: '#eae7f5', // near-white, easy on eyes
    textMuted: '#8a86a8',   // lifted from near-invisible
    textDim: '#5a5670',     // lifted from near-black
    concrete: '#1c1928',
    iron: '#252336',
};

// ─── Map bright DB workout colours → muted rusted equivalents ────────────────
export const muteWorkoutColor = (hex: string): string => {
    const map: Record<string, string> = {
        '#e8003d': '#7a2020',   // neon red      → rust
        '#7c3aed': '#4a306e',   // electric violet → aged iron
        '#0ea5e9': '#1e4a5e',   // sky blue       → gunmetal
        '#10b981': '#2a4a36',   // neon green     → moss
    };
    return map[hex?.toLowerCase()] ?? hex;
};
