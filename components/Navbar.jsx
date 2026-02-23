import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <header>
            <div className="container">
                <nav>
                    <Link to="/dashboard" className="logo">
                        CampusEats 🎓
                    </Link>

                    <div className="nav-links">
                        <Link to="/dashboard">Dashboard</Link>
                        <button onClick={handleLogout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
