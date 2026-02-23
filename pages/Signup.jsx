import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Signup = () => {
    const [formData, setFormData] = useState({
        studentId: '',
        name: '',
        email: '',
        password: '',
        hostel: 'Hostel A',
        floor: '1',
        roomNumber: '',
        cuisines: [],
        spiceLevel: 'Medium',
        vegNonVeg: 'Non-veg',
        favouriteFoods: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCuisineChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            if (checked) return { ...prev, cuisines: [...prev.cuisines, value] };
            return { ...prev, cuisines: prev.cuisines.filter(c => c !== value) };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Split favourite foods by comma
            const submissionData = {
                ...formData,
                favouriteFoods: formData.favouriteFoods.split(',').map(s => s.trim())
            };

            const response = await api.post('/signup', submissionData);
            if (response.data.success) {
                login(response.data.user);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed.');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Student Registration</h2>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="grid">
                        <div>
                            <label>Student ID</label>
                            <input name="studentId" value={formData.studentId} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Full Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                    </div>

                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                    <div className="grid">
                        <div>
                            <label>Hostel</label>
                            <select name="hostel" value={formData.hostel} onChange={handleChange}>
                                <option>Hostel A</option>
                                <option>Hostel B</option>
                                <option>Girls Hostel</option>
                            </select>
                        </div>
                        <div>
                            <label>Floor</label>
                            <select name="floor" value={formData.floor} onChange={handleChange}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                            </select>
                        </div>
                        <div>
                            <label>Room Number</label>
                            <input name="roomNumber" value={formData.roomNumber} onChange={handleChange} required placeholder="e.g. 101" />
                        </div>
                    </div>

                    <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid var(--border)' }} />
                    <h3>Food Preferences (For Recommendations)</h3>

                    <div style={{ marginTop: '10px' }}>
                        <label>Preferred Cuisines</label>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            {['North Indian', 'South Indian', 'Chinese', 'Continental'].map(c => (
                                <label key={c} style={{ display: 'flex', gap: '5px', width: 'auto', alignItems: 'center' }}>
                                    <input type="checkbox" value={c} checked={formData.cuisines.includes(c)} onChange={handleCuisineChange} style={{ width: 'auto', marginBottom: 0 }} />
                                    {c}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid">
                        <div>
                            <label>Spice Level</label>
                            <select name="spiceLevel" value={formData.spiceLevel} onChange={handleChange}>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                        <div>
                            <label>Vegetarian?</label>
                            <select name="vegNonVeg" value={formData.vegNonVeg} onChange={handleChange}>
                                <option value="Veg">Pure Veg</option>
                                <option value="Non-veg">Non-Veg Allowed</option>
                            </select>
                        </div>
                    </div>

                    <label>Top 3 Favourite Foods (comma separated)</label>
                    <input name="favouriteFoods" value={formData.favouriteFoods} onChange={handleChange} placeholder="e.g. Biryani, Pizza, Dosa" />

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Register</button>
                </form>
                <p style={{ marginTop: '15px', textAlign: 'center' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
