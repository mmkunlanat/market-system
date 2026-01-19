"use client";
import { useEffect, useState } from "react";
import "./my-bookings.css";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/bookings");
        if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลการจอง");
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h1>📋 การจองของฉัน</h1>
        <p className="subtitle">ตรวจสอบและจัดการการจองทั้งหมด</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>กำลังโหลดข้อมูลการจอง...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>ยังไม่มีการจอง</h3>
          <p>คุณยังไม่ได้ทำการจองล็อก</p>
          <a href="/booking" className="btn btn-primary">
            <span>📍</span>จองล็อกเดี๋ยวนี้
          </a>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-item">
              <div className="booking-info">
                <h3 className="booking-lock">ล็อก {booking.lockId?.code || booking.lock?.code}</h3>
                <div className="booking-details">
                  <span className="detail">
                    <span className="label">ประเภท:</span>
                    <span className="value">{booking.durationType}</span>
                  </span>
                  <span className="detail">
                    <span className="label">ราคา:</span>
                    <span className="value">฿{booking.totalPrice}</span>
                  </span>
                  <span className="detail">
                    <span className="label">สถานะ:</span>
                    <span className={`status ${booking.status || 'pending'}`}>
                      {booking.status || 'pending'}
                    </span>
                  </span>
                </div>
              </div>
              <button className="btn-action">ดูรายละเอียด →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
