import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
    try {
        const paymentsFile = join(process.cwd(), 'public', 'payments.json');
        const bookingsFile = join(process.cwd(), 'public', 'bookings.json');
        const locksFile = join(process.cwd(), 'public', 'locks.json');

        const [paymentsData, bookingsData, locksData] = await Promise.all([
            readFile(paymentsFile, 'utf-8').catch(() => '[]'),
            readFile(bookingsFile, 'utf-8').catch(() => '[]'),
            readFile(locksFile, 'utf-8').catch(() => '[]'),
        ]);

        const payments = JSON.parse(paymentsData);
        const bookings = JSON.parse(bookingsData);
        const locks = JSON.parse(locksData);

        // Populate payment with booking and lock info
        const enrichedPayments = payments.map(p => {
            const booking = bookings.find(b => b._id === p.bookingId) || {};
            const lock = locks.find(l => l._id === booking.lockId) || {};
            return {
                ...p,
                bookingDetails: {
                    ...booking,
                    lockDetails: lock
                }
            };
        });

        return Response.json(enrichedPayments);
    } catch (error) {
        console.error('Admin Payments API Error:', error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
