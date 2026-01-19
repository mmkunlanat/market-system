import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  slipImage: String,
  paidAt: Date,
  status: { type: String, default: 'waiting' },
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
