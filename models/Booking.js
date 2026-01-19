import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lock' },
  startDate: Date,
  endDate: Date,
  durationType: String,
  totalPrice: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
