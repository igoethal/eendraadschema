import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const formatDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}-${hours}${minutes}${seconds}`;
};

export default defineConfig({
    define: {
        BUILD_DATE: JSON.stringify(formatDate()) // Injects current date/time
    },
    build: {
        target: "es2017", // Match your tsconfig.json
        /*minify: "terser",*/  // Minifies the output
        //minify: false, // Disable minification for easier debugging
        outDir: "dist",
        manifest: false, // We handle this ourselves, not through Vite
        rollupOptions: {
            input: {
                main: 'index.html'
            },
            output: {
                inlineDynamicImports: true, // Forces everything into one file
                format: "esm",              // Keeps ES module format
                entryFileNames: "bundle.js" // Generates `bundle.js`
            },
            external: [
                "prop/prop_scripts_js.js",
                "builddate.js",
                "pako/pako.min.js",
                "jsPDF/jspdf.umd.min.js",
                "jsPDF/print.js"
            ]
        }
    },
    plugins: [viteSingleFile()]
});