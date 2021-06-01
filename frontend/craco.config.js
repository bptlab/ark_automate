const CracoAntDesignPlugin = require('craco-antd');
const customizedTheme = require('./src/layout/customizedTheme');

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: customizedTheme,
      },
    },
  ],
};
