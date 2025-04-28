import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [tailwindcss(), react()],
});
// vite.config.js
// export default {
//     build: {
//       minify: 'terser',
//       terserOptions: {
//         compress: {
//           drop_console: true,  // Remove console logs in production
//         },
//       },
//     },
//   }
  