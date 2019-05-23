'use strict';

const Boom = require('boom');
const Environment = require('../../models/Environment');

function verifyUniqueEnvironment(req, h) {
  return Environment.findOne(
    {
      $or: [{ name: req.payload.name }]
    }
  )
  .exec()
  .then(env => {
    if (env) {
      throw Boom.badRequest('Environment is already exist')
    }
    return req.payload
  })
}

module.exports = {
  verifyUniqueEnvironment: verifyUniqueEnvironment,
};
