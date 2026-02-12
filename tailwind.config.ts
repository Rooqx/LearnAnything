import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors based on the design screenshot
        'x-black': '#1E1E1E', // Dark sidebar background
        'x-gray': '#F5F5F5', // Light background for the form area
        'x-primary': '#212121', // Primary button background (e.g., Create Account)
        'x-text-light': '#FFFFFF', // Text color on dark backgrounds
        'x-text-dark': '#333333', // Default dark text color
        'x-border': '#E0E0E0', // Input and general border color
        'x-link': '#007BFF', // Link color (if different from primary)
      },
      backgroundImage: {
        // A subtle gradient or pattern might be needed for the sidebar, 
        // but for a clean dark look, a solid color is used primarily.
      },
      boxShadow: {
        'x-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;