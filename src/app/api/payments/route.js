import connectDB from "@/lib/mongodb";
import Booking from "@/src/models/Booking";
import Lock from "@/src/models/Lock";
import Payment from "@/src/models/Payment";
import mongoose from "mongoose";

export async function POST(req) {
  await connectDB();
  const { bookingId, slipImage } = await req.json();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking || booking.status !== "pending") {
      throw new Error("Booking ใช้ไม่ได้");
    }

    // ใครได้ lock ก่อน = ชนะ
    const lock = await Lock.findOneAndUpdate(
      { _id: booking.lockId, status: "available" },
      { status: "occupied" },
      { session }
    );

    if (!lock) {
      throw new Error("มีคนจ่ายตัดหน้าแล้ว");
    }

    // บันทึก payment
    await Payment.create(
      [{
        bookingId,
        slipImage,
        paidAt: new Date(),
        status: "approved"
      }],
      { session }
    );

    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    await booking.save({ session });

    // ยกเลิก booking อื่น
    await Booking.updateMany(
      {
        lockId: booking.lockId,
        status: "pending",
        _id: { $ne: booking._id }
      },
      { status: "cancelled" },
      { session }
    );

    await session.commitTransaction();
    return Response.json({ success: true });

  } catch (err) {
    await session.abortTransaction();
    return Response.json({ success: false, message: err.message });
  }
}
