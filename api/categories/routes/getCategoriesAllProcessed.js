'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const Category = require('../../models/Category');
const User = require('../../models/User')
const Joi = require('joi');
var mongoose = require('mongoose');
const headerToken = require('../../../config').headerToken
const _ = require('lodash')



module.exports = {
  method: 'GET',
  path: '/api/categories/testsuites/processed',
  config: {
    auth: 'jwt',
    // Validate the payload against the Joi schema
    validate: {
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
    },
    description: 'Get all categories and its testsuites, then processed for map with treeview of Quasar',
    notes: 'This will get all categories and its testsuites in the database, then processed for map with treeview of Quasar',
    tags: ['api', 'categories'],
    handler: async (req, res) => {
      try{
        const categories = await Category.find()
          .populate({path: 'testSuites', populate: {path: 'testGroups testCases', populate: {path: 'testCases'}}})
          .populate({path: 'owner', select: 'email username'})
          .exec()
        if(!categories) throw Boom.notFound("Not found categories")
        // const processedCat = transfer(categories)
        return res.response(categories).code(200)
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
