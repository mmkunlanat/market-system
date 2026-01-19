import connectDB from "@/lib/mongodb";
import Lock from "@/models/Lock";

export async function GET() {
  try {
    await connectDB();

    const locks = await Lock.find()
      .populate("zoneId")
      .lean();

    return Response.json(locks);
  } catch (error) {
    console.error("GET /api/locks error:", error);
    return Response.json(
      { message: "Failed to fetch locks" },
      { status: 500 }
    );
  }
}
