// Import the getDefaultConfig function from '@expo/metro-config'
const { getDefaultConfig } = require('@expo/metro-config');

// Get the default configuration for Metro bundler by calling getDefaultConfig with the current directory (__dirname)
const defaultConfig = getDefaultConfig(__dirname);

// Add 'cjs' as a valid source extension for Metro bundler
// This allows importing CommonJS modules with the '.cjs' extension in your project
defaultConfig.resolver.sourceExts.push('cjs');

// Export the modified defaultConfig so it can be used in the Metro bundler configuration
module.exports = defaultConfig;
