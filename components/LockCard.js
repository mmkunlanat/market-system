export default function LockCard({ lock, onSelect }) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body text-center">
        <h5 className="card-title">ล็อก {lock.code}</h5>
        <p className="card-text">
          โซน: {lock.zone} <br />
          ราคา/วัน: {lock.priceDay} บาท
        </p>

        <button
          className="btn btn-outline-primary"
          onClick={() => onSelect(lock)}
        >
          จองล็อกนี้
        </button>
      </div>
    </div>
  );
}
