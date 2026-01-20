import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { action } = await request.json(); // 'approve' or 'reject'

    const paymentsFile = join(process.cwd(), 'public', 'payments.json');
    const bookingsFile = join(process.cwd(), 'public', 'bookings.json');
    const locksFile = join(process.cwd(), 'public', 'locks.json');

    const [paymentsData, bookingsData, locksData] = await Promise.all([
      readFile(paymentsFile, 'utf-8').catch(() => '[]'),
      readFile(bookingsFile, 'utf-8').catch(() => '[]'),
      readFile(locksFile, 'utf-8').catch(() => '[]'),
    ]);

    let payments = JSON.parse(paymentsData);
    let bookings = JSON.parse(bookingsData);
    let locks = JSON.parse(locksData);

    const paymentIndex = payments.findIndex(p => p._id === id);
    if (paymentIndex === -1) {
      return Response.json({ message: "ไม่พบข้อมูลการชำระเงิน" }, { status: 404 });
    }

    const payment = payments[paymentIndex];
    const bookingIndex = bookings.findIndex(b => b._id === payment.bookingId);

    if (action === 'approve') {
      payment.status = 'approved';
      if (bookingIndex !== -1) {
        bookings[bookingIndex].status = 'confirmed';
        bookings[bookingIndex].paymentStatus = 'paid';

        // Ensure lock status is 'unavailable'
        const lockIndex = locks.findIndex(l => l._id === bookings[bookingIndex].lockId);
        if (lockIndex !== -1) {
          locks[lockIndex].status = 'unavailable';
        }
      }
    } else if (action === 'reject') {
      payment.status = 'rejected';
      if (bookingIndex !== -1) {
        bookings[bookingIndex].status = 'cancelled';
        bookings[bookingIndex].paymentStatus = 'rejected';

        // Reset lock status to 'available'
        const lockIndex = locks.findIndex(l => l._id === bookings[bookingIndex].lockId);
        if (lockIndex !== -1) {
          locks[lockIndex].status = 'available';
        }
      }
    }

    await Promise.all([
      writeFile(paymentsFile, JSON.stringify(payments, null, 2)),
      writeFile(bookingsFile, JSON.stringify(bookings, null, 2)),
      writeFile(locksFile, JSON.stringify(locks, null, 2)),
    ]);

    return Response.json({ success: true, payment });
  } catch (error) {
    console.error('Payment Action Error:', error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
