module.exports = {
    root: true,
    extends: [
      '@react-native-community',
      'plugin:prettier/recommended', // Prettier ����
    ],
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  };
  