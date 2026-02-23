import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
    return (
        <div className="card" style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center', padding: '40px' }}>
            <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '20px' }} />
            <h1 style={{ marginBottom: '10px' }}>Order Confirmed!</h1>
            <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>
                Your food will be delivered to your hostel floor in the selected time slot.
            </p>

            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <strong>Payment Note:</strong><br />
                Payment will be handled by the college system in future updates. No payment is required now.
            </div>

            <p style={{ marginBottom: '20px' }}>Rate your experience:</p>
            <div style={{ fontSize: '1.5rem', cursor: 'pointer', marginBottom: '30px' }}>
                ⭐⭐⭐⭐⭐
            </div>

            <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
    );
};

export default OrderConfirmation;
