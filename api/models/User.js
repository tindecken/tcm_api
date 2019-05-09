'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
  _id: Schema.Types.ObjectId,
  email: { type: String, required: true, index: { unique: true } },
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true, default: false},
  testsuites: [{ type: Schema.Types.ObjectId, ref: 'TestSuite' }]
});

module.exports = mongoose.model('User', userModel);
