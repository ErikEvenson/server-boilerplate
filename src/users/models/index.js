var
  mongoose = require('mongoose'),
  crypto = require('crypto'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  created: {
    default: Date.now,
    type: Date
  },
  email: {
    match: [
      /.+\@.+\..+/,
      'Please provide a valid e-mail address'
    ],
    type: String
  },
  isActive: {
    default: false,
    type: Boolean
  },
  name: {
    first: {
      // required: true,
      type: String
    },
    last: {
      // required: true,
      type: String
    }
  },
  password: {
    type: String,
    validate: [
      function(password) {
        return password && password.length > 6;
      }, 'Password should be longer'
    ]
  },
  salt: {
    type: String
  },
  provider: {
    default: 'local',
    required: 'Provider is required',
    type: String
  },
  providerData: {},
  providerId: String,
  registrationToken: {
    sparse: true,
    type: String,
    unique: true
  },
  username: {
    required: 'Username is required',
    trim: true,
    type: String,
    unique: true
  }
});

UserSchema.pre('save', function(next) {
  if (this.password) {
    this.salt = new Buffer(
      crypto.randomBytes(16).toString('base64'),
      'base64'
    );

    this.password = this.hashPassword(this.password);
  }

  next();
});

UserSchema.statics.findOneByUsername = function(username, cb) {
  this.findOne({username: new RegExp(username, 'i')}, cb);
};

UserSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

UserSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

module.exports = mongoose.model('User', UserSchema);
