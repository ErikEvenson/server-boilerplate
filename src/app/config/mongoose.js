var
  environment = require('./environment'),
  mongoose = require('mongoose'),
  path = require('path');

/**
 * @return {Function} db - The database.
 */
module.exports = function() {
  var db = mongoose.connect(environment.db);
  var instancePath = path.join(__dirname, '../..');

  require(path.join(instancePath, 'users/models/users'));
  require(path.join(instancePath, 'organizations/models/organizations'));

  // Close the Mongoose connection on Control+C
  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      console.log('Mongoose default connection disconnected.');
      process.exit(0);
    });
  });

  return db;
};
