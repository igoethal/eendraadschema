import { defineConfig } from 'vite';
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";


export default defineConfig({
    plugins: [
        obfuscatorPlugin({
            apply: 'build',
            options: {
                compact: true,
                debugProtection: true,
                // ...  [See more options](https://github.com/javascript-obfuscator/javascript-obfuscator)
            },
        }),
    ],
    build: {
        emptyOutDir: true,
        minify: 'terser', // Default, or use 'terser' for more aggressive minification
        sourcemap: false,
        terserOptions: {
            mangle: {
                toplevel: true, // Mangle top-level variable names
                keep_fnames: false, // Don’t preserve function names
            },
            compress: {
                drop_console: true, // Remove console.log statements
                drop_debugger: true, // Remove debugger statements
                pure_funcs: ['console.info', 'console.debug', 'console.log'], // Remove specific functions
            },
            format: {
                comments: false, // Remove all comments
            },
        },
    },
});

