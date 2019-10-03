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
  method: 'POST',
  path: '/api/testsuites',
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
      payload: Joi.object({
        name: Joi.string().required().min(3).max(50).description('name'),
        description: Joi.string().description('description'),
        workId: Joi.string().allow('').description('workid for this test suite'),
        categoryId: Joi.objectId().required().description('category id').error(errors => {
          return {
            message: "categoryId must be Mongo ObjectID and it's required."
          }
        })
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Create new testsuite',
    notes: 'This will create new test suite',
    tags: ['api', 'testsuites'],
    handler: async (req, res) => {
      let testSuite = new TestSuite();
      testSuite._id = new mongoose.Types.ObjectId()
      testSuite.name = req.payload.name
      testSuite.description = req.payload.description
      if(req.payload.workID) testSuite.workID = req.payload.workID
      else testSuite.workID = ''
      testSuite.owner = req.pre.userID
      testSuite.category = req.payload.categoryId
      testSuite.createdAt = Date.now()
      try{
        const user = await User.findOneAndUpdate({ _id: req.pre.userID}, { $push: { testSuites: testSuite._id }}).exec()
        if(!user)  throw Boom.badRequest('Not found user in the system')
        const cat = await Category.findOneAndUpdate({ _id: req.payload.categoryId}, { $push: { testSuites: testSuite._id }}).exec()
        if(!cat) throw Boom.badRequest('Not found category in the system')
        const testsuite = await testSuite.save()
        return res.response(testsuite).code(201);
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
