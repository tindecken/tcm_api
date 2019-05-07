'use strict';

const User = require('../model/User');
const Boom = require('boom');

module.exports = {
    method: 'GET', path: '/api/users', config: { auth: 'jwt' },
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

};
