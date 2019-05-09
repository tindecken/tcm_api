'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSuiteModel = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true, index: { unique: true }, minlength: 5, maxlength: 50, trim: true},
  status: {type: String, enum: ["PASS", "FAIL", "NORUN", "RUNNING"], default: "NORUN", required: true},
  runningTime: {type: Date},
  description: { type: String },
  workID: {type: String, maxlength: 255},
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('TestSuite', testSuiteModel);
