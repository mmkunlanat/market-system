import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" href="/">Market</Link>

        <div>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row gap-3">
            <li className="nav-item">
              <Link className="nav-link" href="/market">ผังตลาด</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/booking">จองล็อก</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/my-bookings">การจองของฉัน</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/admin">Admin</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
