'use strict';

const Boom = require('boom');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

function verifyUniqueUser(req, h) {
  // Find an entry from the database that
  // matches either the email or username
  return User.findOne(
    {
      $or: [{ email: req.payload.email }, { username: req.payload.username }]
    }
  )
  .exec()
  .then(user => {
    // Check whether the username or email
    // is already taken and error out if so
    if (user) {
      if (user.username === req.payload.username) {
        throw Boom.badRequest('Username taken')
      }
      if (user.email === req.payload.email) {
        throw Boom.badRequest('Email taken')
      }
    }
    // If everything checks out, send the payload through
    // to the route handler
    return req.payload
  })
}

async function verifyCredentials(req, h) {
  const password = req.payload.password;

  // Find an entry from the database that
  // matches either the email or username
  const user = await User.findOne({
    $or: [{ email: req.payload.email }, { username: req.payload.username }]
  })
    .exec();
  if (!user) {
    throw Boom.badRequest('Incorrect username or email!');
  }
  const valid = await bcrypt.compare(password, user.password)
  if(!valid) throw Boom.badRequest('Invalid password')
  req.payload.user = user
  return req.payload.user;
}

async function verifyAdminUser(req, h) {
  if(req.auth.credentials.scope !== 'admin') throw Boom.forbidden('Required admin users')
  return req.auth.credentials
}

function getUserID(req,h) {
  if(!req.auth.credentials.id) throw Boom.forbidden('Required authen')
  return req.auth.credentials.id
}

module.exports = {
  verifyUniqueUser: verifyUniqueUser,
  verifyCredentials: verifyCredentials,
  verifyAdminUser: verifyAdminUser,
  getUserID: getUserID
};
