const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");

// Set your SendGrid API Key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Cloud Function to send emails using SendGrid
 */
exports.sendContactEmail = functions.https.onCall(async (data, context) => {
  try {
    const {name, email, message} = data;

    const msg = {
      to: "34percyjackson@gmail.com", // 👈 replace with your email
      from: "34percyjackson@gmail.com", // 👈 must be verified in SendGrid
      subject: `New Contact Form Message from ${name}`,
      text: `
        You have received a new message from your website contact form.
        
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    await sgMail.send(msg);

    return {success: true, message: "Email sent successfully"};
  } catch (error) {
    console.error("Error sending email:", error);
    return {success: false, message: "Failed to send email"};
  }
});
