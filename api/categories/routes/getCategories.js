'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const Category = require('../../models/Category');
const User = require('../../models/User')
const Joi = require('joi');
var mongoose = require('mongoose');
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'GET',
  path: '/api/categories',
  config: {
    auth: 'jwt',
    // Validate the payload against the Joi schema
    validate: {
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
    },
    description: 'Get all categories',
    notes: 'This will get all categories in the database',
    tags: ['api', 'categories'],
    handler: (req, res) => {
      return Category.find()
        .populate('owner', 'username email')
        .exec()
        .then(categories => {
          return res.response(categories).code(200)
        })
        .catch(err => {
          return Boom.boomify(err, {
            statusCode: 512,
            message: err.errmsg,
            override: false
          })
        })
      
    },
  }
};
