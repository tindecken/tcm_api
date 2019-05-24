'use strict';

const Boom = require('boom');
const User = require('../../models/User')
const Keyword = require('../../models/Keyword')
const getUserID = require('../../utils/users/userFunctions').getUserID;
const Joi = require('joi');
var mongoose = require('mongoose');
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'POST',
  path: '/api/keywords',
  config: {
    auth: 'jwt',
    // Validate the payload against the Joi schema
    validate: {
      options: {
        abortEarly: false
      },
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
      payload: Joi.object({
        name: Joi.string().required().min(3).max(50).description('name'),
        description: Joi.string().description('description'),
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Create new keyword',
    notes: 'This will create new keyword',
    tags: ['api', 'keywords'],
    handler: (req, res) => {
      let kw = new Keyword();
      kw._id = new mongoose.Types.ObjectId()
      kw.name = req.payload.name
      kw.description = req.payload.description
      kw.category = req.payload.category
      kw.feature = req.payload.feature
      kw.createdAt = Date.now()
      cat.save((err, category) => {
        if (err) {
          throw Boom.badRequest(err);
        }
        User.findOneAndUpdate({ _id: req.pre.category}, { $push: { categories: cat._id }})
          .exec()
          .then()
          .catch(err => {
            throw Boom.internal(err)
          })
      });
      return res.response({ cat }).code(201);
    },
  }
};
