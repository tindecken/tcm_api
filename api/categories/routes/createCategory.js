'use strict';

const Boom = require('boom');
const User = require('../../models/User')
const Category = require('../../models/Category')
const verifyUniqueCategory = require('../../utils/categories/categoryFunctions').verifyUniqueCategory;
const getUserID = require('../../utils/users/userFunctions').getUserID;
const Joi = require('joi');
var mongoose = require('mongoose');
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'POST',
  path: '/api/categories',
  config: {
    auth: 'jwt',
    pre: [{ method: verifyUniqueCategory, assign: 'category' }, { method: getUserID, assign: 'userID'}],
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
        workID: Joi.string().allow('').description('workid for this category'),
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Create new category',
    notes: 'This will create new category',
    tags: ['api', 'categories'],
    handler: async (req, res) => {
      let cat = new Category();
      cat._id = new mongoose.Types.ObjectId()
      cat.name = req.payload.name
      cat.description = req.payload.description
      if(req.payload.workID) cate.workID = req.payload.workID
      else cat.workID = ''
      cat.owner = req.pre.userID
      cat.createdAt = Date.now()
      try{
        const user = await User.findOneAndUpdate({ _id: req.pre.userID}, { $push: { categories: cat._id }}).exec()
        if(!user)  throw Boom.badRequest('Not found user in the system')
        const category = await cat.save()
        return res.response({ category }).code(201);
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
