import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata = {
  title: 'Market Booking System',
  description: 'ระบบจองล็อกตลาดนัด',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
