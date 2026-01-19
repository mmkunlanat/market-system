import connectDB from "@/lib/mongodb";
import Lock from "@/models/Lock";
import Zone from "@/models/Zone";

export async function GET() {
  await connectDB();

  const locks = await Lock.find().populate("zoneId");

  return Response.json(locks);
}
