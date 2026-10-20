import { User } from "@/models/userModel";
import nodemailer from "nodemailer";
import crypto from "crypto";
import "dotenv/config"
export const sendMail = async ({ userEmail, emailType, userId }) => {
  try {
    // 1. Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    // 2. Set token expiry (15 minutes)
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    // 3. Save token in database
    const updateFields =
      emailType === "Reset-Password"
        ? {
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: tokenExpiry,
          }
        : {
            verifyToken: token,
            verifyTokenExpiry: tokenExpiry,
          };

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true },
    );
    if (!user) {
      throw new Error("User not found");
    }

    // 4. Create email link
    const baseUrl = process.env.DOMAIN;
    if (!baseUrl) {
      throw new Error("DOMAIN is not configured");
    }

    const link =
      emailType === "Reset-Password"
        ? `${baseUrl}/reset-password?token=${token}`
        : `${baseUrl}/verify-email?token=${token}`;

    // 5. Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 6. Send email
    const isReset = emailType === "Reset-Password";

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: userEmail,
      subject: isReset ? "Reset Your Password" : "Verify Your Email",
      text: isReset
        ? `Reset your password using this link: ${link}`
        : `Verify your email using this link: ${link}`,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

export default sendMail;
