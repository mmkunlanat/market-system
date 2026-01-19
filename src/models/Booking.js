import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    lockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lock",
      required: true,
    },

    durationType: {
      type: String,
      enum: ["day", "week", "month"],
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "expired", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "rejected"],
      default: "unpaid",
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true, // 👈 ใช้กับ cron
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
  }
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
