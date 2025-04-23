import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import sonarjs from 'eslint-plugin-sonarjs';
import eslintConfigPrettier from 'eslint-config-prettier';
import vitestGlobals from "eslint-config-vitest-globals/flat";
import globals from 'globals';
import babelParser from "@babel/eslint-parser";

export default defineConfig([
  {
    files: ['**/*.{js,jsx,mjs}'],
    ignores: ['**/*.scss', '**/*.css', '**/*.module.css', 'coverage/**', 'node_modules/**'],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      importPlugin.flatConfigs.recommended,
      jsxA11y.flatConfigs.recommended,
      eslintConfigPrettier,
      reactHooks.configs['recommended-latest'],
      sonarjs.configs.recommended,
      vitestGlobals()
    ],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        babelOptions: {
          configFile: './.babelrc'
        },
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        JSX: true
      }
    },
    settings: {
      react: {
        version: 'detect'
      },
      "import/resolver": {
        node: {
          extensions: [
            ".js",
            ".jsx"
          ]
        }
      }
    },
    rules: {
      'react/jsx-uses-react': 1,
      'react/forbid-prop-types': 0,
      'react/function-component-definition': 0,
      'react/default-props-match-prop-types': 0,
      'react/destructuring-assignment': 0,
      'react/jsx-props-no-spreading': 0,
      'react/jsx-no-constructed-context-values': 0,
      'react/jsx-filename-extension': 0,
      'react/no-unstable-nested-components': 0,
      'react/require-default-props': 0,
      'react/no-danger': 1,
      'react/display-name': 0,
      'import/extensions': 0,
      'import/order': ['error', {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index']
        ],
        'newlines-between': 'always'
      }],
      'import/no-named-as-default': 0,
      'import/no-named-as-default-member': 0,
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          components: ['Label'],
          required: {
            some: ['nesting', 'id']
          },
          allowChildren: false
        }
      ],
      'jsx-a11y/no-autofocus': 0,
      'camelcase': 0,
      'no-underscore-dangle': 1,
      'no-console': 1,
      'no-param-reassign': 1,
    }
  },
]);
