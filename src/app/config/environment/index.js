process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var
  _ = require('lodash'),
  path = require('path');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend this object.
var all = {
  apiPrefix: '/api',
  apiVersion: '/v1',
  brand: 'Boilerplate',
  env: process.env.NODE_ENV,
  instancePath: path.join(__dirname, '../../..')
};

/** @param {Constructor} module.exports - Export combined config. */
module.exports = _.extend(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {}
);
