"use client";
import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "../admin.css";

export default function AdminLocks() {
    const [locks, setLocks] = useState([]);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterZone, setFilterZone] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [locksRes, zonesRes] = await Promise.all([
                fetch("/api/admin/locks"),
                fetch("/api/zones")
            ]);
            const locksData = await locksRes.json();
            const zonesData = await zonesRes.json();
            setLocks(locksData);
            setZones(zonesData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleStatus = async (lockId, currentStatus) => {
        const newStatus = currentStatus === "available" ? "unavailable" : "available";
        if (!confirm(`ต้องการเปลี่ยนสถานะแผงค้านี้เป็น "${newStatus === 'available' ? 'ว่าง' : 'ไม่ว่าง'}" ใช่หรือไม่?`)) return;

        setLoading(true);
        try {
            const res = await fetch("/api/admin/locks", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lockId, status: newStatus }),
            });

            if (res.ok) {
                fetchData();
            } else {
                alert("อัปเดตสถานะล้มเหลว");
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const filteredLocks = locks.filter(lock => {
        const matchesZone = filterZone === "all" || lock.zoneId === filterZone;
        const matchesSearch = lock.code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesZone && matchesSearch;
    });

    return (
        <div className="admin-container">
            <AdminSidebar />
            <div className="admin-content">
                <div className="admin-header">
                    <h1>📍 จัดการแผงค้า (Locks)</h1>
                    <p>ตั้งค่าสถานะแผงค้า เปิด/ปิดการจอง และจัดการข้อมูลทั่วไป</p>
                </div>

                <div className="admin-section">
                    <div className="filter-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <div className="filter-group">
                            <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>ค้นหารหัส</label>
                            <input
                                type="text"
                                className="btn-secondary btn-sm"
                                style={{ padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                placeholder="ระบุรหัสแผง..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>เลือกโซน</label>
                            <select
                                className="btn-secondary btn-sm"
                                style={{ padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', height: 'auto' }}
                                value={filterZone}
                                onChange={(e) => setFilterZone(e.target.value)}
                            >
                                <option value="all">ทั้งหมดทุกโซน</option>
                                {zones.map(z => (
                                    <option key={z._id} value={z._id}>{z.name}</option>
                                ))}
                            </select>
                        </div>
                        <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-end', height: '38px' }} onClick={fetchData} disabled={loading}>
                            {loading ? '...' : 'รีเฟรช'}
                        </button>
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>รหัสแผง</th>
                                <th>โซน</th>
                                <th>ขนาด</th>
                                <th>ราคา</th>
                                <th>สถานะปัจจุบัน</th>
                                <th>การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLocks.map((lock) => {
                                const zone = zones.find(z => z._id === lock.zoneId);
                                const displayPrice = lock.priceOverride || zone?.pricePerDay;

                                return (
                                    <tr key={lock._id}>
                                        <td><strong>{lock.code}</strong></td>
                                        <td>{lock.zoneName}</td>
                                        <td>{lock.size}</td>
                                        <td>
                                            <span className="price-tag">
                                                ฿{displayPrice ? displayPrice.toLocaleString() : '-'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${lock.status}`}>
                                                {lock.status === 'available' ? '✅ ว่าง' :
                                                    lock.status === 'unavailable' ? '🚫 ไม่ว่าง' : lock.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${lock.status === 'available' ? 'btn-danger' : 'btn-success'}`}
                                                onClick={() => toggleStatus(lock._id, lock.status)}
                                                disabled={loading}
                                            >
                                                {lock.status === 'available' ? 'ปิดการจอง' : 'เปิดให้จอง'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
