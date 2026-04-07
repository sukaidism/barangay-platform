import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import collectModuleAssetsPaths from './vite-module-loader.js';

export default defineConfig(async () => {
    const paths = ['resources/js/app.tsx'];
    const allPaths = await collectModuleAssetsPaths(paths, 'Modules');

    return {
        plugins: [
            laravel({
                input: allPaths,
                ssr: 'resources/js/ssr.tsx',
                refresh: true,
            }),
            react(),
        ],
    };
});
