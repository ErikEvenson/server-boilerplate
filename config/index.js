var
  path = require('path');

module.exports = {
  aws: {
    bucket: 'eeegen',
    region: 'us-west-2'
  },
  basepath: path.join(__dirname, '..'),
  instances: path.join(__dirname, '../instances'),
  secrets: path.join(__dirname, '../secrets'),
  temp: path.join(__dirname, '../temp')
};
