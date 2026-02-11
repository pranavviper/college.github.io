/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4f46e5', // Indigo 600 - Main Brand Color
                secondary: '#64748b', // Slate 500 - Secondary Text/Icons
                accent: '#8b5cf6', // Violet 500 - Highlights/Gradients
                success: '#10b981', // Emerald 500
                warning: '#f59e0b', // Amber 500
                danger: '#ef4444', // Red 500
                background: '#f8fafc', // Slate 50 - Main Background
                surface: '#ffffff', // White - Card Background
                dark: '#1e293b', // Slate 800 - Headings
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'], // For Headings if needed
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'glow': '0 0 15px rgba(79, 70, 229, 0.3)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)',
                'gradient-surface': 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            }
        },
    },
    plugins: [],
}
