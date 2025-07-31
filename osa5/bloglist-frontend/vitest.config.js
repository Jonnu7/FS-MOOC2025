import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    // setupFiles: './vitest.setup.js', // Poista jos setup on tyhjä
    exclude: ['dist', 'node_modules'],
  },
})