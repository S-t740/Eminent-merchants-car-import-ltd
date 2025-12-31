import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiCheckCircle, FiClock, FiXCircle, FiMessageSquare, FiPlus } from 'react-icons/fi';
import { vehiclesAPI, inquiriesAPI } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [vehicleStats, setVehicleStats] = useState(null);
    const [inquiryStats, setInquiryStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [vehicleRes, inquiryRes] = await Promise.all([
                    vehiclesAPI.getStats(),
                    inquiriesAPI.getStats()
                ]);
                setVehicleStats(vehicleRes.data.data);
                setInquiryStats(inquiryRes.data.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            icon: <FiTruck />,
            label: 'Total Vehicles',
            value: vehicleStats?.total || 0,
            color: 'primary'
        },
        {
            icon: <FiCheckCircle />,
            label: 'Available',
            value: vehicleStats?.available || 0,
            color: 'success'
        },
        {
            icon: <FiClock />,
            label: 'Reserved',
            value: vehicleStats?.reserved || 0,
            color: 'warning'
        },
        {
            icon: <FiXCircle />,
            label: 'Sold',
            value: vehicleStats?.sold || 0,
            color: 'error'
        },
        {
            icon: <FiMessageSquare />,
            label: 'New Inquiries',
            value: inquiryStats?.new || 0,
            color: 'info'
        }
    ];

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here's an overview of your inventory.</p>
                </div>
                <Link to="/admin/vehicles/new" className="btn btn-primary">
                    <FiPlus /> Add Vehicle
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div key={index} className={`stat-card ${stat.color}`}>
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-content">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/admin/vehicles" className="action-card">
                        <FiTruck />
                        <span>Manage Vehicles</span>
                    </Link>
                    <Link to="/admin/vehicles/new" className="action-card">
                        <FiPlus />
                        <span>Add New Vehicle</span>
                    </Link>
                    <Link to="/admin/inquiries" className="action-card">
                        <FiMessageSquare />
                        <span>View Inquiries</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
