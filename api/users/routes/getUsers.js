'use strict';

const User = require('../../models/User');
const Boom = require('boom');
const Joi = require('joi');
const verifyAdminUser = require('../../utils/users/userFunctions').verifyAdminUser;
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'GET', 
  path: '/api/users',
  config: { 
    auth: 'jwt',
    pre: [{ method: verifyAdminUser, assign: 'user' }],
    description: 'List all users',
    notes: 'Return all users in the system, require admin scope to do this action',
    tags: ['api', 'users'],
    validate: {
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown()
    },
    handler: (req, res) => {
      return User.find()
        // Deselect the password and version fields
        .select('-password -__v')
        .exec()
        .then(users => {
          if(!users.length) {
            throw Boom.notFound('No users found!');
          }
          return res.response(users)
        })
        .catch(err => {
          throw Boom.badRequest(err);
        })
    },
  },
};
