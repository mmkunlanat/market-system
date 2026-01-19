import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // 1 booking มี 1 payment
    },

    slipImage: {
      type: String,
      required: true,
    },

    paidAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["waiting", "approved", "rejected"],
      default: "waiting",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
