'use strict';

const Boom = require('boom');
const Environment = require('../../models/Environment');
const Joi = require('joi');
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'GET',
  path: '/api/environments',
  config: {
    auth: 'jwt',
    validate: {
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
    },
    description: 'Get all environments',
    notes: 'This will get all environments in the database',
    tags: ['api', 'environments'],
    handler: (req, res) => {
      return Environment.find()
        .exec()
        .then(environments => {
          return res.response(environments).code(200)
        })
        .catch(err => {
          throw Boom.badRequest(err);
        })
    },
  }
};
