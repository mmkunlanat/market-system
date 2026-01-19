"use client";
import { useEffect, useState } from "react";
import LockCard from "@/components/LockCard";
import BookingForm from "@/components/BookingForm";
import "./booking.css";

export default function BookingPage() {
  const [locks, setLocks] = useState([]);
  const [selectedLock, setSelectedLock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/locks")
      .then(async res => {
        if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลล็อก");
        return res.json();
      })
      .then(data => {
        setLocks(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h1>📍 เลือกล็อกขายของ</h1>
        <p className="subtitle">เลือกล็อกที่เหมาะสมกับความต้องการของคุณ</p>
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
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      ) : locks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>ไม่มีล็อกขายของ</h3>
          <p>ไม่มีล็อกว่างให้จองในตอนนี้ กรุณากลับมาใหม่ในภายหลัง</p>
        </div>
      ) : (
        <>
          <div className="locks-grid">
            {locks.map(lock => (
              <div key={lock._id} onClick={() => setSelectedLock(lock)}>
                <LockCard
                  lock={lock}
                  onSelect={setSelectedLock}
                  isSelected={selectedLock?._id === lock._id}
                />
              </div>
            ))}
          </div>

          {selectedLock && (
            <div className="booking-form-container">
              <BookingForm lock={selectedLock} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
