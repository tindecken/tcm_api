'use strict';

const _ = require('lodash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keywordSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true, index: { unique: true }, minlength: 3, maxlength: 50, trim: true},
  inUse: { type: Boolean, default: true},
  description: { type: String, trim: true },
  params: [{
    name: { type: String, trim: true, maxlength: 25, required: true},
    description: {type: String, required: true},
    defaultValue: { type: String, maxlength: 255, default: '' }
  }],
  owner:  {type: String, trim: true, required: true},
  kwFeatureId:  {type: Schema.Types.ObjectId, ref: 'KWFeature'},
  steps: [{type: Schema.Types.ObjectId, ref: 'Step'}],
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

keywordSchema.virtual('codeName').get(function () {
  return `kw_${_.snakeCase(this.name)}`
});

module.exports = mongoose.model('Keyword', keywordSchema);
