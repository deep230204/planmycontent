const Idea = require('../models/Idea');
const Plan = require('../models/Plan');
const Content = require('../models/Content');
const User = require('../models/user');

exports.getDashboardData = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "User ID required" });

    const ideas = await Idea.find({ userId }).sort({ createdAt: -1 });
    const plans = await Plan.find({ userId }).sort({ createdAt: -1 });
    const contents = await Content.find({ userId }).sort({ createdAt: -1 });

    const user = await User.findById(userId);
    const credits = user ? user.credits : 10;

    res.json({
      success: true,
      data: {
        ideas,
        plans,
        contents,
        credits,
        membership: user?.membership || null,
        paymentHistory: user?.paymentHistory || [],
        userMeta: user
          ? {
              name: user.name,
              email: user.email,
              onboardingData: user.onboardingData,
              updatedAt: user.updatedAt,
            }
          : null,
        syncedAt: new Date().toISOString(),
        stats: {
          totalIdeas: ideas.length,
          totalPlans: plans.length,
          totalContents: contents.length
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.saveIdea = async (req, res) => {
  try {
    const { userId, idea } = req.body;
    const newIdea = new Idea({ ...idea, userId });
    await newIdea.save();
    res.json({ success: true, idea: newIdea });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.saveContent = async (req, res) => {
  try {
    const { userId, contentData } = req.body;
    const newContent = new Content({ ...contentData, userId });
    await newContent.save();
    res.json({ success: true, content: newContent });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.savePlan = async (req, res) => {
  try {
    const { userId, planData } = req.body;
    // Strict logic: Full 7 days check
    if (!planData.plan || planData.plan.length < 7) {
      return res.status(400).json({ 
        success: false, 
        message: "Only full 7-day plans can be saved in Plans. Save individual days as Content instead." 
      });
    }
    const newPlan = new Plan({ ...planData, userId });
    await newPlan.save();
    res.json({ success: true, plan: newPlan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;
    await Idea.findByIdAndDelete(id);
    res.json({ success: true, message: "Idea deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    await Content.findByIdAndDelete(id);
    res.json({ success: true, message: "Content deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    await Plan.findByIdAndDelete(id);
    res.json({ success: true, message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

