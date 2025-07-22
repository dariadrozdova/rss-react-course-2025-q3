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
import { myEslintRules } from './eslint-rules/my-eslint-rules.js';

export default tseslint.config(
  {
    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
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
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^node:'],
            ['^@?\\w'],
            ['^(@/.*)$'],
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
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
);
