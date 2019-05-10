'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const User = require('../../models/User');
const createUserSchema = require('../schemas/createUser');
const verifyUniqueUser = require('../../utils/users/userFunctions').verifyUniqueUser;
const createToken = require('../../utils/users/token');
const Joi = require('joi');
var mongoose = require('mongoose');

function hashPassword(password, cb) {
  // Generate a salt at level 10 strength
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      return cb(err, hash);
    });
  });
}

module.exports = {
  method: 'POST',
  path: '/api/users',
  config: {
    auth: false,
    // Before the route handler runs, verify that the user is unique
    pre: [{ method: verifyUniqueUser, assign: 'user' }],
    // Validate the payload against the Joi schema
    validate: {
      payload: createUserSchema
    },
    description: 'Create new user',
    notes: 'This will create an non-admin user, return user\'s token',
    tags: ['api', 'users'],
    handler: (req, res) => {
      let user = new User();
      user._id = new mongoose.Types.ObjectId(),
      user.email = req.payload.email;
      user.username = req.payload.username;
      user.admin = false;
      hashPassword(req.payload.password, (err, hash) => {
        if (err) {
          throw Boom.badRequest(err);
        }
        user.password = hash;
        user.save((err, user) => {
          if (err) {
            throw Boom.badRequest(err);
          }
        });
      });
      // If the user is saved successfully, issue a JWT
      return res.response({ id_token: createToken(user) }).code(201);
    },
  }
};
