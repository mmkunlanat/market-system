"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบ user ที่ login
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

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

          {!loading && user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link admin" href="/admin">
                  <span className="icon">⚙️</span>Admin
                </Link>
              </li>
              <li className="nav-item">
                <div className="user-menu">
                  <div className="user-info">
                    <span className="user-icon">👤</span>
                    <span className="user-name">{user.name || user.email}</span>
                  </div>
                  <button className="logout-btn" onClick={handleLogout}>
                    🚪 ออกจากระบบ
                  </button>
                </div>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link className="nav-link admin" href="/login">
                <span className="icon">🔐</span>เข้าสู่ระบบ
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
