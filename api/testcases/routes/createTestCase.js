'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const TestCase = require('../../models/TestCase');
const TestSuite = require('../../models/TestSuite');
const TestGroup = require('../../models/TestGroup');
const User = require('../../models/User')
const createTestCaseSchema = require('../schemas/createTestCase');
const verifyUniqueTestCase = require('../../utils/testgroups/testcaseFunctions').verifyUniqueTestCase;
const getUserID = require('../../utils/users/userFunctions').getUserID;
const Joi = require('joi');
var mongoose = require('mongoose');
const headerToken = require('../../../config').headerToken


module.exports = {
  method: 'POST',
  path: '/api/testcases',
  config: {
    auth: 'jwt',
    pre: [{ method: verifyUniqueTestCase, assign: 'testcase' }, { method: getUserID, assign: 'testgroup'}],
    // Validate the payload against the Joi schema
    validate: {
      options: {
        abortEarly: false
      },
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
      payload: createTestCaseSchema,
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Create new test case',
    notes: 'This will create new testcase in testgroup or testsuite',
    tags: ['api', 'testgroups'],
    handler: async (req, res) => {
      let testCase = new testCase();
      testCase._id = new mongoose.Types.ObjectId()
      testCase.name = req.payload.name
      testCase.description = req.payload.description
      if(req.payload.workID) testCase.workID = req.payload.workID
      else testGroup.workID = ''
      testGroup.testSuite = req.payload.testSuiteId
      testGroup.createdAt = Date.now()
      try{
        const user = await User.findOneAndUpdate({ _id: req.pre.testsuite}, { $push: { testsuites: testSuite._id }}).exec()
        if(!user)  throw Boom.badRequest('Not found user in the system')
        const ts = await TestSuite.findOneAndUpdate({ _id: req.payload.testSuiteId}, { $push: { testGroups: testGroup._id }}).exec()
        if(!ts) throw Boom.badRequest('Not found testsuite in the system')
        const testgroup = await testGroup.save()
        return res.response({ testgroup }).code(201);
      }catch(error) {
        throw Boom.boomify(error)
      }
    },
  }
};
