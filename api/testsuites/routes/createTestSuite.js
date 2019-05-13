'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const TestSuite = require('../../models/TestSuite');
const User = require('../../models/User')
const Category = require('../../models/Category')
const createTestSuiteSchema = require('../schemas/createTestSuite');
const verifyUniqueTestSuite = require('../../utils/testsuites/testsuiteFunctions').verifyUniqueTestSuite;
const getUserID = require('../../utils/users/userFunctions').getUserID;
const Joi = require('joi');
var mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi);


module.exports = {
  method: 'POST',
  path: '/api/testsuites',
  config: {
    auth: 'jwt',
    pre: [{ method: verifyUniqueTestSuite, assign: 'testsuite' }, { method: getUserID, assign: 'testsuite'}],
    // Validate the payload against the Joi schema
    validate: {
      options: {
        abortEarly: false
      },
      headers: Joi.object({
          'authorization': Joi.string().required()
      }).unknown(),
      payload: createTestSuiteSchema,
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Create new testsuite',
    notes: 'This will create new test suite',
    tags: ['api', 'testsuites'],
    handler: (req, res) => {
      let testSuite = new TestSuite();
      testSuite._id = new mongoose.Types.ObjectId()
      testSuite.name = req.payload.name
      testSuite.description = req.payload.description
      if(req.payload.workID) testSuite.workID = req.payload.workID
      else testSuite.workID = ''
      testSuite.owner = req.pre.testsuite
      testSuite.category = req.payload.categoryId
      testSuite.createdAt = Date.now()
      testSuite.save(async(err, testsuite) => {
        if (err) {
          throw Boom.badRequest(err);
        }
        await User.findOneAndUpdate({ _id: req.pre.testsuite}, { $push: { testsuites: testSuite._id }})
          .exec()
          .then(user => {
            if(!user) throw Boom.badRequest('Not found user in the system')
          })
          .catch(err => {
            throw Boom.internal(err)
          })
        console.log('AAAAAAAAAAAAAAAAAA')
        await Category.findOneAndUpdate({ _id: req.payload.categoryId}, { $push: { testsuites: testSuite._id }})
          .exec()
          .then(category => {
            console.log('category', category)
            if(!category) throw Boom.badRequest('Not found category in the system')
          })
          .catch(err => {
            console.log(err)
            throw Boom.internal(err)
          })
      });
      return res.response({ testSuite }).code(201);
    },
  }
};
