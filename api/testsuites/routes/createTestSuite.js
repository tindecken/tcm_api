'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const TestSuite = require('../../models/TestSuite');
const User = require('../../models/User')
const Category = require('../../models/Category')
const createTestSuiteSchema = require('../schemas/createTestSuite');
const verifyUniqueTestSuite = require('../../utils/testsuites/testsuiteFunctions').verifyUniqueTestSuite;
const getUserID = require('../../utils/users/userFunctions').getUserID;
const Joi = require('joi');
var mongoose = require('mongoose');



module.exports = {
  method: 'POST',
  path: '/api/testsuites',
  config: {
    auth: 'jwt',
    pre: [{ method: verifyUniqueTestSuite, assign: 'testsuite' }, { method: getUserID, assign: 'testsuite'}],
    // Validate the payload against the Joi schema
    validate: {
      options: {
        abortEarly: false
      },
      headers: Joi.object({
          'authorization': Joi.string().required()
      }).unknown(),
      payload: createTestSuiteSchema,
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
      testSuite.owner = req.pre.testsuite
      testSuite.category = req.payload.categoryId
      testSuite.createdAt = Date.now()
      try{
        const user = await User.findOneAndUpdate({ _id: req.pre.testsuite}, { $push: { testsuites: testSuite._id }}).exec()
        if(!user)  throw Boom.badRequest('Not found user in the system')
        const cat = await Category.findOneAndUpdate({ _id: req.payload.categoryId}, { $push: { testsuites: testSuite._id }}).exec()
        if(!cat) throw Boom.badRequest('Not found category in the system')
        const testsuite = await testSuite.save()
        return res.response({ testsuite }).code(201);
      }catch(error) {
        throw Boom.boomify(error)
      }
    },
  }
};
