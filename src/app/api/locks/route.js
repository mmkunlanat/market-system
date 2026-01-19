export async function GET() {
  try {
    const { readFile } = await import('fs/promises');
    const { join } = await import('path');
    
    const locksFile = join(process.cwd(), 'public', 'locks.json');
    const data = await readFile(locksFile, 'utf-8');
    const locks = JSON.parse(data);

    return Response.json(locks);
  } catch (error) {
    console.error('Error reading locks:', error);
    return Response.json(
      { message: "ไม่สามารถโหลดข้อมูลล็อก", error: error.message },
      { status: 500 }
    );
  }
}
