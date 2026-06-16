require("dotenv").config(); // ✅ Load env first

const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

// ✅ Connect DB + Start Server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ DB CONNECTION ERROR:", error.message);
    process.exit(1); // ✅ Exit if DB fails
  }
};

startServer();