import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiPhone, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import logoImage from '../../assets/images/logo.jpg';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/vehicles', label: 'Vehicles' },
        { path: '/about', label: 'About Us' },
        { path: '/contact', label: 'Contact' }
    ];

    return (
        <>
            {/* Main Header */}
            <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo">
                            <img src={logoImage} alt="Eminent Merchants Car Importers LTD" className="logo-image" />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="nav-desktop">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>

                        <div className="header-actions">
                            <Link to="/admin/login" className="btn btn-outline staff-portal-btn">
                                Staff Portal
                            </Link>
                            <Link to="/vehicles" className="btn btn-primary">
                                View Inventory
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                className="mobile-menu-toggle"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <FiX /> : <FiMenu />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`nav-mobile ${isMenuOpen ? 'open' : ''}`}>
                    <nav>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        <Link to="/admin/login" className="btn btn-outline mobile-cta">
                            Staff Portal
                        </Link>
                        <Link to="/vehicles" className="btn btn-primary mobile-cta">
                            View Inventory
                        </Link>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Header;
