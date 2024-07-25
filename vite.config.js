import Path from 'path'
import vuePlugin from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { defineConfig } from 'vite'

/**
 * https://vitejs.dev/config
 */
const config = defineConfig({
    root: Path.join(__dirname, 'src', 'renderer'),
    publicDir: 'public',
    server: {
        port: 8080,
    },
    open: false,
    build: {
        outDir: Path.join(__dirname, 'build', 'renderer'),
        emptyOutDir: true,
    },
    plugins: [
        vuePlugin({
            template: { transformAssetUrls },
        }),
        quasar({
            sassVariables: 'src/renderer/quasar-variables.sass',
        }),
        nodePolyfills({}),
    ],
})

export default config

