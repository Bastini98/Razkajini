/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#2F8A80',
          dark: '#1E6B62',
        },
        sand: {
          DEFAULT: '#C9C3A0',
          light: '#E6E1C6',
        },
        ink: '#173A36',
      },
      fontFamily: {
        pudelinka: ['Pudelinka', 'serif'],
        colus: ['ColusRegular', 'ui-serif', 'Georgia', 'Times New Roman', 'serif'],
        serif: ['Libre Baskerville', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'page-turn': 'pageTurn 0.8s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pageTurn: {
          '0%': { transform: 'perspective(1200px) rotateY(0deg)', opacity: '1' },
          '50%': { transform: 'perspective(1200px) rotateY(-90deg)', opacity: '0.7' },
          '100%': { transform: 'perspective(1200px) rotateY(-180deg)', opacity: '0' },
        },
      },
      backgroundImage: {
        'paper-texture':
          "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"%3E%3Cg fill-opacity=\"0.03\"%3E%3Cpath d=\"M50 10L60 50L50 90L40 50z\" fill=\"%23000\"%3E%3C/path%3E%3C/g%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
};
