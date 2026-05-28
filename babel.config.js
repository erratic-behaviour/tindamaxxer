module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }]
    ],
    plugins: [], // <-- This MUST be empty. If it says 'nativewind/babel', Metro will crash!
  };
};