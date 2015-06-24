var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  uuid = require('uuid');

var RegistrationSchema = new Schema({
  created: {
    default: Date.now,
    type: Date
  },
  token: {
    sparse: true,
    type: String,
    unique: true
  },
  username: {
    trim: true,
    type: String,
  }
});

RegistrationSchema.pre('save', function(next) {
  // Email in here?
  if (!this.token) {
    this.token = uuid.v4();
    console.log("TOKEN: ", this.token);
  }

  next();
});

RegistrationSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

module.exports = mongoose.model('Registration', RegistrationSchema);
