'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const Keyword = require('../../models/Keyword');
const Joi = require('joi');
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'GET',
  path: '/api/keywords',
  config: {
    auth: 'jwt',
    // Validate the payload against the Joi schema
    validate: {
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
    },
    description: 'Get all keywords',
    notes: 'This will get all keywords in the database',
    tags: ['api', 'keywords'],
    handler: (req, res) => {
      return Keyword.find()
        .exec()
        .then(keywords => {
          return res.response(keywords).code(200)
        })
        .catch(err => {
          throw Boom.badRequest(err);
        })
    },
  }
};
