'use strict';

const Boom = require('boom')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const Client = require('../../models/Client')
const verifyUniqueClient = require('../../utils/clients/clientFunctions').verifyUniqueClient;
var mongoose = require('mongoose')
const headerToken = require('../../../config').headerToken


module.exports = {
  method: 'POST',
  path: '/api/clients',
  config: {
    auth: 'jwt',
    pre: [{ method: verifyUniqueClient, assign: 'client' }],
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
        type: Joi.string().required().description('Client type').default('Chrome'),
        path: Joi.string().description('Client path or IP address')
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Create new client',
    notes: 'This will create new client',
    tags: ['api', 'clients'],
    handler: async (req, res) => {
      try{
        let cli = new Client();
        cli._id = new mongoose.Types.ObjectId()
        cli.name = req.payload.name
        cli.description = req.payload.description
        cli.type = req.payload.type
        cli.path = req.payload.path
        cli.createdAt = Date.now()
        const client = await cli.save()
        return res.response( client ).code(201);
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
