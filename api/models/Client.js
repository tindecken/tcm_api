'use strict';

const _ = require('lodash')

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientModel = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true, index: { unique: true }, minlength: 3, maxlength: 50, trim: true},
  description: { type: String, trim: true },
  type: { type: String, maxlength: 50, required: true},
  value: { type: String, maxlength: 255},
  keywords:[{type: Schema.Types.ObjectId, ref: 'Keyword'}],
  createdAt: { type: Date, default: Date.now},
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Client', clientModel);
