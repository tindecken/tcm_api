'use strict';

const bcrypt = require('bcryptjs');
const Boom = require('boom');
const Category = require('../../models/Category');
const User = require('../../models/User')
const Joi = require('joi');
var mongoose = require('mongoose');
const headerToken = require('../../../config').headerToken
const _ = require('lodash')

/**
 *
 * @param {Array need to get} list
 * @param {Property (_id)} key
 * @param {.type (testcase)} type
 * @param {next (children)} next
 * @param {Return array of Primary IDs} r
 */
function renameDeep(list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].hasOwnProperty('testSuites')){
      console.log('A')
      renameKeyName(list[i], 'testSuites', 'children')
      result.push(renameKeyName(list[i], key, renameKey))
    }else {
      console.log('B', list[i])
      result.push(list[i])
      if (list[i][next]){
        renameDeep(list[i][next], key, renameKey ,next, result)
      }
    }
  }
  return result;
}

function renameKeyName(obj, oldName, newName) {
  const clone = cloneDeep(obj);
  const keyVal = clone[oldName];

  delete clone[oldName];
  clone[newName] = keyVal;

  return clone;
}

const renameKeys = (keysMap, obj) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] }
    }),
    {}
  );

module.exports = {
  method: 'GET',
  path: '/api/categories/testsuites/processed',
  config: {
    auth: 'jwt',
    // Validate the payload against the Joi schema
    validate: {
      headers: Joi.object({
          'authorization': Joi.string().required().default(headerToken)
      }).unknown(),
    },
    description: 'Get all categories and its testsuites, then processed for map with treeview of Quasar',
    notes: 'This will get all categories and its testsuites in the database, then processed for map with treeview of Quasar',
    tags: ['api', 'categories'],
    handler: async (req, res) => {
      try{
        const categories = await Category.find().populate({path: 'testSuites', populate: {path: 'testGroups testCases', populate: {path: 'testCases'}}}).exec()
        if(!categories) throw Boom.notFound("Not found categories")
        let processedCat = renameDeep(categories, 'testSuites', 'children', 'testSuites', [])
        return res.response(processedCat).code(200)
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
