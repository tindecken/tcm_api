'use strict';


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryModel = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true, index: { unique: true }, minlength: 3, maxlength: 50, trim: true},
  runningTime: { type: Number, default: 0 },
  description: { type: String, trim: true },
  workID: { type: String, trim: true, default: ''},
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  testsuites: [{ type: Schema.Types.ObjectId, ref: 'TestSuite' }],
  createdAt: { type: Date, default: Date.now},
  updatedAt: { type: Date }
});

categoryModel.virtual('codeName').get(function () {
  return `ts_${_.snakeCase(this.name)}`
});

module.exports = mongoose.model('Category', categoryModel);
