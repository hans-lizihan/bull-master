module.exports = {
  env: {
    node: true,
    jest: true,
  },

  extends: ['airbnb/base', 'prettier'],

  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.js', '**/*.spec.js', 'webpack.config.js'],
      },
    ],
  },
};
