interface LogoBadgeProps {
    size?: number;
    style?: React.CSSProperties;
}

export function LogoBadge({ size = 44, style }: LogoBadgeProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            style={style}
        >
            <defs>
                <radialGradient id="lbBg" cx="40%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#2a1d45" />
                    <stop offset="100%" stopColor="#080610" />
                </radialGradient>
                <radialGradient id="lbGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#6a3fc7" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#6a3fc7" stopOpacity="0" />
                </radialGradient>
                <filter id="lbShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6a3fc7" floodOpacity="0.4" />
                </filter>
            </defs>

            {/* Background rect */}
            <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#lbBg)"
                stroke="#4a2e8a" strokeWidth="1.5" />

            {/* Glow disc */}
            <ellipse cx="50" cy="44" rx="36" ry="32" fill="url(#lbGlow)" />

            {/* Scratch lines */}
            <line x1="18" y1="22" x2="44" y2="82" stroke="rgba(255,255,255,0.04)" strokeWidth="1.2" />
            <line x1="28" y1="16" x2="54" y2="76" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="60" y1="18" x2="36" y2="84" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

            {/* Dumbbell bar */}
            <rect x="29" y="46" width="42" height="8" rx="4" fill="#7a6aaa" filter="url(#lbShadow)" />

            {/* Left collar rings */}
            <rect x="23" y="39" width="10" height="22" rx="3" fill="#5a4090" />
            <rect x="25" y="43" width="6" height="14" rx="2" fill="#6a50a8" />

            {/* Right collar rings */}
            <rect x="67" y="39" width="10" height="22" rx="3" fill="#5a4090" />
            <rect x="69" y="43" width="6" height="14" rx="2" fill="#6a50a8" />

            {/* Weight plates left */}
            <rect x="14" y="35" width="9" height="30" rx="2.5" fill="#3a2870" />
            <rect x="16" y="38" width="5" height="24" rx="1.5" fill="#4a3880" />

            {/* Weight plates right */}
            <rect x="77" y="35" width="9" height="30" rx="2.5" fill="#3a2870" />
            <rect x="79" y="38" width="5" height="24" rx="1.5" fill="#4a3880" />

            {/* Chain ring dots around edge */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const cx = 50 + 44 * Math.cos(rad);
                const cy = 50 + 44 * Math.sin(rad);
                return <circle key={i} cx={cx} cy={cy} r="2" fill="#2a1860" opacity="0.8" />;
            })}

            {/* "LW" monogram */}
            <text
                x="50" y="91"
                textAnchor="middle"
                fontFamily="'Oswald', sans-serif"
                fontWeight="700"
                fontSize="11"
                letterSpacing="3"
                fill="#8878c0"
                opacity="0.85"
            >LW</text>
        </svg>
    );
}
