const User = require("../models/user");
const OTP = require("../models/otpModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { generateStrategyResults } = require("../utils/generateStrategyResults");
const { generateWeeklyPlan } = require("../utils/generateWeeklyPlan");
const { refineDayPlan } = require("../utils/refineDayPlan");
const { enhanceIdea } = require("../utils/enhanceIdea");

const MEMBERSHIP_PLANS = {
  starter: {
    planId: "starter",
    name: "Starter",
    amount: 0,
    currency: "INR",
    credits: 10,
    billingCycle: "monthly",
  },
  pro: {
    planId: "pro",
    name: "Pro Creator",
    amount: 799,
    currency: "INR",
    credits: 250,
    billingCycle: "monthly",
  },
  studio: {
    planId: "studio",
    name: "Studio",
    amount: 1999,
    currency: "INR",
    credits: 1000,
    billingCycle: "monthly",
  },
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isOnboarded: false,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isOnboarded: user.isOnboarded,
        membership: user.membership,
        credits: user.credits,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isOnboarded: user.isOnboarded,
        membership: user.membership,
        credits: user.credits,
        onboardingData: user.onboardingData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 3 * 60 * 1000),
    });

    await sendEmail(email, otp);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const existingOtp = await OTP.findOne({ email, otp });

    if (!existingOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (existingOtp.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    const existingOtp = await OTP.findOne({ email, otp });

    if (!existingOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (existingOtp.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      }
    );

    await OTP.deleteMany({ email });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   🔥 Onboarding API (FIXED)
========================= */
const saveOnboarding = async (req, res) => {
  try {
    const { email, onboardingData } = req.body;

    if (!email || !onboardingData) {
      return res.status(400).json({
        success: false,
        message: "Email and onboarding data are required",
      });
    }

    // 🔥 DEBUG (safe to keep for now)
    console.log("Received onboarding:", onboardingData);

    const user = await User.findOneAndUpdate(
      { email },
      {
        isOnboarded: true,
        onboardingData,
      },
      { new: true }
    );

    // ✅ IMPORTANT FIX
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Saved user:", user);

    res.status(200).json({
      success: true,
      message: "Onboarding completed",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isOnboarded: user.isOnboarded,
        onboardingData: user.onboardingData,
      },
    });
  } catch (error) {
    console.error("Onboarding Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const generateResults = async (req, res) => {
  try {
    const { onboardingData, options } = req.body;

    if (!onboardingData) {
      return res.status(400).json({
        success: false,
        message: "Onboarding data is required",
      });
    }

    const results = await generateStrategyResults(onboardingData, options);

    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Generate Results Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const saveIdeas = async (req, res) => {
  try {
    const { email, savedResult } = req.body;

    if (!email || !savedResult) {
      return res.status(400).json({
        success: false,
        message: "Email and saved result are required",
      });
    }

    const user = await User.findOneAndUpdate(
      { email },
      {
        $push: {
          savedIdeas: {
            brandName: savedResult.brandName || "",
            industry: savedResult.industry || "",
            summary: Array.isArray(savedResult.summary) ? savedResult.summary : [],
            ideas: Array.isArray(savedResult.ideas) ? savedResult.ideas : [],
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ideas saved successfully",
      savedIdeasCount: user.savedIdeas.length,
    });
  } catch (error) {
    console.error("Save Ideas Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const generateWeeklyPlanController = async (req, res) => {
  try {
    const { selectedIdea, onboardingData, contextIdeas, sourcePage } = req.body;

    if (!selectedIdea || !onboardingData) {
      return res.status(400).json({
        success: false,
        message: "Selected idea and onboarding data are required",
      });
    }

    const result = await generateWeeklyPlan(selectedIdea, onboardingData, {
      contextIdeas,
      sourcePage,
    });

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Generate Weekly Plan Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const refineDayController = async (req, res) => {
  try {
    const { dayData, feedback, onboardingData, fullPlan } = req.body;

    if (!dayData || !feedback || !onboardingData) {
      return res.status(400).json({
        success: false,
        message: "Day data, feedback, and onboarding data are required",
      });
    }

    const refinedDay = await refineDayPlan(dayData, feedback, onboardingData, fullPlan);

    res.status(200).json({
      success: true,
      refinedDay,
    });
  } catch (error) {
    console.error("Refine Day Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const enhanceIdeaController = async (req, res) => {
  try {
    const { idea, onboardingData } = req.body;

    if (!idea || !onboardingData) {
      return res.status(400).json({
        success: false,
        message: "Idea and onboarding data are required",
      });
    }

    const enhanced = await enhanceIdea(idea, onboardingData);

    res.status(200).json({
      success: true,
      data: enhanced,
    });
  } catch (error) {
    console.error("Enhance Idea Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const savePlan = async (req, res) => {
  try {
    const { email, savedPlan } = req.body;

    if (!email || !savedPlan) {
      return res.status(400).json({
        success: false,
        message: "Email and saved plan are required",
      });
    }

    const user = await User.findOneAndUpdate(
      { email },
      {
        $push: {
          savedPlans: {
            ideaTitle: savedPlan.ideaTitle || "",
            brandName: savedPlan.brandName || "",
            platform: savedPlan.platform || "",
            type: savedPlan.type || "",
            weeklyPlan: Array.isArray(savedPlan.weeklyPlan) ? savedPlan.weeklyPlan : [],
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Plan saved successfully",
      savedPlansCount: user.savedPlans.length,
    });
  } catch (error) {
    console.error("Save Plan Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserData = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User Data Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUserSettings = async (req, res) => {
  try {
    const {
      currentEmail,
      name,
      email,
      currentPassword,
      password,
      notificationPreferences,
    } = req.body;

    if (!currentEmail || !currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current email and password are required for verification",
      });
    }

    const user = await User.findOne({ email: currentEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect current password. Verification failed.",
      });
    }

    if (email && email !== currentEmail) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    if (typeof name === "string") {
      user.name = name.trim();
    }

    if (typeof email === "string" && email.trim()) {
      user.email = email.trim().toLowerCase();
    }

    if (typeof password === "string" && password.trim()) {
      user.password = await bcrypt.hash(password.trim(), 10);
    }

    if (notificationPreferences) {
      user.notificationPreferences = {
        ...user.notificationPreferences?.toObject?.(),
        ...notificationPreferences,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isOnboarded: user.isOnboarded,
        onboardingData: user.onboardingData,
        savedIdeas: user.savedIdeas,
        savedPlans: user.savedPlans,
        notificationPreferences: user.notificationPreferences,
      },
    });
  } catch (error) {
    console.error("Update User Settings Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createRazorpayOrder = async (req, res) => {
  try {
    const { email, planId } = req.body;

    if (!email || !planId) {
      return res.status(400).json({
        success: false,
        message: "Email and planId are required",
      });
    }

    const selectedPlan = MEMBERSHIP_PLANS[planId];
    if (!selectedPlan || selectedPlan.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid paid membership plan selected",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message:
          "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to Server/.env and restart the backend server.",
      });
    }

    // Razorpay receipt must stay within 40 characters.
    const shortUserId = String(user._id).slice(-8);
    const shortTimestamp = Date.now().toString().slice(-10);
    const receipt = `pmc_${selectedPlan.planId}_${shortUserId}_${shortTimestamp}`;

    const orderResponse = await axios.post(
      "https://api.razorpay.com/v1/orders",
      {
        amount: selectedPlan.amount * 100,
        currency: selectedPlan.currency,
        receipt,
        notes: {
          email,
          planId: selectedPlan.planId,
          planName: selectedPlan.name,
          userId: String(user._id),
        },
      },
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );

    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order: orderResponse.data,
      plan: selectedPlan,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Create Razorpay Order Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.error?.description || error.message,
    });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      email,
      planId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !email ||
      !planId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete Razorpay payment payload",
      });
    }

    const selectedPlan = MEMBERSHIP_PLANS[planId];
    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.membership = {
      planId: selectedPlan.planId,
      planName: selectedPlan.name,
      status: "active",
      billingCycle: selectedPlan.billingCycle,
      paymentMethod: "Razorpay",
      startedAt: new Date(),
      lastPaymentAt: new Date(),
    };

    user.credits = Math.max(user.credits || 0, selectedPlan.credits);
    user.paymentHistory.push({
      planId: selectedPlan.planId,
      planName: selectedPlan.name,
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: "paid",
      createdAt: new Date(),
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and membership activated",
      membership: user.membership,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isOnboarded: user.isOnboarded,
        membership: user.membership,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error("Verify Razorpay Payment Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  saveOnboarding,
  generateResults,
  saveIdeas,
  generateWeeklyPlanController,
  refineDayController,
  savePlan,
  getUserData,
  updateUserSettings,
  createRazorpayOrder,
  verifyRazorpayPayment,
  enhanceIdeaController,
};
