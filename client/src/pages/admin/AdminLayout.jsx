import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiTruck,
    FiTag,
    FiMessageSquare,
    FiLogOut,
    FiMenu,
    FiX
} from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
    const { user, loading, logout, isAuthenticated } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    const navItems = [
        { path: '/admin', icon: <FiHome />, label: 'Dashboard', exact: true },
        { path: '/admin/vehicles', icon: <FiTruck />, label: 'Vehicles' },
        { path: '/admin/offers', icon: <FiTag />, label: 'Offers' },
        { path: '/admin/inquiries', icon: <FiMessageSquare />, label: 'Inquiries' }
    ];

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/" className="sidebar-logo">
                        <span>Eminent</span>
                        <span className="accent">Merchants</span>
                    </Link>
                    <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
                        <FiX />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user?.name || 'Admin'}</span>
                            <span className="user-role">{user?.role || 'admin'}</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <FiLogOut /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-main">
                <header className="admin-header">
                    <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
                        <FiMenu />
                    </button>
                    <div className="header-right">
                        <Link to="/" target="_blank" className="view-site-btn">
                            View Website
                        </Link>
                    </div>
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    );
};

export default AdminLayout;
