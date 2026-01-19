"use client";
import { useEffect, useState } from "react";
import LockCard from "@/components/LockCard";
import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  const [locks, setLocks] = useState([]);
  const [selectedLock, setSelectedLock] = useState(null);

  useEffect(() => {
    fetch("/api/locks")
      .then(res => res.json())
      .then(data => setLocks(data));
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📍 เลือกล็อกขายของ</h3>

      <div className="row">
        {locks.map(lock => (
          <div className="col-md-3 mb-3" key={lock._id}>
            <LockCard
              lock={lock}
              onSelect={setSelectedLock}
            />
          </div>
        ))}
      </div>

      {selectedLock && (
        <BookingForm lock={selectedLock} />
      )}
    </div>
  );
}
