import { expireBookings } from "../../../../lib/expireJob"; // ถอยออกจาก expire -> cron -> api -> app
export async function GET() {
  try {
    const count = await expireBookings();
    return Response.json({ expired: count });
  } catch (error) {
    console.error("Cron Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}