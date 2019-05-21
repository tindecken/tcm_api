'use strict';

const Boom = require('boom');
const User = require('../../models/User');
const verifyUniqueUser = require('../../utils/users/userFunctions').verifyUniqueUser;
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'PATCH',
  path: '/api/users/{id}',
  config: {
    description: 'Update one user',
    notes: 'Update user with based on user_id',
    tags: ['api', 'users'],
    pre: [{ method: verifyUniqueUser, assign: 'user' }],
    validate: {
      options: {
        abortEarly: false
      },
      headers: Joi.object({
        'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
      payload: Joi.object({
        username: Joi.string().min(3).max(30),
        email: Joi.string().email(),
        admin: Joi.boolean(),
        password: Joi.string()
      }),
      params: Joi.object({
        id: Joi.objectId().required()
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    handler: (req, res) => {
      const id = req.params.id;
      let update = {
        "admin": req.payload.admin
      }
      return User.findOneAndUpdate({ _id: id}, { 
          $sett: { "admin": req.payload.admin, "email": req.payload.email, username: req.payload.username ? req.payload.username : "a" }, 
          $currentDate: { updatedAt: true }
        },
        {
          new: true
        }).exec().then(user => {
          if (!user) throw Boom.notFound('User not found!')
          else return res.response(user).code(200);
        }).catch(err => {
          return Boom.boomify(err, {
            statusCode: 512,
            message: err.errmsg,
            override: false
          })
        })
    },
  }
};
