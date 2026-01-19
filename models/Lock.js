import mongoose from "mongoose";

const LockSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    zoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
    },
    size: {
      type: String,
      enum: ["S", "M", "L"],
      default: "M",
    },
    status: {
      type: String,
      enum: ["available", "reserved", "booked"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Lock ||
  mongoose.model("Lock", LockSchema);
