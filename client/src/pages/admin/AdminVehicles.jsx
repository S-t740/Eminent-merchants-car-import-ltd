import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiEye } from 'react-icons/fi';
import { vehiclesAPI } from '../../services/api';
import { formatPrice, formatMileage } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './AdminVehicles.css';

const AdminVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchVehicles();
    }, [currentPage, statusFilter]);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: 10,
                search: search || undefined,
                status: statusFilter || undefined
            };
            const response = await vehiclesAPI.getAll(params);
            setVehicles(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            toast.error('Failed to fetch vehicles');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchVehicles();
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            await vehiclesAPI.delete(id);
            toast.success('Vehicle deleted successfully');
            fetchVehicles();
        } catch (error) {
            toast.error('Failed to delete vehicle');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'available': return 'badge-success';
            case 'reserved': return 'badge-warning';
            case 'sold': return 'badge-error';
            default: return 'badge-info';
        }
    };

    return (
        <div className="admin-vehicles">
            <div className="page-header">
                <div>
                    <h1>Vehicles</h1>
                    <p>Manage your vehicle inventory</p>
                </div>
                <Link to="/admin/vehicles/new" className="btn btn-primary">
                    <FiPlus /> Add Vehicle
                </Link>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <form className="search-form" onSubmit={handleSearch}>
                    <div className="search-input">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Search vehicles..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>

                <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                </select>
            </div>

            {/* Vehicles Table */}
            <div className="table-container">
                {loading ? (
                    <div className="table-loading">
                        <div className="loading-spinner"></div>
                    </div>
                ) : vehicles.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Vehicle</th>
                                <th>Year</th>
                                <th>Price</th>
                                <th>Mileage</th>
                                <th>Status</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle.id}>
                                    <td>
                                        <div className="vehicle-cell">
                                            <img
                                                src={vehicle.images?.[0]?.url || vehicle.images?.[0] || 'https://placehold.co/100x75/3B82F6/FFFFFF?text=No+Image'}
                                                alt={vehicle.title}
                                                className="vehicle-thumb"
                                            />
                                            <div>
                                                <span className="vehicle-title">{vehicle.title || `${vehicle.make} ${vehicle.model}`}</span>
                                                <span className="vehicle-make">{vehicle.make}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{vehicle.year}</td>
                                    <td>{formatPrice(vehicle.price)}</td>
                                    <td>{formatMileage(vehicle.mileage)}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadgeClass(vehicle.status)}`}>
                                            {vehicle.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${vehicle.featured ? 'badge-info' : ''}`}>
                                            {vehicle.featured ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <Link
                                                to={`/vehicles/${vehicle.id}`}
                                                target="_blank"
                                                className="action-btn view"
                                                title="View"
                                            >
                                                <FiEye />
                                            </Link>
                                            <Link
                                                to={`/admin/vehicles/${vehicle.id}/edit`}
                                                className="action-btn edit"
                                                title="Edit"
                                            >
                                                <FiEdit />
                                            </Link>
                                            <button
                                                className="action-btn delete"
                                                title="Delete"
                                                onClick={() => handleDelete(vehicle.id, vehicle.title)}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <p>No vehicles found</p>
                        <Link to="/admin/vehicles/new" className="btn btn-primary">
                            Add Your First Vehicle
                        </Link>
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

export default AdminVehicles;
