export default function LockCard({ lock, onSelect }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">ล็อก {lock.code}</h5>

        <p className="mb-1">โซน: {lock.zoneId.name}</p>
        <p className="mb-1">฿ {lock.zoneId.pricePerDay} / วัน</p>

        <p className={`fw-bold ${
          lock.status === "available" ? "text-success" : "text-danger"
        }`}>
          {lock.status}
        </p>

        <button
          className="btn btn-primary btn-sm"
          disabled={lock.status !== "available"}
          onClick={() => onSelect(lock)}
        >
          จองล็อกนี้
        </button>
      </div>
    </div>
  );
}
