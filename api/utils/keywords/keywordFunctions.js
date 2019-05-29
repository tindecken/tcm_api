'use strict';

const Boom = require('boom');
const Keyword = require('../../models/Keyword');

function verifyUniqueKeyword(req, h) {
  // Find an entry from the database that
  // matches either the email or username
  return Keyword.findOne(
    {
      $or: [{ name: req.payload.name }]
    }
  )
  .exec()
  .then(kw => {
    if (kw) {
      throw Boom.badRequest('Keyword is already exist')
    }
    return req.payload
  })
}

module.exports = {
  verifyUniqueKeyword: verifyUniqueKeyword,
};
