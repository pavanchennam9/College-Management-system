const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feeType: { type: String, enum: ['tuition', 'hostel', 'library', 'lab', 'exam', 'other'], required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paidDate: { type: Date },
  status: { type: String, enum: ['pending', 'paid', 'overdue', 'partial'], default: 'pending' },
  paidAmount: { type: Number, default: 0 },
  semester: { type: Number },
  transactionId: { type: String },
  paymentMode: { type: String, enum: ['cash', 'online', 'cheque', 'dd'] },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fee', feeSchema);
