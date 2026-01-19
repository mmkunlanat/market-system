export async function POST(request) {
  try {
    const { readFile, writeFile } = await import('fs/promises');
    const { join } = await import('path');
    
    const bookingsFile = join(process.cwd(), 'public', 'bookings.json');
    const { lockId, lockCode, zoneId, zoneName, durationType, startDate, totalPrice } = await request.json();

    // Validation
    if (!lockId || !durationType || !totalPrice || !startDate) {
      return Response.json(
        { message: "กรุณากรอกข้อมูลการจองให้ครบ" },
        { status: 400 }
      );
    }

    // Read existing bookings
    let bookings = [];
    try {
      const data = await readFile(bookingsFile, 'utf-8');
      bookings = JSON.parse(data);
    } catch {
      bookings = [];
    }

    // Create new booking
    const newBooking = {
      _id: Date.now().toString(),
      lockId,
      lockCode,
      zoneId,
      zoneName,
      durationType,
      startDate,
      totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
    };

    bookings.push(newBooking);

    // Save bookings
    await writeFile(bookingsFile, JSON.stringify(bookings, null, 2), 'utf-8');

    return Response.json(
      { 
        message: "จองสำเร็จ",
        booking: newBooking
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking error:', error);
    return Response.json(
      { message: "เกิดข้อผิดพลาด: " + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { readFile } = await import('fs/promises');
    const { join } = await import('path');
    
    const bookingsFile = join(process.cwd(), 'public', 'bookings.json');
    
    let bookings = [];
    try {
      const data = await readFile(bookingsFile, 'utf-8');
      bookings = JSON.parse(data);
    } catch {
      bookings = [];
    }

    return Response.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    return Response.json(
      { message: "เกิดข้อผิดพลาด: " + error.message },
      { status: 500 }
    );
  }
}
