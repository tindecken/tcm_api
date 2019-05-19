'use strict';

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const createTestCaseSchema = Joi.object({
  name: Joi.string().required().min(3).max(50).description('name'),
  description: Joi.string().description('description'),
  workId: Joi.string().allow('').description('workid for this test group'),
  testSuiteId: Joi.objectId().description('testsuite id').error(errors => {
    return {
      message: "testSuiteId must be Mongo ObjectID"
    }
  }),
  testGroupId: Joi.objectId().description('testgroup id').error(errors => {
    return {
      message: "testGroupId must be Mongo ObjectID"
    }
  })
})

module.exports = createTestCaseSchema;
