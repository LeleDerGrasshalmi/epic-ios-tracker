module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb-typescript/base',
  ],
  parser: '@typescript-eslint/parser',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    BigInt: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    'no-console': 'off',
    'no-continue': 'off',
    'no-loop-func': 'off',
    'no-bitwise': 'off',
    'no-await-in-loop': 'off',
    'max-len': ['error', {
      code: 120,
      ignoreComments: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'no-constant-condition': 'off',
    'linebreak-style': 0,
    'spaced-comment': 0,
    'import/no-mutable-exports': 'off',
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-extra-parens': 'error',
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/method-signature-style': 'error',
    '@typescript-eslint/lines-between-class-members': 'off',
    'no-restricted-syntax': [
      'error',
      'FunctionExpression[generator=false]:not(:has(ThisExpression))',
      'FunctionDeclaration[generator=false]:not(:has(ThisExpression))',
      {
        selector: 'FunctionDeclaration[generator=false]:not(:has(ThisExpression))',
        message: 'arrow functions should be used instead of normal functions',
      },
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'ForOfStatement',
        message: 'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'block-like',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'cjs-export',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'const',
      },
      {
        blankLine: 'any',
        prev: 'const',
        next: 'const',
      },
      {
        blankLine: 'always',
        prev: 'const',
        next: 'multiline-const',
      },
      {
        blankLine: 'always',
        prev: 'multiline-const',
        next: 'const',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'cjs-import',
      },
      {
        blankLine: 'any',
        prev: 'cjs-import',
        next: 'cjs-import',
      },
    ],
    curly: ['error', 'multi-line'],
    'no-param-reassign': ['error', {
      props: false,
    }],
    'padded-blocks': [
      'error',
      'never',
      {
        allowSingleLineBlocks: false,
      },
    ],
    'import/extensions': [
      'error',
      'always',
      {
        '': 'never',
        js: 'never',
        ts: 'never',
      },
    ],
    'lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true,
      },
    ],
    '@typescript-eslint/consistent-type-imports': 'error',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
        warnOnUnassignedImports: true,
        groups: [
          'builtin',
          'external',
          'unknown',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
      },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-underscore-dangle': 'off',
  },
  overrides: [{
    files: ['src/services/**/*.ts'],
    rules: {
      'import/prefer-default-export': 'off',
    },
  }, {
    files: ['src/types/responses/**/*.ts'],
    rules: {
      camelcase: 'off',
    },
  }],
};
