"use client";
import { useEffect, useState } from "react";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch("/api/admin/payments")
      .then((res) => res.json())
      .then(setPayments);
  }, []);

  const handleAction = async (id, action) => {
    await fetch(`/api/admin/payments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    setPayments(payments.filter((p) => p._id !== id));
  };

  return (
    <div>
      <h3>💼 อนุมัติการชำระเงิน</h3>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ล็อก</th>
            <th>สลิป</th>
            <th>สถานะ</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id}>
              <td>{p.bookingId.lockId.code}</td>
              <td>
                <a href={p.slipImage} target="_blank">ดูสลิป</a>
              </td>
              <td>{p.status}</td>
              <td>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => handleAction(p._id, "approve")}
                >
                  อนุมัติ
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleAction(p._id, "reject")}
                >
                  ปฏิเสธ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
