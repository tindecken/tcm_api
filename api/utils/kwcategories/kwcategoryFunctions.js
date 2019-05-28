'use strict';

const Boom = require('boom');
const KWCategory = require('../../models/KWCategory');

function verifyUniqueKWCategory(req, h) {
  // Find an entry from the database that
  // matches either the email or username
  return KWCategory.findOne(
    {
      $or: [{ name: req.payload.name }]
    }
  )
  .exec()
  .then(kwCat => {
    if (kwCat) {
      throw Boom.badRequest('KWCategory is already exist')
    }
    return req.payload
  })
}

module.exports = {
  verifyUniqueKWCategory: verifyUniqueKWCategory,
};
