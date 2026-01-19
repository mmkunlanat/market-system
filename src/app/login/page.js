"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "เข้าสู่ระบบล้มเหลว");
      }

      localStorage.setItem("token", data.token || "logged-in");
      localStorage.setItem("user", JSON.stringify(data.user || {}));
      router.push("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="logo">🏪</div>
          <h1>Market Booking</h1>
          <p>ระบบจองล็อกตลาดนัด</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              <>
                <span>🔐</span>
                เข้าสู่ระบบ
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="demo-text">
            <span className="demo-icon">💡</span>
            ข้อมูลสำหรับทดสอบ:
          </p>
          <code>Admin / 123456789</code>
          <p className="signup-link">
            ยังไม่มีบัญชี? <a href="/signup">สมัครสมาชิก</a>
          </p>
        </div>
      </div>

      <div className="login-background">
        <div className="blob"></div>
        <div className="blob blob2"></div>
      </div>
    </div>
  );
}
