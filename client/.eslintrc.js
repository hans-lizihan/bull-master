module.exports = {
  parser: 'babel-eslint',

  env: {
    browser: true,
    es6: true,
    jest: true,
  },

  extends: ['airbnb', 'prettier', 'prettier/react'],

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  plugins: ['jsx-a11y', 'import', 'react', 'react-hooks'],

  rules: {
    'react/jsx-fragments': [2, 'element'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
