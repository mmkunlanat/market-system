"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./signup.css";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("กรุณากรอกชื่อ");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("กรุณากรอกอีเมล");
      setLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setError("กรุณากรอกเบอร์โทรศัพท์");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "สมัครสมาชิกล้มเหลว");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <div className="logo">🎉</div>
          <h1>สมัครสมาชิก</h1>
          <p>เข้าร่วมระบบจองล็อกตลาดนัด</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              <span>สมัครสมาชิกสำเร็จ! กำลังไปหน้า Login...</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              ชื่อ-นามสกุล
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className="form-input"
              placeholder="เช่น สมชาย สมศรี"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-input"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              เบอร์โทรศัพท์
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              className="form-input"
              placeholder="089-123-4567"
              value={formData.phone}
              onChange={handleChange}
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
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              ยืนยันรหัสผ่าน
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn-signup"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                กำลังสมัครสมาชิก...
              </>
            ) : (
              <>
                <span>📝</span>
                สมัครสมาชิก
              </>
            )}
          </button>
        </form>

        <div className="signup-footer">
          <p className="login-link">
            มีบัญชีอยู่แล้ว? <Link href="/login">เข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>

      <div className="signup-background">
        <div className="blob"></div>
        <div className="blob blob2"></div>
      </div>
    </div>
  );
}
