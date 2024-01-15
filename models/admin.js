const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    role: String,
    created_at: { type: Date, default: Date.now },
    updated_at: Date
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
