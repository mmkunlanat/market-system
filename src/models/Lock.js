import mongoose from "mongoose";

const LockSchema = new mongoose.Schema({
  code: String,
  status: { type: String, default: "available" },
  zoneId: {
    name: String,
    pricePerDay: Number,
    pricePerWeek: Number,
    pricePerMonth: Number,
  },
});

export default mongoose.models.Lock ||
  mongoose.model("Lock", LockSchema);
