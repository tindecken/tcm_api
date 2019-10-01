'use strict';

const Boom = require('boom');
const TestGroup = require('../../models/TestGroup');
const Joi = require('joi');
const headerToken = require('../../../config').headerToken
Joi.objectId = require('joi-objectid')(Joi)

module.exports = {
  method: 'GET',
  path: '/api/testgroups/{id}',
  config: {
    auth: 'jwt',
    // Validate the payload against the Joi schema
    validate: {
      options: {
        abortEarly: false
      },
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
      params: Joi.object({
        id: Joi.objectId().required().description('testgroup ID')
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Get testgroup by id',
    notes: 'This will get testgroup and its testcase in the database by testgroupID',
    tags: ['api', 'testgroups'],
    handler: async (req, res) => {
      try{
        const id = req.params.id;
        const testgroup = await TestGroup.findById(id)
          .populate({path: 'testCases'})
          .exec()
        if(!testgroup) throw Boom.notFound("Not found testgroup")
        else return res.response(testgroup).code(200)
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
