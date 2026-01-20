"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import "../admin.css";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = () => {
    setLoading(true);
    fetch("/api/admin/payments")
      .then((res) => res.json())
      .then(data => {
        setPayments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAction = async (id, action) => {
    if (!confirm(`คุณต้องการ ${action === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ'} รายการนี้ใช่หรือไม่?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        fetchPayments();
      } else {
        alert("การดำเนินการล้มเหลว");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด");
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>💳 จัดการการชำระเงิน</h1>
          <p>ตรวจสอบและอนุมัติหลักฐานการโอนเงินจากลูกค้า</p>
        </div>

        <div className="admin-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>📋 รายการที่รอการตรวจสอบ</h2>
            <button className="btn btn-secondary btn-sm" onClick={fetchPayments} disabled={loading}>
              {loading ? 'กำลังโหลด...' : '🔄 รีเฟรช'}
            </button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>ข้อมูลแผงค้า</th>
                <th>ยอดเงิน</th>
                <th>หลักฐาน (Slip)</th>
                <th>ช่องทาง</th>
                <th>สถานะ</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    ไม่มีรายการชำระเงินในขณะนี้
                  </td>
                </tr>
              )}
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{new Date(p.createdAt).toLocaleDateString('th-TH')}</td>
                  <td>
                    <strong>{p.bookingDetails?.lockCode}</strong><br />
                    <small style={{ color: '#64748b' }}>{p.bookingDetails?.zoneName}</small>
                  </td>
                  <td>฿{p.amount?.toLocaleString()}</td>
                  <td>
                    {p.slipImage && p.slipImage !== "Credit Card Payment" ? (
                      <a href={p.slipImage} target="_blank" className="btn-view-slip">
                        🖼️ ดูรูปสลิป
                      </a>
                    ) : (
                      <span className="text-secondary">ไม่มี (Credit Card)</span>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-info">{p.paymentMethod || 'N/A'}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${p.status}`}>
                      {p.status === 'pending' ? '⏳ รอตรวจสอบ' :
                        p.status === 'approved' ? '✅ อนุมัติแล้ว' :
                          p.status === 'rejected' ? '❌ ปฏิเสธ' : p.status}
                    </span>
                  </td>
                  <td>
                    {p.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleAction(p._id, "approve")}
                          disabled={loading}
                        >
                          อนุมัติ
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleAction(p._id, "reject")}
                          disabled={loading}
                        >
                          ปฏิเสธ
                        </button>
                      </div>
                    )}
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
