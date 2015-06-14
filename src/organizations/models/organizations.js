var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var OrganizationSchema = new Schema({
  created: {
    default: Date.now,
    type: Date
  },
  creator: {
    ref: 'User',
    type: Schema.ObjectId
  },
  email: {
    match: [
      /.+\@.+\..+/,
      'Please provide a valid e-mail address'
    ],
    type: String
  },
  name: {
    required: true,
    type: String
  }
});

/** @param {Object} module.exports - Export model. */
module.exports = mongoose.model('Organization', OrganizationSchema);
