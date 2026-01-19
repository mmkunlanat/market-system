import mongoose from 'mongoose';

const ZoneSchema = new mongoose.Schema({
  name: String,
  isPremium: Boolean,
  pricePerDay: Number,
  pricePerWeek: Number,
  pricePerMonth: Number,
});

export default mongoose.models.Zone || mongoose.model('Zone', ZoneSchema);
