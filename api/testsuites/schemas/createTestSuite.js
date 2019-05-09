'use strict';

const Joi = require('joi');

const createTestSuiteSchema = Joi.object({
  name: Joi.string().required().description('name'),
  description: Joi.string().description('description'),
});

module.exports = createTestSuiteSchema;
