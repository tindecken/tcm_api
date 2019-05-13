'use strict';

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const createTestSuiteSchema = Joi.object({
  name: Joi.string().required().min(3).max(50).description('name'),
  description: Joi.string().description('description'),
  workId: Joi.string().allow('').description('workid for this test suite'),
  categoryId: Joi.objectId().required().description('category id').error(errors => {
    return {
      message: "categoryId must be Mongo ObjectID and it's required."
    }
  })
})

module.exports = createTestSuiteSchema;
