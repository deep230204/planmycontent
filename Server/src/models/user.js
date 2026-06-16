const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        "Password must contain uppercase, lowercase, number, and special character",
      ],
    },

    isOnboarded: {
      type: Boolean,
      default: false,
    },

    // ✅ FIXED Onboarding Data (matches your frontend)
    onboardingData: {
      brandName: {
        type: String,
        default: "",
      },

      industry: {
        type: Array,
        default: [],
      },

      description: {
        type: String,
        default: "",
      },

      usp: {
        type: String,
        default: "",
      },

      brandStage: {
        type: Array,
        default: [],
      },

      audience: {
        type: Object,
        default: {},
      },

      goals: {
        type: Object,
        default: {},
      },

      voice: {
        type: Object,
        default: {},
      },

      contentType: {
        type: Object,
        default: {},
      },

      keywords: {
        type: Object,
        default: {},
      },

      challenges: {
        type: Object,
        default: {},
      },
    },

    savedIdeas: [
      {
        brandName: {
          type: String,
          default: "",
        },

        industry: {
          type: String,
          default: "",
        },

        summary: {
          type: Array,
          default: [],
        },

        ideas: {
          type: Array,
          default: [],
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    savedPlans: [
      {
        ideaTitle: {
          type: String,
          default: "",
        },

        brandName: {
          type: String,
          default: "",
        },

        platform: {
          type: String,
          default: "",
        },

        type: {
          type: String,
          default: "",
        },

        weeklyPlan: {
          type: Array,
          default: [],
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    notificationPreferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      weeklyReports: {
        type: Boolean,
        default: true,
      },
      trendingAlerts: {
        type: Boolean,
        default: false,
      },
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },
    
    credits: {
      type: Number,
      default: 10,
    },

    membership: {
      planId: {
        type: String,
        default: "starter",
      },
      planName: {
        type: String,
        default: "Starter",
      },
      status: {
        type: String,
        default: "inactive",
      },
      billingCycle: {
        type: String,
        default: "monthly",
      },
      paymentMethod: {
        type: String,
        default: "",
      },
      startedAt: {
        type: Date,
        default: null,
      },
      lastPaymentAt: {
        type: Date,
        default: null,
      },
    },

    paymentHistory: [
      {
        planId: {
          type: String,
          default: "",
        },
        planName: {
          type: String,
          default: "",
        },
        amount: {
          type: Number,
          default: 0,
        },
        currency: {
          type: String,
          default: "INR",
        },
        orderId: {
          type: String,
          default: "",
        },
        paymentId: {
          type: String,
          default: "",
        },
        signature: {
          type: String,
          default: "",
        },
        status: {
          type: String,
          default: "created",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
