'use strict';

const _ = require('lodash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buildSchema = new Schema({
  _id: Schema.Types.ObjectId,
  type: { type: String, default: "build"},
  name: { type: String, required: true, index: { unique: true }, minlength: 3, maxlength: 50, trim: true},
  status: {type: String, enum: ["PASS", "FAIL", "NORUN", "RUNNING"], default: "NORUN", required: true},
  runningTime: { type: Number, required: true, default: 0 },
  description: { type: String, trim: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  testsuites: [{ type: Schema.Types.ObjectId, ref: 'TestSuite' }],
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Build', buildSchema);
