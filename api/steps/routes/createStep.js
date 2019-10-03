'use strict';

const Boom = require('boom')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const Step = require('../../models/Step')
var mongoose = require('mongoose')
const headerToken = require('../../../config').headerToken
const TestCase = require('../../models/TestCase')
const Keyword = require('../../models/Keyword')
const Client = require('../../models/Client')

module.exports = {
  method: 'POST',
  path: '/api/steps',
  config: {
    auth: 'jwt',
    validate: {
      options: {
        abortEarly: false
      },
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
      payload: Joi.object({
        name: Joi.string().required().min(3).max(50).description('name'),
        description: Joi.string().description('description'),
        testCase: Joi.objectId().required().description('step belong to what testcase'),
        keyword: Joi.objectId().required().description('this step is reference with keyword'),
        client: Joi.objectId().required().description('this step is running on what client'),
        params: Joi.array().description('Array of parameter, must be correct with keyword params')
      }),
      failAction: (request, h, err) => {
        throw err;
      }
    },
    description: 'Create new step, step must reference to keyword and client',
    notes: 'This will create step for testcase, so it much reference to testcase, keyword and client',
    tags: ['api', 'steps'],
    handler: async (req, res) => {
      try{
        let st = new Step();
        st._id = new mongoose.Types.ObjectId()
        st.name = req.payload.name
        st.description = req.payload.description
        st.testCase = req.payload.testCase
        st.keyword = req.payload.keyword
        st.client = req.payload.client
        st.createdAt = Date.now()
        st.params = []
        
        const testcase = await TestCase.findOneAndUpdate({ _id: req.payload.testCase}, { $push: { steps: st._id }}).exec()
        if(!testcase)  throw Boom.badRequest(`Not found testcase ${req.payload.testCase} in the system`)
        
        const client = await Client.findOneAndUpdate({ _id: req.payload.client}, { $push: { steps: st._id }}).exec()
        if(!client)  throw Boom.badRequest(`Not found client ${req.payload.client} in the system`)

        const keyword = await Keyword.findOneAndUpdate({ _id: req.payload.keyword}, { $push: { steps: st._id }}).exec()
        if(!keyword)  throw Boom.badRequest(`Not found keyword ${req.payload.keyword} in the system`)

        if(!req.payload.params){ //user didn't provide params --> set keyword.params = step.params
          keyword.params.forEach(param => {
            let pr = {
              name: param.name,
              description: param.description,
              value: param.defaultValue,
              ref_node: ''
            }
            st.params.push(pr)  
          });
        }else{
          if(st.params.length !== keyword.params.length) throw Boom.badRequest(`Not match parameter length with the keyword ${keyword.name}`)
          st.params = req.payload.params
        }

        const step = await st.save()
        return res.response( step ).code(201);
      }catch(err) {
        return Boom.boomify(err, {
          statusCode: 512,
          message: err.errmsg,
          override: false
        })
      }
    },
  }
};
