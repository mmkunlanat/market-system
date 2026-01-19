import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <h4 className="footer-title">🏪 Market Booking</h4>
            <p className="footer-description">
              ระบบการจองล็อกตลาดนัดที่ทันสมัยและง่ายต่อการใช้งาน
            </p>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">ลิงค์ด่วน</h4>
            <ul className="footer-links">
              <li><a href="/">หน้าแรก</a></li>
              <li><a href="/booking">จองล็อก</a></li>
              <li><a href="/market">ผังตลาด</a></li>
              <li><a href="/my-bookings">การจองของฉัน</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">ติดต่อเรา</h4>
            <ul className="footer-links">
              <li><a href="tel:">โทร: 089-123-4567</a></li>
              <li><a href="mailto:">อีเมล: info@market.com</a></li>
              <li>เปิดวันจันทร์ - วันศุกร์ 8:00-18:00</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-title">สิ่งที่สำคัญ</h4>
            <ul className="footer-links">
              <li><a href="#">นโยบายความเป็นส่วนตัว</a></li>
              <li><a href="#">เงื่อนไขการใช้งาน</a></li>
              <li><a href="#">ความปลอดภัยและความโปร่งใส</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Market Booking System. สงวนลิขสิทธิ์ทั้งหมด</p>
          <div className="social-links">
            <a href="#" className="social-link">Facebook</a>
            <a href="#" className="social-link">Line</a>
            <a href="#" className="social-link">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
