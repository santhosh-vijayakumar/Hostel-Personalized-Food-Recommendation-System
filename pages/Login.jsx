import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Login = () => {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const EXPECTED_CAPTCHA = '1234';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (captcha !== EXPECTED_CAPTCHA) {
            setError('Invalid Captcha. Please enter 1234.');
            return;
        }

        try {
            const response = await api.post('/login', { studentId, password });
            if (response.data.success) {
                login(response.data.user);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Try again.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Student Login</h2>

                {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Student ID</label>
                        <input
                            type="text"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder="e.g. S123"
                            required
                        />
                    </div>

                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Dummy Password"
                            required
                        />
                    </div>

                    <div>
                        <label>Captcha (Type 1234)</label>
                        <input
                            type="text"
                            value={captcha}
                            onChange={(e) => setCaptcha(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                </form>

                <p style={{ marginTop: '15px', textAlign: 'center' }}>
                    New Student? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Signup here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
