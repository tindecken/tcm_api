'use strict';

const Boom = require('boom');
const User = require('../../models/User');
const authenticateUserSchema = require('../schemas/authenticateUser');
const verifyCredentials = require('../../utils/users/userFunctions').verifyCredentials;
const createToken = require('../../utils/users/token');

module.exports = {
  method: 'POST',
  path: '/api/users/authenticate',
  config: {
    auth: false,
    pre: [{ method: verifyCredentials, assign: 'user' }],
    validate: {
      payload: authenticateUserSchema
    },
    description: 'Login',
    notes: 'Return user\s token',
    tags: ['api', 'users'],
    handler: (req, res) => {
      return res.response({ id_token: createToken(req.pre.user) }).code(201);
    }
  }
};
