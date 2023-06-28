module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'prettier',
    '@typescript-eslint',
    'simple-import-sort'
  ],
  ignorePatterns: 'build',
  rules: {
    'prettier/prettier': 'error',
    'simple-import-sort/sort': 'warn'
  }
}
