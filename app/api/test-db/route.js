import connectDB from '@/lib/mongodb';

export async function GET() {
  await connectDB();
  return new Response(JSON.stringify({ message: 'MongoDB Connected' }));
}
