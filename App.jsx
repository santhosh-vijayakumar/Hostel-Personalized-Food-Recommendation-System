import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Food from './pages/Food';
import Restaurant from './pages/Restaurant';
import OrderConfirmation from './pages/OrderConfirmation';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <h3>Checking authentication...</h3>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="app-container">
                    <Navbar />
                    <div className="container" style={{ marginTop: '20px', paddingBottom: '40px' }}>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />

                            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

                            <Route path="/food/:foodId" element={<PrivateRoute><Food /></PrivateRoute>} />
                            <Route path="/restaurant/:restaurantId" element={<PrivateRoute><Restaurant /></PrivateRoute>} />
                            <Route path="/order-confirmation" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />

                            <Route path="*" element={<Navigate to="/login" />} />
                        </Routes>
                    </div>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
