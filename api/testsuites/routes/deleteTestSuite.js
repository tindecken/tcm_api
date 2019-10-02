'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const TestSuite = require('../../models/TestSuite');
const User = require('../../models/User')
const Category = require('../../models/Category')
const verifyUniqueTestSuite = require('../../utils/testsuites/testsuiteFunctions').verifyUniqueTestSuite;
const getUserID = require('../../utils/users/userFunctions').getUserID;
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
var mongoose = require('mongoose');
const headerToken = require('../../../config').headerToken


module.exports = {
  method: 'DELETE',
  path: '/api/testsuites/{id}',
  config: {
    auth: 'jwt',
    pre: [{ method: verifyUniqueTestSuite, assign: 'testsuite' }, { method: getUserID, assign: 'userID'}],
    // Validate the payload against the Joi schema
    validate: {
      options: {
        abortEarly: false
      },
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
      params: Joi.object({
        id: Joi.objectId().required().description('test suite id')
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Delete test suite',
    notes: 'Delete test suite by id',
    tags: ['api', 'testsuites'],
    handler: async (req, res) => {
      try{
        const response = await TestSuite.deleteOne({ _id: req.params.id})
        return res.response({ response }).code(201);
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
