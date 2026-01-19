import Link from "next/link";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" href="/">
          <span className="brand-icon">🏪</span>
          <span className="brand-text">Market Booking</span>
        </Link>

        <ul className="navbar-menu">
          <li className="nav-item">
            <Link className="nav-link" href="/market">
              <span className="icon">🗺️</span>ผังตลาด
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/booking">
              <span className="icon">📍</span>จองล็อก
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/my-bookings">
              <span className="icon">📋</span>การจองของฉัน
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link admin" href="/admin">
              <span className="icon">⚙️</span>Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
