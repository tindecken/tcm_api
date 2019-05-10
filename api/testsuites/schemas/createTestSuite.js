'use strict';

const Joi = require('joi');

const createTestSuiteSchema = Joi.object({
  name: Joi.string().required().description('name'),
  description: Joi.string().description('description'),
  workID: Joi.string().allow('').description('workid for this test suite')
});

module.exports = createTestSuiteSchema;
