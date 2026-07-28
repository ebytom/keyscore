import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  noExternal: ['@keyscore/shared'],
  clean: true,
});
