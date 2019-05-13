'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const TestSuite = require('../../models/TestSuite');
const User = require('../../models/User')
const Joi = require('joi');
var mongoose = require('mongoose');

module.exports = {
  method: 'GET',
  path: '/api/testsuites',
  config: {
    auth: 'jwt',
    // pre: [{ method: getUserID, assign: 'testsuite'}],
    // Validate the payload against the Joi schema
    validate: {
      headers: Joi.object({
          'authorization': Joi.string().required()
      }).unknown(),
    },
    description: 'Get all testsuites',
    notes: 'This will get all testsuites in the database',
    tags: ['api', 'testsuites'],
    handler: (req, res) => {
      return TestSuite.find()
        .populate('owner')
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
