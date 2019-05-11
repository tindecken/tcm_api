'use strict';

const _ = require('lodash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logModel = new Schema({
  _id: Schema.Types.ObjectId,
  type: {type: String, enum: ["PASS", "FAIL", "INFO"]},
  value: { type: String },
  step: {type: Schema.Types.ObjectId, ref: 'Step'},
  createdAt: { type: Date, default: Date.now},
});

module.exports = mongoose.model('Log', logModel);
