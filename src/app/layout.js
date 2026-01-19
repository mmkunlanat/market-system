import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Market Booking System - ระบบจองล็อกตลาดนัด',
  description: 'ระบบการจองล็อกขายของที่ง่ายและสะดวก ด้วยการจัดการแบบสมัยใหม่',
  keywords: 'ตลาด, จองล็อก, ล็อกขายของ, market booking',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }} className="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
