// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // ডার্ক মোড অন করা হলো
  theme: {
    extend: {
      fontFamily: {
        atma: ['var(--font-atma)', 'cursive'],         // Unique Handwriting
        noto: ['var(--font-noto)', 'serif'],         // Classic Bold Bold
        tiro: ['var(--font-tiro)', 'serif'],          // Literate style
      },
      // ... (অন্যান্য এক্সটেনশন)
    },
  },
  // ...
};
export default config;