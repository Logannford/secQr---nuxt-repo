/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				'xs'	 : '1rem',
				'sm'	 : '2rem',
				'md'	 : '2rem',
				'lg'	 : '2rem',
				'xl'	 : '2rem',
				'2xl'	 : '4rem'
			}
		},
    extend: {
      animation: {
        text: 'text 5s ease infinite',
      },
      colors: {
        "white": "#FFFFFF",
        "black": "#000000",
        "transparent": "transparent",
        "dark-black": "#0A0A0A",
        "light-black": "#1c1c1c",
        "onyx-black": "#3E3E3E",
        "light-grey": "#B6B6B6",
        "dark-purple": "#240046",
        "light-purple": "#7b2cbf",


        "secqr-purple": {
            "500": "#7b2cbf"
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
}

