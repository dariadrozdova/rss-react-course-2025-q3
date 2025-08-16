import { fileURLToPath } from 'url';
import { dirname } from 'path';

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import reactCompiler from 'eslint-plugin-react-compiler';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginNoRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import unusedImports from 'eslint-plugin-unused-imports';
import unicorn from 'eslint-plugin-unicorn';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import nextPlugin from '@next/eslint-plugin-next';
import { myEslintRules } from './eslint-rules/my-eslint-rules.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  {
    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    ignores: ['dist', '**/*.js', '**/*.d.ts', '**/*.config.ts'],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-compiler': reactCompiler,
      'unused-imports': unusedImports,
      'no-relative-import-paths': eslintPluginNoRelativeImportPaths,
      'simple-import-sort': simpleImportSort,
      '@next/next': nextPlugin,
    },
    extends: [
      js.configs.recommended,
      perfectionist.configs['recommended-natural'],
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...tseslint.configs.strictTypeChecked,
      unicorn.configs.recommended,
      eslintPluginPrettier,
    ],
    rules: {
      ...myEslintRules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports',
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^node:'],
            ['^react'],
            ['^@?\\w'],
            [
              '^(@api|@components|@hooks|@pages|@utils|@types|@store|@context|@__test__)(/.*)?$',
            ],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            [
              '^\\./(?=.*/)(?!.*\\.(css|less|scss|sass|styl))$',
              '^\\.(?!/?$)',
              '^\\./?$',
            ],
            ['^.+\\.(css|less|scss|sass|styl)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        { allowSameFolder: true, prefix: '@' },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: [
      '**/*.test.{ts,tsx,js,jsx}',
      '**/*.spec.{ts,tsx,js,jsx}',
      '**/__tests__/**/*.{ts,tsx,js,jsx}',
    ],
    rules: {
      'max-lines': [
        'error',
        {
          max: 210,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'max-lines-per-function': [
        'error',
        {
          max: 210,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  }
);
