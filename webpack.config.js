module.exports = {
    entry: "./example/main.ts",
    output: {
      filename: "./example/public/js/app/bundle.js",
    },
    devtool: "source-map",
    devServer: {
      port: 9900,
      open: true,
      openPage: "example/public/index.html"
    },
    resolve: {
      extensions: [".webpack.js", ".web.js", ".ts", ".vue", ".js"],
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    mode: 'development',
    module: {
      rules: [
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                esModule: true
            }
        },
        {
          test: /\.js$/,
          use: "source-map-loader",
          enforce: "pre"
        },      
        { 
          test: /\.tsx?$/, 
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              appendTsSuffixTo: [/\.vue$/]
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader" }
          ]
        },
        { 
          test: /\.(eot|svg|ttf|woff|woff2)$/, 
          use: "url-loader?name=[name].[ext]"
        }
      ]
    }
  };