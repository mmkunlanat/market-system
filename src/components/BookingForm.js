"use client";
import { useState } from "react";
import "./BookingForm.css";

export default function BookingForm({ lock }) {
  const [durationType, setDurationType] = useState("day");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const price =
    durationType === "day"
      ? lock.zoneId?.pricePerDay || lock.priceDay
      : durationType === "week"
      ? lock.zoneId?.pricePerWeek || lock.priceWeek
      : lock.zoneId?.pricePerMonth || lock.priceMonth;

  const durationTexts = {
    day: "รายวัน",
    week: "รายสัปดาห์",
    month: "รายเดือน"
  };

  async function handleBooking() {
    setLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lockId: lock._id,
          durationType,
          totalPrice: price,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setDurationType("day");
        }, 3000);
      } else {
        alert("การจองล้มเหลว กรุณาลองใหม่");
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="booking-form">
      <div className="form-header">
        <h2>🎫 สรุปการจอง</h2>
        <p>ล็อก {lock.code} • {lock.zoneId?.name}</p>
      </div>

      <div className="form-body">
        <div className="form-group">
          <label htmlFor="duration" className="form-label">
            ระยะเวลาการจอง
          </label>
          <select
            id="duration"
            className="form-select"
            value={durationType}
            onChange={e => setDurationType(e.target.value)}
            disabled={loading}
          >
            <option value="day">📅 รายวัน</option>
            <option value="week">📆 รายสัปดาห์</option>
            <option value="month">📅 รายเดือน</option>
          </select>
        </div>

        <div className="price-breakdown">
          <div className="breakdown-row">
            <span className="breakdown-label">ล็อก:</span>
            <span className="breakdown-value">{lock.code}</span>
          </div>
          <div className="breakdown-row">
            <span className="breakdown-label">ประเภท:</span>
            <span className="breakdown-value">{durationTexts[durationType]}</span>
          </div>
          <div className="breakdown-row total">
            <span className="breakdown-label">ราคารวม:</span>
            <span className="breakdown-value">฿{price}</span>
          </div>
        </div>

        {success && (
          <div className="success-message">
            <span className="success-icon">✓</span>
            <p>จองสำเร็จแล้ว! กรุณาชำระเงิน</p>
          </div>
        )}

        <button
          className="btn-confirm"
          onClick={handleBooking}
          disabled={loading || success}
        >
          {loading ? (
            <>
              <span className="spinner-small"></span>
              กำลังประมวลผล...
            </>
          ) : success ? (
            <>
              <span>✓</span>
              จองสำเร็จ
            </>
          ) : (
            <>
              <span>💳</span>
              ยืนยันการจอง
            </>
          )}
        </button>
      </div>
    </div>
  );
}
