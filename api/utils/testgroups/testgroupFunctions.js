'use strict';

const Boom = require('boom');
const TestGroup = require('../../models/TestGroup');

function verifyUniqueTestGroup(req, h) {
  // Find an entry from the database that
  // matches either the email or username
  return TestGroup.findOne(
    {
      $or: [{ name: req.payload.name }]
    }
  )
  .exec()
  .then(testgroup => {
    if (testgroup) {
      throw Boom.badRequest('Test Group is already exist')
    }
    // If everything checks out, send the payload through
    // to the route handler
    return req.payload
  })
}

module.exports = {
  verifyUniqueTestGroup: verifyUniqueTestGroup,
};
