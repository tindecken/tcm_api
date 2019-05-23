'use strict';

const Boom = require('boom');
const User = require('../../models/User');
const verifyUniqueUser = require('../../utils/users/userFunctions').verifyUniqueUser;
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const headerToken = require('../../../config').headerToken
const hashPassword = require('../../utils/users/userFunctions').hashPassword;

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
        id: Joi.objectId().required().description('id of user need to update')
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    handler: async (req, res) => {
      const id = req.params.id;
      var currentUser = await User.findById(id).exec()
      console.log('currentUser', currentUser)
      var hashedPassword = ""
      if(req.payload.password) {
        hashedPassword = await hashPassword(req.payload.password)
      }
      let update = {
        admin: req.payload.admin ? req.payload.admin : currentUser.admin,
        email: req.payload.email ? req.payload.email : currentUser.email,
        password: req.payload.password ? hashedPassword : currentUser.password,
        updatedAt: Date.now()
      }
      return User.findOneAndUpdate({ _id: id}, update,
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
