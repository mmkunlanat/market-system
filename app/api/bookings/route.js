import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Lock from "@/models/Lock";

export async function POST(req) {
  await connectDB();
  const data = await req.json();

  const { lockId, durationType, totalPrice } = data;

  // เช็กว่าล็อกถูกจองแล้วหรือยัง
  const lock = await Lock.findById(lockId);
  if (lock.status !== "available") {
    return Response.json(
      { message: "ล็อกนี้ถูกจองแล้ว" },
      { status: 400 }
    );
  }

  // สร้างการจอง
  const booking = await Booking.create({
    lockId,
    durationType,
    totalPrice,
    status: "pending",
  });

  // ล็อกสถานะ
  lock.status = "reserved";
  await lock.save();

  return Response.json({
    message: "จองสำเร็จ",
    booking,
  });
}
