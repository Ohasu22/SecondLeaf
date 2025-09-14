const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['verification', 'login', 'password_reset'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 600 // 10 minutes
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  isUsed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
otpSchema.index({ email: 1, type: 1 });
// TTL index is automatically created by expires: 600

// Static method to generate OTP
otpSchema.statics.generateOTP = function(email, type) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return this.create({
    email,
    otp,
    type,
    expiresAt
  });
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function(email, otp, type) {
  const otpRecord = await this.findOne({
    email,
    otp,
    type,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  });
  
  if (!otpRecord) {
    return { success: false, message: 'Invalid or expired OTP' };
  }
  
  if (otpRecord.attempts >= 3) {
    return { success: false, message: 'Too many failed attempts' };
  }
  
  // Mark OTP as used
  otpRecord.isUsed = true;
  await otpRecord.save();
  
  return { success: true, message: 'OTP verified successfully' };
};

// Method to increment attempts
otpSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  return this.save();
};

module.exports = mongoose.model('OTP', otpSchema);

