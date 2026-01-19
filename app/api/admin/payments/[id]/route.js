import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";
import Lock from "@/models/Lock";

export async function PUT(req, { params }) {
  await connectDB();
  const { action } = await req.json();

  const payment = await Payment.findById(params.id);
  if (!payment) {
    return Response.json({ message: "ไม่พบข้อมูล" }, { status: 404 });
  }

  const booking = await Booking.findById(payment.bookingId);

  if (action === "approve") {
    payment.status = "approved";
    booking.status = "confirmed";
    booking.paymentStatus = "paid";

    await Lock.findByIdAndUpdate(booking.lockId, {
      status: "occupied",
    });

    // ยกเลิก booking อื่น
    await Booking.updateMany(
      {
        lockId: booking.lockId,
        _id: { $ne: booking._id },
      },
      { status: "cancelled" }
    );
  }

  if (action === "reject") {
    payment.status = "rejected";
    booking.status = "cancelled";
  }

  await payment.save();
  await booking.save();

  return Response.json({ message: "อัปเดตสถานะเรียบร้อย" });
}
