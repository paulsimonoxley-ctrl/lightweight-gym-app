/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#040405',
                surface: '#0a0a0c',
                surfaceHighlight: '#141417',
                accent: {
                    DEFAULT: '#ffffff',
                    hover: '#e5e5e5',
                },
                text: {
                    main: '#ffffff',
                    muted: '#8e8e93',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'system-ui', 'sans-serif'],
                display: ['Oswald', 'sans-serif'],
                mono: ['"Space Grotesk"', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
