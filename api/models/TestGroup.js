'use strict';

const _ = require('lodash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testGrouSchema = new Schema({
  _id: Schema.Types.ObjectId,
  type: { type: String, default: "testgroup"},
  name: { type: String, required: true, index: { unique: true }, minlength: 3, maxlength: 50, trim: true},
  status: {type: String, enum: ["PASS", "FAIL", "NORUN", "RUNNING"], default: "NORUN", required: true},
  enabled: { type: Boolean, default: true },
  runningTime: { type: Number, required: true, default: 0 },
  description: { type: String, trim: true },
  workID: { type: String, trim: true, default: ''},
  testCases: [{ type: Schema.Types.ObjectId, ref: 'TestCase' }],
  testSuite: { type: Schema.Types.ObjectId, ref: 'TestSuite'},
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

testGrouSchema.virtual('codeName').get(function () {
  return `tg_${_.snakeCase(this.name)}`
});

module.exports = mongoose.model('TestGroup', testGrouSchema);
