'use strict';

const _ = require('lodash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepSchema = new Schema({
  _id: Schema.Types.ObjectId,
  type: { type: String, default: "step"},
  name: { type: String, required: true, index: { unique: true }, minlength: 3, maxlength: 50, trim: true},
  status: {type: String, enum: ["PASS", "FAIL", "NORUN", "RUNNING"], default: "NORUN", required: true},
  runningTime: { type: Number, required: true, default: 0 },
  description: { type: String, trim: true },
  enabled: { type: Boolean, default: true},
  testCase:  { type: Schema.Types.ObjectId, ref: 'TestCase' },
  keyword: {type: Schema.Types.ObjectId, ref: 'Keyword'},
  order: { type: Number, required: true, default: 1 },
  params: [{
    name: { type: String, trim: true, maxlength: 25, required: true},
    description: {type: String, required: true},
    defaultValue: { type: String, maxlength: 255, required: true },
    value: { type: String, maxlength: 255, required: true },
    ref_node: { type: String, maxlength: 255, required: true }
  }],
  client: {type: Schema.Types.ObjectId, ref: 'Client'},
  stepLog: {type: Schema.Types.ObjectId, ref: 'StepLog'},
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

stepSchema.virtual('codeName').get(function () {
  return `st_${_.snakeCase(this.name)}`
});

module.exports = mongoose.model('Step', stepSchema);
