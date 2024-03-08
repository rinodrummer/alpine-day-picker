// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
    eslint.configs.recommended,
    eslintPluginPrettierRecommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['dist/**'],
        files: ['lib/**', 'src/**', 'tests/**'],
    }
);
