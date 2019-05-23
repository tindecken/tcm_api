'use strict';

const _ = require('lodash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keywordSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true, index: { unique: true }, minlength: 3, maxlength: 50, trim: true},
  inUse: { type: Boolean, default: true},
  description: { type: String, trim: true },
  feature:  { type: String, maxlength: 255 },
  params: [{
    name: { type: String, trim: true, maxlength: 25, required: true},
    value: { type: String, maxlength: 255 },
    node_ref: {type: String}
  }],
  category: { type: String, required: true, maxlength: 50},
  feature:  { type: String, required: true, maxlength: 50},
  steps: [{type: Schema.Types.ObjectId, ref: 'Step'}],
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Keyword', keywordSchema);
