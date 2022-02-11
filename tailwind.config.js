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
      ,
      width: {
        '74': '19rem',
        '100': '30rem',
        '200': '60rem'
      }
      
    },
    // React Leaflet uses some really high z-indexes
    zIndex:{
      '1300': 2000,
      '3000': 3000,
      '4000': 4000, // Less that this is all map elements
      '5000': 5000, // Drawer
      '6000': 6000, // Popups
    }
    
  },
  variants: {
    extend: {},
  },
  plugins: [],
}