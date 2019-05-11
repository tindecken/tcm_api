'use strict';

const _ = require('lodash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepModel = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true, index: { unique: true }, minlength: 3, maxlength: 50, trim: true},
  status: {type: String, enum: ["PASS", "FAIL", "NORUN", "RUNNING"], default: "NORUN", required: true},
  runningTime: { type: Number, required: true, default: 0 },
  description: { type: String, trim: true },
  enabled: { type: Boolean, default: true},
  testcase:  { type: Schema.Types.ObjectId, ref: 'TestCase' },
  keyword: {type: Schema.Types.ObjectId, ref: 'Keyword'},
  client: {type: Schema.Types.ObjectId, ref: 'Client'},
  log: {type: Schema.Types.ObjectId, ref: 'Log'},
  createdAt: { type: Date, default: Date.now},
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Step', stepModel);
