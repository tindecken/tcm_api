'use strict';

const _ = require('lodash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSuiteModel = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true, index: { unique: true }, minlength: 5, maxlength: 50, trim: true},
  status: {type: String, enum: ["PASS", "FAIL", "NORUN", "RUNNING"], default: "NORUN", required: true},
  runningTime: { type: Number, required: true, default: 0 },
  description: { type: String, trim: true },
  workID: { type: String, trim: true, default: ''},
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdDate: { type: Date, default: Date.now}
});

testSuiteModel.virtual('codeName').get(function () {
  return `ts_${_.snakeCase(this.name)}`
});

module.exports = mongoose.model('TestSuite', testSuiteModel);
