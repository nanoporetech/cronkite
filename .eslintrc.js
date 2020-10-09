module.exports = {
  // root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    project: 'tsconfig.json',
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:@stencil/recommended',
  ],
  env: {
    browser: true,
    commonjs: true,
    node: true,
    mocha: true,
    es6: true,
  },
  rules: {
    camelcase: 'off',
    curly: [
      'error',
      'multi-line'
    ],
    indent: 'off',
    'prettier/prettier': 'error',

    '@stencil/strict-boolean-conditions': 'off',
    '@stencil/required-jsdoc': 'off',
    '@stencil/ban-exported-const-enums': 'error',
    '@stencil/decorators-style': [
      'error',
      {
        prop: 'inline',
        state: 'inline',
        element: 'inline',
        event: 'inline',
        method: 'multiline',
        watch: 'multiline',
        listen: 'multiline'
      }
    ],
    '@stencil/dependency-suggestions': 'warn',
    '@stencil/own-methods-must-be-private': 'warn',
    '@stencil/own-props-must-be-private': 'warn',
    '@stencil/required-jsdoc': 'off',
    '@stencil/strict-boolean-conditions': 'off',
    '@stencil/strict-mutable': 'error',
    '@typescript-eslint/no-extra-semi': 'error',
    '@typescript-eslint/semi': [
      'error',
    ],
    semi: 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/class-name-casing': 'off',
    '@typescript-eslint/prefer-regexp-exec': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-misused-promises': ['error', { 'checksVoidReturn': false }],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '[iI]gnored' }],
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/explicit-module-boundary-types': [
      'warn',
      {
        'allowedNames': [
          'connectedCallback',
          'disconnectedCallback',
          'componentWillLoad',
          'componentDidLoad',
          'componentShouldUpdate',
          'componentWillRender',
          'render',
          'componentDidRender',
          'componentWillUpdate',
          'componentDidUpdate',
        ]
      }
    ]
  },
};
