'use strict';

const _ = require('lodash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true, index: { unique: true }, minlength: 3, maxlength: 50, trim: true},
  description: { type: String, trim: true },
  type: { type: String, maxlength: 50, required: true},
  path: { type: String, maxlength: 255},
  steps:[{type: Schema.Types.ObjectId, ref: 'Step'}],
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Client', clientSchema);
