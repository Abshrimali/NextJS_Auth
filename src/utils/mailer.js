import nodemailer from "nodemailer";

const sendMail = async ({ email, subject, text, emailType }) => {
  try {

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject:
        emailType === "Reset Password"
          ? "Reset Your Password"
          : "Verify Your Email",
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
    
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

export default sendMail;
