import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FiCalendar,
    FiSettings,
    FiDroplet,
    FiMapPin,
    FiPhone,
    FiArrowLeft,
    FiChevronLeft,
    FiChevronRight,
    FiShare2
} from 'react-icons/fi';
import { TbRoad, TbEngine, TbColorSwatch } from 'react-icons/tb';
import { FaWhatsapp } from 'react-icons/fa';
import { vehiclesAPI, inquiriesAPI } from '../../services/api';
import { formatPrice, formatMileage, getWhatsAppLink, getPlaceholderImage } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './VehicleDetailPage.css';

const VehicleDetailPage = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [inquiryData, setInquiryData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await vehiclesAPI.getById(id);
                setVehicle(response.data.data);
            } catch (error) {
                console.error('Error fetching vehicle:', error);
                toast.error('Vehicle not found');
            } finally {
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [id]);

    const handlePrevImage = () => {
        setCurrentImageIndex(prev =>
            prev === 0 ? (vehicle.images?.length || 1) - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prev =>
            prev === (vehicle.images?.length || 1) - 1 ? 0 : prev + 1
        );
    };

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await inquiriesAPI.create({
                ...inquiryData,
                vehicleId: id
            });
            toast.success('Inquiry submitted successfully! We will contact you soon.');
            setShowInquiryForm(false);
            setInquiryData({ name: '', phone: '', email: '', message: '' });
        } catch (error) {
            toast.error('Failed to submit inquiry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: vehicle.title,
                    text: `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} at Eminent Merchants!`,
                    url: window.location.href
                });
            } catch (error) {
                console.log('Share cancelled');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="vehicle-detail-loading">
                <div className="loading-spinner"></div>
                <p>Loading vehicle details...</p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="vehicle-not-found">
                <h2>Vehicle Not Found</h2>
                <p>The vehicle you're looking for doesn't exist or has been removed.</p>
                <Link to="/vehicles" className="btn btn-primary">
                    Browse All Vehicles
                </Link>
            </div>
        );
    }

    const images = vehicle.images && vehicle.images.length > 0
        ? vehicle.images
        : [{ url: getPlaceholderImage() }];

    const currentImage = images[currentImageIndex]?.url || images[currentImageIndex] || getPlaceholderImage();

    const whatsappMessage = `Hello! I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} (${formatPrice(vehicle.price)}) listed on your website. Is it still available?`;

    const specs = [
        { icon: <FiCalendar />, label: 'Year', value: vehicle.year },
        { icon: <TbRoad />, label: 'Mileage', value: formatMileage(vehicle.mileage) },
        { icon: <FiSettings />, label: 'Transmission', value: vehicle.transmission },
        { icon: <FiDroplet />, label: 'Fuel Type', value: vehicle.fuelType },
        { icon: <TbEngine />, label: 'Engine', value: vehicle.engineSize || 'N/A' },
        { icon: <TbColorSwatch />, label: 'Color', value: vehicle.color || 'N/A' },
    ];

    return (
        <div className="vehicle-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <Link to="/vehicles" className="back-link">
                        <FiArrowLeft /> Back to Inventory
                    </Link>
                </div>

                <div className="vehicle-detail-grid">
                    {/* Image Gallery */}
                    <div className="vehicle-gallery">
                        <div className="main-image">
                            <img src={currentImage} alt={vehicle.title} />

                            {images.length > 1 && (
                                <>
                                    <button className="gallery-nav prev" onClick={handlePrevImage}>
                                        <FiChevronLeft />
                                    </button>
                                    <button className="gallery-nav next" onClick={handleNextImage}>
                                        <FiChevronRight />
                                    </button>
                                </>
                            )}

                            <span className={`status-badge ${vehicle.status}`}>
                                {vehicle.status}
                            </span>
                        </div>

                        {images.length > 1 && (
                            <div className="thumbnail-strip">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <img src={img.url || img} alt={`${vehicle.title} - ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Vehicle Info */}
                    <div className="vehicle-info">
                        <div className="vehicle-header">
                            <h1>{vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}</h1>
                            <button className="share-btn" onClick={handleShare}>
                                <FiShare2 />
                            </button>
                        </div>

                        <div className="vehicle-price-box">
                            <span className="price">{formatPrice(vehicle.price)}</span>
                            {vehicle.offers?.[0] && (
                                <span className="offer-badge">Special Offer!</span>
                            )}
                        </div>

                        {/* Specs Grid */}
                        <div className="specs-grid">
                            {specs.map((spec, index) => (
                                <div key={index} className="spec-item">
                                    <div className="spec-icon">{spec.icon}</div>
                                    <div className="spec-content">
                                        <span className="spec-label">{spec.label}</span>
                                        <span className="spec-value">{spec.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        {vehicle.description && (
                            <div className="vehicle-description">
                                <h3>Description</h3>
                                <p>{vehicle.description}</p>
                            </div>
                        )}

                        {/* Contact Actions */}
                        <div className="contact-actions">
                            <a
                                href={getWhatsAppLink('254723332197', whatsappMessage)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary btn-lg whatsapp-btn"
                            >
                                <FaWhatsapp /> WhatsApp
                            </a>
                            <a href="tel:+254723332197" className="btn btn-primary btn-lg">
                                <FiPhone /> Call Now
                            </a>
                            <button
                                className="btn btn-outline btn-lg"
                                onClick={() => setShowInquiryForm(true)}
                            >
                                Send Inquiry
                            </button>
                        </div>

                        {/* Location */}
                        <div className="dealer-info">
                            <FiMapPin />
                            <div>
                                <strong>Eminent Merchants Car Importers LTD</strong>
                                <p>Gakurine, Kithoka, Meru County, Kenya</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inquiry Modal */}
            {showInquiryForm && (
                <div className="modal-overlay" onClick={() => setShowInquiryForm(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Send Inquiry</h3>
                        <p>Interested in this {vehicle.year} {vehicle.make} {vehicle.model}?</p>

                        <form onSubmit={handleInquirySubmit}>
                            <div className="form-group">
                                <label className="form-label">Your Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={inquiryData.name}
                                    onChange={e => setInquiryData({ ...inquiryData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number *</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={inquiryData.phone}
                                    onChange={e => setInquiryData({ ...inquiryData, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={inquiryData.email}
                                    onChange={e => setInquiryData({ ...inquiryData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Message *</label>
                                <textarea
                                    className="form-textarea"
                                    rows="4"
                                    value={inquiryData.message}
                                    onChange={e => setInquiryData({ ...inquiryData, message: e.target.value })}
                                    placeholder="I'm interested in this vehicle. Please contact me with more details."
                                    required
                                ></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowInquiryForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Sending...' : 'Send Inquiry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleDetailPage;
