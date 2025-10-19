const NodeCache = require('node-cache');
const logger = require('./logger');

// In-memory cache for OTP (can be replaced with Redis in production)
const otpCache = new NodeCache({ stdTTL: parseInt(process.env.OTP_EXPIRY_MINUTES) * 60 || 300 });

/**
 * Generate a 6-digit OTP code
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP in cache
 */
const storeOTP = (identifier, purpose, otp) => {
  const key = `${identifier}:${purpose}`;
  const data = {
    otp,
    attempts: 0,
    createdAt: Date.now()
  };
  otpCache.set(key, data);
  logger.info(`OTP stored for ${identifier} (${purpose}): ${otp}`);
  return true;
};

/**
 * Verify OTP
 */
const verifyOTP = (identifier, purpose, otp) => {
  const key = `${identifier}:${purpose}`;
  const data = otpCache.get(key);

  if (!data) {
    return { success: false, message: 'OTP expired or not found' };
  }

  // Check max attempts
  if (data.attempts >= parseInt(process.env.OTP_MAX_ATTEMPTS) || 3) {
    otpCache.del(key);
    return { success: false, message: 'Maximum OTP attempts exceeded' };
  }

  // Increment attempts
  data.attempts += 1;
  otpCache.set(key, data);

  // Verify OTP
  if (data.otp !== otp) {
    return { success: false, message: 'Invalid OTP', attemptsLeft: (parseInt(process.env.OTP_MAX_ATTEMPTS) || 3) - data.attempts };
  }

  // Success - delete OTP
  otpCache.del(key);
  return { success: true, message: 'OTP verified successfully' };
};

/**
 * Delete OTP
 */
const deleteOTP = (identifier, purpose) => {
  const key = `${identifier}:${purpose}`;
  otpCache.del(key);
  return true;
};

/**
 * Send OTP via SMS (using Twilio)
 */
const sendSMS = async (phoneNumber, otp) => {
  try {
    // In development, just log the OTP
    if (process.env.NODE_ENV === 'development') {
      logger.info(`[DEV MODE] SMS OTP to ${phoneNumber}: ${otp}`);
      return { success: true };
    }

    // In production, use Twilio
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      logger.warn('Twilio credentials not configured');
      return { success: false, message: 'SMS service not configured' };
    }

    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.messages.create({
      body: `Your MutualNest OTP is: ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES || 5} minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    logger.info(`SMS sent to ${phoneNumber}`);
    return { success: true };
  } catch (error) {
    logger.error('Failed to send SMS:', error);
    return { success: false, message: 'Failed to send SMS' };
  }
};

/**
 * Send OTP via Email (using SendGrid)
 */
const sendEmail = async (email, otp, purpose = 'verification') => {
  try {
    // In development, just log the OTP
    if (process.env.NODE_ENV === 'development') {
      logger.info(`[DEV MODE] Email OTP to ${email}: ${otp}`);
      return { success: true };
    }

    // In production, use SendGrid
    if (!process.env.SENDGRID_API_KEY) {
      logger.warn('SendGrid API key not configured');
      return { success: false, message: 'Email service not configured' };
    }

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME
      },
      subject: `MutualNest - Your OTP Code`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563EB;">MutualNest</h2>
          <p>Your one-time password (OTP) for ${purpose} is:</p>
          <h1 style="color: #2563EB; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 5} minutes.</p>
          <p style="color: #6B7280; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    await sgMail.send(msg);
    logger.info(`Email sent to ${email}`);
    return { success: true };
  } catch (error) {
    logger.error('Failed to send email:', error);
    return { success: false, message: 'Failed to send email' };
  }
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  deleteOTP,
  sendSMS,
  sendEmail
};
