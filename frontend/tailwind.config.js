module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['PT Sans', 'Nunito Sans', 'Source Sans Pro', 'sans-serif'], // ✅ PT Sans como principal
        'pt': ['PT Sans', 'sans-serif'], // ✅ Clase específica para PT Sans
        'alt': ['Nunito Sans', 'Source Sans Pro', 'sans-serif'], // Alternativa
      },
      colors: {
        'naranjaDivanco': '#e5542e',
      }
    },
  },
  plugins: [],
}