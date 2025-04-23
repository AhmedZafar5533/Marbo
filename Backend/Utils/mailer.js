const nodemailer = require("nodemailer");
require("dotenv").config();

// 1. Create transporter
const transporter = nodemailer.createTransport({
    service: "gmail", // or use your email service provider
    auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your password or app-specific password
    },
});

// 2. Function to send OTP
const sendOtpEmail = async (toEmail, otp) => {
    const mailOptions = {
        from: `"Marbo Global" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Your OTP Code",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #4CAF50;">Your One-Time Password (OTP)</h2>
        <p>Hello,</p>
        <p>Use the following OTP to proceed with your action:</p>
        <h1 style="background: #f2f2f2; padding: 10px 20px; display: inline-block; border-radius: 5px;">${otp}</h1>
        <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
        <br />
        <p>Thanks,<br />Marbo Global</p>
      </div>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

const styledHtmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        a {
             color: #007bff;
             text-decoration: none;
        }
        a:hover {
             text-decoration: underline;
        }
    </style>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div class="container" style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div class="header" style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee;">
            <h1 style="margin: 0; color: #333333; font-size: 24px;">Password Reset Request</h1>
        </div>
        <div class="content" style="padding: 20px 0;">
            <p style="margin-bottom: 15px;">Hello \${user.username},</p>
            <p style="margin-bottom: 15px;">You requested a password reset. Click the link below to reset your password:</p>

            <div class="button-container" style="text-align: center; margin: 30px 0;">
                 <a href="\${resetLink}" class="button" style="display: inline-block; background-color: #dc3545; color: #ffffff !important; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-size: 16px; font-weight: bold;">Reset Password</a>
            </div>

            <p style="margin-bottom: 15px;">This link will expire in \${RESET_TOKEN_EXPIRY}.</p>
            <p style="margin-bottom: 15px;">If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer" style="text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #888888;">
            <p style="margin: 0;">&copy;Marbo Global. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

// --- Function to Send Reset Email ---
async function sendPasswordResetEmail(user, resetLink, resetTokenExpiry) {
    // Pass user object, link, and expiry
    try {
        // Replace placeholders in the template string
        let htmlContent = styledHtmlTemplate; // Start with the base template
        htmlContent = htmlContent.replace(/\${user.username}/g, user.username);
        htmlContent = htmlContent.replace(/\${resetLink}/g, resetLink);
        htmlContent = htmlContent.replace(
            /\${RESET_TOKEN_EXPIRY}/g,
            resetTokenExpiry
        );
        htmlContent = htmlContent.replace(
            /\${new Date().getFullYear()}/g,
            new Date().getFullYear().toString()
        );

        // Define email options
        const mailOptions = {
            from: `"Marbo Global" <${process.env.EMAIL_USER}>`, // Sender address
            to: user.email, // Recipient email address from user object
            subject: "Your password reset link", // Subject line
            html: htmlContent, // Use the processed HTML template as the body
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        console.log("Password reset email sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error; // Re-throw the error
    }
}

module.exports = { sendOtpEmail, sendPasswordResetEmail };
