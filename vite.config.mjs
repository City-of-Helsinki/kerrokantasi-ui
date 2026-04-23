/* eslint-disable import/no-unresolved */
import path from 'path';

import react from '@vitejs/plugin-react-swc';
import {
  defineConfig,
  coverageConfigDefaults,
  configDefaults,
} from 'vitest/config';
import dotenv from 'dotenv';
import istanbul from 'vite-plugin-istanbul';

import { getCityAssets, getCityConfig, getCityPublic } from './scripts/utils';

const USE_TEST_ENV = process.env.NODE_ENV === 'test';
const defaultNodeEnv = USE_TEST_ENV ? 'test' : 'development';

/* @ts-ignore */
import.meta.env = {};

import.meta.env.NODE_ENV = process.env.NODE_ENV || defaultNodeEnv;

dotenv.config({
  processEnv: import.meta.env,
  ...(USE_TEST_ENV
    ? { path: ['.env', '.env.test'] }
    : { path: ['.env', '.env.local'] }),
  override: true,
});

export default defineConfig(() => {
  const cityConfig = getCityConfig(import.meta.env);
  const cityAssets = getCityAssets(import.meta.env, cityConfig);
  const cityPublic = getCityPublic(import.meta.env, cityConfig);

  const cityi18n = path.resolve(cityConfig, 'i18n/');
  const cityImages = path.resolve(cityAssets, 'images/');
  const ui = path.resolve(__dirname, './');
  const modules = path.resolve(__dirname, 'node_modules/');

  const ENABLE_E2E_COVERAGE = import.meta.env.ENABLE_E2E_COVERAGE === 'true';

  return {
    base: '/',
    envPrefix: 'REACT_APP_',
    plugins: [
      react(),
      ENABLE_E2E_COVERAGE
        ? istanbul({
            requireEnv: false,
            nycrcPath: './nyc.config.js',
          })
        : undefined,
    ],
    assetsInclude: ['**/*.md'],
    build: {
      outDir: './build',
      emptyOutDir: true,
      sourcemap: true,
      cssMinify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return;
            }

            if (id.includes('/react/') || id.includes('/react-dom/')) {
              return 'vendor';
            }

            if (id.includes('/hds-react/')) {
              return 'ui';
            }

            if (
              id.includes('/draft-js/') ||
              id.includes('/@draft-js-plugins/editor/')
            ) {
              return 'editor';
            }

            if (id.includes('/leaflet/') || id.includes('/react-leaflet/')) {
              return 'maps';
            }
          },
        },
      },
    },
    publicDir: cityPublic,
    server: {
      host: true,
      port: 8080,
    },
    preview: {
      port: 8080,
    },
    resolve: {
      alias: [
        { find: '@city-config', replacement: cityConfig },
        { find: '@city-assets', replacement: cityAssets },
        { find: '@city-i18n', replacement: cityi18n },
        { find: '@city-images', replacement: cityImages },
        { find: 'kerrokantasi-ui', replacement: ui },
        { find: 'kerrokantasi-ui-modules', replacement: modules },
        {
          find: /^leaflet-draw$/,
          replacement: path.resolve(__dirname, './src/utils/leafletDrawCompat.js'),
        },
      ],
    },
    define: {
      global: 'globalThis',
    },
    css: {
      lightningcss: {
        errorRecovery: true,
      },
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          quietDeps: true,
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
      css: true,
      reporters: ['verbose'],
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], // Only Vitest files
      exclude: [
        ...configDefaults.exclude,
        'e2e',
        'e2e/**',
        '**/e2e/**',
        '**/*.spec.js',
      ], // Exclude Playwright files
      coverage: {
        reporter: ['clover', 'json', 'lcov', 'text'],
        include: ['src/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}'],
        exclude: [
          ...coverageConfigDefaults.exclude,
          '**/__snapshots__/**',
          '**/constants.js',
        ],
        provider: 'istanbul',
      },
      testTimeout: 100000,
      deps: {
        interopDefault: true,
      },
      alias: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
          path.resolve(__dirname, './src/__mocks__/fileMock.js'),
        '\\.(css|less)$': path.resolve(
          __dirname,
          './src/__mocks__/styleMock.js'
        ),
        '^@city-i18n(.*)$': path.resolve(__dirname, './src/i18n$1'),
        '^@city-assets(.*)$': path.resolve(__dirname, './assets$1'),
        '^@city-images(.*)$': path.resolve(__dirname, './assets/images$1'),
        'react-leaflet-draw': path.resolve(
          __dirname,
          './src/__mocks__/reactLeafletDrawMock.jsx'
        ),
        'react-leaflet': path.resolve(
          __dirname,
          './src/__mocks__/reactLeafletMock.jsx'
        ),
      },
    },
  };
});
