const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('cjs'); // Fixed typo in accessing resolver property

module.exports = config;
