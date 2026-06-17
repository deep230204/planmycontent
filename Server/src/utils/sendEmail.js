const nodemailer = require("nodemailer");
const dns = require("dns");

let transporter;

const getTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "Email is not configured. Add EMAIL_USER and EMAIL_PASS to Server/.env and restart the backend server."
    );
  }

  if (transporter) {
    return transporter;
  }

  dns.setDefaultResultOrder("ipv4first");

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4,
    pool: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      servername: "smtp.gmail.com",
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  return transporter;
};

const sendEmail = async (to, otp) => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"PlanMyContent" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Password OTP",
    text: `Your PlanMyContent password reset OTP is ${otp}. This OTP expires in 3 minutes.`,
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
  });

  console.log("OTP email sent to:", to);
};

module.exports = sendEmail;
