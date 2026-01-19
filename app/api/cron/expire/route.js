import { expireBookings } from "@/lib/expireJob";

export async function GET() {
  const count = await expireBookings();
  return Response.json({ expired: count });
}
