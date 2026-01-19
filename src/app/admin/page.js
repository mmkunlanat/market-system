import AdminSidebar from "@/components/AdminSidebar";
import "./admin.css";

export default function AdminPage() {
  return (
    <div className="admin-container">
      <AdminSidebar />
      
      <div className="admin-content">
        <div className="admin-header">
          <h1>⚙️ Admin Dashboard</h1>
          <p>ยินดีต้อนรับสู่แผงควบคุมผู้ดูแลระบบ</p>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <h3>ล็อกทั้งหมด</h3>
            <p className="stat-number">--</p>
            <p className="stat-label">รอการเชื่อมต่อ</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <h3>การจองทั้งหมด</h3>
            <p className="stat-number">--</p>
            <p className="stat-label">รอการเชื่อมต่อ</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <h3>รายได้รวม</h3>
            <p className="stat-number">฿--</p>
            <p className="stat-label">รอการเชื่อมต่อ</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <h3>ผู้ใช้งาน</h3>
            <p className="stat-number">--</p>
            <p className="stat-label">รอการเชื่อมต่อ</p>
          </div>
        </div>

        <div className="admin-section">
          <h2>📊 สถิติล่าสุด</h2>
          <div className="coming-soon-box">
            <p>กำลังพัฒนาแผนภูมิและสถิติ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
