'use strict';

const Boom = require('boom');
const Client = require('../../models/Client');

function verifyUniqueClient(req, h) {
  return Client.findOne(
    {
      $or: [{ name: req.payload.name }]
    }
  )
  .exec()
  .then(env => {
    if (env) {
      throw Boom.badRequest('Client is already exist')
    }
    return req.payload
  })
}

module.exports = {
  verifyUniqueClient: verifyUniqueClient,
};
