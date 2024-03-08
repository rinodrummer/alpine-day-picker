/// <reference types="vitest" />

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        dts({
            include: ['lib'],
            rollupTypes: true,
        }),
    ],
    test: {
        globals: true,
        environment: 'happy-dom',
    },
    esbuild: {
        minifyIdentifiers: false,
        keepNames: true,
    },
    build: {
        copyPublicDir: false,
        lib: {
            entry: resolve(__dirname, 'lib/DayPicker.ts'),
            name: 'DayPicker',
            fileName: 'main',
        },
        rollupOptions: {
            external: ['alpinejs'],
            output: {
                globals: {
                    alpinejs: 'Alpine',
                },
            },
        },
    },
});
