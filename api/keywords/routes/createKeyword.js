'use strict';

const Boom = require('boom');
const User = require('../../models/User')
const Keyword = require('../../models/Keyword')
const KWFeature = require('../../models/KWFeature')
const getUserID = require('../../utils/users/userFunctions').getUserID;
const verifyUniqueKeyword = require('../../utils/keywords/keywordFunctions').verifyUniqueKeyword;
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
var mongoose = require('mongoose');
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'POST',
  path: '/api/keywords',
  config: {
    pre: [{ method: verifyUniqueKeyword, assign: 'Keyword' }],
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
        kwFeatureId: Joi.objectId().required().description('this keyword is from feature'),
        owner: Joi.string().required().description('owner of this keyword, input username').default('tindecken'),
        params: Joi.array().required().items(Joi.object({
          name: Joi.string().required().description('parameter name'),
          defaultValue: Joi.string().description('parameter value'),
          description: Joi.string().max(200).required().description('node description')
        })).description('list of nodes of the environment'),
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Create new keyword',
    notes: 'This will create new keyword',
    tags: ['api', 'keywords'],
    handler: async (req, res) => {
      try {
        let kw = new Keyword();
        kw._id = new mongoose.Types.ObjectId()
        kw.name = req.payload.name
        kw.description = req.payload.description
        kw.kwFeatureId = req.payload.kwFeatureId
        kw.params = req.payload.params
        kw.owner = req.payload.owner
        kw.createdAt = Date.now()
        let keyword = await kw.save()
        let kwFeature = await KWFeature.findByIdAndUpdate(kw.kwFeatureId, { $push: {keywords: kw._id}}).exec()
        if(!kwFeature) throw Boom.badRequest(`Not found keyword feature with id ${kw.kwFeatureId}`)
        let user = await User.findOneAndUpdate({ name: req.pre.owner}, { $push: { keywords: kw._id }}).exec()
        return res.response({ keyword }).code(201);
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
