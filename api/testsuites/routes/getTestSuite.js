'use strict';

const Boom = require('boom');
const TestSuite = require('../../models/TestSuite');
const Joi = require('joi');
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'GET',
  path: '/api/testsuites/{id}',
  config: {
    auth: 'jwt',
    // pre: [{ method: getUserID, assign: 'testsuite'}],
    // Validate the payload against the Joi schema
    validate: {
      options: {
        abortEarly: false
      },
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
      params: Joi.object({
        id: Joi.objectId().required()
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Get testsuite by id',
    notes: 'This will get testsuite information in the database by id',
    tags: ['api', 'testsuites'],
    handler: async (req, res) => {
      try{
        const id = req.params.id;
        const testsuite = await TestSuite.findById(id).exec()
        if(!testsuite) throw Boom.notFound("Not found testsuite")
        else return res.response(testsuite).code(200)
      }catch(err){
        return Boom.boomify(err, {
          statusCode: 512,
          message: err.errmsg,
          override: false
        })
      }
    },
  }
};
