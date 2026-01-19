import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";
import Lock from "@/models/Lock";

export async function POST(req) {
  await connectDB();
  const { bookingId, slipImage } = await req.json();

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return Response.json({ message: "ไม่พบการจอง" }, { status: 404 });
  }

  // ถ้ามีคนจ่ายแล้ว
  if (booking.paymentStatus === "paid") {
    return Response.json(
      { message: "มีผู้ชำระเงินก่อนแล้ว" },
      { status: 400 }
    );
  }

  // บันทึกการชำระเงิน
  await Payment.create({
    bookingId,
    slipImage,
  });

  booking.paymentStatus = "paid";
  booking.status = "confirmed";
  await booking.save();

  // ล็อกล็อกขายของ
  await Lock.findByIdAndUpdate(booking.lockId, {
    status: "occupied",
  });

  // ยกเลิก booking อื่น
  await Booking.updateMany(
    {
      lockId: booking.lockId,
      _id: { $ne: bookingId },
    },
    {
      status: "cancelled",
    }
  );

  return Response.json({ message: "ชำระเงินสำเร็จ คุณได้สิทธิ์ล็อกนี้" });
}
