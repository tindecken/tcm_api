'use strict';

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const createTestGroupSchema = Joi.object({
  name: Joi.string().required().min(3).max(50).description('name'),
  description: Joi.string().description('description'),
  workId: Joi.string().allow('').description('workid for this test group'),
  testSuiteId: Joi.objectId().required().description('testsuite id').error(errors => {
    return {
      message: "testgroupId must be Mongo ObjectID and it's required."
    }
  })
})

module.exports = createTestGroupSchema;
