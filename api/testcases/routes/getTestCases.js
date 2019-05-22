'use strict';

const Boom = require('boom');
const TestCase = require('../../models/TestCase');
const Joi = require('joi');
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'GET',
  path: '/api/testcases',
  config: {
    auth: 'jwt',
    // pre: [{ method: getUserID, assign: 'testsuite'}],
    // Validate the payload against the Joi schema
    validate: {
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
    },
    description: 'Get all testcases',
    notes: 'This will get all testcase in the database',
    tags: ['api', 'testcases'],
    handler: (req, res) => {
      return TestCase.find()
        .populate('owner', 'username email')
        .exec()
        .then(testcases => {
          return res.response(testcases).code(200)
        })
        .catch(err => {
          throw Boom.badRequest(err);
        })
    },
  }
};
