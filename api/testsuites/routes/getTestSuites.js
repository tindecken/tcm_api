'use strict';

const Boom = require('boom');
const TestSuite = require('../../models/TestSuite');
const Joi = require('joi');
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'GET',
  path: '/api/testsuites',
  config: {
    auth: 'jwt',
    // pre: [{ method: getUserID, assign: 'testsuite'}],
    // Validate the payload against the Joi schema
    validate: {
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
    },
    description: 'Get all testsuites',
    notes: 'This will get all testsuites in the database',
    tags: ['api', 'testsuites'],
    handler: (req, res) => {
      return TestSuite.find()
        .populate('owner', 'username email')
        .exec()
        .then(testsuites => {
          return res.response(testsuites).code(200)
        })
        .catch(err => {
          throw Boom.badRequest(err);
        })
    },
  }
};
