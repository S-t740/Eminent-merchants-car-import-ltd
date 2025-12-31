import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';
import { inquiriesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await inquiriesAPI.create(formData);
            toast.success('Message sent successfully! We will contact you soon.');
            setFormData({ name: '', phone: '', email: '', message: '' });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="contact-page">
            {/* Hero Section */}
            <section className="contact-hero">
                <div className="container">
                    <h1>Contact <span>Us</span></h1>
                    <p>We're here to help you find your perfect vehicle</p>
                </div>
            </section>

            <section className="contact-content section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Info */}
                        <div className="contact-info">
                            <h2>Get in Touch</h2>
                            <p>
                                Have questions about a vehicle or our services? We'd love to hear from you.
                                Reach out through any of the channels below or fill out the contact form.
                            </p>

                            <div className="contact-methods">
                                <div className="contact-method">
                                    <div className="method-icon">
                                        <FiPhone />
                                    </div>
                                    <div className="method-content">
                                        <h4>Phone</h4>
                                        <a href="tel:+254723332197">+254 723 332197</a>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <div className="method-icon whatsapp">
                                        <FaWhatsapp />
                                    </div>
                                    <div className="method-content">
                                        <h4>WhatsApp</h4>
                                        <a
                                            href="https://wa.me/254723332197"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            +254 723 332197
                                        </a>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <div className="method-icon">
                                        <FiMail />
                                    </div>
                                    <div className="method-content">
                                        <h4>Email</h4>
                                        <a href="mailto:info@emcil.co.ke">info@emcil.co.ke</a>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <div className="method-icon">
                                        <FiMapPin />
                                    </div>
                                    <div className="method-content">
                                        <h4>Address</h4>
                                        <p>Gakurine, Kithoka<br />Meru County, Kenya</p>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <div className="method-icon">
                                        <FiClock />
                                    </div>
                                    <div className="method-content">
                                        <h4>Business Hours</h4>
                                        <p>Mon - Sat: 8:00 AM - 6:00 PM<br />Sun: 10:00 AM - 4:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            <div className="social-links">
                                <h4>Follow Us</h4>
                                <div className="social-icons">
                                    <a href="#" aria-label="Facebook">
                                        <FaFacebook />
                                    </a>
                                    <a href="#" aria-label="Instagram">
                                        <FaInstagram />
                                    </a>
                                    <a
                                        href="https://wa.me/254723332197"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="WhatsApp"
                                    >
                                        <FaWhatsapp />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-container">
                            <div className="contact-form-card">
                                <h3>Send us a Message</h3>
                                <p>Fill out the form below and we'll get back to you as soon as possible.</p>

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="form-label">Your Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-input"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Phone Number *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className="form-input"
                                                placeholder="+254 7XX XXX XXX"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-input"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Message *</label>
                                        <textarea
                                            name="message"
                                            className="form-textarea"
                                            rows="5"
                                            placeholder="How can we help you?"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg submit-btn"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Sending...' : <><FiSend /> Send Message</>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="contact-map">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7647899999997!2d37.6500!3d0.0667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMDQnMDAuMCJOIDM3wrAzOScwMC4wIkU!5e0!3m2!1sen!2ske!4v1234567890"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Eminent Merchants Location"
                ></iframe>
            </section>
        </div>
    );
};

export default ContactPage;
