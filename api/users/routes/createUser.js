'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const User = require('../../models/User');
const verifyUniqueUser = require('../../utils/users/userFunctions').verifyUniqueUser;
const hashPassword = require('../../utils/users/userFunctions').hashPassword;
const createToken = require('../../utils/users/token');
const Joi = require('joi');
var mongoose = require('mongoose');

module.exports = {
  method: 'POST',
  path: '/api/users',
  config: {
    auth: false,
    // Before the route handler runs, verify that the user is unique
    pre: [{ method: verifyUniqueUser, assign: 'user' }],
    // Validate the payload against the Joi schema
    validate: {
      options: {
        abortEarly: false
      },
      failAction: (request, h, err) => {
        throw err;
      },
      payload: Joi.object({
        username: Joi.string().alphanum().min(2).max(30).required().description('username'),
        email: Joi.string().email().required().description('email'),
        password: Joi.string().required().description('password, will salt 10')
      })
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
