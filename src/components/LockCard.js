import "./LockCard.css";

export default function LockCard({ lock, onSelect, isSelected }) {
  const isAvailable = lock.status === "available";
  
  return (
    <div className={`lock-card ${isSelected ? "selected" : ""} ${!isAvailable ? "unavailable" : ""}`}>
      <div className="lock-status">
        <span className={`status-badge ${isAvailable ? "available" : "unavailable"}`}>
          {isAvailable ? "✓ ว่าง" : "✕ ไม่ว่าง"}
        </span>
      </div>

      <div className="lock-content">
        <h3 className="lock-code">
          <span className="lock-icon">🔓</span>
          ล็อก {lock.code}
        </h3>

        {lock.zoneId && (
          <div className="zone-info">
            <span className="zone-name">{lock.zoneId.name}</span>
          </div>
        )}

        <div className="price-section">
          <p className="price-label">ราคา / วัน</p>
          <p className="price-value">
            <span className="currency">฿</span>
            {lock.zoneId?.pricePerDay || lock.priceDay || "—"}
          </p>
        </div>

        <button
          className={`btn-select ${isAvailable ? "enabled" : "disabled"}`}
          disabled={!isAvailable}
          onClick={() => onSelect(lock)}
        >
          {isAvailable ? "จองล็อกนี้ →" : "ไม่สามารถจองได้"}
        </button>
      </div>
    </div>
  );
}
