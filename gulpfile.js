var
  gulp = require('gulp'),
  fs = require('fs');

fs.readdirSync(__dirname + '/gulp').forEach(function(task) {
  if (task.indexOf('.spec.') == -1) {
    require('./gulp/' + task);
  }
});
