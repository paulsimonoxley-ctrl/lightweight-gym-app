// ─── Rusted / Industrial theme ───────────────────────────────────────────────
// All colours desaturated, aged, muted — concrete, iron, rust
export const T = {
    bg: '#070708',
    surface: 'rgba(12,10,16,0.98)',
    surfaceSolid: '#0c0a10',
    border: 'rgba(80,55,130,0.18)',
    borderGlow: 'rgba(100,70,160,0.30)',
    // Primary: aged/muted purple-iron, not electric violet
    violet: '#6a3fc7',
    violetGlow: 'rgba(106,63,199,0.22)',
    // Secondary: deep rust, not neon red
    crimson: '#8b2222',
    crimsonGlow: 'rgba(139,34,34,0.22)',
    electric: '#3a6a80',    // muted gunmetal blue
    green: '#3a5c3a',       // dark moss green
    textPrimary: '#ccc8dc', // aged off-white, not bright white
    textMuted: '#524f68',
    textDim: '#2c2a3a',
    concrete: '#111016',
    iron: '#1a182a',
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
