"use client";
import { useEffect, useState } from "react";
import LockCard from "@/components/LockCard";
import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  const [locks, setLocks] = useState([]);
  const [selectedLock, setSelectedLock] = useState(null);

  useEffect(() => {
    fetch("/api/locks")
      .then((res) => res.json())
      .then(setLocks);
  }, []);

  return (
    <div>
      <h2>📍 เลือกล็อกขายของ</h2>

      <div className="row">
        {locks.map((lock) => (
          <div className="col-md-3 mb-3" key={lock._id}>
            <LockCard
              lock={{
                id: lock._id,
                code: lock.code,
                zone: lock.zoneId.name,
                priceDay: lock.zoneId.pricePerDay,
                status: lock.status,
              }}
              onSelect={setSelectedLock}
            />
          </div>
        ))}
      </div>

      {selectedLock && <BookingForm lock={selectedLock} />}
    </div>
  );
}
