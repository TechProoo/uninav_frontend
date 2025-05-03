/** @type {import('tailwindcss').Config} */
module.exports = {
  // ...existing code...
  theme: {
    extend: {
      // ...existing extends...
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
  // ...existing code...
};
