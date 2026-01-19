import connectDB from "@/lib/mongodb";
import Lock from "@/models/Lock";

export async function GET() {
  await connectDB();
  const locks = await Lock.find().populate("zoneId");
  return Response.json(locks);
}
