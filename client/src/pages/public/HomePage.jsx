import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FiSearch,
    FiShield,
    FiTruck,
    FiDollarSign,
    FiUsers,
    FiArrowRight,
    FiPhone
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import VehicleCard from '../../components/vehicles/VehicleCard';
import { vehiclesAPI } from '../../services/api';
import { getWhatsAppLink } from '../../utils/helpers';
import './HomePage.css';

const HomePage = () => {
    const [featuredVehicles, setFeaturedVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchFeaturedVehicles = async () => {
            try {
                const response = await vehiclesAPI.getFeatured();
                setFeaturedVehicles(response.data.data);
            } catch (error) {
                console.error('Error fetching featured vehicles:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedVehicles();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/vehicles?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    const benefits = [
        {
            icon: <FiShield />,
            title: 'Quality Guaranteed',
            description: 'Every vehicle undergoes rigorous inspection to ensure top quality and reliability.'
        },
        {
            icon: <FiTruck />,
            title: 'Wide Selection',
            description: 'From luxury sedans to rugged SUVs, we have the perfect vehicle for your needs.'
        },
        {
            icon: <FiDollarSign />,
            title: 'Competitive Pricing',
            description: 'Get the best value with our fair and transparent pricing on all vehicles.'
        },
        {
            icon: <FiUsers />,
            title: 'Customer First',
            description: 'Dedicated support team ready to assist you throughout your car buying journey.'
        }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <video
                    className="hero-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="https://res.cloudinary.com/dpi3ynfa7/video/upload/McLaren_P1_on_Backroads___4k_h7wgmy.mp4" type="video/mp4" />
                </video>
                <div className="hero-overlay"></div>
                <div className="hero-content container">
                    <div className="hero-text animate-slideUp">
                        <h1>Find Your Perfect <span>Vehicle</span> Today</h1>
                        <p>
                            Discover quality imported and local vehicles at competitive prices.
                            Your trusted car dealership in Meru, Kenya.
                        </p>

                        {/* Search Bar */}
                        <form className="hero-search" onSubmit={handleSearch}>
                            <div className="search-input-wrapper">
                                <FiSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search by make, model, or keyword..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-secondary btn-lg">
                                Search
                            </button>
                        </form>

                        <div className="hero-actions">
                            <Link to="/vehicles" className="btn btn-primary btn-lg">
                                View All Vehicles <FiArrowRight />
                            </Link>
                            <a
                                href={getWhatsAppLink('254723332197', 'Hello! I am interested in your vehicles.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-white btn-lg"
                            >
                                <FaWhatsapp /> WhatsApp Us
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits section">
                <div className="container">
                    <div className="section-title">
                        <h2>Why Choose <span className="text-primary">Eminent Merchants</span></h2>
                        <p>We are committed to providing the best car buying experience in Meru and beyond.</p>
                    </div>

                    <div className="benefits-grid">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="benefit-card">
                                <div className="benefit-icon">{benefit.icon}</div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Vehicles Section */}
            <section className="featured-vehicles section bg-gray">
                <div className="container">
                    <div className="section-title">
                        <h2>Featured <span className="text-primary">Vehicles</span></h2>
                        <p>Explore our handpicked selection of premium vehicles ready for you.</p>
                    </div>

                    {loading ? (
                        <div className="loading-grid">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="loading-card animate-pulse"></div>
                            ))}
                        </div>
                    ) : featuredVehicles.length > 0 ? (
                        <div className="vehicles-grid">
                            {featuredVehicles.map((vehicle) => (
                                <VehicleCard key={vehicle.id} vehicle={vehicle} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-vehicles">
                            <p>No featured vehicles available at the moment.</p>
                            <Link to="/vehicles" className="btn btn-primary">
                                Browse All Vehicles
                            </Link>
                        </div>
                    )}

                    <div className="section-cta">
                        <Link to="/vehicles" className="btn btn-primary btn-lg">
                            View All Inventory <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <div className="cta-text">
                            <h2>Ready to Find Your Dream Car?</h2>
                            <p>
                                Visit our showroom in Gakurine, Kithoka, Meru County or contact us today.
                                Our team is ready to help you find the perfect vehicle.
                            </p>
                        </div>
                        <div className="cta-actions">
                            <a href="tel:+254723332197" className="btn btn-white btn-lg">
                                <FiPhone /> Call Now
                            </a>
                            <Link to="/contact" className="btn btn-outline btn-lg">
                                Get Directions
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
