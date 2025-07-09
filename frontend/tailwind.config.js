/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Onest', 'sans-serif'],    
        roboto: ['Roboto', 'sans-serif'], 
      },
    },
  },
  plugins: [],
};
  