'use strict';

const Boom = require('boom');
const User = require('../../models/User');
const verifyCredentials = require('../../utils/users/userFunctions').verifyCredentials;
const createToken = require('../../utils/users/token');

module.exports = {
  method: 'POST',
  path: '/api/users/authenticate',
  config: {
    auth: false,
    pre: [{ method: verifyCredentials, assign: 'user' }],
    validate: {
      payload: Joi.alternatives().try(
        Joi.object({
          username: Joi.string().alphanum().min(2).max(30).required().default('tindecken'),
          password: Joi.string().required().default('rivaldo')
        }),
        Joi.object({
          email: Joi.string().email().required().default('tindecken@gmail.com'),
          password: Joi.string().required().default('rivaldo')
        })
      )
    },
    description: 'Login',
    notes: 'Return user\s token',
    tags: ['api', 'users'],
    handler: (req, res) => {
      return res.response({ id_token: createToken(req.pre.user) }).code(201);
    }
  }
};
