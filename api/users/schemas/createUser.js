'use strict';

const Joi = require('joi');

const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(2).max(30).required().description('username'),
  email: Joi.string().email().required().description('email'),
  password: Joi.string().required().description('password, will salt 10')
});

module.exports = createUserSchema;
