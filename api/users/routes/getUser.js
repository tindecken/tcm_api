'use strict';

const User = require('../../models/User');
const Boom = require('boom');
const Joi = require('joi');
const verifyCredentials = require('../../utils/users/userFunctions').verifyCredentials;
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'GET', 
  path: '/api/users/{id}',
  config: { 
    auth: 'jwt',
    // pre: [{ method: verifyCredentials, assign: 'user' }],
    description: 'Get user',
    notes: 'Return user by id',
    tags: ['api', 'users'],
    validate: {
      options: {
        abortEarly: false
      },
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
      params: Joi.object({
        id: Joi.objectId().required()
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    handler: async (req, res) => {
      try{
        const id = req.params.id;
        const user = await User.findById(id).exec()
        if(!user) throw Boom.notFound("Not found user")
        else return res.response(user).code(200)
      }catch(err){
        return Boom.boomify(err, {
          statusCode: 512,
          message: err.errmsg,
          override: false
        })
      }
    },
  },
};
