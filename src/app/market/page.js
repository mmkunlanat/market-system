import "./market.css";

export default function MarketPage() {
  return (
    <div className="market-container">
      <div className="market-header">
        <h1>🗺️ ผังตลาด</h1>
        <p className="subtitle">การจัดหมวดหมู่ล็อกขายของตามโซน</p>
      </div>

      <div className="market-content">
        <div className="coming-soon">
          <div className="coming-icon">🔨</div>
          <h2>กำลังพัฒนา</h2>
          <p>ฟีเจอร์ผังตลาดกำลังจะเปิดใช้งาน</p>
          <p className="description">เร็ว ๆ นี้คุณจะสามารถดูผังตลาดแบบสมัยใหม่พร้อมระบบหมวดหมู่และค้นหา</p>
        </div>
      </div>

      <div className="features-preview">
        <h3>ฟีเจอร์ที่จะมาถึง</h3>
        <div className="preview-grid">
          <div className="preview-item">
            <span className="preview-icon">🔍</span>
            <span>ค้นหาล็อก</span>
          </div>
          <div className="preview-item">
            <span className="preview-icon">🏷️</span>
            <span>ตัวกรองตามราคา</span>
          </div>
          <div className="preview-item">
            <span className="preview-icon">📍</span>
            <span>แสดงตำแหน่ง</span>
          </div>
          <div className="preview-item">
            <span className="preview-icon">⭐</span>
            <span>ประเมินล็อก</span>
          </div>
        </div>
      </div>
    </div>
  );
}
