const {
  ContextReplacementPlugin,
  HotModuleReplacementPlugin,
  DefinePlugin,
  ProgressPlugin,
  optimize: {
    CommonsChunkPlugin,
    UglifyJsPlugin
  }
} = require('webpack');

const path = require('path');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { AotPlugin } = require('@ngtools/webpack');

function root(__path = '.') {
  return path.join(__dirname, __path);
}

function webpackConfig(options) {

  const ENV = options.ENV || 'development';
  const HMR = options.HMR === 'true' || options.HMR === true;
  const PORT = options.PORT || 3000;
  const isProd = options.ENV === 'production';
  const AOT = !!options.AOT || isProd;

  return {
    cache: true,
    devtool: 'source-map',
    entry: {
      main: root('demo/main.ts'),
      polyfills: root('demo/polyfills.ts'),
      styles: root('demo/styles/index.styl')
    },
    output: {
      path: root('docs'),
      publicPath: '',
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      chunkFilename: '[id].chunk.js'
    },
    module: {
      rules: [
        {
          test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
          use: 'file?name=assets/[name].[hash].[ext]'
        },
        {
          test: /\.styl$/,
          use: ExtractTextPlugin.extract([
            {
              loader: 'css-loader',
              options: {
                url: false,
                minimize: !!isProd
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  require('autoprefixer')
                ]
              }
            },
            {
              loader: 'vcl-loader'
            }
          ])
        },
        {
          test: /\.css$/,
          // The component css files are raw-loaded to work with the angular2-template-loader
          include: [root('demo/app/'), root('src/')],
          use: ['raw-loader']
        },        
        {
          test: /\.(html)$/, 
          use: ['raw-loader'],
        },
        {
          test: /\.ts?$/,
          use: AOT ? [
            {
              loader: '@ngtools/webpack',
            }
          ] : [
            {
              loader: 'awesome-typescript-loader',
              options: {
                  module: 'es2015' 
              }
            },
            'angular-router-loader',
            'angular2-template-loader'
          ]
        },        
      ]
    },
    plugins: [
      AOT ? new AotPlugin({
        tsConfigPath: root('tsconfig.json'),
        entryModule: root('demo/app/app.module#AppModule')
      }): null,
      new ExtractTextPlugin('app.css'),
      (HMR && !isProd) ? new HotModuleReplacementPlugin() : null,
      new CommonsChunkPlugin({
        name: 'vendor',
        chunks: ['main'],
        minChunks: (module) => module.resource && module.resource.startsWith(root('node_modules') )
      }),
      new CommonsChunkPlugin({ 
        name: 'manifest'
      }),      
      new DefinePlugin({
        'ENV': JSON.stringify(ENV)
      }),
      new ProgressPlugin({}),
      new ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)@angular/,
        root()
      ),
      new HtmlWebpackPlugin({
        template: 'demo/index.html',
        chunksSortMode: 'dependency'
      }),
      new CopyWebpackPlugin([{
        from: 'demo/public',
        to: ''
      }]),
      isProd ? new UglifyJsPlugin({
        mangle: {
          screw_ie8 : true,
        },
        compress: {
          screw_ie8: true,
          warnings: false
        },
        sourceMap: true,
        comments: false
      }) : null
    ].filter(plugin=>plugin!==null),
    resolve: {
      mainFields: ["webpack", "module", "browser", "main"],
      extensions: ['.ts', '.js', '.json'],
      plugins: [ new TsConfigPathsPlugin() ]
    },
    devServer: {
      contentBase: './app/public',
      host: '0.0.0.0',
      port: PORT,
      hot: HMR,
      inline: HMR,
      historyApiFallback: true
    },
    node: {
      global: true,
      process: true,
      Buffer: false,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false,
      clearTimeout: true,
      setTimeout: true
    }
  };
}

// Export
module.exports = webpackConfig;
