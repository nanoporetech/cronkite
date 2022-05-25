module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    project: './tsconfig.json',
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'plugin:@stencil/recommended'],
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
    '@stencil/decorators-context': 'off', // Think this is a bug - shouldn't ahve to turn it off
    '@stencil/no-unused-watch': 'off', // Think this is a bug - shouldn't ahve to turn it off
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],
  },
};
