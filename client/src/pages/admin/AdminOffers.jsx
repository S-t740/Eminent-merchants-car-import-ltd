import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { offersAPI, vehiclesAPI } from '../../services/api';
import { formatPrice, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './AdminOffers.css';

const AdminOffers = () => {
    const [offers, setOffers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        vehicleId: '',
        discountPercentage: '',
        startDate: '',
        endDate: '',
        isActive: true
    });

    useEffect(() => {
        fetchOffers();
        fetchVehicles();
    }, []);

    const fetchOffers = async () => {
        try {
            const response = await offersAPI.getAll();
            setOffers(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch offers');
        } finally {
            setLoading(false);
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await vehiclesAPI.getAll({ limit: 100, status: 'available' });
            setVehicles(response.data.data);
        } catch (error) {
            console.error('Failed to fetch vehicles');
        }
    };

    const handleOpenModal = (offer = null) => {
        if (offer) {
            setEditingOffer(offer);
            setFormData({
                title: offer.title,
                description: offer.description || '',
                vehicleId: offer.vehicleId,
                discountPercentage: offer.discountPercentage || '',
                startDate: offer.startDate?.split('T')[0] || '',
                endDate: offer.endDate?.split('T')[0] || '',
                isActive: offer.isActive
            });
        } else {
            setEditingOffer(null);
            setFormData({
                title: '',
                description: '',
                vehicleId: '',
                discountPercentage: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                isActive: true
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingOffer(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingOffer) {
                await offersAPI.update(editingOffer.id, formData);
                toast.success('Offer updated successfully');
            } else {
                await offersAPI.create(formData);
                toast.success('Offer created successfully');
            }
            handleCloseModal();
            fetchOffers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save offer');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this offer?')) return;
        try {
            await offersAPI.delete(id);
            toast.success('Offer deleted successfully');
            fetchOffers();
        } catch (error) {
            toast.error('Failed to delete offer');
        }
    };

    const isOfferActive = (offer) => {
        const now = new Date();
        const start = new Date(offer.startDate);
        const end = new Date(offer.endDate);
        return offer.isActive && now >= start && now <= end;
    };

    return (
        <div className="admin-offers">
            <div className="page-header">
                <div>
                    <h1>Offers & Promotions</h1>
                    <p>Create special offers for your vehicles</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <FiPlus /> New Offer
                </button>
            </div>

            <div className="offers-grid">
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                    </div>
                ) : offers.length > 0 ? (
                    offers.map((offer) => (
                        <div key={offer.id} className={`offer-card ${isOfferActive(offer) ? 'active' : ''}`}>
                            <div className="offer-header">
                                <h3>{offer.title}</h3>
                                {isOfferActive(offer) ? (
                                    <span className="status-badge active">Active</span>
                                ) : (
                                    <span className="status-badge">Inactive</span>
                                )}
                            </div>

                            {offer.vehicle && (
                                <div className="offer-vehicle">
                                    <span>{offer.vehicle.title || `${offer.vehicle.make} ${offer.vehicle.model}`}</span>
                                    <span className="original-price">{formatPrice(offer.vehicle.price)}</span>
                                </div>
                            )}

                            {offer.discountPercentage && (
                                <div className="offer-discount">
                                    {offer.discountPercentage}% OFF
                                </div>
                            )}

                            <div className="offer-dates">
                                <span>{formatDate(offer.startDate)} - {formatDate(offer.endDate)}</span>
                            </div>

                            <div className="offer-actions">
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => handleOpenModal(offer)}
                                >
                                    <FiEdit /> Edit
                                </button>
                                <button
                                    className="btn btn-outline btn-sm delete"
                                    onClick={() => handleDelete(offer.id)}
                                >
                                    <FiTrash2 /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No offers yet</p>
                        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                            Create Your First Offer
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{editingOffer ? 'Edit Offer' : 'New Offer'}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Title *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. New Year Special"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Vehicle *</label>
                                <select
                                    className="form-select"
                                    value={formData.vehicleId}
                                    onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Vehicle</option>
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.id}>
                                            {v.title || `${v.year} ${v.make} ${v.model}`} - {formatPrice(v.price)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Discount Percentage</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.discountPercentage}
                                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                                    placeholder="e.g. 10"
                                    min="0"
                                    max="100"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Start Date *</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">End Date *</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Optional description"
                                ></textarea>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingOffer ? 'Update Offer' : 'Create Offer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOffers;
