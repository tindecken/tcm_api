'use strict';

const Joi = require('joi');

const authenticateUserSchema = Joi.alternatives().try(
  Joi.object({
    username: Joi.string().alphanum().min(2).max(30).required().default('tindecken'),
    password: Joi.string().required().default('rivaldo')
  }),
  Joi.object({
    email: Joi.string().email().required().default('tindecken@gmail.com'),
    password: Joi.string().required().default('rivaldo')
  })
);

module.exports = authenticateUserSchema;
