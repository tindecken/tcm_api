'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const KWCategory = require('../../models/KWCategory');
const Joi = require('joi');
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'GET',
  path: '/api/kwcategories',
  config: {
    auth: 'jwt',
    validate: {
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
    },
    description: 'Get all keyword category',
    notes: 'This will get all keywords category in the database',
    tags: ['api', 'kwcategories'],
    handler: (req, res) => {
      return KWCategory.find()
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
