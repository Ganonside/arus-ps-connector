var webpack = require('webpack');
var config = require('./config.js');
var path = require('path');

var env = config.get('env');

console.log('Environment is ' + env);

// These options are common to the configuration for each environment
var commonConfig = {
  module: {
    loaders: [{
      test: /\.js$/, loader: 'babel', exclude: /node_modules/
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      '__USERNAME__': JSON.stringify(config.get('username')),
      '__PASSWORD__': JSON.stringify(config.get('password')),
      '__PROFILE_URL__': JSON.stringify(config.get('getProfileUrl')),
      '__PICTURE_URL__': JSON.stringify(config.get('getPictureUrl')),
      '__SCHEDULE_URL__': JSON.stringify(config.get('getScheduleUrl')),
      '__NOTIFICATIONS_URL__': JSON.stringify(config.get('getNotificationsUrl')),
      '__EVENTS_URL__': JSON.stringify(config.get('getNotificationEventsUrl')),
      '__CHANGE_READ_STATUS_URL__': JSON.stringify(config.get('changeReadStatusUrl')),
      '__LOV_URL__': JSON.stringify(config.get('getLovUrl'))
    })
  ]
};

var devConfig = {
  name: 'development',
  entry: {
    ArusPSConnector: './index.js'
  },
  output: {
    libraryTarget: 'var',
    library: '[name]',
    path: './build',
    filename: '[name].js'
  },
  externals: commonConfig.externals,
  module: commonConfig.module,
  plugins: commonConfig.plugins
};
var prodConfig = {
  name: 'production',
  entry: {
    ArusPSConnector: './index.js'
  },
  output: {
    libraryTarget: 'commonjs2',
    library: '[name]',
    path: __dirname + '/',
    filename: '[name].js'
  },
  module: commonConfig.module,
  plugins: commonConfig.plugins
};
var testConfig = {
  name: 'test',
  entry: {
    ArusPSConnectorTests: './test/tests.js'
  },
  output: {
    libraryTarget: 'var',
    library: 'ArusPSConnector',
    path: path.join(__dirname, './test/build'),
    filename: '[name].js'
  },
  module: commonConfig.module,
  plugins: commonConfig.plugins
};

// Exports a configuration that corresponds to the current environment
switch(env) {
  case 'development':
    module.exports = devConfig;
    break;
  case 'production':
    module.exports = prodConfig;
    break;
  case 'test':
    module.exports = testConfig;
    break;
}
