'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const User = require('../../models/User')
const Category = require('../../models/Category')
const createCategorySchema = require('../schemas/createCategory');
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
    pre: [{ method: verifyUniqueCategory, assign: 'category' }, { method: getUserID, assign: 'category'}],
    // Validate the payload against the Joi schema
    validate: {
      options: {
        abortEarly: false
      },
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
      payload: createCategorySchema,
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Create new category',
    notes: 'This will create new category',
    tags: ['api', 'categories'],
    handler: (req, res) => {
      let cat = new Category();
      cat._id = new mongoose.Types.ObjectId()
      cat.name = req.payload.name
      cat.description = req.payload.description
      if(req.payload.workID) cate.workID = req.payload.workID
      else cat.workID = ''
      cat.owner = req.pre.category
      cat.createdAt = Date.now()
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
