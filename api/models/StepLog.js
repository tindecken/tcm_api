'use strict';

const _ = require('lodash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stepLogSchema = new Schema({
  _id: Schema.Types.ObjectId,
  type: {type: String, enum: ["PASS", "FAIL", "INFO"]},
  value: { type: String },
  step: {type: Schema.Types.ObjectId, ref: 'Step'},
  createdAt: { type: Date },
});

module.exports = mongoose.model('StepLog', stepLogSchema);
