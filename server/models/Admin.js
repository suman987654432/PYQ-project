// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});

// Add password comparison method
AdminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
