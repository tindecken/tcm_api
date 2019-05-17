'use strict';

const Boom = require('boom');
const User = require('../../models/User');
const updateUserSchema = require('../schemas/updateUser');
const verifyUniqueUser = require('../../utils/users/userFunctions').verifyUniqueUser;

module.exports = {
  method: 'PATCH',
  path: '/api/users/{id}',
  config: {
    description: 'Update one user',
    notes: 'Update user with based on user_id',
    tags: ['api', 'users'],
    pre: [{ method: verifyUniqueUser, assign: 'user' }],
    handler: (req, res) => {
      const id = req.params.id;
      User.findOneAndUpdate({ _id: id }, req.pre.user, (err, user) => {
        if (err) {
          throw Boom.badRequest(err);
        }
        if (!user) {
          throw Boom.notFound('User not found!');
        }
        res({ message: 'User updated!' });
      });
    },
    validate: {
      payload: updateUserSchema.payloadSchema,
      params: updateUserSchema.paramsSchema
    },
    auth: {
      strategy: 'jwt',
      scope: ['admin']
    }
  }
};
