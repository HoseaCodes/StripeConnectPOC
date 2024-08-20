const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const bankAccountSchema = mongoose.Schema({
  accountNumber: String,
  routingNumber: String,
  bankName: String,
  accountId: String,
  accountName: String,
  accountMask: String,
  accountType: String,
  accountSubtype: String,
  institutionName: String,
  accessToken: String,
  itemId: String,
}, { _id: false });

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  stripeAccountId: { type: String },
  onboarded: { type: Boolean, default: false },
  ssn: {type: String, required: true},
  phone: { type: String },
  dob: {
    day: { type: Number },
    month: { type: Number },
    year: { type: Number },
  },
  address: {
    line1: { type: String },
    city: { type: String },
    state: { type: String },
    postal_code: { type: String },
    country: { type: String },
  },
  bankAccounts: [bankAccountSchema],
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
