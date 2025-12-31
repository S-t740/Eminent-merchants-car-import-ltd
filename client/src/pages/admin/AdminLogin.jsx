import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <Link to="/" className="login-logo">
                            <span>Eminent</span>
                            <span className="accent">Merchants</span>
                        </Link>
                        <h1>Admin Portal</h1>
                        <p>Sign in to manage inventory and operations</p>
                    </div>

                    {error && (
                        <div className="login-error">
                            <FiAlertCircle />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-icon-wrapper">
                                <FiMail className="input-icon" />
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="admin@emcil.co.ke"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-icon-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg login-btn"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <Link to="/">← Back to Website</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
