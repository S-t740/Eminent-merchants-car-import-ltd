import { useState, useEffect } from 'react';
import { FiCheck, FiTrash2, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';
import { inquiriesAPI } from '../../services/api';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './AdminInquiries.css';

const AdminInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchInquiries();
    }, [currentPage, statusFilter]);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: 20,
                status: statusFilter || undefined
            };
            const response = await inquiriesAPI.getAll(params);
            setInquiries(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            toast.error('Failed to fetch inquiries');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await inquiriesAPI.update(id, { status });
            toast.success('Status updated');
            fetchInquiries();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
        try {
            await inquiriesAPI.delete(id);
            toast.success('Inquiry deleted');
            fetchInquiries();
        } catch (error) {
            toast.error('Failed to delete inquiry');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'new': return 'badge-info';
            case 'contacted': return 'badge-warning';
            case 'closed': return 'badge-success';
            default: return '';
        }
    };

    return (
        <div className="admin-inquiries">
            <div className="page-header">
                <div>
                    <h1>Inquiries</h1>
                    <p>Manage customer inquiries and leads</p>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            {/* Inquiries List */}
            <div className="inquiries-list">
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                    </div>
                ) : inquiries.length > 0 ? (
                    inquiries.map((inquiry) => (
                        <div key={inquiry.id} className={`inquiry-card ${inquiry.status}`}>
                            <div className="inquiry-header">
                                <div className="inquiry-customer">
                                    <h3>{inquiry.name}</h3>
                                    <span className="inquiry-time">{formatRelativeTime(inquiry.createdAt)}</span>
                                </div>
                                <span className={`badge ${getStatusBadgeClass(inquiry.status)}`}>
                                    {inquiry.status}
                                </span>
                            </div>

                            <div className="inquiry-contact">
                                <a href={`tel:${inquiry.phone}`} className="contact-item">
                                    <FiPhone /> {inquiry.phone}
                                </a>
                                {inquiry.email && (
                                    <a href={`mailto:${inquiry.email}`} className="contact-item">
                                        <FiMail /> {inquiry.email}
                                    </a>
                                )}
                            </div>

                            <div className="inquiry-message">
                                <FiMessageSquare />
                                <p>{inquiry.message}</p>
                            </div>

                            {inquiry.vehicle && (
                                <div className="inquiry-vehicle">
                                    Interested in: <strong>{inquiry.vehicle.title || `${inquiry.vehicle.make} ${inquiry.vehicle.model}`}</strong>
                                </div>
                            )}

                            <div className="inquiry-actions">
                                <select
                                    className="form-select status-select"
                                    value={inquiry.status}
                                    onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                                >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="closed">Closed</option>
                                </select>
                                <button
                                    className="btn btn-outline btn-sm delete"
                                    onClick={() => handleDelete(inquiry.id)}
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No inquiries found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Previous
                    </button>
                    <span className="pagination-info">
                        Page {currentPage} of {pagination.pages}
                    </span>
                    <button
                        className="pagination-btn"
                        disabled={currentPage === pagination.pages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminInquiries;
