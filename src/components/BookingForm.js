"use client";
import { useState } from "react";
import "./BookingForm.css";

export default function BookingForm({ lock, zone }) {
  const [durationType, setDurationType] = useState("day");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getPrice = () => {
    const basePrice = lock.priceOverride || zone?.pricePerDay;
    
    const multipliers = {
      day: 1,
      week: 7,
      month: 30,
    };
    
    return basePrice * (multipliers[durationType] || 1);
  };

  const durationTexts = {
    day: "รายวัน",
    week: "รายสัปดาห์ (7 วัน)",
    month: "รายเดือน (30 วัน)",
  };

  const calculateEndDate = () => {
    if (!startDate) return null;
    
    const start = new Date(startDate);
    const days = durationType === "day" ? 1 : durationType === "week" ? 7 : 30;
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    
    return end.toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  async function handleBooking() {
    if (!startDate) {
      alert("กรุณาเลือกวันเริ่มต้น");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lockId: lock._id,
          lockCode: lock.code,
          zoneId: zone?._id,
          zoneName: zone?.name,
          durationType,
          startDate,
          totalPrice: getPrice(),
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setDurationType("day");
          setStartDate("");
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

  const price = getPrice();
  const endDate = calculateEndDate();

  return (
    <div className="booking-form">
      <div className="form-header">
        <h2>🎫 สรุปการจอง</h2>
        <p>ล็อก {lock.code} • {zone?.name}</p>
      </div>

      <div className="form-body">
        <div className="lock-overview">
          <div className="overview-item">
            <span className="label">รหัสล็อก:</span>
            <span className="value">{lock.code}</span>
          </div>
          <div className="overview-item">
            <span className="label">โซน:</span>
            <span className="value">{zone?.code} - {zone?.name}</span>
          </div>
          <div className="overview-item">
            <span className="label">ขนาด:</span>
            <span className="value">{lock.size}</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="duration" className="form-label">
            เลือกระยะเวลาการจอง
          </label>
          <select
            id="duration"
            className="form-select"
            value={durationType}
            onChange={e => setDurationType(e.target.value)}
            disabled={loading}
          >
            <option value="day">📅 รายวัน (1 วัน)</option>
            <option value="week">📆 รายสัปดาห์ (7 วัน)</option>
            <option value="month">📅 รายเดือน (30 วัน)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="startDate" className="form-label">
            เลือกวันเริ่มต้น
          </label>
          <input
            id="startDate"
            type="date"
            className="form-select"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            min={getTodayDate()}
            disabled={loading}
          />
        </div>

        {startDate && (
          <div className="date-preview">
            <div className="preview-item">
              <span className="label">🗓️ วันเริ่มต้น:</span>
              <span className="value">
                {new Date(startDate).toLocaleDateString('th-TH', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="preview-item">
              <span className="label">📅 วันสิ้นสุด:</span>
              <span className="value">{endDate}</span>
            </div>
          </div>
        )}

        <div className="price-breakdown">
          <div className="breakdown-row">
            <span className="breakdown-label">ล็อก:</span>
            <span className="breakdown-value">{lock.code}</span>
          </div>
          <div className="breakdown-row">
            <span className="breakdown-label">ประเภท:</span>
            <span className="breakdown-value">{durationTexts[durationType]}</span>
          </div>
          <div className="breakdown-row">
            <span className="breakdown-label">ราคา / {durationType === 'day' ? 'วัน' : 'งวด'}:</span>
            <span className="breakdown-value">฿{lock.priceOverride || zone?.pricePerDay}</span>
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
          disabled={loading || success || !startDate}
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
