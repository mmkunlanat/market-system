"use client";
import { useEffect, useState } from "react";
import LockCard from "@/components/LockCard";
import BookingForm from "@/components/BookingForm";
import "./booking.css";

export default function BookingPage() {
  const [locks, setLocks] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedLock, setSelectedLock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch zones
        const zonesRes = await fetch("/api/zones");
        if (!zonesRes.ok) throw new Error("ไม่สามารถโหลดข้อมูลโซน");
        const zonesData = await zonesRes.json();
        setZones(zonesData);

        // Fetch locks
        const locksRes = await fetch("/api/locks");
        if (!locksRes.ok) throw new Error("ไม่สามารถโหลดข้อมูลล็อก");
        const locksData = await locksRes.json();
        setLocks(locksData);
        
        setError(null);
      } catch (err) {
        console.error(err);
        setError("โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredLocks = selectedZone 
    ? locks.filter(lock => lock.zoneId === selectedZone)
    : locks;

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
      ) : (
        <>
          {/* Zone Filter */}
          <div className="zone-filter">
            <h3>เลือกโซน</h3>
            <div className="zone-buttons">
              <button 
                className={`zone-btn ${!selectedZone ? 'active' : ''}`}
                onClick={() => setSelectedZone(null)}
              >
                <span>📍</span> ทั้งหมด ({locks.length})
              </button>
              {zones.map(zone => (
                <button
                  key={zone._id}
                  className={`zone-btn ${selectedZone === zone._id ? 'active' : ''}`}
                  onClick={() => setSelectedZone(zone._id)}
                  style={{
                    borderColor: zone.color,
                    backgroundColor: selectedZone === zone._id ? zone.color : 'transparent'
                  }}
                >
                  <span>{zone.code}</span> {zone.name} ({locks.filter(l => l.zoneId === zone._id).length})
                </button>
              ))}
            </div>
          </div>

          {filteredLocks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>ไม่มีล็อกขายของในโซนนี้</h3>
              <p>ไม่มีล็อกว่างให้จองในตอนนี้ กรุณากลับมาใหม่ในภายหลัง</p>
            </div>
          ) : (
            <>
              <div className="locks-grid">
                {filteredLocks.map(lock => {
                  const zone = zones.find(z => z._id === lock.zoneId);
                  return (
                    <div key={lock._id} onClick={() => setSelectedLock(lock)}>
                      <LockCard
                        lock={lock}
                        zone={zone}
                        onSelect={setSelectedLock}
                        isSelected={selectedLock?._id === lock._id}
                      />
                    </div>
                  );
                })}
              </div>

              {selectedLock && (
                <div className="booking-form-container">
                  <BookingForm 
                    lock={selectedLock}
                    zone={zones.find(z => z._id === selectedLock.zoneId)}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
