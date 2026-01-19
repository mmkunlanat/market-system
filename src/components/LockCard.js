import "./LockCard.css";

export default function LockCard({ lock, zone, onSelect, isSelected }) {
  const isAvailable = lock.status === "available";
  const price = lock.priceOverride || (zone?.pricePerDay);
  
  return (
    <div className={`lock-card ${isSelected ? "selected" : ""} ${!isAvailable ? "unavailable" : ""}`}>
      <div className="lock-header">
        <div className="lock-zone" style={{ backgroundColor: zone?.color || '#ccc' }}>
          <span className="zone-badge">{zone?.code || 'N/A'}</span>
        </div>
        <div className="lock-status">
          <span className={`status-badge ${isAvailable ? "available" : "unavailable"}`}>
            {isAvailable ? "✓ ว่าง" : "✕ ไม่ว่าง"}
          </span>
        </div>
      </div>

      <div className="lock-content">
        <h3 className="lock-code">
          <span className="lock-icon">🔓</span>
          ล็อก {lock.code}
        </h3>

        {zone && (
          <div className="zone-info">
            <span className="zone-name">{zone.name}</span>
            <span className="zone-badge-pill">{zone.badge}</span>
          </div>
        )}

        <div className="lock-details">
          <div className="detail-item">
            <span className="detail-label">📏 ขนาด:</span>
            <span className="detail-value">{lock.size}</span>
          </div>
          {lock.features && lock.features.length > 0 && (
            <div className="detail-item">
              <span className="detail-label">⭐ จุดเด่น:</span>
              <span className="detail-value">{lock.features.join(", ")}</span>
            </div>
          )}
        </div>

        <div className="price-section">
          <p className="price-label">ราคา / วัน</p>
          <p className="price-value">
            <span className="currency">฿</span>
            {price || "—"}
          </p>
          {lock.priceOverride && (
            <p className="price-note">ราคาพิเศษสำหรับขนาดนี้</p>
          )}
        </div>

        <button
          className={`btn-select ${isAvailable ? "enabled" : "disabled"}`}
          disabled={!isAvailable}
          onClick={() => onSelect(lock)}
        >
          {isAvailable ? "เลือกล็อกนี้ →" : "ไม่สามารถจองได้"}
        </button>
      </div>
    </div>
  );
}
