module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'rotate':"rotate 3s linear infinite",
        'animate': 'animate 50s linear infinite',
        'animate': 'animate 3s linear infinite',
        'flicker': 'flicker 2s linear infinite',
      },
      
      keyframes: {
        rotate: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        animate: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        animate: {
          '0%': { transform: 'rotate(315deg) translateX(0)', opacity: 1 },
          '70%': { opacity: 1 },
          '100%': { transform: 'rotate(315deg) translateX(-1000px)', opacity: 0 },
        },
        flicker: {
          '0%, 100%': { opacity: 1 },
          '41.99%': { opacity: 1 },
          '42%': { opacity: 0 },
          '43%': { opacity: 0 },
          '43.01%': { opacity: 1 },
          '47.99%': { opacity: 1 },
          '48%': { opacity: 0 },
          '49%': { opacity: 0 },
          '49.01%': { opacity: 1 },
        },
      },
      boxShadow: {
        'md': '1px 1px 1px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
