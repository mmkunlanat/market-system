// ใช้ ./ เพราะอยู่ในโฟลเดอร์เดียวกัน (lib)
import connectDB from "./mongodb"; 
// ใช้ ../ เพื่อถอยออกจาก lib ไปเข้า models
import Booking from "../models/Booking";
import Lock from "../models/Lock";

export async function expireBookings() {
  await connectDB();
  const expired = await Booking.find({
    status: "pending",
    expiresAt: { $lte: new Date() },
  });

  for (const b of expired) {
    b.status = "expired";
    await b.save();
    await Lock.findByIdAndUpdate(b.lockId, {
      status: "available",
    });
  }
  return expired.length;
}