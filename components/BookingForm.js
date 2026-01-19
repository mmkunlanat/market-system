"use client";
import { useState } from "react";

export default function BookingForm({ lock }) {
  const [duration, setDuration] = useState("day");
  const [message, setMessage] = useState("");

  const priceMap = {
    day: lock.priceDay,
    week: lock.priceDay * 7,
    month: lock.priceDay * 30,
  };

  const handleBooking = async () => {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lockId: lock.id,
        durationType: duration,
        totalPrice: priceMap[duration],
      }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="card p-4 mt-3">
      <h4>📝 จองล็อก {lock.code}</h4>

      <select
        className="form-select mb-3"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      >
        <option value="day">1 วัน</option>
        <option value="week">1 สัปดาห์</option>
        <option value="month">1 เดือน</option>
      </select>

      <div className="alert alert-info">
        ราคารวม {priceMap[duration]} บาท
      </div>

      <button className="btn btn-success" onClick={handleBooking}>
        ยืนยันการจอง
      </button>

      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
