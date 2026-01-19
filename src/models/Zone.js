import mongoose from "mongoose";

const ZoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    pricePerWeek: {
      type: Number,
      required: true,
    },
    pricePerMonth: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Zone ||
  mongoose.model("Zone", ZoneSchema);
