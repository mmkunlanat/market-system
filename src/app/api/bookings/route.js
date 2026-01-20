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

    // Calculate Rental End Date
    const start = new Date(startDate);
    let end = new Date(startDate);
    if (durationType === 'day') {
      end.setDate(end.getDate() + 1);
    } else if (durationType === 'week') {
      end.setDate(end.getDate() + 7);
    } else if (durationType === 'month') {
      end.setMonth(end.getMonth() + 1);
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
      endDate: end.toISOString().split('T')[0], // YYYY-MM-DD
      totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes for payment processing
    };

    bookings.push(newBooking);

    // Save bookings
    await writeFile(bookingsFile, JSON.stringify(bookings, null, 2), 'utf-8');

    // --- Update lock status in locks.json ---
    const locksFile = join(process.cwd(), 'public', 'locks.json');
    try {
      const locksData = await readFile(locksFile, 'utf-8');
      let locks = JSON.parse(locksData);
      const lockIndex = locks.findIndex(l => l._id === lockId);

      if (lockIndex !== -1) {
        locks[lockIndex].status = "unavailable";
        await writeFile(locksFile, JSON.stringify(locks, null, 2), 'utf-8');
      }
    } catch (lockError) {
      console.error('Error updating lock status:', lockError);
      // We don't fail the booking if only the lock status update fails, 
      // but in a real system we might want transactionality.
    }
    // ----------------------------------------

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
