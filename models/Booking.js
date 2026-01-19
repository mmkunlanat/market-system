import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  lockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lock' },
  durationType: String,
  totalPrice: Number,

  status: { type: String, default: 'pending' }, 
  paymentStatus: { type: String, default: 'unpaid' },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking ||
  mongoose.model('Booking', BookingSchema);
