const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String },
  source: { 
    type: String, 
    enum: ['idea', 'plan', 'manual'], 
    default: 'manual' 
  },
  dayNumber: { type: Number },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  status: { 
    type: String, 
    enum: ['draft', 'saved'], 
    default: 'saved' 
  },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

module.exports = mongoose.model('Content', contentSchema);
