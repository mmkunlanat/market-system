export async function expireBookings() {
  try {
    const { readFile, writeFile } = await import('fs/promises');
    const { join } = await import('path');
    
    const bookingsFile = join(process.cwd(), 'public', 'bookings.json');

    const now = new Date();

    // Read bookings
    let bookings = [];
    try {
      const data = await readFile(bookingsFile, 'utf-8');
      bookings = JSON.parse(data);
    } catch {
      bookings = [];
    }

    // Find expired bookings
    let modifiedCount = 0;
    bookings = bookings.map(booking => {
      if (booking.status === "pending" && new Date(booking.expiresAt) < now) {
        booking.status = "expired";
        modifiedCount++;
      }
      return booking;
    });

    // Save bookings
    await writeFile(bookingsFile, JSON.stringify(bookings, null, 2), 'utf-8');

    return modifiedCount;
  } catch (error) {
    console.error('Error expiring bookings:', error);
    return 0;
  }
}
