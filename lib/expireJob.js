import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function expireBookings() {
  await connectDB();

  const now = new Date();

  const expired = await Booking.updateMany(
    {
      status: "pending",
      expiresAt: { $lt: now }
    },
    { status: "expired" }
  );

  return expired.modifiedCount;
}
