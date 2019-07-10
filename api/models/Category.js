'use strict';


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  _id: Schema.Types.ObjectId,
  type: { type: String, default: "category"},
  name: { type: String, required: true, index: { unique: true }, minlength: 3, maxlength: 50, trim: true},
  status: {type: String, enum: ["PASS", "FAIL", "NORUN", "RUNNING"], default: "NORUN", required: true},
  runningTime: { type: Number, default: 0 },
  description: { type: String, trim: true },
  workID: { type: String, trim: true, default: ''},
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  testSuites: [{ type: Schema.Types.ObjectId, ref: 'TestSuite' }],
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

categorySchema.virtual('codeName').get(function () {
  return `ts_${_.snakeCase(this.name)}`
});

module.exports = mongoose.model('Category', categorySchema);
