import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import sonarjs from 'eslint-plugin-sonarjs';
import prettier from 'eslint-plugin-prettier';
import vitestGlobals from 'eslint-config-vitest-globals/flat';
import globals from 'globals';
import typescriptParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';

export default defineConfig([
  js.configs.recommended,
  eslintReact.configs.recommended,
  importPlugin.flatConfigs.recommended,
  jsxA11y.flatConfigs.recommended,
  sonarjs.configs.recommended,
  vitestGlobals(),
  {
    files: ['**/*.{js,jsx,mjs}'],
    ignores: [
      '**/*.scss',
      '**/*.css',
      '**/*.module.css',
      'coverage/**',
      'node_modules/**',
    ],
    plugins: {
      'react-hooks': reactHooks,
      prettier,
      '@typescript-eslint': typescriptEslint,
      'import-x': importPlugin
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        JSX: true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import-x/resolver': {
        node: {
          extensions: ['.js', '.jsx'],
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'prettier/prettier': 'error',
      'import-x/extensions': 0,
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
        },
      ],
      'import-x/no-named-as-default': 0,
      'import-x/no-named-as-default-member': 0,
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          components: ['Label'],
          required: {
            some: ['nesting', 'id'],
          },
          allowChildren: false,
        },
      ],
      'jsx-a11y/no-autofocus': 0,
      camelcase: 0,
      'no-underscore-dangle': 1,
      'no-console': 1,
      'no-param-reassign': 1,
      'max-len': ['warn', { code: 120 }],
      // ESLint v10 added `no-useless-assignment` to defaults; existing code has many occurrences.
      'no-useless-assignment': 0,
      // eslint-plugin-react-hooks v7 introduced these error-level rules; disable to keep
      // migration blast-radius bounded. Revisit as separate cleanup PRs.
      'react-hooks/set-state-in-effect': 0,
      'react-hooks/purity': 0,
      'react-hooks/preserve-manual-memoization': 0,
      'react-hooks/immutability': 0,
      // @eslint-react ships several rules that overlap with the react-hooks plugin we
      // chose to keep, or that surface many pre-existing patterns. Disable the ones
      // that fired multiple times during the ESLint 10 upgrade.
      '@eslint-react/set-state-in-effect': 0,
      '@eslint-react/exhaustive-deps': 0,
      '@eslint-react/purity': 0,
      '@eslint-react/use-state': 0,
      '@eslint-react/static-components': 0,
      '@eslint-react/no-array-index-key': 0,
      '@eslint-react/no-context-provider': 0,
      '@eslint-react/naming-convention-ref-name': 0,
      '@eslint-react/no-nested-component-definitions': 0,
      '@eslint-react/web-api-no-leaked-event-listener': 0,
      // sonarjs rules that surfaced pre-existing test patterns; disable to unblock v10.
      'sonarjs/assertions-in-tests': 0,
      'sonarjs/prefer-specific-assertions': 0,
      'sonarjs/no-skipped-tests': 0,
      'sonarjs/no-duplicate-test-title': 0,
    },
  },
]);
