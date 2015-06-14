/**
 * @param {Object} app - The application instance.
 */

module.exports = function(app) {
  var index = require('../controllers/app');
  app.get('/', index.render);
};
