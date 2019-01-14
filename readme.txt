
Для удобства внесения экстренных изменений прямо на хостинге рекомендуется НЕ убирать переносы в index.HTML

для этого в файле
node_modules\react-scripts\config\webpack.config.prod.js

в настройках
minify: {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true
}
добавляем строку
        ,preserveLineBreaks:true
