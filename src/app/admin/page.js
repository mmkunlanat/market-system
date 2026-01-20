"use client";
import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "./admin.css";

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalLocks: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingPayments: 0,
    availableLocks: 0,
    chartData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
            <p className="stat-number">{loading ? "..." : stats.totalLocks}</p>
            <p className="stat-label">ว่าง {stats.availableLocks} ห้อง</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <h3>การจองทั้งหมด</h3>
            <p className="stat-number">{loading ? "..." : stats.totalBookings}</p>
            <p className="stat-label">รอชำระ {stats.pendingPayments} รายการ</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <h3>รายได้รวม</h3>
            <p className="stat-number">฿{loading ? "..." : stats.totalRevenue.toLocaleString()}</p>
            <p className="stat-label">ยอดจองรวม (รายได้โดยประมาณ)</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <h3>ผู้ใช้งาน</h3>
            <p className="stat-number">{loading ? "..." : stats.totalUsers}</p>
            <p className="stat-label">พนักงานและสมาชิก</p>
          </div>
        </div>

        <div className="admin-section chart-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>📊 รายได้ในเดือนนี้ (รายวัน)</h2>
            <div className="chart-legend" style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#2563eb' }}></span>
                รายได้รายวัน
              </span>
            </div>
          </div>

          <div className="chart-container" style={{ width: '100%', height: 350, marginTop: '1.5rem' }}>
            {loading ? (
              <div className="chart-loading" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                กำลังโหลดข้อมูลแผนภูมิ...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    interval={2}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `฿${value}`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`฿${value.toLocaleString()}`, 'รายได้']}
                    labelStyle={{ marginBottom: '0.5rem', fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
