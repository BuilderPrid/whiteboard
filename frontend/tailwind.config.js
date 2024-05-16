/** @type {import('tailwindcss').Config} */
const usedColors = ['red-500','white','black','cyan-500'];
export default {
  safeList: usedColors.map(color => `bg-${color}`),
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
