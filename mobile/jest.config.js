module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native-async-storage/async-storage|@react-native|react-native|@react-navigation|react-native-screens|react-native-safe-area-context|nativewind|react-native-css-interop|react-native-svg|@react-native-community)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
