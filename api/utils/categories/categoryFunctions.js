'use strict';

const Boom = require('boom');
const Category = require('../../models/Category');

function verifyUniqueCategory(req, h) {
  // Find an entry from the database that
  // matches either the email or username
  return Category.findOne(
    {
      $or: [{ name: req.payload.name }]
    }
  )
  .exec()
  .then(cat => {
    if (cat) {
      throw Boom.badRequest('Category is already exist')
    }
    return req.payload
  })
}

module.exports = {
  verifyUniqueCategory: verifyUniqueCategory,
};
