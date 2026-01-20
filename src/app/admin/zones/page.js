"use client";
import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "../admin.css";

export default function AdminZones() {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/zones");
            const data = await res.json();
            setZones(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="admin-container">
            <AdminSidebar />
            <div className="admin-content">
                <div className="admin-header">
                    <h1>🏢 จัดการโซน (Zones)</h1>
                    <p>ตั้งค่าข้อมูลโซนและราคาเช่าแผงค้า</p>
                </div>

                <div className="admin-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2>📋 รายการโซนทั้งหมด</h2>
                        <button className="btn btn-secondary btn-sm" onClick={fetchData} disabled={loading}>
                            {loading ? '...' : 'รีเฟรช'}
                        </button>
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>โซน</th>
                                <th>คำอธิบาย</th>
                                <th>สีประจำโซน</th>
                                <th>ราคารายวัน</th>
                                <th>ราคารายสัปดาห์</th>
                                <th>ราคารายเดือน</th>
                                <th>จุดเด่น</th>
                            </tr>
                        </thead>
                        <tbody>
                            {zones.map((zone) => (
                                <tr key={zone._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                backgroundColor: zone.color,
                                                boxShadow: '0 0 0 1px #e2e8f0'
                                            }}></div>
                                            <strong>{zone.name}</strong>
                                        </div>
                                        <small style={{ color: '#64748b' }}>Code: {zone.code}</small>
                                    </td>
                                    <td>{zone.description}</td>
                                    <td>
                                        <code style={{ fontSize: '0.8rem' }}>{zone.color}</code>
                                    </td>
                                    <td>
                                        <span className="price-tag">฿{zone.pricePerDay?.toLocaleString()}</span>
                                    </td>
                                    <td>
                                        <span className="price-tag">฿{zone.pricePerWeek?.toLocaleString()}</span>
                                    </td>
                                    <td>
                                        <span className="price-tag">฿{zone.pricePerMonth?.toLocaleString()}</span>
                                    </td>
                                    <td>
                                        <span className="badge badge-info">{zone.badge}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
        .price-tag {
          font-weight: 700;
          color: var(--primary);
        }
      `}</style>
        </div>
    );
}
