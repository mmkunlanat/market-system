import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";
import Lock from "@/models/Lock";

export async function GET() {
  await connectDB();
  const payments = await Payment.find({ status: "waiting" })
    .populate({
      path: "bookingId",
      populate: { path: "lockId" },
    });

  return Response.json(payments);
}
