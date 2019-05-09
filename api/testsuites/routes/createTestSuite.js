'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const TestSuite = require('../../models/TestSuite');
const User = require('../../models/User')
const createTestSuiteSchema = require('../schemas/createTestSuite');
const verifyUniqueTestSuite = require('../util/testSuiteFunctions').verifyUniqueTestSuite;
const getUserID = require('../util/testSuiteFunctions').getUserID;
const Joi = require('joi');
var mongoose = require('mongoose');

module.exports = {
  method: 'POST',
  path: '/api/testsuites',
  config: {
    auth: 'jwt',
    pre: [{ method: verifyUniqueTestSuite, assign: 'testSuite' }, { method: getUserID, assign: 'user'}],
    // Validate the payload against the Joi schema
    validate: {
      payload: createTestSuiteSchema
    },
    description: 'Create new testsuite',
    notes: 'This will create new test suite',
    tags: ['api', 'testsuites'],
    handler: (req, res) => {
      console.log('req.headers.authorization', req.headers.authorization)
      let testSuite = new TestSuite();
      testSuite._id = new mongoose.Types.ObjectId(),
      testSuite.name = req.payload.name;
      testSuite.description = req.payload.description
      testSuite.owner = 'abc'
      testSuite.save((err, testsuite) => {
        if (err) {
          throw Boom.badRequest(err);
        }
      });
      return res.response({ testSuite }).code(201);
    },
  }
};
