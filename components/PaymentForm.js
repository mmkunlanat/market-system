"use client";
import { useState } from "react";

export default function PaymentForm({ bookingId }) {
  const [slip, setSlip] = useState("");
  const [msg, setMsg] = useState("");

  const handlePay = async () => {
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId,
        slipImage: slip,
      }),
    });

    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <div className="card p-3 mt-3">
      <h5>💳 ชำระเงิน</h5>

      <input
        className="form-control mb-2"
        placeholder="URL รูปสลิป (Demo)"
        onChange={(e) => setSlip(e.target.value)}
      />

      <button className="btn btn-primary" onClick={handlePay}>
        ยืนยันการชำระเงิน
      </button>

      {msg && <p className="mt-2">{msg}</p>}
    </div>
  );
}
