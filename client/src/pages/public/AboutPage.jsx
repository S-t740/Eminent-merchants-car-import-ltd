import { FiTarget, FiHeart, FiCheck, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import './AboutPage.css';

const AboutPage = () => {
    const values = [
        {
            icon: <FiTarget />,
            title: 'Quality First',
            description: 'Every vehicle in our inventory undergoes thorough inspection to ensure it meets our high standards of quality and reliability.'
        },
        {
            icon: <FiHeart />,
            title: 'Customer Satisfaction',
            description: 'We are committed to providing an exceptional car buying experience, from your first inquiry to long after your purchase.'
        },
        {
            icon: <FiCheck />,
            title: 'Transparency',
            description: 'We believe in honest, upfront pricing and full disclosure about every vehicle we sell. No hidden fees, no surprises.'
        }
    ];

    const stats = [
        { number: '500+', label: 'Vehicles Sold' },
        { number: '10+', label: 'Years Experience' },
        { number: '98%', label: 'Customer Satisfaction' },
        { number: '24/7', label: 'Support Available' }
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <div className="about-hero-content">
                        <h1>About <span>Eminent Merchants</span></h1>
                        <p>Your trusted partner in finding the perfect vehicle in Meru, Kenya</p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="about-story section">
                <div className="container">
                    <div className="story-grid">
                        <div className="story-image">
                            <img src="/images/about-car.jpg" alt="Eminent Merchants Showroom" />
                        </div>
                        <div className="story-content">
                            <h2>Our Story</h2>
                            <p>
                                Eminent Merchants Car Importers LTD is a leading car dealership located in
                                Gakurine, Kithoka, Meru County, Kenya. We specialize in importing and selling
                                quality vehicles that meet the needs of our diverse clientele.
                            </p>
                            <p>
                                What started as a small family business has grown into one of Meru's most
                                trusted car dealerships. Our success is built on a foundation of integrity,
                                quality, and exceptional customer service.
                            </p>
                            <p>
                                We understand that buying a car is a significant decision. That's why we
                                go above and beyond to ensure every customer finds the perfect vehicle that
                                fits their lifestyle and budget.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="about-stats">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <span className="stat-number">{stat.number}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-values section">
                <div className="container">
                    <div className="section-title">
                        <h2>Our <span className="text-primary">Values</span></h2>
                        <p>The principles that guide everything we do</p>
                    </div>

                    <div className="values-grid">
                        {values.map((value, index) => (
                            <div key={index} className="value-card">
                                <div className="value-icon">{value.icon}</div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section className="about-location section bg-gray">
                <div className="container">
                    <div className="location-grid">
                        <div className="location-content">
                            <h2>Visit Our Showroom</h2>
                            <p>
                                We invite you to visit our showroom and explore our wide selection of
                                vehicles in person. Our friendly team is ready to assist you.
                            </p>

                            <div className="location-info">
                                <div className="info-item">
                                    <FiMapPin />
                                    <div>
                                        <strong>Address</strong>
                                        <p>Gakurine, Kithoka<br />Meru County, Kenya</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <FiPhone />
                                    <div>
                                        <strong>Phone</strong>
                                        <p><a href="tel:+254723332197">+254 723 332197</a></p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <FiMail />
                                    <div>
                                        <strong>Email</strong>
                                        <p><a href="mailto:info@emcil.co.ke">info@emcil.co.ke</a></p>
                                    </div>
                                </div>
                            </div>

                            <div className="location-hours">
                                <h4>Business Hours</h4>
                                <ul>
                                    <li><span>Monday - Friday</span> <span>8:00 AM - 6:00 PM</span></li>
                                    <li><span>Saturday</span> <span>8:00 AM - 5:00 PM</span></li>
                                    <li><span>Sunday</span> <span>10:00 AM - 4:00 PM</span></li>
                                </ul>
                            </div>

                            <a
                                href="https://wa.me/254723332197"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary btn-lg"
                            >
                                <FaWhatsapp /> WhatsApp Us
                            </a>
                        </div>

                        <div className="location-map">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7647899999997!2d37.6500!3d0.0667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMDQnMDAuMCJOIDM3wrAzOScwMC4wIkU!5e0!3m2!1sen!2ske!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: 'var(--radius-xl)' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Eminent Merchants Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
