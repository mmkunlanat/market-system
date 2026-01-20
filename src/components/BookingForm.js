"use client";
import { useState } from "react";
import "./BookingForm.css";

export default function BookingForm({ lock, zone }) {
  const [durationType, setDurationType] = useState("day");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("promptpay");
  const [slip, setSlip] = useState("");
  const [slipPreview, setSlipPreview] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useState(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUserData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || ""
          });
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    }
  }, []);

  const getPrice = () => {
    const basePrice = lock.priceOverride || zone?.pricePerDay;

    const multipliers = {
      day: 1,
      week: 7,
      month: 30,
    };

    return basePrice * (multipliers[durationType] || 1);
  };

  const durationTexts = {
    day: "รายวัน",
    week: "รายสัปดาห์ (7 วัน)",
    month: "รายเดือน (30 วัน)",
  };

  const calculateEndDate = () => {
    if (!startDate) return null;

    const start = new Date(startDate);
    const days = durationType === "day" ? 1 : durationType === "week" ? 7 : 30;
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

    return end.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ขนาดไฟล์ใหญ่เกินไป (จำกัด 5MB)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSlip(reader.result); // Base64 string
        setSlipPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleBooking() {
    if (!startDate) {
      alert("กรุณาเลือกวันเริ่มต้น");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lockId: lock._id,
          lockCode: lock.code,
          zoneId: zone?._id,
          zoneName: zone?.name,
          durationType,
          startDate,
          userName: userData.name,
          userEmail: userData.email,
          userPhone: userData.phone,
          totalPrice: getPrice(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookingResult(data.booking);
        setShowPayment(true);
        // Dispatch custom event to notify other components if needed
        window.dispatchEvent(new Event('bookingUpdated'));
      } else {
        const errorData = await response.json();
        alert(errorData.message || "การจองล้มเหลว กรุณาลองใหม่");
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  async function handlePayment() {
    if (paymentMethod !== "credit" && !slip) {
      alert("กรุณากรอกข้อมูลการชำระเงิน หรือ URL สลิป");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingResult._id,
          slipImage: slip || "Credit Card Payment",
          paymentMethod
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setDurationType("day");
          setStartDate("");
          setShowPayment(false);
          setBookingResult(null);
          setSlip("");
        }, 3000);
      } else {
        alert("การชำระเงินล้มเหลว กรุณาลองใหม่");
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการชำระเงิน");
    } finally {
      setLoading(false);
    }
  }

  const price = getPrice();
  const endDate = calculateEndDate();

  return (
    <div className="booking-form">
      <div className="form-header">
        <h2>🎫 สรุปการจอง</h2>
        <p>ล็อก {lock.code} • {zone?.name}</p>
      </div>

      <div className="form-body">
        {!showPayment ? (
          <>
            <div className="lock-overview">
              <div className="overview-item">
                <span className="label">รหัสล็อก:</span>
                <span className="value">{lock.code}</span>
              </div>
              <div className="overview-item">
                <span className="label">โซน:</span>
                <span className="value">{zone?.code} - {zone?.name}</span>
              </div>
              <div className="overview-item">
                <span className="label">ขนาด:</span>
                <span className="value">{lock.size}</span>
              </div>
            </div>

            <div className="form-section-title">👤 ข้อมูลผู้เช่า</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  className="form-input"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  placeholder="กรอกชื่อ-นามสกุล"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">อีเมล</label>
                <input
                  type="email"
                  className="form-input"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  className="form-input"
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  placeholder="08X-XXX-XXXX"
                  required
                />
              </div>
            </div>

            <div className="form-section-title">⏱️ ระยะเวลาการจอง</div>
            <div className="form-group">
              <label htmlFor="duration" className="form-label">
                เลือกระยะเวลาการจอง
              </label>
              <select
                id="duration"
                className="form-select"
                value={durationType}
                onChange={e => setDurationType(e.target.value)}
                disabled={loading}
              >
                <option value="day">📅 รายวัน (1 วัน)</option>
                <option value="week">📆 รายสัปดาห์ (7 วัน)</option>
                <option value="month">📅 รายเดือน (30 วัน)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="startDate" className="form-label">
                เลือกวันเริ่มต้น
              </label>
              <input
                id="startDate"
                type="date"
                className="form-select"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                min={getTodayDate()}
                disabled={loading}
              />
            </div>

            {startDate && (
              <div className="date-preview">
                <div className="preview-item">
                  <span className="label">🗓️ วันเริ่มต้น:</span>
                  <span className="value">
                    {new Date(startDate).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="preview-item">
                  <span className="label">📅 วันสิ้นสุด:</span>
                  <span className="value">{endDate}</span>
                </div>
              </div>
            )}

            <div className="price-breakdown">
              <div className="breakdown-row">
                <span className="breakdown-label">ล็อก:</span>
                <span className="breakdown-value">{lock.code}</span>
              </div>
              <div className="breakdown-row">
                <span className="breakdown-label">ประเภท:</span>
                <span className="breakdown-value">{durationTexts[durationType]}</span>
              </div>
              <div className="breakdown-row">
                <span className="breakdown-label">ราคา / {durationType === 'day' ? 'วัน' : 'งวด'}:</span>
                <span className="breakdown-value">฿{lock.priceOverride || zone?.pricePerDay}</span>
              </div>
              <div className="breakdown-row total">
                <span className="breakdown-label">ราคารวม:</span>
                <span className="breakdown-value">฿{price}</span>
              </div>
            </div>

            <button
              className="btn-confirm"
              onClick={handleBooking}
              disabled={loading || success || !startDate}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  กำลังประมวลผล...
                </>
              ) : (
                <>
                  <span>💳</span>
                  ไปสู่การชำระเงิน
                </>
              )}
            </button>
          </>
        ) : (
          <div className="payment-step">
            <h3 className="payment-title">💳 ขั้นตอนการชำระเงิน</h3>
            <div className="payment-methods">
              <div
                className={`method-card ${paymentMethod === 'promptpay' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('promptpay')}
              >
                <div className="method-icon">📲</div>
                <p>PromptPay</p>
              </div>
              <div
                className={`method-card ${paymentMethod === 'bank' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('bank')}
              >
                <div className="method-icon">🏦</div>
                <p>โอนผ่านธนาคาร</p>
              </div>
              <div
                className={`method-card ${paymentMethod === 'credit' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('credit')}
              >
                <div className="method-icon">💳</div>
                <p>บัตรเครดิต</p>
              </div>
            </div>

            <div className="payment-detail-container">
              {paymentMethod === 'promptpay' && (
                <div className="method-detail promptpay">
                  <p className="detail-instr">สแกน QR Code ด้านล่างเพื่อชำระเงิน</p>
                  <div className="qr-container">
                    <img
                      src="/promptpay_qr.png"
                      alt="PromptPay QR"
                      className="qr-image"
                    />
                    <p className="qr-price">฿{price}</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="method-detail bank">
                  <p className="detail-instr">โอนเข้าบัญชีธนาคารดังนี้:</p>
                  <div className="bank-info">
                    <p><strong>ธนาคารกสิกรไทย (K-Bank)</strong></p>
                    <p>123-4-56789-0</p>
                    <p>ชื่อบัญชี: บจก. ตลาดมั่งมีศรีสุข</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'credit' && (
                <div className="method-detail credit">
                  <div className="credit-form">
                    <input type="text" placeholder="หมายเลขบัตร 16 หลัก" className="form-select mb-2" />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="text" placeholder="วันหมดอายุ" className="form-select" />
                      <input type="text" placeholder="CVV" className="form-select" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod !== 'credit' && (
                <div className="slip-upload-section">
                  <label className="form-label">📁 แนบรูปภาพสลิปการโอน</label>
                  <label className="file-upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input-hidden"
                      onChange={handleFileChange}
                    />
                    <div className="upload-placeholder">
                      {slipPreview ? (
                        <div className="slip-preview-container">
                          <img src={slipPreview} alt="Slip Preview" className="slip-preview-img" />
                          <div className="change-photo-overlay">เปลี่ยนรูปภาพ</div>
                        </div>
                      ) : (
                        <>
                          <span className="upload-icon">📷</span>
                          <span className="upload-text">คลิกเพื่อเลือกรูปภาพสลิป</span>
                          <span className="upload-hint">ไฟล์ภาพ (JPG, PNG) ไม่เกิน 5MB</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              )}
            </div>

            {success && (
              <div className="success-message">
                <span className="success-icon">✓</span>
                <p>จองและชำระเงินสำเร็จแล้ว!</p>
              </div>
            )}

            <div className="payment-actions">
              <button
                className="btn-back"
                onClick={() => setShowPayment(false)}
                disabled={loading || success}
              >
                ย้อนกลับ
              </button>
              <button
                className="btn-confirm"
                onClick={handlePayment}
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    กำลังประมวลผล...
                  </>
                ) : success ? (
                  <>
                    <span>✓</span>
                    สำเร็จ
                  </>
                ) : (
                  <>
                    <span>💳</span>
                    ยืนยันชำระเงิน ฿{price}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
