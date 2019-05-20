'use strict';

const bcrypt = require('bcryptjs')
const Boom = require('boom')
const TestCase = require('../../models/TestCase')
const TestSuite = require('../../models/TestSuite')
const TestGroup = require('../../models/TestGroup')
const User = require('../../models/User')
const verifyUniqueTestCase = require('../../utils/testcases/testcaseFunctions').verifyUniqueTestCase
const getUserID = require('../../utils/users/userFunctions').getUserID
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
var mongoose = require('mongoose')
const headerToken = require('../../../config').headerToken


module.exports = {
  method: 'POST',
  path: '/api/testcases',
  config: {
    auth: 'jwt',
    pre: [{ method: verifyUniqueTestCase, assign: 'testcase' }, { method: getUserID, assign: 'user'}],
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
        workId: Joi.string().allow('').description('workid for this test group'),
        dependencies: Joi.array().items(Joi.objectId()).description('list of denpendencies of tescase').error(errors => {
          return {
            message: "dependencies must be Mongo ObjectID"
          }
        }),
        testSuiteId: Joi.objectId().description('testsuite id').error(errors => {
          return {
            message: "testSuiteId must be Mongo ObjectID"
          }
        }),
        testGroupId: Joi.objectId().description('testgroup id').error(errors => {
          return {
            message: "testGroupId must be Mongo ObjectID"
          }
        }),
        enabled: Joi.boolean().description('TestCase will be enabled or disabled'),
        key: Joi.boolean().description('TestCase is keycase or not'),
        primary: Joi.boolean().description('TestCase is primary or not'),
        dependOn: Joi.objectId().description('TestCase is dependOn another TestCase')
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Create new test case',
    notes: 'This will create new testcase in testgroup or testsuite',
    tags: ['api', 'testgroups'],
    handler: async (req, res) => {
      try{
        let testCase = new TestCase();
        testCase._id = new mongoose.Types.ObjectId()
        testCase.name = req.payload.name
        testCase.description = req.payload.description
        if(req.payload.enabled) testCase.enabled = req.payload.enabled
        if(req.payload.key) testCase.key = req.payload.key
        if(req.payload.primary) testCase.primary = req.payload.primary
        if(req.payload.dependOn) testCase.dependOn = req.payload.dependOn
        if(testCase.primary && testCase.dependOn) throw Boom.badRequest('TestCase cant be primary and depend on another testcase together')
        if(req.payload.dependencies) testCase.dependencies = req.payload.dependencies
        if(req.payload.workID) testCase.workID = req.payload.workID
        if(!req.payload.testSuiteId && !req.payload.testGroupId) throw Boom.badRequest('TestCase must be in TestGroup or in TestSuite. You provided null both of them')
        if(req.payload.testSuiteId && req.payload.testGroupId) throw Boom.badRequest('TestCase must be in TestGroup or in TestSuite. You input both of them')
        if(req.payload.testSuiteId){
          testCase.testSuite = req.payload.testSuiteId
        }
        if(req.payload.testGroup) {
          testCase.testGroupId = req.payload.testGroupId
        }
        testCase.owner = req.pre.user
        testCase.createdAt = Date.now()
        const user = await User.findOneAndUpdate({ _id: req.pre.user}, { $push: { testCases: testCase._id }}).exec()
        if(!user)  throw Boom.badRequest('Not found user in the system')
        if(req.payload.testSuiteId){
          const ts = await TestSuite.findOneAndUpdate({ _id: req.payload.testSuiteId}, { $push: { testCases: testCase._id }}).exec()
          if(!ts) throw Boom.badRequest('Not found testsuite in the system')
        }
        if(req.payload.testGroupId){
          const tg = await TestGroup.findOneAndUpdate({ _id: req.payload.testGroupId}, { $push: { testCases: testCase._id }}).exec()
          if(!tg) throw Boom.badRequest('Not found testgroup in the system')
        }
        const testCaseSaved = await testCase.save()
        return res.response({ testCaseSaved }).code(201);
      }catch(error) {
        throw Boom.boomify(error)
      }
    },
  }
};
