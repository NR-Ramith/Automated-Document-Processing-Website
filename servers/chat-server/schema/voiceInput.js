const mongoose = require('mongoose');

const voiceInputSchema = new mongoose.Schema({
    name: String,
    personalNumber: Number,
    email: String,
    fatherName: String,
    fatherNumber: Number,
    motherName: String,
    motherNumber: Number,
    guardianName: String,
    guardianNumber: Number,
    dob: Date,
    date: Date,
    address: String,
    city: String,
    state: String,
    nationality: String,
    pinCode: Number
});

const VoiceInput = mongoose.model('VoiceInput', voiceInputSchema);

module.exports = VoiceInput;