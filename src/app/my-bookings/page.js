"use client";
import { useEffect, useState } from "react";
import "./my-bookings.css";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/bookings");
        if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลการจอง");
        const data = await response.json();

        // เรียงลำดับตามวันที่จองล่าสุด
        const sortedData = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];

        setBookings(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const closeModal = () => setSelectedBooking(null);

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h1>📋 การจองของฉัน</h1>
        <p className="subtitle">ตรวจสอบและจัดการการจองทั้งหมดของคุณ</p>
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
          <p>คุณยังไม่ได้ทำการจองล็อกในขณะนี้</p>
          <a href="/market" className="btn btn-primary">
            <span>📍</span>ไปที่ผังตลาดเพื่อจอง
          </a>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-item">
              <div className="booking-info">
                <div className="booking-main-info">
                  <h3 className="booking-lock">ล็อก {booking.lockCode}</h3>
                  <span className={`status ${booking.status || 'pending'}`}>
                    {booking.status === 'pending' ? '⏳ รอตรวจสอบ' :
                      booking.status === 'confirmed' ? '✅ ยืนยันแล้ว' :
                        booking.status === 'cancelled' ? '❌ ยกเลิก' : booking.status}
                  </span>
                </div>
                <div className="booking-details-summary">
                  <span className="detail">
                    <span className="label">โซน:</span>
                    <span className="value">{booking.zoneName}</span>
                  </span>
                  <span className="detail">
                    <span className="label">เริ่มเช่า:</span>
                    <span className="value">{new Date(booking.startDate).toLocaleDateString('th-TH')}</span>
                  </span>
                </div>
              </div>
              <button
                className="btn-action"
                onClick={() => setSelectedBooking(booking)}
              >
                ดูรายละเอียด →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal รายละเอียดการจอง */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🎫 รายละเอียดการจอง</h2>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-card">
                  <span className="icon">📍</span>
                  <div className="content">
                    <label>รหัสล็อก</label>
                    <p>{selectedBooking.lockCode}</p>
                  </div>
                </div>
                <div className="detail-card">
                  <span className="icon">🗺️</span>
                  <div className="content">
                    <label>โซน</label>
                    <p>{selectedBooking.zoneName}</p>
                  </div>
                </div>
                <div className="detail-card">
                  <span className="icon">📅</span>
                  <div className="content">
                    <label>ประเภทการเช่า</label>
                    <p>{selectedBooking.durationType === 'day' ? 'รายวัน' :
                      selectedBooking.durationType === 'week' ? 'รายสัปดาห์' : 'รายเดือน'}</p>
                  </div>
                </div>
                <div className="detail-card">
                  <span className="icon">💰</span>
                  <div className="content">
                    <label>ราคารวม</label>
                    <p>฿{selectedBooking.totalPrice?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="period-container">
                <div className="period-box">
                  <label>🗓️ วันเริ่มต้นเช่า</label>
                  <p>{new Date(selectedBooking.startDate).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                <div className="period-box expiry">
                  <label>⌛ วันหมดเขต (สิ้นสุด)</label>
                  <p>{selectedBooking.endDate ? new Date(selectedBooking.endDate).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : '-'}</p>
                </div>
              </div>

              <div className="booking-meta">
                <p><strong>รหัสการจอง:</strong> {selectedBooking._id}</p>
                <p><strong>จองเมื่อวันที่:</strong> {new Date(selectedBooking.createdAt).toLocaleString('th-TH')}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-close-modal" onClick={closeModal}>ปิดหน้าต่าง</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
