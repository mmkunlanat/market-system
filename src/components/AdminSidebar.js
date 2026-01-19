import Link from "next/link";
import "./admin-sidebar.css";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>หมวดควบคุม</h2>
      </div>

      <nav className="sidebar-nav">
        <Link href="/admin" className="nav-item active">
          <span className="nav-icon">📊</span>
          <span className="nav-text">หน้าแรก</span>
        </Link>

        <Link href="/admin/locks" className="nav-item">
          <span className="nav-icon">📍</span>
          <span className="nav-text">จัดการล็อก</span>
        </Link>

        <Link href="/admin/zones" className="nav-item">
          <span className="nav-icon">🏢</span>
          <span className="nav-text">จัดการโซน</span>
        </Link>

        <Link href="/admin/bookings" className="nav-item">
          <span className="nav-icon">📋</span>
          <span className="nav-text">จัดการการจอง</span>
        </Link>

        <Link href="/admin/payments" className="nav-item">
          <span className="nav-icon">💳</span>
          <span className="nav-text">จัดการการชำระเงิน</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <span>🚪</span>
          ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}
