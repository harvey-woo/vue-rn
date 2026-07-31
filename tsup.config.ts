import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    router: 'src/router.ts',
    'web/index': 'src/web/index.ts',
    'metro/index': 'src/metro/index.ts',
  },
  format: ['cjs', 'esm'],
  target: 'es2020',
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  external: [
    '@rasenjs/rn-dom',
    '@vue/runtime-core',
    '@vue/reactivity',
    '@vue/shared',
    'vue-router',
    'react-native',
    'vue',
  ],
  onSuccess: 'cp src/metro/nostics.cjs dist/metro/nostics.cjs',
})
