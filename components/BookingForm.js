"use client";
import { useState } from "react";

export default function BookingForm({ lock }) {
  const [durationType, setDurationType] = useState("day");
  const [loading, setLoading] = useState(false);

  const price =
    durationType === "day"
      ? lock.zoneId.pricePerDay
      : durationType === "week"
      ? lock.zoneId.pricePerWeek
      : lock.zoneId.pricePerMonth;

  async function handleBooking() {
    setLoading(true);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lockId: lock._id,
        durationType,
        totalPrice: price,
      }),
    });

    const data = await res.json();
    setLoading(false);

    alert("สร้างการจองแล้ว กรุณาชำระเงิน");
    console.log("BOOKING:", data);
  }

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5>🧾 จองล็อก {lock.code}</h5>

        <select
          className="form-select my-2"
          value={durationType}
          onChange={e => setDurationType(e.target.value)}
        >
          <option value="day">รายวัน</option>
          <option value="week">รายสัปดาห์</option>
          <option value="month">รายเดือน</option>
        </select>

        <p>ราคารวม: <b>฿{price}</b></p>

        <button
          className="btn btn-success"
          onClick={handleBooking}
          disabled={loading}
        >
          {loading ? "กำลังจอง..." : "ยืนยันการจอง"}
        </button>
      </div>
    </div>
  );
}
