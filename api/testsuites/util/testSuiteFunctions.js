'use strict';

const Boom = require('boom');
const TestSuite = require('../../models/TestSuite');
const bcrypt = require('bcryptjs');

function verifyUniqueTestSuite(req, h) {
  // Find an entry from the database that
  // matches either the email or username
  return TestSuite.findOne(
    {
      $or: [{ name: req.payload.name }]
    }
  )
  .exec()
  .then(testsuite => {
    if (testsuite) {
      throw Boom.badRequest('Test Suite is already exist')
    }
    // If everything checks out, send the payload through
    // to the route handler
    return req.payload
  })
}

function getUserID(req,h) {
  
}


module.exports = {
  verifyUniqueTestSuite: verifyUniqueTestSuite,
  getUserID: getUserID
};
