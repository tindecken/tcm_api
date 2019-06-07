'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const Category = require('../../models/Category');
const User = require('../../models/User')
const Joi = require('joi');
var mongoose = require('mongoose');
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'GET',
  path: '/api/categories/testsuites',
  config: {
    auth: 'jwt',
    // Validate the payload against the Joi schema
    validate: {
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
    },
    description: 'Get all categories and its testsuites',
    notes: 'This will get all categories and its testsuites in the database',
    tags: ['api', 'categories'],
    handler: async (req, res) => {
      try{
        const categories = await Category.find().populate({path: 'testSuites', populate: {path: 'testGroups', populate: {path: 'testCases'}}}).exec()
        if(!categories) throw Boom.notFound("Not found categories")
        else return res.response(categories).code(200)
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
