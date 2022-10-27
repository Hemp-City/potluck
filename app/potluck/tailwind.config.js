/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily:{
      unleash:["UNLEASH"],
      agree:["AGREE"],
      "bungee-shade":['"Bungee Shade"', 'cursive'],
      bungee:['"Bungee"', 'cursive'],
      "bungee-spice":['"Bungee Spice"','cursive'],

      // sans:["UNLEASH",'sans-serif']
      // 'sans': ['"Exo 2"','sans-serif'],
    },
    extend: {
      keyframes:{
        fadeIn:{
          '0%': {opacity:'0'},
          '100%':{opacity:'1'}
        }
      },
      animation:{
        fadeIn:'fadeIn 1s ease-in-out infinte'
      }
    },
  },
  plugins: [require('daisyui')],
   // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: ["autumn"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
  
}
