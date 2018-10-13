const mongoose = require('mongoose');
const { Schema } = mongoose;
const _ = require('lodash');
const lib = require('../lib');

const USER_FIELDS = [
  'username', 'email', 'fname', 'lname', 'alias',
  'age', 'street', 'barangay', 'city', 'region',
  'country', 'zip', 'hosts', 'reporterID', 'hosts',
  'gender'
];

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  fname: { type: String },
  lname: { type: String },
  gender: { type: String, enum: ['M', 'F'], required: true },
  alias: { type: String },
  age: { type: Number },
  street: { type: String },
  barangay: { type: String },
  city: { type: String },
  region: { type: String },
  country: { type: String },
  zip: { type: String },
  reporterID: { type: String },
  hosts: [{
    _id: String,
    isOwner: Boolean,
    isAdmin: Boolean,
    isBlocked: Boolean,
    createdAt: Date,
    updatedAt: Date
  }],
  accessLevel: { type: String, Enum: ['ADMIN', 'USER'], default: 'USER' }
}, { timestamps: true });

/* private functions */

function prepareHost (user, hostId, type) {
  if (!user) {
    return {
      error: 'USER_NOT_FOUND'
    };
  }
  const host = _.find(user.toObject().hosts, function (h) {
    return h._id.toString() === hostId;
  });
  if (host) {
    return {
      error: 'HOST_ALREADY_EXISTS'
    };
  }
  switch (type.toUpperCase()) {
    case 'CREATE':
      return {
        error: null,
        host: {
          _id: hostId,
          isOwner: true,
          isAdmin: true,
          isBlocked: false,
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        user: user
      };
    case 'REQUEST':
      return {
        error: null,
        host: {
          _id: hostId,
          isOwner: false,
          isAdmin: false,
          isBlocked: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        user: user
      };
  }
}

function addHostToUser (result) {
  if (result.error) {
    return result;
  }
  const hosts = result.user.toObject().hosts;
  return User.findByIdAndUpdate(result.user._id, {hosts: hosts.concat([result.host])});
}

function unblockHost (user, hostId) {
  const hosts = user.hosts;
  const hostToUpdate = _.find(hosts, h => h._id === hostId);
  if (!hostToUpdate) {
    return false;
  }
  const updatedHost = hosts.reduce(function (p, c) {
    if (c._id === hostId) {
      c.isBlocked = false;
      c.updatedAt = Date.now();
    }
    return p.concat([c]);
  }, []);
  return updatedHost;
}

function updateHosts (userId, newHosts) {
  if (!newHosts || !Array.isArray(newHosts) || newHosts.length < 0) {
    return Promise.resolve(false);
  }
  return User.findByIdAndUpdate(userId, {
    hosts: newHosts
  });
}
/* End private functions */

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
        gender: user.gender,
        alias: user.alias,
        age: user.age,
        street: user.street,
        barangay: user.barangay,
        city: user.city,
        region: user.region,
        country: user.country,
        zip: user.zip,
        hosts: user.hosts || []
      });
      return newUser.save();
    });
};

UserSchema.statics.addReporterId = function (userId, reporterID) {
  return User.findByIdAndUpdate(userId, {
    reporterID: reporterID
  })
    .select(USER_FIELDS.join(' '))
    .then(function (reporter) {
      if (!reporter) {
        return null;
      }
      return User.findById(userId);
    });
};

UserSchema.statics.appendHostToUser = function (userId, hostId) {
  return User.findById(userId)
    .then(user => prepareHost(user, hostId, 'CREATE'))
    .then(addHostToUser)
    .then(user => ({user}));
};

UserSchema.statics.requestToJoinHost = function (userId, hostId) {
  return User.findById(userId)
    .then(user => prepareHost(user, hostId, 'REQUEST'))
    .then(addHostToUser)
    .then(user => ({user}));
};

UserSchema.statics.getUserRequest = function (hostId, page = 0, limit = 10) {
  const allowedLimit = Number(limit) < 31 ? Number(limit) : 30;
  const offset = Number(page) * allowedLimit;
  return User.find({
    $and: [
      {
        'hosts._id': {
          $in: [hostId]
        }
      },
      { 'hosts.isOwner':  {
        $ne: true
      }},
      { 'hosts.isBlocked': {
        $ne: false
      }}
    ]
  }).skip(offset).limit(allowedLimit).sort('-createdAt');
};

UserSchema.statics.getUserRequestCount = function (hostId) {
  return User.count({
    $and: [
      {
        'hosts._id': {
          $in: [hostId]
        }
      },
      { 'hosts.isOwner':  {
        $ne: true
      }},
      { 'hosts.isBlocked': {
        $ne: false
      }}
    ]
  });
};

UserSchema.statics.approveUserToHost = function (userId, hostId) {
  return User.findById(userId)
    .then(user => unblockHost(user, hostId))
    .then(hosts => updateHosts(userId, hosts));
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
