import mongoose from 'mongoose';

const LockSchema = new mongoose.Schema({
  code: String,
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
  size: String,
  status: { type: String, default: 'available' },
});

export default mongoose.models.Lock || mongoose.model('Lock', LockSchema);
