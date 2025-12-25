const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    assetExts: ['bin', 'txt', 'jpg', 'png', 'json', 'gif', 'webp', 'svg'],
    blockList: [
      // Exclude problematic files from processing
      /.*\/shim\.js$/,
      /.*\/blue_modules\/.*/,
      /.*\/malin_modules\/.*/,
    ],
  },
  transformer: {
    babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);