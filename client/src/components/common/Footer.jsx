import { Link } from 'react-router-dom';
import {
    FiPhone,
    FiMail,
    FiMapPin,
    FiClock,
    FiFacebook,
    FiInstagram,
    FiTwitter
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import logoImage from '../../assets/images/logo.jpg';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            {/* Main Footer */}
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        {/* Company Info */}
                        <div className="footer-section">
                            <div className="footer-logo">
                                <img src={logoImage} alt="Eminent Merchants" className="footer-logo-image" />
                            </div>
                            <p className="footer-description">
                                Your trusted car dealership in Meru, Kenya. We specialize in quality
                                imported and local vehicles at competitive prices with exceptional
                                customer service.
                            </p>
                            <div className="footer-social">
                                <a href="#" aria-label="Facebook" className="social-link">
                                    <FiFacebook />
                                </a>
                                <a href="#" aria-label="Instagram" className="social-link">
                                    <FiInstagram />
                                </a>
                                <a href="#" aria-label="Twitter" className="social-link">
                                    <FiTwitter />
                                </a>
                                <a
                                    href="https://wa.me/254723332197"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="WhatsApp"
                                    className="social-link whatsapp"
                                >
                                    <FaWhatsapp />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-section">
                            <h4 className="footer-title">Quick Links</h4>
                            <ul className="footer-links">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/vehicles">Browse Vehicles</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/contact">Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* Vehicle Categories */}
                        <div className="footer-section">
                            <h4 className="footer-title">Popular Brands</h4>
                            <ul className="footer-links">
                                <li><Link to="/vehicles?make=Toyota">Toyota</Link></li>
                                <li><Link to="/vehicles?make=Mercedes-Benz">Mercedes-Benz</Link></li>
                                <li><Link to="/vehicles?make=BMW">BMW</Link></li>
                                <li><Link to="/vehicles?make=Nissan">Nissan</Link></li>
                                <li><Link to="/vehicles?make=Honda">Honda</Link></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="footer-section">
                            <h4 className="footer-title">Contact Us</h4>
                            <ul className="footer-contact">
                                <li>
                                    <FiMapPin />
                                    <span>Gakurine, Kithoka<br />Meru County, Kenya</span>
                                </li>
                                <li>
                                    <FiPhone />
                                    <a href="tel:+254723332197">+254 723 332197</a>
                                </li>
                                <li>
                                    <FiMail />
                                    <a href="mailto:info@emcil.co.ke">info@emcil.co.ke</a>
                                </li>
                                <li>
                                    <FiClock />
                                    <span>Mon - Sat: 8:00 AM - 6:00 PM<br />Sun: 10:00 AM - 4:00 PM</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p>&copy; {currentYear} Eminent Merchants Car Importers LTD. All rights reserved.</p>
                        <div className="footer-bottom-links">
                            <Link to="/privacy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
