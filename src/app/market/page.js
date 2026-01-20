"use client";
import { useEffect, useState } from "react";
import "./market.css";

export default function MarketPage() {
  const [locks, setLocks] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zonesRes, locksRes, bookingsRes] = await Promise.all([
          fetch("/api/zones"),
          fetch("/api/locks"),
          fetch("/api/bookings")
        ]);
        const zonesData = await zonesRes.json();
        const locksData = await locksRes.json();
        const bookingsData = await bookingsRes.json();
        setZones(zonesData);
        setLocks(locksData);
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="market-container">
        <div className="loading-state">กำลังโหลดผังตลาด...</div>
      </div>
    );
  }

  const zoneA = locks.filter(l => l.zoneId === "zone-a");
  const zoneB = locks.filter(l => l.zoneId === "zone-b");
  const zoneC = locks.filter(l => l.zoneId === "zone-c");

  // Helper function to group stalls into blocks
  const groupStalls = (stalls, size) => {
    const groups = [];
    for (let i = 0; i < stalls.length; i += size) {
      groups.push(stalls.slice(i, i + size));
    }
    return groups;
  };

  const renderStallGroup = (stalls, bgColor, textColor = "black") => {
    const groups = groupStalls(stalls, 2); // Group by 2 stalls
    return (
      <div className="stall-zone-container">
        {groups.map((group, gIndex) => (
          <div key={gIndex} className="stall-group-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="stall-group">
              {group.map(lock => {
                const isUnavailable = lock.status === "unavailable" || lock.status === "booked";
                const booking = bookings.find(b => b.lockId === lock._id && (b.status === "confirmed" || b.status === "pending"));

                let tooltip = `${lock.code}: ${lock.zoneName}`;
                if (isUnavailable) {
                  tooltip += " (ไม่ว่าง)";
                  if (booking) {
                    const startStr = new Date(booking.startDate).toLocaleDateString('th-TH');
                    const endStr = new Date(booking.endDate).toLocaleDateString('th-TH');
                    tooltip += `\nเช่าตั้งแต่วันที่: ${startStr}\nหมดเขตวันที่: ${endStr}`;
                  }
                }

                return (
                  <div
                    key={lock._id}
                    className={`stall ${isUnavailable ? 'unavailable' : ''}`}
                    style={{
                      backgroundColor: isUnavailable ? '#e2e8f0' : bgColor,
                      color: isUnavailable ? '#94a3b8' : textColor,
                      cursor: isUnavailable ? 'not-allowed' : 'pointer',
                      textDecoration: isUnavailable ? 'line-through' : 'none'
                    }}
                    title={tooltip}
                  >
                    <span className="stall-code">{lock.code}</span>
                    <span className="stall-label">{isUnavailable ? 'จองแล้ว' : 'แผง'}</span>
                  </div>
                );
              })}
            </div>
            {gIndex < groups.length - 1 && <div className="internal-walkway"></div>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="market-container">
      <div className="market-header">
        <h1>🗺️ ผังตลาดนัด</h1>
        <p className="subtitle">แผนผังแสดงตำแหน่งแผงค้าและโซนต่างๆ พร้อมทางเดินที่ชัดเจน</p>
      </div>

      <div className="market-legend">
        {zones.map(zone => (
          <div key={zone._id} className="legend-item">
            <div className="color-box" style={{ backgroundColor: zone.color }}></div>
            <span>{zone.name}</span>
          </div>
        ))}
        <div className="legend-item unavailable">
          <div className="color-box"></div>
          <span>ไม่ว่าง / ถูกจองแล้ว</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}></div>
          <span>ทางเดิน / ช่องว่าง</span>
        </div>
      </div>

      <div className="market-map-layout">
        <div className="entrance-main">▲ ทางเข้าหลัก (MAIN ENTRANCE) ▲</div>

        <div className="market-grid-container">
          {/* Row 1: Zone A (Strongest Area) */}
          <div className="market-row">
            <div className="side-entrance">ทางเข้า 2</div>
            <div className="walkway-vertical">ทางเดิน A</div>
            {renderStallGroup(zoneA, "#FFEB3B")}
            <div className="walkway-vertical">ทางเดินหลัก</div>
          </div>

          <div className="walkway-horizontal">ทางเดินเชื่อมโซน - MAIN WALKWAY</div>

          {/* Row 2: Zone B (Normal Area) */}
          <div className="market-row">
            <div className="walkway-vertical">ซอย B1</div>
            {renderStallGroup(zoneB, "#2196F3", "white")}
            <div className="walkway-vertical">ซอย B2</div>
          </div>

          <div className="walkway-horizontal">ทางเดินกลางตลาด</div>

          {/* Row 3: Zone C (Value Area) + Stage */}
          <div className="market-row">
            <div className="side-entrance">ทางเข้า 3</div>
            <div className="walkway-vertical">ซอย C1</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', width: '100%' }}>
              {renderStallGroup(zoneC, "#4CAF50", "white")}

              <div className="special-zones-container">
                <div className="stage-area">
                  <span>🎭</span> เวทีกิจกรรมกลาง (MAIN STAGE)
                </div>
                <div className="dining-area">
                  <span>🍱</span> โซนนั่งเล่นและทานอาหาร (DINING & SEATING)
                  <div className="dining-tables">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="dining-table">🪑</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="walkway-vertical">ซอย C2</div>
          </div>
        </div>

        <div className="entrance-main">▼ ทางเข้าท้ายตลาด ▼</div>
      </div>

      <div className="market-footer">
        <p>* ผังตลาดจำลองเพื่อช่วยในการตัดสินใจเลือกทำเล</p>
        <p>* คลิกเพื่อดูรายละเอียดหรือจองล็อกในหน้าจองหลัก</p>
      </div>
    </div>
  );
}
