import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Public Pages
import HomePage from './pages/public/HomePage';
import InventoryPage from './pages/public/InventoryPage';
import VehicleDetailPage from './pages/public/VehicleDetailPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminVehicleForm from './pages/admin/AdminVehicleForm';
import AdminOffers from './pages/admin/AdminOffers';
import AdminInquiries from './pages/admin/AdminInquiries';

// Styles
import './styles/index.css';

// Public Layout
const PublicLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/vehicles" element={<InventoryPage />} />
            <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="vehicles" element={<AdminVehicles />} />
            <Route path="vehicles/new" element={<AdminVehicleForm />} />
            <Route path="vehicles/:id/edit" element={<AdminVehicleForm />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="inquiries" element={<AdminInquiries />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
