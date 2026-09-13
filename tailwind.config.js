/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F4F7F5',
        ink: '#16232E',
        line: '#DCE3DF',
        sky: {
          950: '#071322',
          900: '#0B1E33',
          700: '#145374',
          500: '#2A76A0',
          100: '#DCEAF2',
        },
        teal: {
          600: '#157F73',
          500: '#1B998B',
          100: '#DAF0EC',
        },
        amber: {
          600: '#C6821F',
          500: '#E8A33D',
          100: '#FBEBD1',
        },
        clay: {
          600: '#9C3A2C',
          500: '#B94D3B',
          100: '#F6DFD9',
        },
      },
      fontFamily: {
        display: ['"Newsreader"', 'serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
