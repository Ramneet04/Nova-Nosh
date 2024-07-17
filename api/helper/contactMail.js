import nodemailer from "nodemailer";
import ApiError from "../helper/apiError.js"

export const contactEmail = async ({ name, email, phoneNumber, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
        from: `"${name}" <${email}>`, // Using name and email in the from field
        to: "nova-nosh@gmail.com",
        subject: `New Contact Us Message from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Contact Us Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>
        `,
      };
  
    // Send mail
    await transporter.sendMail(mailOptions);
    return { success: true };


  } catch (error) {
  throw new ApiError(500, "Internal Server Error");
  }
};
