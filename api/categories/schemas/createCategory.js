'use strict';

const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().required().min(3).max(50).description('name'),
  description: Joi.string().description('description'),
  workID: Joi.string().allow('').description('workid for this category')
});

module.exports = createCategorySchema;
