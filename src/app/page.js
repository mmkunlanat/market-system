import Link from "next/link";
import "./home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            ระบบจองล็อกตลาดนัด
          </h1>
          <p className="hero-subtitle">
            ระบบการจองล็อกขายของที่ง่ายและสะดวก ด้วยการจัดการแบบสมัยใหม่
          </p>
          <div className="hero-buttons">
            <Link href="/booking" className="btn btn-primary btn-lg">
              <span className="btn-icon">📍</span>จองล็อกเดี๋ยวนี้
            </Link>
            <Link href="/my-bookings" className="btn btn-secondary btn-lg">
              <span className="btn-icon">📋</span>ดูการจองของฉัน
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="floating-card">🏪</div>
          <div className="floating-card" style={{ animationDelay: "0.5s" }}>📍</div>
          <div className="floating-card" style={{ animationDelay: "1s" }}>✨</div>
        </div>
      </div>

      <div className="features-section">
        <h2>ทำไมต้องใช้เรา</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>ง่าย &amp; เร็ว</h3>
            <p>จองล็อกได้ในไม่กี่คลิก ไม่ต้องยุ่งยากซับซ้อน</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>ราคาโปร่งใส</h3>
            <p>ราคาตั้งแต่รายวัน รายสัปดาห์ ถึงรายเดือน</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>ปลอดภัย</h3>
            <p>ระบบล็อคขายของของคุณได้อย่างปลอดภัย</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>บนมือถือ</h3>
            <p>ใช้งานได้บนทุกอุปกรณ์ สะดวกทุกที่ทุกเวลา</p>
          </div>
        </div>
      </div>
    </div>
  );
}
