export async function PUT(request, { params }) {
  try {
    const { readFile, writeFile } = await import('fs/promises');
    const { join } = await import('path');
    
    const paymentsFile = join(process.cwd(), 'public', 'payments.json');
    const bookingsFile = join(process.cwd(), 'public', 'bookings.json');
    
    const { action } = await request.json();

    // Read payments
    let payments = [];
    try {
      const data = await readFile(paymentsFile, 'utf-8');
      payments = JSON.parse(data);
    } catch {
      payments = [];
    }

    const paymentIndex = payments.findIndex(p => p._id === params.id);
    if (paymentIndex === -1) {
      return Response.json({ message: "ไม่พบข้อมูล" }, { status: 404 });
    }

    const payment = payments[paymentIndex];

    // Read bookings
    let bookings = [];
    try {
      const data = await readFile(bookingsFile, 'utf-8');
      bookings = JSON.parse(data);
    } catch {
      bookings = [];
    }

    const bookingIndex = bookings.findIndex(b => b._id === payment.bookingId);
    if (bookingIndex === -1) {
      return Response.json({ message: "ไม่พบ booking" }, { status: 404 });
    }

    const booking = bookings[bookingIndex];

    if (action === "approve") {
      payment.status = "approved";
      booking.status = "confirmed";
      booking.paymentStatus = "paid";

      payments[paymentIndex] = payment;
      bookings[bookingIndex] = booking;

      // ยกเลิก booking อื่น
      bookings = bookings.map(b => {
        if (b.lockId === booking.lockId && b._id !== booking._id && b.status === "pending") {
          b.status = "cancelled";
        }
        return b;
      });
    }

    if (action === "reject") {
      payment.status = "rejected";
      booking.status = "cancelled";

      payments[paymentIndex] = payment;
      bookings[bookingIndex] = booking;
    }

    // Save to files
    await writeFile(paymentsFile, JSON.stringify(payments, null, 2), 'utf-8');
    await writeFile(bookingsFile, JSON.stringify(bookings, null, 2), 'utf-8');

    return Response.json({ message: "อัปเดตสถานะเรียบร้อย" });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
