// Test Email Configuration
// Run with: node test-email.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

console.log('Testing email configuration...');
console.log('Email Service:', process.env.EMAIL_SERVICE);
console.log('Email User:', process.env.EMAIL_USER);
console.log('Admin Email:', process.env.ADMIN_EMAIL);

// Verify connection
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Email configuration error:', error);
    process.exit(1);
  } else {
    console.log('✅ Email server connection verified');
    
    // Send test email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test Email from QuickTaxReturns Server',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email to verify the email configuration is working correctly.</p>
        <p>If you received this, your email settings are configured properly!</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Failed to send test email:', error);
        process.exit(1);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        process.exit(0);
      }
    });
  }
});
