"use client";

export default function LockCard({ lock, onSelect }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">ล็อก {lock.code}</h5>

        <p className="card-text">
          โซน: {lock.zone}
        </p>

        <p className="card-text">
          ราคา/วัน: {lock.priceDay} บาท
        </p>

        <p className="card-text">
          สถานะ:{" "}
          {lock.status === "available" ? "ว่าง" : "ไม่ว่าง"}
        </p>

        <button
          className="btn btn-primary w-100"
          disabled={lock.status !== "available"}
          onClick={() => onSelect(lock)}
        >
          จองล็อกนี้
        </button>
      </div>
    </div>
  );
}
