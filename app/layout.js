import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Market Booking System',
  description: 'ระบบจองล็อกตลาดนัด',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
