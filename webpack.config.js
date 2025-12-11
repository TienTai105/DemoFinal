const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PORT = process.env.PORT || 3000;

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              api: 'modern',
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@hooks': path.resolve(__dirname, 'src/hooks/'),
      '@store': path.resolve(__dirname, 'src/store/'),
      '@api': path.resolve(__dirname, 'src/api/'),
      '@types': path.resolve(__dirname, 'src/types/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
  ],
  devServer: {
    port: PORT,
    hot: true,
    historyApiFallback: true,
    compress: true,
    open: true,
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
      },
    },
  },
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
};
