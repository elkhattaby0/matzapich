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
    assetsInclude: ['**/*.wasm'],          // ← ADD for ffmpeg wasm
    optimizeDeps: {
        exclude: ['@ffmpeg/ffmpeg'],      // ← ADD so ffmpeg loads correctly
    },
    server: {
        host: '127.0.0.1',
        port: 5173,
        cors: {
            origin: ['http://127.0.0.1:8000', 'http://localhost:8000'],
        },
        hmr: {
            host: '127.0.0.1',
        },
    }
});
