"use client";
import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "../admin.css";

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/bookings"); // Using existing booking API
            const data = await res.json();
            // Sort by latest first
            const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
            setBookings(sortedData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredBookings = bookings.filter(b =>
        b.lockCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b._id.includes(searchTerm)
    );

    return (
        <div className="admin-container">
            <AdminSidebar />
            <div className="admin-content">
                <div className="admin-header">
                    <h1>📋 จัดการการจอง (Bookings)</h1>
                    <p>ตรวจสอบสถานะการจองแผงค้าทั้งหมดในระบบ</p>
                </div>

                <div className="admin-section">
                    <div className="filter-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <div className="filter-group">
                            <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>ค้นหารหัสการจอง / รหัสแผง</label>
                            <input
                                type="text"
                                className="btn-secondary btn-sm"
                                style={{ padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', width: '300px' }}
                                placeholder="ระบุรหัสแผง หรือ ID การจอง..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-end', height: '38px' }} onClick={fetchData} disabled={loading}>
                            {loading ? '...' : '🔄 รีเฟรช'}
                        </button>
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID การจอง</th>
                                <th>ข้อมูลแผงค้า</th>
                                <th>วันที่เริ่ม</th>
                                <th>วันที่สิ้นสุด</th>
                                <th>ประเภท</th>
                                <th>ราคารวม</th>
                                <th>สถานะการจอง</th>
                                <th>สถานะชำระเงิน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                        ไม่พบข้อมูลการจอง
                                    </td>
                                </tr>
                            )}
                            {filteredBookings.map((b) => (
                                <tr key={b._id}>
                                    <td><code style={{ fontSize: '0.8rem' }}>{b._id}</code></td>
                                    <td>
                                        <strong>{b.lockCode}</strong><br />
                                        <small style={{ color: '#64748b' }}>{b.zoneName}</small>
                                    </td>
                                    <td>{new Date(b.startDate).toLocaleDateString('th-TH')}</td>
                                    <td>{b.endDate ? new Date(b.endDate).toLocaleDateString('th-TH') : '-'}</td>
                                    <td>
                                        {b.durationType === 'day' ? 'รายวัน' :
                                            b.durationType === 'week' ? 'รายสัปดาห์' : 'รายเดือน'}
                                    </td>
                                    <td><strong>฿{b.totalPrice?.toLocaleString()}</strong></td>
                                    <td>
                                        <span className={`status-badge ${b.status}`}>
                                            {b.status === 'pending' ? '⏳ รอตรวจสอบ' :
                                                b.status === 'confirmed' ? '✅ ยืนยันแล้ว' :
                                                    b.status === 'cancelled' ? '❌ ยกเลิก' : b.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${b.paymentStatus || 'unpaid'}`}>
                                            {b.paymentStatus === 'paid' ? '💰 ชำระแล้ว' : '🕒 ยังไม่ชำระ'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
