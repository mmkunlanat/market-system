import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
    try {
        const locksFile = join(process.cwd(), 'public', 'locks.json');
        const bookingsFile = join(process.cwd(), 'public', 'bookings.json');
        const paymentsFile = join(process.cwd(), 'public', 'payments.json');
        const usersFile = join(process.cwd(), 'public', 'users.json');

        const [locksData, bookingsData, paymentsData, usersData] = await Promise.all([
            readFile(locksFile, 'utf-8').catch(() => '[]'),
            readFile(bookingsFile, 'utf-8').catch(() => '[]'),
            readFile(paymentsFile, 'utf-8').catch(() => '[]'),
            readFile(usersFile, 'utf-8').catch(() => '[]'),
        ]);

        const locks = JSON.parse(locksData);
        const bookings = JSON.parse(bookingsData);
        const payments = JSON.parse(paymentsData);
        const users = JSON.parse(usersData);

        const totalLocks = locks.length;
        const totalBookings = bookings.length;
        const totalUsers = users.length;

        // Calculate revenue from all active bookings (real-time)
        const totalRevenue = bookings
            .filter(b => b.status !== 'cancelled' && b.status !== 'rejected')
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

        const stats = {
            totalLocks,
            totalBookings,
            totalRevenue,
            totalUsers,
            pendingPayments: payments.filter(p => p.status === 'pending').length,
            availableLocks: locks.filter(l => l.status === 'available').length,
            chartData: getChartData(bookings)
        };

        return Response.json(stats);
    } catch (error) {
        console.error('Stats API Error:', error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

function getChartData(bookings) {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Get all days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dailyData = {};

    // Initialize dailyData with 0
    for (let i = 1; i <= daysInMonth; i++) {
        dailyData[i] = 0;
    }

    // Sum revenue per day for current month
    bookings.forEach(b => {
        if (b.status === 'cancelled' || b.status === 'rejected') return;

        const bookingDate = new Date(b.createdAt);
        if (bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
            const day = bookingDate.getDate();
            dailyData[day] += (b.totalPrice || 0);
        }
    });

    // Convert to array for Recharts
    return Object.keys(dailyData).map(day => ({
        day: `${day}/${currentMonth + 1}`,
        revenue: dailyData[day]
    }));
}
