import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    assetsInclude: ['**/*.wasm'],
    optimizeDeps: {
        exclude: ['@ffmpeg/ffmpeg'],
    },
    define: {
        global: 'globalThis',  // â† ADD for Echo
    },
    server: {
        host: '127.0.0.1',
        port: 5173,
        cors: {
            origin: ['http://127.0.0.1:8000', 'http://localhost:8000'],
        },
        proxy: {  // â† ADD Proxy
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            },
            '/broadcasting': {  // â† WebSocket proxy
                target: 'http://localhost:8080',
                ws: true,
                changeOrigin: true,
            }
        },
        hmr: {
            host: '127.0.0.1',
        },
    }
});
