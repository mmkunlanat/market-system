import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Lock from "@/models/Lock";

export async function POST(req) {
  await connectDB();
  const { lockId, durationType, totalPrice } = await req.json();

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 นาที

  const booking = await Booking.create({
    lockId,
    durationType,
    totalPrice,
    expiresAt,
  });

  return Response.json(booking);
}
