import pxtorem from 'postcss-pxtorem';
const path = require('path');
const svgSpriteDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''), // antd-mobile 内置svg
  path.resolve(__dirname, './src/assets/'),  // 业务代码本地私有 svg 存放目录
];
export default {
  "svgSpriteLoaderDirs": svgSpriteDirs,
  "entry": "src/index.js",
  "disableCSSModules": true,
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        "transform-runtime",
        ["import", {"libraryName": "antd-mobile", "libraryDirectory": "lib", "style": "css"},
          {"libraryName": "antd", "style": "css"}
        ]
      ]
    },
    "production": {
      "extraBabelPlugins": [
        "transform-runtime",
        ["import", {"libraryName": "antd-mobile", "style": "css"}]
      ]
    }
  },
  "autoprefixer": {
    "browsers": [
      "iOS >= 8", "Android >= 4"
    ]
  },

  extraPostCSSPlugins: [
    pxtorem({
      rootValue: 100,
      propWhiteList: [],
    }),
  ],
  svgSpriteLoaderDirs: svgSpriteDirs,

}
