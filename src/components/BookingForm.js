"use client";
import { useState } from "react";

export default function BookingForm({ lock }) {
  const [durationType, setDurationType] = useState("day");

  const price =
    durationType === "day"
      ? lock.zoneId.pricePerDay
      : durationType === "week"
      ? lock.zoneId.pricePerWeek
      : lock.zoneId.pricePerMonth;

  async function handleBooking() {
    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lockId: lock._id,
        durationType,
        totalPrice: price,
      }),
    });

    alert("จองสำเร็จ กรุณาชำระเงิน");
  }

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5>จองล็อก {lock.code}</h5>

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

        <button className="btn btn-success" onClick={handleBooking}>
          ยืนยันการจอง
        </button>
      </div>
    </div>
  );
}
