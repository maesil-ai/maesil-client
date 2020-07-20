module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ['plugin:react/recommended', 'google'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    "require-jsdoc" : 0,
    "max-len": 0,
    "no-invalid-this": 0,
    "valid-jsdoc": 0,
  },
  ignorePatterns: ['build/'],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
