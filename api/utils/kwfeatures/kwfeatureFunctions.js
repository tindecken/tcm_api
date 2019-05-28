'use strict';

const Boom = require('boom');
const KWFeature = require('../../models/KWFeature');

function verifyUniqueKWFeature(req, h) {
  // Find an entry from the database that
  // matches either the email or username
  return KWFeature.findOne(
    {
      $or: [{ name: req.payload.name }]
    }
  )
  .exec()
  .then(kwFea => {
    if (kwFea) {
      throw Boom.badRequest('KWFeature is already exist')
    }
    return req.payload
  })
}

module.exports = {
  verifyUniqueKWFeature: verifyUniqueKWFeature,
};
