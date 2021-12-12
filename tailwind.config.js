module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: {
        'primary': '#3490dc',
        'secondary': '#ffed4a',
        'danger': '#e3342f',
      },
      height: theme => ({
        "800": '800px'
      }),
      color: {
        gray: {
          450: '#5F99F7'
        }
      },
      backgroundImage: theme => ({
        'arrow-down-pattern': "url('/img/down.png')",
        'arrow-up-pattern': "url('/img/up.png')"
      }),
      borderWidth: {
        '12': '12px',
        '14': '14px'
      }
    },
    zIndex:{
      '1300': 2000,
      '3000': 3000,
      '4000': 4000,
      '5000': 5000,
    }
    
  },
  variants: {
    extend: {},
  },
  plugins: [],
}