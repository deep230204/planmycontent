const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"PlanMyContent" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset Password OTP",

      // ✅ ONLY HTML (no text → no quoted text issue)
      html: `
      <div style="background:#f5f7fb;padding:20px;font-family:Arial,sans-serif;">
        <div style="max-width:480px;margin:auto;background:#fff;padding:24px;border-radius:10px;border:1px solid #e5e7eb;">
          
          <h2 style="margin:0;color:#ff6b00;">PlanMyContent</h2>
          <p style="font-size:13px;color:#777;margin:4px 0 16px;">
            Smart Content Strategy Platform
          </p>

          <hr style="border:none;border-top:1px solid #eee;" />

          <h3>Reset your password</h3>

          <p>Use the OTP below:</p>

          <div style="text-align:center;margin:20px 0;">
            <div style="
              display:inline-block;
              padding:14px 28px;
              font-size:26px;
              font-weight:bold;
              letter-spacing:3px;
              background:#f3f4f6;
              border-radius:8px;
            ">
              ${otp}
            </div>
          </div>

          <p style="text-align:center;font-size:13px;color:#666;">
            This OTP expires in <strong>3 minutes</strong>.
          </p>

        </div>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent with OTP:", otp);

  } catch (error) {
    console.error("❌ Email error:", error.message);
  }
};

module.exports = sendEmail;