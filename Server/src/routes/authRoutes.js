const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);


router.post("/onboarding", saveOnboarding);
router.post("/generate-results", generateResults);
router.post("/save-ideas", saveIdeas);
router.post("/generate-weekly-plan", generateWeeklyPlanController);
router.post("/refine-day", refineDayController);
router.post("/save-plan", savePlan);
router.post("/user-data", getUserData);
router.put("/settings", updateUserSettings);
router.post("/payments/razorpay/order", createRazorpayOrder);
router.post("/payments/razorpay/verify", verifyRazorpayPayment);
router.post("/enhance-idea", enhanceIdeaController);

module.exports = router;
