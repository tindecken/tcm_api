'use strict';

const _ = require('lodash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSuiteSchema = new Schema({
  _id: Schema.Types.ObjectId,
  type: { type: String, default: "testsuite"},
  name: { type: String, required: true, index: { unique: true }, minlength: 3, maxlength: 50, trim: true},
  status: {type: String, enum: ["PASS", "FAIL", "NORUN", "RUNNING"], default: "NORUN", required: true},
  runningTime: { type: Number, required: true, default: 0 },
  description: { type: String, trim: true },
  workID: { type: String, trim: true, default: ''},
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  testGroups: [{ type: Schema.Types.ObjectId, ref: 'TestGroup' }],
  testCases: [{ type: Schema.Types.ObjectId, ref: 'TestCase' }],
  environment: { type: Schema.Types.ObjectId, ref: 'Environment'},
  builds: [{ type: Schema.Types.ObjectId, ref: 'Build' }],
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

testSuiteSchema.virtual('codeName').get(function () {
  return `ts_${_.snakeCase(this.name)}`
});

module.exports = mongoose.model('TestSuite', testSuiteSchema);
