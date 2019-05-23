'use strict';

const Boom = require('boom');
const Client = require('../../models/Client');
const Joi = require('joi');
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'GET',
  path: '/api/clients',
  config: {
    auth: 'jwt',
    validate: {
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
    },
    description: 'Get all clients',
    notes: 'This will get all clients in the database',
    tags: ['api', 'clients'],
    handler: (req, res) => {
      return Client.find()
        .exec()
        .then(clients => {
          return res.response(clients).code(200)
        })
        .catch(err => {
          throw Boom.badRequest(err);
        })
    },
  }
};
