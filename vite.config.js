import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  /* GitHub Pages sirve el sitio bajo /apilamientoppt/, no en la raíz del
     dominio. Sin esta base, el index.html compilado pide /assets/index-xxx.js
     —absoluto— y el navegador lo busca en cmp-ppt.github.io/assets/…, que no
     existe: la página carga en blanco sin un solo error visible salvo los
     404 en la consola. Netlify no lo necesitaba porque ahí el sitio vivía en
     la raíz de su propio subdominio. */
  base: '/apilamientoppt/',
});
