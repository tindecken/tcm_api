'use strict';

const _ = require('lodash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kwCategorySchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true, index: { unique: true }, minlength: 3, maxlength: 50, trim: true},
  description: { type: String, trim: true },
  kwFeatures: [{ type: Schema.Types.ObjectId, ref: 'KWFeature' }],
  keywords: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }],
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('KWCategory', kwCategorySchema);
