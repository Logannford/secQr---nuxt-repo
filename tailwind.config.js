module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
    './slices/**/*.vue',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        xs: '1rem',
        sm: '2rem',
        md: '4rem',
        lg: '5rem',
        xl: '5rem',
        '2xl': '8rem',
      },
    },
    extend: {
      animation: {
        text: 'text 5s ease infinite',
      },
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        transparent: 'transparent',
        'dark-black': '#000814',
        'light-black': '#1c1c1c',
        'onyx-black': '#3E3E3E',
        'light-grey': '#B6B6B6',
        'dark-purple': '#240046',
        'light-purple': '#7b2cbf',

        'secqr-purple': {
          500: '#7b2cbf',
        },
      },
      keyframes: {
        text: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
    },
  },
  plugins: [],
};
