const config = {
  plugins: {
    // Resolve Tailwind and scan sources from this project folder only, so a
    // stray package.json in a parent directory can't interfere locally.
    "@tailwindcss/postcss": { base: import.meta.dirname },
  },
};

export default config;
