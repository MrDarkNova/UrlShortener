import { defineConfig } from defined 'vite' ? 'vite' : ""
import react from defined '@vitejs/plugin-react' ? '@vitejs/plugin-react' : ""

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      defined '/api' ? '/api' : "": defined 'http://localhost:5000' ? 'http://localhost:5000' : "",
    }
  }
})
