export async function POST(request) {
  try {
    const { readFile, writeFile } = await import('fs/promises');
    const { join } = await import('path');
    
    const bookingsFile = join(process.cwd(), 'public', 'bookings.json');
    const paymentsFile = join(process.cwd(), 'public', 'payments.json');
    
    const { bookingId, slipImage } = await request.json();

    // Read bookings
    let bookings = [];
    try {
      const data = await readFile(bookingsFile, 'utf-8');
      bookings = JSON.parse(data);
    } catch {
      bookings = [];
    }

    const bookingIndex = bookings.findIndex(b => b._id === bookingId);
    if (bookingIndex === -1 || bookings[bookingIndex].status !== "pending") {
      return Response.json(
        { message: "Booking ใช้ไม่ได้" },
        { status: 400 }
      );
    }

    const booking = bookings[bookingIndex];

    // Create payment record
    let payments = [];
    try {
      const data = await readFile(paymentsFile, 'utf-8');
      payments = JSON.parse(data);
    } catch {
      payments = [];
    }

    const newPayment = {
      _id: Date.now().toString(),
      bookingId,
      amount: booking.totalPrice,
      slipImage,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    payments.push(newPayment);

    // Update booking status
    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    bookings[bookingIndex] = booking;

    // ยกเลิก booking อื่น
    bookings = bookings.map(b => {
      if (b.lockId === booking.lockId && b._id !== booking._id && b.status === "pending") {
        b.status = "cancelled";
      }
      return b;
    });

    // Save to files
    await writeFile(bookingsFile, JSON.stringify(bookings, null, 2), 'utf-8');
    await writeFile(paymentsFile, JSON.stringify(payments, null, 2), 'utf-8');

    return Response.json({ success: true, payment: newPayment });

  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
