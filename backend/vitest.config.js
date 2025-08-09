import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Permite usar describe, it, expect sem importar
    environment: 'jsdom', // Simula DOM para testes com JSDOM
    coverage: {
      provider: 'c8', // Usa c8 para cobertura
      reporter: ['text', 'html'], // Mostra no terminal e gera relatório HTML
      exclude: ['tests/', 'vitest.config.js'], // Ignora arquivos de teste e config
    },
  },
});