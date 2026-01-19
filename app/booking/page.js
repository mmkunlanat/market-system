"use client";
import { useEffect, useState } from "react";
import LockCard from "@/components/LockCard";
import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  const [locks, setLocks] = useState([]);
  const [selectedLock, setSelectedLock] = useState(null);

  // 👇 ตรงนี้แหละที่คุณถาม
  useEffect(() => {
    fetch("/api/locks")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("API error");
        }
        return res.json();
      })
      .then((data) => {
        console.log("LOCKS:", data); // 👈 ใช้ debug ได้
        setLocks(data);
      })
      .catch((err) => {
        console.error("โหลดล็อกไม่สำเร็จ", err);
        alert("โหลดข้อมูลไม่สำเร็จ");
      });
  }, []);

  return (
    <div className="container mt-4">
      <h3>📍 เลือกล็อกขายของ</h3>

      <div className="row">
        {locks.map((lock) => (
          <div className="col-md-3 mb-3" key={lock._id}>
            <LockCard lock={lock} onSelect={setSelectedLock} />
          </div>
        ))}
      </div>

      {selectedLock && <BookingForm lock={selectedLock} />}
    </div>
  );
}
