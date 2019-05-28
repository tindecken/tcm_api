'use strict';

const Boom = require('boom');
const User = require('../../models/User')
const KWFeature = require('../../models/KWFeature')
const KWCategory = require('../../models/KWCategory')
const verifyUniqueKWFeature = require('../../utils/kwfeatures/kwfeatureFunctions').verifyUniqueKWFeature;
const getUserID = require('../../utils/users/userFunctions').getUserID;
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
var mongoose = require('mongoose');
const headerToken = require('../../../config').headerToken


module.exports = {
  method: 'POST',
  path: '/api/kwfeatures',
  config: {
    auth: 'jwt',
    pre: [{ method: verifyUniqueKWFeature, assign: 'kwfeature' }],
    // Validate the payload against the Joi schema
    validate: {
      options: {
        abortEarly: false
      },
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
      payload: Joi.object({
        name: Joi.string().required().min(3).max(50).description('keyword feature name'),
        description: Joi.string().description('description'),
        kwCategoryId: Joi.objectId().required().description('Keyword category belong to')
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Create new keyword feature',
    notes: 'This will create new keyword feature for one keyword category',
    tags: ['api', 'kwfeatures'],
    handler: async (req, res) => {
      try {
        let kwFea = new KWFeature();
        kwFea._id = new mongoose.Types.ObjectId()
        kwFea.name = req.payload.name
        kwFea.description = req.payload.description
        kwFea.createdAt = Date.now()
        const kwCat = await KWCategory.findOneAndUpdate({ _id: req.payload.kwCategoryId}, { $push: { kwFeatures: kwFea._id }}).exec()
        if(!kwCat) throw Boom.badRequest('Not found keyword category in the system')
        const kwFeature = await kwFea.save()
        return res.response({ kwFeature }).code(201);
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
