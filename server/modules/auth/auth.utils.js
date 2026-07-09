import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

export const generateAuthToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
const getTransporter = () => {
  return nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});
}

export const sendOtpResetPassword = async (email, otp) => {
  const transporter = getTransporter();
  try{
  await transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: email,
  subject: "Career Compass • Password Reset OTP",
  html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body style="margin:0;padding:0;background:#f4f7fb;font-family:Inter,Arial,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 20px;">

          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td align="center"
                style="background:linear-gradient(135deg,#6d5dfc,#8b5cf6);padding:32px;">
                
                <h1 style="margin:0;color:white;font-size:28px;font-weight:700;">
                  Career Compass
                </h1>

                <p style="margin-top:8px;color:rgba(255,255,255,0.9);font-size:14px;">
                  Navigate Your Career Journey
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:40px;">

                <h2 style="margin:0 0 16px;color:#111827;">
                  Password Reset Request
                </h2>

                <p style="color:#6b7280;font-size:15px;line-height:1.7;">
                  We received a request to reset your password.
                  Use the verification code below to continue.
                </p>

                <!-- OTP Card -->
                <div style="
                  margin:30px 0;
                  background:#f8faff;
                  border:2px dashed #6d5dfc;
                  border-radius:14px;
                  text-align:center;
                  padding:24px;
                ">
                  <p style="
                    margin:0;
                    color:#6b7280;
                    font-size:13px;
                    letter-spacing:1px;
                    text-transform:uppercase;
                  ">
                    One-Time Password
                  </p>

                  <h1 style="
                    margin:12px 0 0;
                    color:#6d5dfc;
                    font-size:42px;
                    letter-spacing:10px;
                    font-weight:700;
                  ">
                    ${otp}
                  </h1>
                </div>

                <p style="color:#6b7280;font-size:14px;">
                  This OTP will expire in
                  <strong>5 minutes</strong>.
                </p>

                <p style="color:#6b7280;font-size:14px;">
                  If you didn't request a password reset,
                  you can safely ignore this email.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center"
                style="
                  background:#f9fafb;
                  padding:24px;
                  border-top:1px solid #e5e7eb;
                ">

                <p style="
                  margin:0;
                  color:#9ca3af;
                  font-size:12px;
                ">
                  © ${new Date().getFullYear()} Career Compass
                </p>

                <p style="
                  margin-top:8px;
                  color:#9ca3af;
                  font-size:12px;
                ">
                  Helping students and professionals achieve career success.
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `,
});
  }
  catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
}