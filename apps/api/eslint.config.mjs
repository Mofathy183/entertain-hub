// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * ESLint configuration for the NestJS API project.
 * - Uses TypeScript-aware linting with type-checking.
 * - Disables unresolved import checks since TS handles path aliases.
 * - Integrates Prettier and Jest globals.
 */
export default tseslint.config(
	{
		// Ignore this config file itself
		ignores: ['eslint.config.mjs'],
	},

	// Base recommended ESLint config
	eslint.configs.recommended,

	// TypeScript ESLint configs with type-aware rules
	...tseslint.configs.recommendedTypeChecked,

	// Prettier integration (disable stylistic rules that conflict)
	eslintPluginPrettierRecommended,

	// 🌍 Global language options
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
			sourceType: 'commonjs',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},

		// ⚙️ Settings block (kept minimal)
		// Note: We're NOT using `eslint-import-resolver-typescript`
		// because it's not installed. Path aliases are handled by TS itself.
		settings: {
			'import/resolver': {
				node: {
					extensions: ['.js', '.ts'],
				},
			},
		},
	},

	// 🧹 Base rules for project code
	{
		rules: {
			// TypeScript-specific relaxations
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-floating-promises': 'warn',

			// ✅ Relax unsafe rules (common for NestJS)
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/restrict-template-expressions': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',

			// Disable false positives for TS path aliases
			'import/no-unresolved': 'off',

			// Prettier
			'prettier/prettier': 'off',
		},
	},

	// 🧪 Overrides for test files
	{
		files: [
			'test/**/*.ts',
			'**/*.spec.ts',
			'**/*.test.ts',
			'**/*.e2e-spec.ts',
		],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
		},
		rules: {
			// Relax TypeScript safety rules for test flexibility
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',

			// Again, disable unresolved import warnings for TS aliases
			'import/no-unresolved': 'off',
		},
	},
);
