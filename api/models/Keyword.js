'use strict';

const _ = require('lodash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keywordModel = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true, index: { unique: true }, minlength: 3, maxlength: 50, trim: true},
  status: {type: String, enum: ["", "FAIL", "NORUN", "RUNNING"], default: "NORUN", required: true},
  description: { type: String, trim: true },
  feature:  { type: String, maxlength: 255 },
  params: [{
    name: { type: String, trim: true, maxlength: 25, required: true}
  }],
  steps: [{type: Schema.Types.ObjectId, ref: 'Step'}],
  createdAt: { type: Date, default: Date.now},
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Keyword', keywordModel);
