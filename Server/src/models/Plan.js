const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  industry: { type: String },
  plan: { type: Array, default: [] },
  selectedIdea: { type: Object, default: {} },
  onboardingData: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', planSchema);


