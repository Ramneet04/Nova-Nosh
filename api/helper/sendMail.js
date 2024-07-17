import User from "../models/user.model.js";
import sgMail from '@sendgrid/mail';
import bcryptjs from "bcryptjs";
import dotenv from 'dotenv';
import ApiError from "./apiError.js";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    const userIdString = String(userId);
    const hashToken = await bcryptjs.hash(userIdString, 10);

    if (emailType === "resetPassword") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashToken,
          forgotPasswordExpire: Date.now() + (20 * 60 * 1000), // 20 min
        },
      });
    } else if (emailType === "verifyEmail") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashToken,
          verifyTokenExpire: Date.now() + (20 * 60 * 1000), // 20 min
        },
      });
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: emailType === "resetPassword" ? "Reset Password" : "Verify Email",
      html: `
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Template</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                background-color: #000;
                color: #fff;
                text-align: center;
                padding: 10px 0;
                border-radius: 5px 5px 0 0;
              }
              .header h1 {
                margin: 0;
              }
              .content {
                padding: 20px 0;
                text-align: center;
              }
              .footer {
                margin-top: 20px;
                border-top: 1px solid #ccc;
                padding-top: 20px;
                text-align: center;
                font-size: 12px;
                color: #777;
              }
              .footer p {
                margin: 5px 0;
              }
              .social-icons {
                margin: 10px 0;
              }
              .social-icons img {
                width: 24px;
                height: 24px;
                margin: 0 5px;
              }
              a {
                color: #ff0000;
                text-decoration: none;
              }
              a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>${emailType === "resetPassword" ? 'Reset Password' : 'Verify Email'}</h1>
                <p>Sent by <a href="mailto:${process.env.SENDER_EMAIL}" style="color: #fff;">${process.env.COMPANY_NAME}</a></p>
              </div>
              <div class="content">
                <p>Click <a href="${emailType === "resetPassword" ? `${process.env.DOMAIN}/resetPassword?token=${hashToken}` : `${process.env.DOMAIN}/verifyEmail?token=${hashToken}`}">here</a> to ${emailType === "resetPassword" ? 'reset your password' : 'verify your email'}.</p>
                <span>Link is valid for 20 minutes.</span>
              </div>
              <div class="footer">
                <div class="social-icons">
                  <a href="#" target="_blank"><img width="60" height="60" src="https://img.icons8.com/color/48/facebook-new.png" alt="facebook"/></a>
                  <a href="https://x.com/iampriyanshu29" target="_blank"><img width="24" height="24" src="https://img.icons8.com/material-outlined/24/twitterx--v2.png" alt="twitter"/></a>
                  <a href="https://www.instagram.com/iampriyanshu29/?next=%2F" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn"></a>
                  <a href="https://www.linkedin.com/in/iampriyanshu29/" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram"></a>
                </div>
                <p>For any assistance, please visit our <a href="${process.env.HELP_URL}">Help Center</a> or read our <a href="${process.env.PRIVACY_POLICY_URL}">Privacy Policy</a>.</p>
                <p>&copy; ${new Date().getFullYear()} ${process.env.COMPANY_NAME}. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };
    

    // Send the email using SendGrid
    await sgMail.send(mailOptions);
    console.log('Email sent');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new ApiError("Error in sending message", 500); 
  }
}
