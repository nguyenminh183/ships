const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  salary_id: {
    type: String,
    required: [true, 'Please add a salary ID'],
    unique: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  total_income: {
    type: Number,
    required: [true, 'Please add total income']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Salary', SalarySchema); 