'use strict';

const Boom = require('boom');
const TestCase = require('../../models/TestCase');
const Joi = require('joi');
const headerToken = require('../../../config').headerToken

module.exports = {
  method: 'GET',
  path: '/api/testcases/{id}',
  config: {
    auth: 'jwt',
    validate: {
      options: {
        abortEarly: false
      },
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
      params: Joi.object({
        id: Joi.objectId().required().description('test case id')
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Get testcase detail',
    notes: 'This will all test steps, parameter and its value of a testcase',
    tags: ['api', 'testcases'],
    handler: async (req, res) => {
      try{
        const tc_id = req.params.id;
        const testcase = await TestCase.findById(tc_id).populate({path: 'steps', populate: {path: 'keyword client'}}).exec()
        if(!testcase) throw Boom.notFound("Not found testcase")
        else return res.response(testcase).code(200)
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
