import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  // The hero loads three.js lazily; pre-bundle it so dev doesn't re-optimize mid-load.
  optimizeDeps: {
    include: [
      'three',
      'three/addons/loaders/GLTFLoader.js',
      'three/addons/libs/meshopt_decoder.module.js',
      'three/addons/postprocessing/EffectComposer.js',
      'three/addons/postprocessing/RenderPass.js',
      'three/addons/postprocessing/ShaderPass.js',
      'three/addons/postprocessing/UnrealBloomPass.js',
    ],
  },
  plugins: [
    devtools(),
    nitro({
      rollupConfig: { external: [/^@sentry\//] },
      // Adopt a Part (utra-rift/rift-adopt-a-part) is its own static site and Vercel project, served here at
      // /adopt/. Its pages use relative paths, so /adopt gains its trailing slash first.
      routeRules: {
        '/adopt': { redirect: { to: '/adopt/', status: 308 } },
        '/adopt/**': { proxy: 'https://rift-adopt-a-part.vercel.app/**' },
      },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
