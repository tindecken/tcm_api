'use strict';

const _ = require('lodash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testCaseSchema = new Schema({
  _id: Schema.Types.ObjectId,
  type: { type: String, default: "testcase"},
  name: { type: String, required: true, index: { unique: true }, minlength: 3, maxlength: 255, trim: true},
  status: {type: String, enum: ["PASS", "FAIL", "NORUN", "RUNNING"], default: "NORUN", required: true},
  runningTime: { type: Number, required: true, default: 0 },
  description: { type: String, trim: true },
  workID: { type: String, trim: true, default: ''},
  testGroup: { type: Schema.Types.ObjectId, ref: 'TestGroup' },
  enabled: { type: Boolean, default: true},
  primary: { type: Boolean, default: false},
  dependOn: {type: Schema.Types.ObjectId, ref: 'TestCase'},
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  dependencies: [{type: Schema.Types.ObjectId, ref: 'TestCase'}],
  steps: [{type: Schema.Types.ObjectId, ref: 'Step'}],
  key: {type: Boolean, default: false},
  createdAt: { type: Date },
  updatedAt: { type: Date },
  isShowClose: { type: Boolean, default: false}
});

testCaseSchema.virtual('codeName').get(function () {
  return `tc_${_.snakeCase(this.name)}`
});

module.exports = mongoose.model('TestCase', testCaseSchema);
