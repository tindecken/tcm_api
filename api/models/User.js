'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  email: { type: String, required: true, index: { unique: true } },
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true, default: false},
  testSuites: [{ type: Schema.Types.ObjectId, ref: 'TestSuite' }],
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  testCases:  [{ type: Schema.Types.ObjectId, ref: 'TestCase' }],
  builds: [{ type: Schema.Types.ObjectId, ref: 'Build' }],
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
