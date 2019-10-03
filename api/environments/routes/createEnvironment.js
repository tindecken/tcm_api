'use strict';

const Boom = require('boom')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const Environment = require('../../models/Environment')
const verifyUniqueEnvironment = require('../../utils/environments/environmentFunctions').verifyUniqueEnvironment;
var mongoose = require('mongoose')
const headerToken = require('../../../config').headerToken


module.exports = {
  method: 'POST',
  path: '/api/environments',
  config: {
    auth: 'jwt',
    pre: [{ method: verifyUniqueEnvironment, assign: 'environment' }],
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
        nodes: Joi.array().items(Joi.object({
          name: Joi.string().min(3).description('node name'),
          value: Joi.string().description('node value'),
          description: Joi.string().max(100).description('node description')
        })).description('list of nodes of the environment'),
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Create new environment',
    notes: 'This will create new environment',
    tags: ['api', 'environments'],
    handler: async (req, res) => {
      try{
        let env = new Environment();
        env._id = new mongoose.Types.ObjectId()
        env.name = req.payload.name
        env.description = req.payload.description
        env.nodes = req.payload.nodes
        env.createdAt = Date.now()
        const environment = await env.save()
        console.log(environment)
        return res.response( environment ).code(201);
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
