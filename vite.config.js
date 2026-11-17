import {defineConfig} from 'vite';
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/swiper')) return 'carousel';
          if (id.includes('node_modules')) return 'vendor';
          if (id.includes('reference-main.html') || id.includes('reference-footer.html')) return 'page-content';
        },
      },
    },
  },
});
