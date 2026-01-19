import connectDB from "../../../lib/mongodb";
import Lock from "../../../models/Lock";


export async function GET() {
  try {
    await connectDB();
    const locks = await Lock.find().populate("zoneId");
    return Response.json(locks);
  } catch (error) {
    console.error("API /locks error:", error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
