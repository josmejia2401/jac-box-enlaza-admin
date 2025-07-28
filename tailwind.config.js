/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'transition',
    'duration-100',
    'duration-75',
    'ease-out',
    'ease-in',
    'opacity-0',
    'opacity-100',
    'scale-95',
    'scale-100',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7ec4cf',
        secondary: '#f3b0c3',
        background: '#f8f9fa',
        surface: '#ffffff',
        text: '#23272f',
        muted: '#90a4ae',
        success: '#a8e6cf',
        warning: '#ffe082',
        error: '#ffb5b5',
        info: '#b0d0f3',

        // Primary - tonos turquesa/aqua
        'primary-light': '#b8dce3',     // Más claro que #7ec4cf
        'primary-dark': '#5ba8b5',      // Más oscuro que #7ec4cf

        // Secondary - tonos rosa suave
        'secondary-light': '#f8c9d4',   // Más claro que #f3b0c3
        'secondary-dark': '#e895ab',    // Más oscuro que #f3b0c3

        // Info - mantiene la armonía azul
        'info-light': '#d4e6f7',       // Más claro que #b0d0f3

        // Surface - ligeramente cálido para combinar
        'surface-light': '#fefefe',     // Casi blanco pero cálido

        // Background - mantiene neutralidad
        'background-light': '#fcfcfd',  // Más claro que #f8f9fa

        // Text - coherente con #23272f
        'text-light': '#64748b',        // Versión más clara del texto

        // Muted - coherente con #90a4ae
        'muted-light': '#b8c5ce',       // Más claro que #90a4ae

        // Success - tonos verdes suaves que combinan
        'success-light': '#d1f2e0',     // Más claro que #a8e6cf
        'success-dark': '#7dd3ae',      // Más oscuro que #a8e6cf

        // Warning - tonos amarillos que armonizan
        'warning-light': '#fff4b3',     // Más claro que #ffe082
        'warning-dark': '#f5d446',      // Más oscuro que #ffe082

        // Error - tonos rojizos suaves
        'error-light': '#ffe0e0',       // Más claro que #ffb5b5
        'error-dark': '#ff8a8a',        // Más oscuro que #ffb5b5
      },
    },
  },
  plugins: [],
}

