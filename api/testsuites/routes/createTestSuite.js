'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const TestSuite = require('../../models/TestSuite');
const User = require('../../models/User')
const createTestSuiteSchema = require('../schemas/createTestSuite');
const verifyUniqueTestSuite = require('../../utils/testsuites/testsuiteFunctions').verifyUniqueTestSuite;
const getUserID = require('../../utils/users/userFunctions').getUserID;
const Joi = require('joi');
var mongoose = require('mongoose');

module.exports = {
  method: 'POST',
  path: '/api/testsuites',
  config: {
    auth: 'jwt',
    pre: [{ method: verifyUniqueTestSuite, assign: 'testsuite' }, { method: getUserID, assign: 'testsuite'}],
    // Validate the payload against the Joi schema
    validate: {
      payload: createTestSuiteSchema
    },
    description: 'Create new testsuite',
    notes: 'This will create new test suite',
    tags: ['api', 'testsuites'],
    handler: (req, res) => {
      let testSuite = new TestSuite();
      testSuite._id = new mongoose.Types.ObjectId(),
      testSuite.name = req.payload.name;
      testSuite.description = req.payload.description
      testSuite.owner = req.pre.testsuite
      testSuite.save((err, testSuite) => {
        if (err) {
          throw Boom.badRequest(err);
        }
      });
      return res.response({ testSuite }).code(201);
    },
  }
};
