module.exports = {
    root: true,
    extends: [
      '@react-native-community',
      'plugin:prettier/recommended', // Prettier ¿¬µ¿
    ],
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  };
  