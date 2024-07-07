import jsdoc from 'eslint-plugin-jsdoc';

export default [
	jsdoc.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {},
			ecmaVersion: 2022,
			sourceType: 'module',
		},

		plugins: {
			jsdoc,
		},

		rules: {
			'array-bracket-newline': 'off',
			'array-bracket-spacing': ['error', 'never'],
			'array-element-newline': 'off',
			'arrow-parens': ['error', 'always'],
			'block-spacing': ['error', 'never'],
			'brace-style': 'error',
			'camelcase': ['off'],
			'comma-dangle': ['error', 'always-multiline'],
			'comma-spacing': 'error',
			'comma-style': 'error',
			'computed-property-spacing': 'error',
			'constructor-super': 'error',
			'curly': ['error', 'multi-line'],
			'eol-last': 'error',
			'func-call-spacing': 'error',
			'generator-star-spacing': ['error', 'after'],
			'guard-for-in': 'error',

			'indent': ['error', 'tab', {
				CallExpression: {
					arguments: 1,
				},

				FunctionDeclaration: {
					body: 1,
					parameters: 2,
				},

				FunctionExpression: {
					body: 1,
					parameters: 2,
				},

				MemberExpression: 2,
				ObjectExpression: 1,
				SwitchCase: 1,
				ignoredNodes: ['ConditionalExpression'],
			}],

			'key-spacing': 'error',
			'keyword-spacing': 'error',
			'linebreak-style': 'error',

			'max-len': ['error', {
				code: 120,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
				ignoreUrls: true,
				tabWidth: 2,
			}],

			'new-cap': 'error',
			'no-array-constructor': 'error',
			'no-caller': 'error',
			'no-cond-assign': 'error',
			'no-extend-native': 'error',
			'no-extra-bind': 'error',
			'no-invalid-this': 'error',
			'no-irregular-whitespace': 'error',
			'no-mixed-spaces-and-tabs': 'error',
			'no-multi-spaces': 'error',
			'no-multi-str': 'error',

			'no-multiple-empty-lines': ['error', {
				max: 2,
			}],

			'no-new-object': 'error',
			'no-new-symbol': 'error',
			'no-new-wrappers': 'error',
			'no-tabs': ['off'],
			'no-this-before-super': 'error',
			'no-throw-literal': 'error',
			'no-trailing-spaces': 'error',
			'no-unexpected-multiline': 'error',

			'no-unused-vars': ['error', {
				args: 'none',
			}],

			'no-var': 'error',
			'no-with': 'error',
			'object-curly-spacing': 'error',

			'one-var': ['error', {
				const: 'never',
				let: 'never',
				var: 'never',
			}],

			'operator-linebreak': ['error', 'after'],
			'padded-blocks': ['error', 'never'],

			'prefer-const': ['error', {
				destructuring: 'all',
			}],

			'prefer-promise-reject-errors': 'error',
			'prefer-rest-params': 'error',
			'prefer-spread': 'error',
			'quote-props': ['error', 'consistent'],

			'quotes': ['error', 'single', {
				allowTemplateLiterals: true,
			}],

			'rest-spread-spacing': 'error',
			'semi': 'error',
			'semi-spacing': 'error',
			'space-before-blocks': 'error',

			'space-before-function-paren': ['error', {
				anonymous: 'never',
				asyncArrow: 'always',
				named: 'never',
			}],

			'spaced-comment': ['error', 'always'],
			'switch-colon-spacing': 'error',
			'yield-star-spacing': ['error', 'after'],

			// JSDoc
			'jsdoc/tag-lines': ['warn', 'any', {startLines: 1}],
			'jsdoc/no-undefined-types': ['off'], // This is handled by TypeScript
		},
	},
];
