const mongoose = require('mongoose');
const { Schema } = mongoose;
const lib = require('../lib');

const UserSchema = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  fname: { type: String },
  lname: { type: String },
  alias: { type: String },
  age: { type: Number },
  street: { type: String },
  barangay: { type: String },
  city: { type: String },
  region: { type: String },
  country: { type: String },
  zip: { type: String },
  reporterID: { type: String },
  adminHosts: [ String ],
  memberHosts: [ String ]
}, { timestamps: true });

UserSchema.statics.findByUsernameOrEmail = function (credential) {
  return User.findOne({
    $or: [
      {username: credential},
      {email: credential}
    ]
  });
};

UserSchema.statics.checkPassword = function (_id, password) {
  return User.findById(_id)
    .then(function (user) {
      return lib.crypto.compareHash(password, user.password);
    });
};

UserSchema.statics.add = function (user) {
  return lib.crypto.hashAndSalt(user.password)
    .then(function (hash) {
      const newUser = new User({
        username: user.username,
        email: user.email,
        password: hash,
        fname: user.fname,
        lname: user.lname,
        alias: user.alias,
        age: user.age,
        street: user.street,
        barangay: user.barangay,
        city: user.city,
        region: user.region,
        country: user.country,
        zip: user.zip,
        reporterID: user.reporterID,
        adminHosts: user.adminHosts || [],
        memberHosts: user.memberHosts || []
      });
      return newUser.save();
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
