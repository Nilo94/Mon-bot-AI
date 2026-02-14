import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement depuis le fichier .env
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      // Permet d'utiliser process.env.API_KEY comme dans l'exemple original
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});