'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const Category = require('../../models/Category');
const User = require('../../models/User')
var mongoose = require('mongoose');
const _ = require('lodash')
const TestSuite = require('../../models/TestSuite');
const Joi = require('joi');
const headerToken = require('../../../config').headerToken
Joi.objectId = require('joi-objectid')(Joi)

module.exports = {
  method: 'GET',
  path: '/api/categories/{id}',
  config: {
    auth: 'jwt',
    // Validate the payload against the Joi schema
    validate: {
      options: {
        abortEarly: false
      },
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
      params: Joi.object({
        id: Joi.objectId().required().description('category ID')
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Get category by id',
    notes: 'return one category and  its testsuites, testgroups, testcases in the database',
    tags: ['api', 'categories'],
    handler: async (req, res) => {
      try{
        const id = req.params.id;
        const category = await Category.findById(id)
          .populate({path: 'testSuites', populate: {path: 'testGroups testCases', populate: {path: 'testCases'}}})
          .populate({path: 'owner', select: 'email username'})
          .exec()
        if(!category) throw Boom.notFound("Not found category")
        // const processedCat = transfer(categories)
        return res.response(category).code(200)
      }catch(err){
        return Boom.boomify(err, {
          statusCode: 512,
          message: err.errmsg,
          override: false
        })
      }
    },
  }
};
