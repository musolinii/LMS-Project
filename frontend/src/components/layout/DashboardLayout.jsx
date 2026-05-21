import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './DashboardLayout.css';

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-layout__body">
        <Sidebar />
        <main className="dashboard-layout__main">
          <div className="dashboard-layout__content">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
