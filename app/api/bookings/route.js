const EXPIRE_MINUTES = 15;

const expiresAt = new Date(
  Date.now() + EXPIRE_MINUTES * 60 * 1000
);

const booking = await Booking.create({
  lockId,
  durationType,
  totalPrice,
  expiresAt,
});
