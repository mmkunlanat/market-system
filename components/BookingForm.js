"use client";

import { useState } from "react";

export default function BookingForm({ lock }) {
  const [duration, setDuration] = useState("day");

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h4>จองล็อก {lock.code}</h4>

        <label className="form-label">ระยะเวลาจอง</label>
        <select
          className="form-select mb-3"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        >
          <option value="day">1 วัน</option>
          <option value="week">1 สัปดาห์</option>
          <option value="month">1 เดือน</option>
        </select>

        <button className="btn btn-success">
          ยืนยันการจอง
        </button>
      </div>
    </div>
  );
}
