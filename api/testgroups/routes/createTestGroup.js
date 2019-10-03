'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const TestSuite = require('../../models/TestSuite');
const TestGroup = require('../../models/TestGroup');
const User = require('../../models/User')
const verifyUniqueTestGroup = require('../../utils/testgroups/testgroupFunctions').verifyUniqueTestGroup;
const getUserID = require('../../utils/users/userFunctions').getUserID;
const Joi = require('joi');
var mongoose = require('mongoose');
const headerToken = require('../../../config').headerToken


module.exports = {
  method: 'POST',
  path: '/api/testgroups',
  config: {
    auth: 'jwt',
    pre: [{ method: verifyUniqueTestGroup, assign: 'testgroup' }, { method: getUserID, assign: 'testgroup'}],
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
        testSuiteId: Joi.objectId().required().description('testsuite id').error(errors => {
          return {
            message: "testgroupId must be Mongo ObjectID and it's required."
          }
        })
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Create new test group in test suite',
    notes: 'This will create new test group in test suite, require testsuite id',
    tags: ['api', 'testgroups'],
    handler: async (req, res) => {
      let testGroup = new TestGroup();
      testGroup._id = new mongoose.Types.ObjectId()
      testGroup.name = req.payload.name
      testGroup.description = req.payload.description
      if(req.payload.workID) testGroup.workID = req.payload.workID
      else testGroup.workID = ''
      testGroup.testSuite = req.payload.testSuiteId
      testGroup.createdAt = Date.now()
      try{
        const ts = await TestSuite.findOneAndUpdate({ _id: req.payload.testSuiteId}, { $push: { testGroups: testGroup._id }}).exec()
        if(!ts) throw Boom.badRequest('Not found testsuite in the system')
        const testgroup = await testGroup.save()
        return res.response( testgroup ).code(201);
      }catch(error) {
        throw Boom.boomify(error)
      }
    },
  }
};
