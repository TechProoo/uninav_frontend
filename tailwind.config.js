/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        bgMain: "#f0f8ff",
        bgSubmain: "#75bfff",
        bgDark: "#003666",
        bgDash: "hsl(207, 22%, 30%)",
        textMain: "hsl(0, 0%, 0%)",
        textLight: "hsl(208, 100%, 73%)",
        textLightTwo: "#f0f8ff",
        textDark: "hsl(0, 0%, 20%)",
        textLightDark: "hsl(208, 100%, 20%)",
        borderMain: "hsl(208, 100%, 73%)",
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
};
