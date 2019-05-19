'use strict';

const Boom = require('boom');
const TestCase = require('../../models/TestCase');

function verifyUniqueTestCase(req, h) {
  // Find an entry from the database that
  // matches either the email or username
  return TestCase.findOne(
    {
      $or: [{ name: req.payload.name }]
    }
  )
  .exec()
  .then(testcase => {
    if (testcase) {
      throw Boom.badRequest('Test Case is already exist')
    }
    // If everything checks out, send the payload through
    // to the route handler
    return req.payload
  })
}

module.exports = {
  verifyUniqueTestCase: verifyUniqueTestCase,
};
