'use strict';

const Boom = require('boom');
const User = require('../../models/User')
const KWCategory = require('../../models/KWCategory')
const verifyUniqueKWCategory = require('../../utils/kwcategories/kwcategoryFunctions').verifyUniqueKWCategory;
const getUserID = require('../../utils/users/userFunctions').getUserID;
const Joi = require('joi');
var mongoose = require('mongoose');
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'POST',
  path: '/api/kwcategories',
  config: {
    auth: 'jwt',
    pre: [{ method: verifyUniqueKWCategory, assign: 'kwcategory' }],
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
    description: 'Create new keyword category',
    notes: 'This will create new keyword category',
    tags: ['api', 'kwcategories'],
    handler: async (req, res) => {
      try {
        let kwCat = new KWCategory();
        kwCat._id = new mongoose.Types.ObjectId()
        kwCat.name = req.payload.name
        kwCat.description = req.payload.description
        kwCat.createdAt = Date.now()
        const kwCategory = await kwCat.save()
        return res.response( kwCategory ).code(201);
      }catch(err) {
        return Boom.boomify(err, {
          statusCode: 512,
          message: err.errmsg,
          override: false
        })
      }
    },
  }
};
