module.exports = {
    presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        // andra presets du använder...
      ],
    plugins: [
      // Dina övriga Babel-plugins (om några)
      "@babel/plugin-transform-private-property-in-object",
    ],
  };