'use strict';
const _ = require('lodash')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrionmentSchema = new Schema({
  _id: Schema.Types.ObjectId,
  type: { type: String, default: "environment"},
  name: { type: String, required: true, index: { unique: true }, minlength: 3, maxlength: 50, trim: true},
  description: { type: String, trim: true },
  nodes: [{
    name: { type: String, required: true, minlength: 3, maxlength: 40},
    value: { type: String, required: true, maxlength: 255 },
    description: { type: String }
  }],
  testsuites: { type: Schema.Types.ObjectId, ref: 'TestSuite'},
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

//make sure there's no duplicated nodes.name
enrionmentSchema.pre('save', function(next){
  this.nodes = _.uniqBy(this.nodes, function (e) {
    return e.name;
  })
  next()
})

module.exports = mongoose.model('Environment', enrionmentSchema);
