export async function GET(request) {
  try {
    const { readFile } = await import('fs/promises');
    const { join } = await import('path');
    
    const zonesFile = join(process.cwd(), 'public', 'zones.json');
    const data = await readFile(zonesFile, 'utf-8');
    const zones = JSON.parse(data);

    return Response.json(zones);
  } catch (error) {
    console.error('Error reading zones:', error);
    return Response.json(
      { message: "ไม่สามารถโหลดข้อมูลโซน", error: error.message },
      { status: 500 }
    );
  }
}
