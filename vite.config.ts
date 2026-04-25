import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Performance-optimized Vite config: minification, code-splitting, asset caching
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable aggressive minification for production
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    // Split vendor chunks for better browser caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-select'],
        },
        // Cache-busting file names
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
